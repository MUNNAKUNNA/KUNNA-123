import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  Layers, 
  Sparkles, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface CodingHubProps {
  onAskMayraCode: (query: string) => void;
}

export const CodingHub: React.FC<CodingHubProps> = ({ onAskMayraCode }) => {
  const [selectedSnippet, setSelectedSnippet] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const snippets = [
    {
      title: "Android Kotlin: Text-to-Speech & Voice Manager",
      language: "kotlin",
      file: "app/src/main/java/com/mayra/assistant/VoiceManager.kt",
      code: `package com.mayra.assistant

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import java.util.Locale

class MayraVoiceManager(private val context: Context) : TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = null
    private var isReady = false

    init {
        tts = TextToSpeech(context, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            // Try Hindi/English/Regional Locale
            val result = tts?.setLanguage(Locale("hi", "IN"))
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                tts?.setLanguage(Locale.US)
            }
            tts?.setPitch(1.05f)
            tts?.setSpeechRate(1.0f)
            isReady = true
        }
    }

    fun speak(text: String, onDone: (() -> Unit)? = null) {
        if (!isReady) return
        val utteranceId = "MAYRA_\${System.currentTimeMillis()}"
        tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(id: String?) {}
            override fun onDone(id: String?) { onDone?.invoke() }
            override fun onError(id: String?) {}
        })
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
    }
}`,
    },
    {
      title: "Android Manifest & Runtime Permissions for Audio/Notifications",
      language: "xml",
      file: "app/src/main/AndroidManifest.xml",
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions required for MAYRA Voice and Assistant -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />

    <application
        android:allowBackup="true"
        android:label="@string/app_name"
        android:theme="@style/Theme.MayraAssistant">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".services.MayraForegroundService"
            android:foregroundServiceType="microphone"
            android:exported="false" />
    </application>
</manifest>`,
    },
    {
      title: "Jetpack Compose: Modern Voice Assistant UI & Ripple Orb",
      language: "kotlin",
      file: "app/src/main/java/com/mayra/assistant/ui/AssistantScreen.kt",
      code: `@Composable
fun MayraVoiceOrb(
    isListening: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "orbPulse")
    val scale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = if (isListening) 1.25f else 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(900, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier.size(140.dp)
    ) {
        if (isListening) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .scale(scale)
                    .clip(CircleShape)
                    .background(Color(0x3310B981))
            )
        }
        FloatingActionButton(
            onClick = onClick,
            shape = CircleShape,
            containerColor = if (isListening) Color(0xFFEF4444) else Color(0xFF10B981),
            contentColor = Color.White,
            modifier = Modifier.size(80.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Mic,
                contentDescription = "MAYRA Mic",
                modifier = Modifier.size(36.dp)
            )
        }
    }
}`,
    },
    {
      title: "Kotlin: SpeechRecognizer Intent Helper",
      language: "kotlin",
      file: "app/src/main/java/com/mayra/assistant/SpeechHelper.kt",
      code: `package com.mayra.assistant

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer

class MayraSpeechRecognizer(
    private val context: Context,
    private val onResult: (String) -> Unit
) {
    private var recognizer: SpeechRecognizer? = null

    fun startListening() {
        if (!SpeechRecognizer.isRecognitionAvailable(context)) return
        recognizer = SpeechRecognizer.createSpeechRecognizer(context).apply {
            setRecognitionListener(object : RecognitionListener {
                override fun onResults(results: Bundle?) {
                    val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    if (!matches.isNullOrEmpty()) {
                        onResult(matches[0])
                    }
                }
                override fun onReadyForSpeech(params: Bundle?) {}
                override fun onBeginningOfSpeech() {}
                override fun onRmsChanged(rmsdB: Float) {}
                override fun onBufferReceived(buffer: ByteArray?) {}
                override fun onEndOfSpeech() {}
                override fun onError(error: Int) {}
                override fun onPartialResults(partialResults: Bundle?) {}
                override fun onEvent(eventType: Int, params: Bundle?) {}
            })
        }

        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "hi-IN") // Can switch to en-US / or-IN
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
        }
        recognizer?.startListening(intent)
    }

    fun stop() {
        recognizer?.stopListening()
        recognizer?.destroy()
    }
}`,
    },
    {
      title: "Python Desktop Assistant: Voice Engine + Gemini AI Bridge",
      language: "python",
      file: "mayra_desktop.py",
      code: `import speech_recognition as sr
import pyttsx3
import datetime
import webbrowser
import wikipedia
import os
import requests

