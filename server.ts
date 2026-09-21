import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const CANDIDATE_FLASH_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

// Keep track of unhealthy models temporarily to avoid repeating 503 latency
const modelCooldownMap = new Map<string, number>();

async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: Record<string, any>;
  }
) {
  let lastError: any = null;
  const now = Date.now();

  // Sort candidate models so active/healthy models are prioritized
  const sortedModels = [...CANDIDATE_FLASH_MODELS].sort((a, b) => {
    const aCooldown = modelCooldownMap.get(a) || 0;
    const bCooldown = modelCooldownMap.get(b) || 0;
    const aAvailable = now > aCooldown;
    const bAvailable = now > bCooldown;
    if (aAvailable === bAvailable) return 0;
    return aAvailable ? -1 : 1;
  });

  for (const model of sortedModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });

      // Clear any cooldown on success
      modelCooldownMap.delete(model);
      return response;
    } catch (err: any) {
      lastError = err;
      const errMsg = (err?.message || "").toLowerCase();
      const errStatus = err?.status || err?.code;

      // If search tool fails, strip tools and retry on same model once
      if (params.config?.tools && (errMsg.includes("tool") || errMsg.includes("googlesearch") || errMsg.includes("search"))) {
        const { tools: _discard, ...restConfig } = params.config;
        try {
          const retryRes = await ai.models.generateContent({
            model,
            contents: params.contents,
            config: restConfig,
          });
          return retryRes;
        } catch {
          // continue to next model
        }
      }

      const isHighDemandOrOverload =
        errMsg.includes("503") ||
        errMsg.includes("high demand") ||
        errMsg.includes("unavailable") ||
        errMsg.includes("429") ||
        errMsg.includes("resource_exhausted") ||
        errStatus === 503 ||
        errStatus === 429;

      if (isHighDemandOrOverload) {
        // Place model on temporary cooldown for 60 seconds so next queries use fast alternate models
        modelCooldownMap.set(model, Date.now() + 60000);
        console.log(`[Gemini Failover] ${model} reported high demand, smoothly routing to next candidate.`);
        continue;
      }

      // For any other error, move to next model
      continue;
    }
  }

  throw lastError;
}

const MAYRA_MASTER_SYSTEM_PROMPT = `
You are MAYRA, a smart, friendly, fast and reliable AI personal assistant.
Your primary goal is to help the user with everyday tasks, learning, coding, creativity, productivity, information, and device-related assistance while being clear, respectful and safe.

1. IDENTITY
Name: MAYRA
Role: Personal AI Assistant
Personality: Intelligent, friendly, calm, helpful, confident and respectful
Communication style: Natural, concise and easy to understand
Default language: Match the user's language automatically.
If the user speaks:
- Hindi → reply in Hindi/Hinglish
- English → reply in English
- Odia → reply in Odia
- Sambalpuri → reply in Sambalpuri when possible
- Mixed language → reply naturally in the same mixed style
Never unnecessarily change the user's preferred language.

2. CORE BEHAVIOR
MAYRA should:
- Understand the user's intent before responding.
- Give direct answers instead of unnecessary explanations.
- Ask for clarification only when it is genuinely necessary.
- Break complicated tasks into simple steps.
- Remember relevant conversation context.
- Never pretend to have performed an action that was not actually performed.
- Clearly distinguish between facts, assumptions and suggestions.
- Admit uncertainty when information is unavailable or uncertain.
- Keep responses useful and practical.

3. PERSONAL ASSISTANT MODE
Help with: Reminders, To-do lists, Notes, Calendar planning, Daily schedules, Study planning, Productivity, Time management, Personal organization, Task planning.
If the user asks to save a note, create a task, or set a reminder, acknowledge it cleanly and format it clearly so it can be recorded.

4. DEVICE ASSISTANT MODE
When supported by the application and granted permissions:
Opening supported applications (YouTube, Camera, Settings, Clock, Calculator, Browser, Maps, etc.), searching, managing settings, voice interaction, text-to-speech.
Never claim access to functions that don't exist.

5. VOICE ASSISTANT MODE
When voice mode or concise spoken mode is requested:
Give a short, friendly, direct spoken response.

6. AI CHAT & CODING MODE
Answering general knowledge, science, programming, Android development, Kotlin, Java, Python, Web development, Jetpack components, Material Design.
When the user asks for code, provide complete, clean, modern code without lazy placeholders.

7. CREATIVE MODE
Generate AI image prompts, cinematic prompts, video prompts, music concepts, YouTube titles, captions, branding.
For image-generation prompts, provide detailed descriptions covering:
- Subject
- Environment
- Lighting
- Camera
- Composition
- Color palette
- Style
- Mood
- Aspect ratio
- Typography (when required)

8. WEB / CURRENT INFORMATION MODE
When current info (news, weather, sports, prices, current events) is requested, use verified knowledge and mention dates when useful.

9. RESPONSE FORMATTING
- Prefer short paragraphs, clear headings, bullet points, clean code blocks.
- Avoid repetitive filler, fake certainty, or endless disclaimers.
- Friendly, warm greeting only when initiated, otherwise get straight to helping.
`;

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

