"use client";

import type React from "react";
import { useState, useEffect, FormEvent } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertCircle, Cpu } from "lucide-react";

// Hooks
import { useInterviewState } from "../hooks/useInterviewState";
import { useInterviewControls } from "../hooks/useInterviewControls";
import { useInterviewMedia } from "../hooks/useInterviewMedia";
import { useSpeechServices } from "../hooks/useSpeechServices";
import { useChatInterface } from "../hooks/useInterviewChat";
import { useCodeEditor } from "../hooks/useCodeEditor";

// Components
import { InterviewSettingsPanel } from "./interview/InterviewSettingsPanel";
import { InterviewToolbar } from "./interview/InterviewToolbar";
import { ChatInterface } from "./interview/ChatInterface";
import { InterviewerProfile } from "./interview/InterviewerProfile";
import EnhancedVideoCallInterface from "./interview/EnhancedVideoCallInterface";
import CodeEditor from "./code-editor";
import WhiteboardEditor from "./whiteboard-editor";
import NotesEditor from "./notes-editor";

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
    isCodeEditorExpanded,
    showWhiteboard,
    showNotes,
    audioEnabled,
    videoEnabled,
    showVideoCall,
    networkQuality,
    handleToggleCodeEditor,
    handleExpandCodeEditor,
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
            isSpeaking={isSpeaking}
            onStopSpeaking={stopSpeaking}
            continuousSpeech={continuousSpeech}
            onToggleContinuousSpeech={toggleContinuousSpeech}
            spokenMessageIds={spokenMessageIds}
            onMessageSpoken={(messageId) => {
              const message = displayMessages.find((m) => m.id === messageId);
              if (message) {
                speakMessage(message.content, false, messageId);
              }
            }}
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
                  <CardTitle className="text-lg">
                    Interview Conversation
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
          <div
            className={
              isCodeEditorExpanded ? "absolute inset-0 z-50 bg-background" : ""
            }
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Code Editor</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExpandCodeEditor}
                >
                  {isCodeEditorExpanded ? "Minimize" : "Expand"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleCodeEditor}
                >
                  Close
                </Button>
              </div>
            </div>
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-0">
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
              </CardContent>
            </Card>
          </div>
        )}

        {showWhiteboard && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Whiteboard</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleWhiteboard}
                >
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WhiteboardEditor
                value={whiteboard}
                onChange={(value) => setWhiteboard(value)}
              />
            </CardContent>
          </Card>
        )}

        {showNotes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>Notes</span>
                <Button variant="outline" size="sm" onClick={handleToggleNotes}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NotesEditor
                value={notes}
                onChange={(value) => setNotes(value)}
              />
            </CardContent>
          </Card>
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
