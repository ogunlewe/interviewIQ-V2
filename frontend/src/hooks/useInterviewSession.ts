import { useState, useRef } from 'react';
import { UnifiedSpeechService } from '../lib/unified-speech-service';
import { SpeechRecognitionService } from '../lib/speech-service';

export interface InterviewSessionState {
  interviewStage: string;
  interviewStarted: boolean;
  elapsedTime: number;
  isTimerRunning: boolean;
  showCodeEditor: boolean;
  isCodeEditorExpanded: boolean;
  showWhiteboard: boolean;
  showNotes: boolean;
  isThinking: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  showVideoCall: boolean;
  networkQuality: number;
  isSpeaking: boolean;
  isListening: boolean;
  speechEnabled: boolean;
  continuousSpeech: boolean;
  spokenMessageIds: Set<string>;
  showScrollButton: boolean;
}

export function useInterviewSession() {
  // Interview state
  const [interviewStage, setInterviewStage] = useState<string>("intro");
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // UI state
  const [showCodeEditor, setShowCodeEditor] = useState<boolean>(false);
  const [isCodeEditorExpanded, setIsCodeEditorExpanded] = useState<boolean>(false);
  const [showWhiteboard, setShowWhiteboard] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Media state
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(false);
  const [showVideoCall, setShowVideoCall] = useState<boolean>(false);
  const [networkQuality, setNetworkQuality] = useState<number>(3);

  // Speech state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
  const [continuousSpeech, setContinuousSpeech] = useState<boolean>(false);
  const [spokenMessageIds, setSpokenMessageIds] = useState<Set<string>>(new Set());

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechServiceRef = useRef<UnifiedSpeechService | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null);

  // Actions
  const startInterview = () => {
    setInterviewStarted(true);
    setIsTimerRunning(true);
    setInterviewStage("in-progress");
  };

  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const resetSession = () => {
    setInterviewStarted(false);
    setIsTimerRunning(false);
    setElapsedTime(0);
    setInterviewStage("intro");
    // Clear any active timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
  };

  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
  };

  const toggleVideo = () => {
    setVideoEnabled(prev => !prev);
  };

  const toggleCodeEditor = () => {
    setShowCodeEditor(prev => !prev);
  };

  const toggleNotes = () => {
    setShowNotes(prev => !prev);
  };

  return {
    // Interview state
    interviewStage,
    interviewStarted,
    elapsedTime,
    isTimerRunning,
    showCodeEditor,
    isCodeEditorExpanded,
    showWhiteboard,
    showNotes,
    isThinking,
    audioEnabled,
    videoEnabled,
    showVideoCall,
    networkQuality,
    isSpeaking,
    isListening,
    speechEnabled,
    continuousSpeech,
    spokenMessageIds,
    showScrollButton,

    // Setters
    setInterviewStage,
    setShowCodeEditor,
    setIsCodeEditorExpanded,
    setShowWhiteboard,
    setShowNotes,
    setIsThinking,
    setShowVideoCall,
    setNetworkQuality,
    setIsSpeaking,
    setIsListening,
    setSpeechEnabled,
    setContinuousSpeech,
    setSpokenMessageIds,
    setShowScrollButton,

    // Actions
    startInterview,
    toggleTimer,
    resetSession,
    toggleAudio,
    toggleVideo,
    toggleCodeEditor,
    toggleNotes,

    // Refs
    timerRef,
    thinkingTimerRef,
    speechServiceRef,
    speechRecognitionRef
  };
}
