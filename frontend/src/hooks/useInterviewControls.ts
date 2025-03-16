import { useState, useRef, useEffect } from "react";

/**
 * Hook for managing interview timer and basic controls
 */
export function useInterviewControls() {
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [interviewStage, setInterviewStage] = useState<string>("intro");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartInterview = () => {
    setInterviewStarted(true);
    setIsTimerRunning(true);
  };

  const handlePauseInterview = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleRestart = () => {
    setInterviewStage("intro");
    setInterviewStarted(false);
    setElapsedTime(0);
    setIsTimerRunning(false);
    setIsThinking(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (thinkingTimerRef.current) {
      clearTimeout(thinkingTimerRef.current);
    }
  };

  const handleThinkingTime = () => {
    setIsThinking(true);
    thinkingTimerRef.current = setTimeout(() => {
      setIsThinking(false);
    }, 30000);
  };

  const handleStopThinking = () => {
    setIsThinking(false);
    if (thinkingTimerRef.current) {
      clearTimeout(thinkingTimerRef.current);
    }
  };

  const handleNextStage = () => {
    const stages = ["intro", "technical", "coding", "system-design", "behavioral", "wrap-up"];
    const currentIndex = stages.indexOf(interviewStage);
    if (currentIndex < stages.length - 1) {
      setInterviewStage(stages[currentIndex + 1]);
    }
  };

  return {
    // State
    interviewStarted,
    elapsedTime,
    isTimerRunning,
    interviewStage,
    isThinking,
    
    // Actions
    formatTime,
    handleStartInterview,
    handlePauseInterview,
    handleRestart,
    handleThinkingTime,
    handleStopThinking,
    handleNextStage,
    setInterviewStage
  };
}