# Voice Engine Setup
engine = pyttsx3.init('sapi5')
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[0].id)  # Male/Female voice
engine.setProperty('rate', 175)            # Speaking speed

def speak(audio):
    """Voice response helper"""
    print(f"MAYRA: {audio}")
    engine.say(audio)
    engine.runAndWait()

def wish_me():
    """Start-up greeting based on local time"""
    hour = int(datetime.datetime.now().hour)
    if 0 <= hour < 12:
        speak("Good Morning, Munna sir!")
    elif 12 <= hour < 18:
        speak("Good Afternoon, Munna sir!")
    else:
        speak("Good Evening, Munna sir!")
    speak("Main MAYRA hoon. Main aapki kya madad kar sakti hoon?")

def take_command():
    """Mic se voice input capture karta hai"""
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("\\nSun rahi hoon (Listening)...")
        r.pause_threshold = 1
        r.adjust_for_ambient_noise(source, duration=1)
        audio = r.listen(source)

    try:
        print("Recognizing...")
        query = r.recognize_google(audio, language='en-in')
        print(f"User said: {query}\\n")
    except Exception:
        print("Dobara boliye, samajh nahi aaya...")
        return "None"
    return query.lower()

# --- Main Program Loop ---
if __name__ == "__main__":
    wish_me()
    while True:
        query = take_command()

        if query == "None":
            continue

        # 1. Wikipedia Search
        if 'wikipedia' in query:
            speak('Searching Wikipedia...')
            query = query.replace("wikipedia", "").strip()
            try:
                results = wikipedia.summary(query, sentences=2)
                speak("According to Wikipedia")
                speak(results)
            except Exception as e:
                speak("Wikipedia par yeh topic nahi mila.")

        # 2. YouTube Open
        elif 'open youtube' in query:
            speak("Opening YouTube")
            webbrowser.open("https://youtube.com")

        # 3. Google Open / Search
        elif 'open google' in query:
            speak("Opening Google")
            webbrowser.open("https://google.com")

        # 4. Time Batana
        elif 'time' in query:
            str_time = datetime.datetime.now().strftime("%I:%M %p")
            speak(f"Sir, the time is {str_time}")

        # 5. Assistant band karna
        elif 'exit' in query or 'stop' in query or 'bye' in query:
            speak("Goodbye Munna sir, have a great day!")
            break

        # 6. Fallback to AI answer
        else:
            speak("Ek second sir, main check kar rahi hoon...")
            # Optional: Call MAYRA / Gemini API
            print(f"Executing query: {query}")
`,
    },
    {
      title: "Flutter & Dart: Gemini AI + Voice STT & TTS Assistant",
      language: "dart",
      file: "lib/main.dart",
      code: `import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

void main() {
  runApp(const MayraVoiceApp());
}

class MayraVoiceApp extends StatelessWidget {
  const MayraVoiceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MAYRA Voice Assistant',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF10B981),
          brightness: Brightness.dark,
        ),
      ),
      home: const MayraHomeScreen(),
    );
  }
}

class MayraHomeScreen extends StatefulWidget {
  const MayraHomeScreen({super.key});

  @override
  State<MayraHomeScreen> createState() => _MayraHomeScreenState();
}

class _MayraHomeScreenState extends State<MayraHomeScreen> {
  late stt.SpeechToText _speech;
  late FlutterTts _tts;
  late GenerativeModel _geminiModel;

  bool _isListening = false;
  bool _isLoading = false;
  String _recognizedText = "Tap mic and say: 'Hey MAYRA'";
  String _assistantReply = "Main MAYRA hoon. Aapki kya madad kar sakti hoon?";

