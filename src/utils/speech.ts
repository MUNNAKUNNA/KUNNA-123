/**
 * Speech Recognition and Synthesis utility for MAYRA Voice Assistant Mode
 */

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

// Check SpeechRecognition support
const SpeechRecognitionClass =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export const isSpeechRecognitionSupported = (): boolean => {
  return !!SpeechRecognitionClass;
};

export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

/**
 * Start listening via Web Speech API
 */
export const startListening = (
  onResult: (result: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void,
  lang: string = 'en-US'
): (() => void) | null => {
  if (!SpeechRecognitionClass) {
    onError('Speech recognition is not supported in this browser.');
    return null;
  }

  try {
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      const text = final || interim;
      if (text) {
        onResult(text.trim(), !!final);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        onError('Microphone permission was denied.');
      } else if (event.error !== 'no-speech') {
        onError(`Speech error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    // Return stop function
    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    };
  } catch (err: any) {
    onError(err.message || 'Failed to start microphone');
    return null;
  }
};

/**
 * Speak text using Web Speech API TTS
 */
export const speakText = (
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    lang?: string;
    onStart?: () => void;
    onEnd?: () => void;
  } = {}
) => {
  if (!isSpeechSynthesisSupported()) return;

  // Cancel any previous speech
  window.speechSynthesis.cancel();

  // Strip markdown formatting for cleaner speech
  const cleanText = text
    .replace(/```[\s\S]*?```/g, 'Code block omitted.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*#_~]/g, '')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = options.rate || 1.0;
  utterance.pitch = options.pitch || 1.05;

  // Try to find a natural female or friendly voice
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const preferredVoice = voices.find(
      (v) =>
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira')) &&
        (options.lang ? v.lang.startsWith(options.lang.slice(0, 2)) : true)
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
  }

  if (options.lang) {
    utterance.lang = options.lang;
  }

  utterance.onstart = () => {
    if (options.onStart) options.onStart();
  };

  utterance.onend = () => {
    if (options.onEnd) options.onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    if (options.onEnd) options.onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};
