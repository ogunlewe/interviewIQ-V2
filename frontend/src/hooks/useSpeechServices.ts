import { useState, useRef, useEffect } from "react";
import { SpeechRecognitionService } from "../lib/speech-service";
import { UnifiedSpeechService } from "../lib/unified-speech-service";
import type { Message } from '../lib/chat-service';

interface UseSpeechServicesProps {
  onTranscriptReady?: (transcript: string) => void;
  onCodeSuggestion?: (suggestion: string) => void;
}

export function useSpeechServices({
  onTranscriptReady,
  onCodeSuggestion
}: UseSpeechServicesProps = {}) {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
  const [continuousSpeech, setContinuousSpeech] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [spokenMessageIds, setSpokenMessageIds] = useState<Set<string>>(new Set());
  const [useElevenLabs, setUseElevenLabs] = useState<boolean>(false);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>("");
  const [elevenLabsVoiceId, setElevenLabsVoiceId] = useState<string>("");
  const [elevenLabsVoices, setElevenLabsVoices] = useState<Array<{ id: string; name: string }>>([]);
  const [speechPauseDuration, setSpeechPauseDuration] = useState(1500);
  const [isSpeechProcessing, setIsSpeechProcessing] = useState(false);
  
  const speechServiceRef = useRef<UnifiedSpeechService | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech services
  useEffect(() => {
    try {
      speechServiceRef.current = UnifiedSpeechService.getInstance();
      speechRecognitionRef.current = SpeechRecognitionService.getInstance();
      setSpeechEnabled(true);

      if (speechServiceRef.current) {
        const voices = speechServiceRef.current.getBrowserVoices();
        setAvailableVoices(voices);
        const preferredVoice = speechServiceRef.current.getPreferredBrowserVoice();
        if (preferredVoice) {
          setSelectedVoice(preferredVoice);
        }

        const elVoices = speechServiceRef.current.getElevenLabsVoices();
        setElevenLabsVoices(elVoices);

        const storedApiKey = localStorage.getItem("elevenLabsApiKey");
        if (storedApiKey) {
          setElevenLabsApiKey(storedApiKey);
          speechServiceRef.current.setElevenLabsApiKey(storedApiKey);
          setUseElevenLabs(true);
          speechServiceRef.current.setUseElevenLabs(true);
        }
      }
    } catch (error) {
      console.error("Speech services not available:", error);
      setSpeechEnabled(false);
    }

    return () => {
      stopSpeaking();
      if (speechRecognitionRef.current && speechRecognitionRef.current.isRecognizing()) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

  // Show notification when continuous speech is enabled
  useEffect(() => {
    if (continuousSpeech) {
      const notification = document.createElement("div");
      notification.className =
        "fixed bottom-4 right-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-md shadow-md text-sm flex items-center z-50";
      notification.innerHTML =
        '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728"></path></svg>Automatic voice mode enabled';
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.5s";
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 500);
      }, 3000);
    }
  }, [continuousSpeech]);

  // Helper function to find the last assistant message
  const findLastAssistantMessage = (messages: Message[]): Message | undefined => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        return messages[i];
      }
    }
    return undefined;
  };

  // Speak a message
  const speakMessage = (message: string, isNewMessage = false, messageId?: string) => {
    if (!speechServiceRef.current || !speechEnabled) return;

    setIsSpeaking(true);

    const segments = message.split(/(\[LINE \d+(?:-\d+)?\]:.*?)(?=\[LINE|\n|$)/g);
    
    let currentIndex = 0;
    
    const speakNextSegment = () => {
      if (currentIndex >= segments.length) {
        setIsSpeaking(false);
        if (messageId) {
          setSpokenMessageIds((prev) => new Set([...prev, messageId]));
        }
        return;
      }

      const segment = segments[currentIndex];
      
      if (segment.trim().match(/^\[LINE \d+(?:-\d+)?\]:/)) {
        if (onCodeSuggestion) {
          onCodeSuggestion(segment.trim());
        }
      }

      speechServiceRef.current?.speak(segment, {
        voice: selectedVoice || undefined,
        onEnd: () => {
          currentIndex++;
          setTimeout(speakNextSegment, 500);
        },
        onError: () => {
          setIsSpeaking(false);
        },
      });
    };

    speakNextSegment();
  };

  // Toggle continuous speech mode
  const toggleContinuousSpeech = () => {
    const newMode = !continuousSpeech;
    setContinuousSpeech(newMode);
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (speechServiceRef.current && speechServiceRef.current.isSpeaking()) {
      speechServiceRef.current.stop();
      setIsSpeaking(false);
    }
  };

  // Start speech recognition
  const startListening = () => {
    if (!speechRecognitionRef.current || !speechEnabled) return;

    setIsListening(true);

    speechRecognitionRef.current.start(
      (transcript) => {
        if (silenceTimer.current) {
          clearTimeout(silenceTimer.current);
        }
        
        silenceTimer.current = setTimeout(() => {
          if (transcript.trim().length > 0 && onTranscriptReady) {
            setIsSpeechProcessing(true);
            stopListening();
            
            setTimeout(() => {
              onTranscriptReady(transcript);
              setIsSpeechProcessing(false);
            }, 500);
          }
        }, speechPauseDuration);
      },
      () => {
        setIsListening(false);
        if (silenceTimer.current) {
          clearTimeout(silenceTimer.current);
        }
      }
    );
  };

  // Stop speech recognition
  const stopListening = () => {
    if (speechRecognitionRef.current && speechRecognitionRef.current.isRecognizing()) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Handle continuous speech for new messages
  const handleNewMessages = (messages: Message[], isLoading: boolean) => {
    const displayMessages = messages.filter(m => m.role !== 'system');
    
    if (displayMessages.length > 0 && !isLoading && continuousSpeech) {
      const lastMessage = displayMessages[displayMessages.length - 1];
      if (lastMessage.role === "assistant" && !spokenMessageIds.has(lastMessage.id)) {
        setTimeout(() => {
          if (!isSpeaking) {
            speakMessage(lastMessage.content, true, lastMessage.id);
            setSpokenMessageIds((prev) => new Set([...prev, lastMessage.id]));
          }
        }, 300);
      }
    }
  };

  // Update voice settings
  const updateVoiceSettings = (settings: {
    elevenLabsApiKey?: string;
    useElevenLabs?: boolean;
    elevenLabsVoiceId?: string;
    selectedVoice?: SpeechSynthesisVoice;
  }) => {
    if (settings.elevenLabsApiKey !== undefined) {
      setElevenLabsApiKey(settings.elevenLabsApiKey);
      localStorage.setItem("elevenLabsApiKey", settings.elevenLabsApiKey);
      if (speechServiceRef.current) {
        speechServiceRef.current.setElevenLabsApiKey(settings.elevenLabsApiKey);
      }
    }
    
    if (settings.useElevenLabs !== undefined) {
      setUseElevenLabs(settings.useElevenLabs);
      if (speechServiceRef.current) {
        speechServiceRef.current.setUseElevenLabs(settings.useElevenLabs);
      }
    }
    
    if (settings.elevenLabsVoiceId !== undefined) {
      setElevenLabsVoiceId(settings.elevenLabsVoiceId);
      if (speechServiceRef.current) {
        speechServiceRef.current.setElevenLabsVoiceId(settings.elevenLabsVoiceId);
      }
    }
    
    if (settings.selectedVoice !== undefined) {
      setSelectedVoice(settings.selectedVoice);
    }
  };

  return {
    // State
    isSpeaking,
    isListening,
    speechEnabled,
    continuousSpeech,
    availableVoices,
    selectedVoice,
    useElevenLabs,
    elevenLabsApiKey,
    elevenLabsVoiceId,
    elevenLabsVoices,
    speechPauseDuration,
    isSpeechProcessing,
    spokenMessageIds,
    
    // Actions
    speakMessage,
    toggleContinuousSpeech,
    stopSpeaking,
    startListening,
    stopListening,
    handleNewMessages,
    updateVoiceSettings,
    setSpeechPauseDuration,
    setSpokenMessageIds
  };
}