  // Replace with your secure key or pass from env
  final String _apiKey = const String.fromEnvironment('GEMINI_API_KEY');

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
    _initTts();
    _initGemini();
  }

  void _initTts() async {
    _tts = FlutterTts();
    await _tts.setLanguage("hi-IN"); // Or "en-IN" / "en-US"
    await _tts.setPitch(1.0);
    await _tts.setSpeechRate(0.95);
  }

  void _initGemini() {
    _geminiModel = GenerativeModel(
      model: 'gemini-1.5-flash',
      apiKey: _apiKey.isNotEmpty ? _apiKey : 'YOUR_GEMINI_API_KEY',
      systemInstruction: Content.system(
        'You are MAYRA, a smart and friendly AI personal assistant. Respond concisely in the user\\'s spoken language (Hindi, Hinglish, or English).'
      ),
    );
  }

  void _speak(String text) async {
    await _tts.stop();
    await _tts.speak(text);
  }

  void _toggleListening() async {
    if (_isListening) {
      setState(() => _isListening = false);
      _speech.stop();
      if (_recognizedText.isNotEmpty && _recognizedText != "Tap mic and say: 'Hey MAYRA'") {
        _askGemini(_recognizedText);
      }
    } else {
      bool available = await _speech.initialize(
        onStatus: (status) {
          if (status == 'done' || status == 'notListening') {
            setState(() => _isListening = false);
          }
        },
        onError: (val) => print('Error: $val'),
      );

      if (available) {
        setState(() => _isListening = true);
        _speech.listen(
          onResult: (val) {
            setState(() {
              _recognizedText = val.recognizedWords;
            });
            if (val.hasConfidenceRating && val.confidence > 0.6) {
              _speech.stop();
              setState(() => _isListening = false);
              _askGemini(_recognizedText);
            }
          },
          localeId: "hi_IN", // or "en_IN"
        );
      }
    }
  }

  Future<void> _askGemini(String prompt) async {
    if (prompt.trim().isEmpty) return;

    setState(() {
      _isLoading = true;
      _assistantReply = "MAYRA soch rahi hai...";
    });

    try {
      final response = await _geminiModel.generateContent([
        Content.text(prompt),
      ]);

      final reply = response.text ?? "Main samajh nahi paayi, dobara boliye.";
      setState(() {
        _assistantReply = reply;
        _isLoading = false;
      });
      _speak(reply);
    } catch (e) {
      setState(() {
        _assistantReply = "Error: \${e.toString()}";
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _speech.stop();
    _tts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('MAYRA Voice Assistant', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            children: [
              // User speech card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white10),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Aapne bola:', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    const SizedBox(height: 6),
                    Text(_recognizedText, style: const TextStyle(fontSize: 16, color: Colors.white)),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // MAYRA Reply card
              Expanded(
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF022C22).withOpacity(0.4),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
                  ),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.auto_awesome, color: Color(0xFF10B981), size: 18),
                            const SizedBox(width: 8),
                            const Text('MAYRA ka jawab:', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
                            if (_isLoading)
                              const Padding(
                                padding: EdgeInsets.only(left: 10),
                                child: SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF10B981))),
                              ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          _assistantReply,
                          style: const TextStyle(fontSize: 15, height: 1.5, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Glowing Animated Mic Button
              GestureDetector(
                onTap: _toggleListening,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  width: 84,
                  height: 84,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _isListening ? Colors.redAccent : const Color(0xFF10B981),
                    boxShadow: [
                      BoxShadow(
                        color: (_isListening ? Colors.redAccent : const Color(0xFF10B981)).withOpacity(0.4),
                        blurRadius: _isListening ? 25 : 12,
                        spreadRadius: _isListening ? 6 : 2,
                      ),
                    ],
                  ),
                  child: Icon(
                    _isListening ? Icons.mic : Icons.mic_none,
                    color: Colors.white,
                    size: 40,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                _isListening ? 'Sun rahi hoon... (Bolte rahiye)' : 'Bolne ke liye Mic dabayein',
                style: const TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }
}`,
    },
  ];

  const current = snippets[selectedSnippet];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            Coding & Android Studio Hub
          </h2>
          <p className="text-xs text-slate-400">
            Production-grade Kotlin, Jetpack Compose, permissions, and backend architecture for MAYRA.
          </p>
        </div>
      </div>

      {/* Snippets navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        {snippets.map((snip, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedSnippet(i)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedSnippet === i
                ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold truncate">
              <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{snip.title}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1 truncate">{snip.file}</p>
          </button>
        ))}
      </div>

      {/* Code Display Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-slate-300 font-medium">{current.file}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-mono">
              {current.language}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              type="button"
              onClick={() => onAskMayraCode(`MAYRA, explain and customize this Kotlin code for my app: ${current.file}\n\`\`\`${current.language}\n${current.code.slice(0, 300)}\n\`\`\``)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask MAYRA to Refactor</span>
            </button>
          </div>
        </div>

        <pre className="p-4 overflow-x-auto text-xs font-mono text-emerald-200/90 bg-slate-950 leading-relaxed max-h-[480px]">
          <code>{current.code}</code>
        </pre>
      </div>

      {/* Quick coding prompts to MAYRA */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Ask MAYRA for More Code Solutions:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            "Write a Kotlin Coroutine worker for background sync",
            "How to handle Android 14 Notification permissions?",
            "Create a Jetpack Compose Chat bubble UI with Markdown",
            "Explain Android Intent filters for voice activation",
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onAskMayraCode(`MAYRA (Coding Mode): ${prompt}`)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-emerald-300 transition-colors text-left"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
