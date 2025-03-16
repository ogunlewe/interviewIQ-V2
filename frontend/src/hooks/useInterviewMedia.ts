import { useState, useEffect } from "react";

/**
 * Hook for managing interview media controls like audio, video, etc.
 */
export function useInterviewMedia() {
  // UI Tool States
  const [showCodeEditor, setShowCodeEditor] = useState<boolean>(false);
  const [isCodeEditorExpanded, setIsCodeEditorExpanded] = useState<boolean>(false);
  const [showWhiteboard, setShowWhiteboard] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  
  // Video Call States
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(false);
  const [showVideoCall, setShowVideoCall] = useState<boolean>(false);
  const [networkQuality, setNetworkQuality] = useState<number>(3);

  // Simulate network quality changes when video is active
  useEffect(() => {
    if (showVideoCall) {
      const interval = setInterval(() => {
        if (Math.random() < 0.1) {
          setNetworkQuality((prev) => Math.max(1, prev - 1));
        } else if (Math.random() < 0.1) {
          setNetworkQuality((prev) => Math.min(3, prev + 1));
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [showVideoCall]);

  const handleToggleCodeEditor = () => {
    setShowCodeEditor((prev) => !prev);
    setIsCodeEditorExpanded(false);
    setShowWhiteboard(false);
    setShowNotes(false);
  };

  const handleExpandCodeEditor = () => {
    setIsCodeEditorExpanded((prev) => !prev);
  };

  const handleToggleWhiteboard = () => {
    setShowWhiteboard((prev) => !prev);
    setShowCodeEditor(false);
    setShowNotes(false);
  };

  const handleToggleNotes = () => {
    setShowNotes((prev) => !prev);
    setShowCodeEditor(false);
    setShowWhiteboard(false);
  };

  const handleToggleAudio = () => {
    setAudioEnabled((prev) => !prev);
  };

  const handleToggleVideo = () => {
    setVideoEnabled((prev) => !prev);
  };

  const handleToggleVideoCall = () => {
    setShowVideoCall((prev) => !prev);
  };

  return {
    // Tool States
    showCodeEditor,
    isCodeEditorExpanded,
    showWhiteboard,
    showNotes,
    
    // Video Call States
    audioEnabled,
    videoEnabled,
    showVideoCall,
    networkQuality,
    
    // Actions
    handleToggleCodeEditor,
    handleExpandCodeEditor,
    handleToggleWhiteboard,
    handleToggleNotes,
    handleToggleAudio,
    handleToggleVideo,
    handleToggleVideoCall,
  };
}