// Chat endpoint with Gemini
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userPreferences, currentMode, searchGrounding } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured.",
        reply: "The required AI service isn't currently available. Please ensure your Gemini API key is configured in Settings > Secrets.",
      });
    }

    let systemInstruction = MAYRA_MASTER_SYSTEM_PROMPT;
    if (userPreferences) {
      systemInstruction += `\n\nUSER PREFERENCES & MEMORY:
- Preferred Language: ${userPreferences.language || "Auto-detect"}
- User Name/Nickname: ${userPreferences.name || "Friend"}
- Response Style: ${userPreferences.style || "Concise and practical"}
- Current Assistant Mode: ${currentMode || "All-in-One"}
`;
    }

    // Format conversation history for Gemini API
    const formattedContents = (messages || []).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // If last message doesn't exist, provide a fallback
    if (formattedContents.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const config: Record<string, any> = {
      systemInstruction,
      temperature: 0.7,
    };

    // If search grounding is requested or current info mode is active
    if (searchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await generateWithFallback(ai, {
      contents: formattedContents,
      config,
    });

    const reply = response.text || "I didn't fully understand that. Please say it another way.";

    // Detect if MAYRA created or suggested an action (like a reminder, note, or app launch)
    const detectedActions: Array<{ type: string; title: string; detail?: string }> = [];
    
    // Quick regex checks for structured assistant action suggestions
    const lowerReply = reply.toLowerCase();
    if (lowerReply.includes("reminder") && (lowerReply.includes("set") || lowerReply.includes("added") || lowerReply.includes("scheduled"))) {
      detectedActions.push({ type: "reminder", title: "Reminder scheduled" });
    }
    if (lowerReply.includes("to-do") || lowerReply.includes("task added") || lowerReply.includes("added to your list")) {
      detectedActions.push({ type: "todo", title: "Task added to list" });
    }
    if (lowerReply.includes("note saved") || lowerReply.includes("noted down")) {
      detectedActions.push({ type: "note", title: "Note recorded" });
    }

    return res.json({
      reply,
      actions: detectedActions,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata,
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate response",
      reply: "I am momentarily experiencing high demand spikes. Please try again in a few seconds, or rephrase your request.",
    });
  }
});

// Creative image prompt generator endpoint
app.post("/api/creative-prompt", async (req, res) => {
  try {
    const { idea, style, ratio } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "API key not configured" });
    }

    const promptText = `As MAYRA in Creative Mode, generate a master-class, high-detail AI image prompt based on this user idea: "${idea}".
Selected style preference: ${style || "Cinematic / Realistic"}.
Target Aspect Ratio: ${ratio || "16:9"}.

Provide the response in the exact structure required by Section 8 of the MAYRA master prompt:
- Full Optimized Prompt (single copyable paragraph ready for Midjourney/Flux/Imagen/Gemini)
- Detailed Breakdown:
  • Subject: ...
  • Environment: ...
  • Lighting: ...
  • Camera & Lens: ...
  • Composition: ...
  • Color Palette: ...
  • Style & Render: ...
  • Mood: ...
  • Aspect Ratio: ${ratio || "16:9"}
  • Typography: (if applicable)
`;

    const response = await generateWithFallback(ai, {
      contents: promptText,
    });

    return res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error in /api/creative-prompt:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate prompt" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MAYRA Assistant server running on http://localhost:${PORT}`);
  });
}

startServer();
