"use client";

import type React from "react";
import { useState, useEffect, FormEvent, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertCircle } from "lucide-react";

// Hooks
import { useInterviewState } from "../hooks/useInterviewState";
import { useInterviewControls } from "../hooks/useInterviewControls";
import { useInterviewMedia } from "../hooks/useInterviewMedia";
import { useSpeechServices } from "../hooks/useSpeechServices";
import { useChatInterface } from "../hooks/useInterviewChat.new";
import { useCodeEditor } from "../hooks/useCodeEditor";

// Components
import  InterviewSettingsPanel  from "./interview/InterviewSettingsPanel.new";
import { InterviewToolbar } from "./interview/InterviewToolbar.new";
import { ChatInterface } from "./interview/ChatInterface";
import { InterviewerProfile } from "./interview/InterviewerProfile";
import EnhancedVideoCallInterface from "./interview/EnhancedVideoCallInterface.new";
import CodeEditor from "./code-editor";
import WhiteboardEditor from "./whiteboard-editor.new";
import NotesEditor from "./notes-editor.new";
import TopicSelector from "./topic-selector.new";

export function InterviewSimulator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<string>("settings");

  // Interview configuration state from the custom hook
  const {
    selectedTopics,
    difficulty,
    interviewerMood,
    companyProfile,
    setSelectedTopics,
    setDifficulty,
    setInterviewerMood,
    setCompanyProfile,
    systemPrompt,
    interviewer,
  } = useInterviewState();

  // Interview controls state from the custom hook
  const {
    interviewStarted,
    elapsedTime,
    isTimerRunning,
    interviewStage,
    isThinking,
    formatTime,
    handleStartInterview,
    handlePauseInterview,
    handleRestart,
    handleThinkingTime,
    handleStopThinking,
    handleNextStage,
    setInterviewStage,
  } = useInterviewControls();

  // Interview media state from the custom hook
  const {
    showCodeEditor,
    showWhiteboard,
    showNotes,
    audioEnabled,
    videoEnabled,
    showVideoCall,
    networkQuality,
    handleToggleCodeEditor,
    handleToggleWhiteboard,
    handleToggleNotes,
    handleToggleAudio,
    handleToggleVideo,
    handleToggleVideoCall,
  } = useInterviewMedia();

  // Speech services from the custom hook
  const {
    isSpeaking,
    isListening,
    speechEnabled,
    continuousSpeech,
    spokenMessageIds,
    speakMessage,
    toggleContinuousSpeech,
    stopSpeaking,
    startListening,
    stopListening,
    handleNewMessages,
  } = useSpeechServices({
    onTranscriptReady: (transcript) => {
      handleSendMessage(null as any, transcript);
    },
  });

  // Chat state from the custom hook
  const {
    displayMessages,
    isLoading,
    error,
    startInterview: startChatInterview,
    sendMessage,
    resetChat,
  } = useChatInterface({
    onThinking: handleThinkingTime,
  });

  // Code editor state from custom hook
  const {
    code,
    language,
    editorRef,
    setCode,
    setLanguage,
    executeCode,
    reviewCode,
  } = useCodeEditor();

  // State for notes and whiteboard
  const [notes, setNotes] = useState<string>("");
  const [whiteboard, setWhiteboard] = useState<string>("");

  // Monitor messages for speech
  useEffect(() => {
    handleNewMessages(displayMessages, isLoading);
  }, [displayMessages, isLoading, handleNewMessages]);

  // Start the interview
  const handleStartInterviewClick = () => {
    handleStartInterview();
    setActiveTab("interview");
    startChatInterview(
      selectedTopics,
      difficulty,
      interviewerMood,
      companyProfile,
      interviewStage,
      interviewer.name
    );
  };

  // Handle sending a message
  const handleSendMessage = (
    e: FormEvent<HTMLFormElement>,
    message: string
  ) => {
    if (e) {
      e.preventDefault();
    }

    if (!message.trim() || isLoading) return;

    sendMessage(message, systemPrompt, interviewer.name);
  };

  // Reset the interview
  const handleInterviewRestart = () => {
    handleRestart();
    resetChat();
    setActiveTab("settings");
  };

  // Render the interview based on started state
  const renderInterviewContent = () => {
    if (!interviewStarted) {
      return (
        <InterviewSettingsPanel
          selectedTopics={selectedTopics}
          difficulty={difficulty}
          interviewerMood={interviewerMood}
          companyProfile={companyProfile}
          onTopicsChange={setSelectedTopics}
          onDifficultyChange={setDifficulty}
          onInterviewerMoodChange={setInterviewerMood}
          onCompanyChange={setCompanyProfile}
          onStartInterview={handleStartInterviewClick}
        />
      );
    }

    return (
      <div className="space-y-4">
        <InterviewToolbar
          isTimerRunning={isTimerRunning}
          elapsedTime={elapsedTime}
          showCodeEditor={showCodeEditor}
          showWhiteboard={showWhiteboard}
          showNotes={showNotes}
          onPauseInterview={handlePauseInterview}
          onRestart={handleInterviewRestart}
          onToggleCodeEditor={handleToggleCodeEditor}
          onToggleWhiteboard={handleToggleWhiteboard}
          onToggleNotes={handleToggleNotes}
          onNextStage={handleNextStage}
          onThinkingTime={handleThinkingTime}
          isSpeaking={isSpeaking}
          continuousSpeech={continuousSpeech}
          onStopSpeaking={stopSpeaking}
          onToggleContinuousSpeech={toggleContinuousSpeech}
        />

        {showVideoCall ? (
          <EnhancedVideoCallInterface
            messages={displayMessages}
            onSendMessage={handleSendMessage}
            audioEnabled={audioEnabled}
            videoEnabled={videoEnabled}
            onToggleAudio={handleToggleAudio}
            onToggleVideo={handleToggleVideo}
            onEndCall={handleToggleVideoCall}
            interviewerName={interviewer.name}
            interviewerAvatar={interviewer.avatar}
            networkQuality={networkQuality}
            isLoading={isLoading}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-1 order-2 md:order-1">
              <InterviewerProfile
                companyProfile={companyProfile}
                mood={interviewerMood}
                interviewStage={interviewStage}
                interviewerName={interviewer.name}
                interviewerAvatar={interviewer.avatar}
              />
            </div>

            <div className="md:col-span-2 order-1 md:order-2">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>Interview Conversation</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={continuousSpeech ? "default" : "outline"}
                        size="sm"
                        onClick={
                          isSpeaking ? stopSpeaking : toggleContinuousSpeech
                        }
                        className={
                          isSpeaking
                            ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                            : continuousSpeech
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : ""
                        }
                      >
                        {isSpeaking
                          ? "Stop Voice"
                          : continuousSpeech
                          ? "Voice On"
                          : "Voice Off"}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChatInterface
                    messages={displayMessages}
                    isLoading={isLoading}
                    error={error}
                    isThinking={isThinking}
                    isSpeaking={isSpeaking}
                    isListening={isListening}
                    speechEnabled={speechEnabled}
                    continuousSpeech={continuousSpeech}
                    spokenMessageIds={spokenMessageIds}
                    interviewerAvatar={interviewer.avatar}
                    onSendMessage={handleSendMessage}
                    onStopThinking={handleStopThinking}
                    onStartListening={startListening}
                    onStopListening={stopListening}
                    onStopSpeaking={stopSpeaking}
                    onToggleContinuousSpeech={toggleContinuousSpeech}
                    onMessageSpoken={(messageId) => {
                      const message = displayMessages.find(
                        (m) => m.id === messageId
                      );
                      if (message) {
                        speakMessage(message.content, false, messageId);
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {showCodeEditor && (
          <CodeEditor
            language={language}
            code={code}
            onLanguageChange={setLanguage}
            onCodeChange={setCode}
            editorRef={editorRef}
            onExecuteCode={executeCode}
            onReviewCode={() => {
              const feedback = reviewCode(code, language);
              if (feedback) {
                sendMessage(
                  `Can you review this code?\n\n\`\`\`${language}\n${code}\n\`\`\``,
                  systemPrompt,
                  interviewer.name
                );
              }
            }}
          />
        )}

        {showWhiteboard && (
          <WhiteboardEditor
            value={whiteboard}
            onChange={(value) => setWhiteboard(value)}
          />
        )}

        {showNotes && (
          <NotesEditor value={notes} onChange={(value) => setNotes(value)} />
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-8">Interview Simulator</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger
            value="video"
            onClick={() => {
              if (interviewStarted) {
                handleToggleVideoCall();
              }
            }}
          >
            Video Call
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">{renderInterviewContent()}</TabsContent>
        <TabsContent value="interview">{renderInterviewContent()}</TabsContent>
        <TabsContent value="video">
          {interviewStarted ? (
            renderInterviewContent()
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Start the interview first to access the video call feature.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
