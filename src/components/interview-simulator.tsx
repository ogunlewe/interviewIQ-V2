"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/seperator";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Send,
  RefreshCw,
  Cpu,
  AlertCircle,
  Clock,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PenTool,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  StickyNote,
  Layers,
  MessageSquare,
} from "lucide-react";
import TopicSelector from "./topic-selector";
import FeedbackPanel from "./feedback-panel";
import CodeEditor from "./code-editor";
import { useChat } from "../lib/chat-service";
import InterviewerProfile from "./interview-profile";
import VideoCallInterface from "../components/video-call-interface";
import Whiteboard from "../components/whiteboard";
import NoteTaker from "../components/note-taker";
import { SpeechService, SpeechRecognitionService } from "../lib/speech-service";

export default function InterviewSimulator() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "JavaScript",
    "React",
    "Data Structures",
  ]);
  const [difficulty, setDifficulty] = useState<string>("intermediate");
  const [activeTab, setActiveTab] = useState<string>("interview");
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [interviewStage, setInterviewStage] = useState<string>("intro");
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showCodeEditor, setShowCodeEditor] = useState<boolean>(false);
  const [showWhiteboard, setShowWhiteboard] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(false);
  const [interviewerMood, setInterviewerMood] = useState<string>("neutral");
  const [companyProfile, setCompanyProfile] = useState<string>("tech-startup");
  const [showVideoCall, setShowVideoCall] = useState<boolean>(false);
  const [networkQuality, setNetworkQuality] = useState<number>(3); // 0-3, where 3 is excellent
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechServiceRef = useRef<SpeechService | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null);

  // Initialize speech services
  useEffect(() => {
    try {
      speechServiceRef.current = SpeechService.getInstance();
      speechRecognitionRef.current = SpeechRecognitionService.getInstance();
      setSpeechEnabled(true);
    } catch (error) {
      console.error("Speech services not available:", error);
      setSpeechEnabled(false);
    }

    return () => {
      if (speechServiceRef.current && speechServiceRef.current.isSpeaking()) {
        speechServiceRef.current.stop();
      }

      if (
        speechRecognitionRef.current &&
        speechRecognitionRef.current.isRecognizing()
      ) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

  // Simulate network quality changes
  useEffect(() => {
    if (showVideoCall) {
      const interval = setInterval(() => {
        // Randomly change network quality for realism
        if (Math.random() < 0.1) {
          setNetworkQuality((prev) => Math.max(1, prev - 1));
        } else if (Math.random() < 0.1) {
          setNetworkQuality((prev) => Math.min(3, prev + 1));
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [showVideoCall]);

  const systemPrompt = `
    You are DevInterviewPro, an expert technical interviewer for software engineers.
    
    Current interview topics: ${selectedTopics.join(", ")}
    Difficulty level: ${difficulty}
    Company profile: ${companyProfile}
    
    This is a structured interview with the following stages:
    1. Introduction and background questions
    2. Technical knowledge assessment
    3. Coding challenge
    4. System design discussion
    5. Behavioral questions
    6. Candidate questions and wrap-up
    
    Current stage: ${interviewStage}
    
    Ask one question at a time related to the current stage and selected topics. Wait for the candidate's response before providing feedback and asking the next question.
    
    For each answer:
    1. Provide constructive feedback
    2. Rate the answer on a scale of 1-5
    3. Suggest improvements if needed
    4. Ask a follow-up question or move to the next stage when appropriate
    
    Keep your questions realistic for a ${difficulty} level software engineering interview.
    Maintain a professional but ${interviewerMood} demeanor throughout the interview.
    
    If the candidate is struggling, provide hints rather than immediate answers.
  `;

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
    error,
  } = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "system",
        content: systemPrompt,
      },
    ],
  });

  // Filter out system messages for display
  const displayMessages = messages.filter(
    (message) => message.role !== "system"
  );

  // Start/stop interview timer
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

  // Format elapsed time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleRestart = () => {
    reload();
    setShowFeedback(false);
    setInterviewStage("intro");
    setInterviewStarted(false);
    setElapsedTime(0);
    setIsTimerRunning(false);
    setShowCodeEditor(false);
    setShowWhiteboard(false);
    setShowNotes(false);
    setIsThinking(false);
    setShowVideoCall(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current);
    }
    if (speechServiceRef.current && speechServiceRef.current.isSpeaking()) {
      speechServiceRef.current.stop();
    }
  };

  const handleTopicsChange = (topics: string[]) => {
    setSelectedTopics(topics);
  };

  const handleDifficultyChange = (level: string) => {
    setDifficulty(level);
  };

  const handleCompanyChange = (company: string) => {
    setCompanyProfile(company);
  };

  const handleInterviewerMoodChange = (mood: string) => {
    setInterviewerMood(mood);
  };

  const handleStartInterview = () => {
    setInterviewStarted(true);
    setIsTimerRunning(true);
    setActiveTab("interview");
  };

  const handlePauseInterview = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleThinkingTime = () => {
    setIsThinking(true);
    // Automatically stop thinking after 30 seconds
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

  const handleToggleCodeEditor = () => {
    setShowCodeEditor((prev) => !prev);
    setShowWhiteboard(false);
    setShowNotes(false);
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

  const handleNextStage = () => {
    const stages = [
      "intro",
      "technical",
      "coding",
      "system-design",
      "behavioral",
      "wrap-up",
    ];
    const currentIndex = stages.indexOf(interviewStage);
    if (currentIndex < stages.length - 1) {
      setInterviewStage(stages[currentIndex + 1]);
    }
  };

  // Text-to-speech for interviewer messages
  const speakMessage = (message: string) => {
    if (!speechServiceRef.current || !speechEnabled) return;

    setIsSpeaking(true);

    speechServiceRef.current.speak(message, {
      rate: 1,
      pitch: 1,
      onEnd: () => {
        setIsSpeaking(false);
      },
      onError: () => {
        setIsSpeaking(false);
      },
    });
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
        // Update input field with transcript
        handleInputChange({
          target: { value: transcript },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  // Stop speech recognition
  const stopListening = () => {
    if (
      speechRecognitionRef.current &&
      speechRecognitionRef.current.isRecognizing()
    ) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Get interviewer details based on company profile
  const getInterviewerDetails = () => {
    switch (companyProfile) {
      case "tech-startup":
        return {
          name: "Alex Chen",
          role: "Senior Developer & Co-founder",
          company: "InnovateTech",
          avatar: "https://placehold.co/200x200",
        };
      case "enterprise":
        return {
          name: "Sarah Johnson",
          role: "Engineering Manager",
          company: "Enterprise Solutions Inc.",
          avatar: "https://placehold.co/200x200",
        };
      case "faang":
        return {
          name: "Michael Rodriguez",
          role: "Principal Engineer",
          company: "TechGiant",
          avatar: "https://placehold.co/200x200",
        };
      default:
        return {
          name: "Alex Chen",
          role: "Senior Developer",
          company: "InnovateTech",
          avatar: "https://placehold.co/200x200",
        };
    }
  };

  const interviewer = getInterviewerDetails();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interview">Interview Session</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="interview" className="mt-4">
            {!interviewStarted ? (
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Ready to Begin Your Interview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Interview Overview</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>
                        This interview will cover: {selectedTopics.join(", ")}
                      </li>
                      <li>
                        Difficulty level:{" "}
                        <span className="capitalize">{difficulty}</span>
                      </li>
                      <li>Expected duration: 20-30 minutes</li>
                      <li>
                        Company profile:{" "}
                        {companyProfile === "tech-startup"
                          ? "Tech Startup"
                          : companyProfile === "enterprise"
                          ? "Enterprise Company"
                          : "FAANG-level Company"}
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Interview Stages</h3>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                      <li>Introduction and background questions</li>
                      <li>Technical knowledge assessment</li>
                      <li>Coding challenge</li>
                      <li>System design discussion</li>
                      <li>Behavioral questions</li>
                      <li>Your questions and wrap-up</li>
                    </ol>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">New Features Available</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Video call interface with screen sharing</li>
                      <li>Text-to-speech for interviewer responses</li>
                      <li>Speech-to-text for your answers</li>
                      <li>Interactive whiteboard for system design</li>
                      <li>Note-taking tool to record key points</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button size="lg" onClick={handleStartInterview}>
                    Start Interview
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={isTimerRunning ? "default" : "outline"}
                      className="flex items-center"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(elapsedTime)}
                    </Badge>
                    <Badge variant="secondary">
                      Stage:{" "}
                      {interviewStage === "intro"
                        ? "Introduction"
                        : interviewStage === "technical"
                        ? "Technical"
                        : interviewStage === "coding"
                        ? "Coding"
                        : interviewStage === "system-design"
                        ? "System Design"
                        : interviewStage === "behavioral"
                        ? "Behavioral"
                        : "Wrap-up"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleAudio}
                      className={!audioEnabled ? "text-slate-400" : ""}
                    >
                      {audioEnabled ? (
                        <Mic className="h-4 w-4" />
                      ) : (
                        <MicOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleVideo}
                      className={!videoEnabled ? "text-slate-400" : ""}
                    >
                      {videoEnabled ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <VideoOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleVideoCall}
                      className={
                        showVideoCall ? "bg-slate-100 dark:bg-slate-700" : ""
                      }
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePauseInterview}
                    >
                      {isTimerRunning ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRestart}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {showVideoCall ? (
                  <VideoCallInterface
                    audioEnabled={audioEnabled}
                    videoEnabled={videoEnabled}
                    onToggleAudio={handleToggleAudio}
                    onToggleVideo={handleToggleVideo}
                    onEndCall={handleToggleVideoCall}
                    interviewerName={interviewer.name}
                    interviewerAvatar={interviewer.avatar}
                    networkQuality={networkQuality}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <InterviewerProfile
                        companyProfile={companyProfile}
                        mood={interviewerMood}
                        interviewStage={interviewStage}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between text-lg">
                            <span>Interview Conversation</span>
                            <div className="flex space-x-2">
                              {speechEnabled && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={
                                    isSpeaking
                                      ? stopSpeaking
                                      : () => {
                                          const lastMessage =
                                            displayMessages.findLast(
                                              (m) => m.role === "assistant"
                                            );
                                          if (lastMessage)
                                            speakMessage(lastMessage.content);
                                        }
                                  }
                                  className={
                                    isSpeaking
                                      ? "bg-slate-100 dark:bg-slate-700"
                                      : ""
                                  }
                                >
                                  {isSpeaking ? (
                                    <VolumeX className="h-4 w-4" />
                                  ) : (
                                    <Volume2 className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleToggleCodeEditor}
                                className={
                                  showCodeEditor
                                    ? "bg-slate-100 dark:bg-slate-700"
                                    : ""
                                }
                              >
                                <PenTool className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleToggleWhiteboard}
                                className={
                                  showWhiteboard
                                    ? "bg-slate-100 dark:bg-slate-700"
                                    : ""
                                }
                              >
                                <Layers className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleToggleNotes}
                                className={
                                  showNotes
                                    ? "bg-slate-100 dark:bg-slate-700"
                                    : ""
                                }
                              >
                                <StickyNote className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextStage}
                              >
                                <SkipForward className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardTitle>
                        </CardHeader>

                        <CardContent>
                          {error && (
                            <Alert variant="destructive" className="mb-4">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}

                          {isThinking && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                                    Thinking Time (30s)
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleStopThinking}
                                >
                                  Done Thinking
                                </Button>
                              </div>
                              <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                                Take your time to think about your answer. The
                                interviewer is waiting.
                              </p>
                            </div>
                          )}

                          <ScrollArea className="h-[400px] pr-4">
                            {displayMessages.length === 0 ? (
                              <div className="flex items-center justify-center h-full">
                                <div className="text-center text-slate-500 dark:text-slate-400">
                                  <Cpu className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                  <p>Your interview will begin shortly...</p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {displayMessages.map((message) => (
                                  <div
                                    key={message.id}
                                    className={`flex ${
                                      message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                                  >
                                    <div
                                      className={`flex gap-3 max-w-[80%] ${
                                        message.role === "user"
                                          ? "flex-row-reverse"
                                          : ""
                                      }`}
                                    >
                                      <Avatar className="h-8 w-8">
                                        {message.role === "user" ? (
                                          <>
                                            <AvatarImage src="https://placehold.co/32x32" />
                                            <AvatarFallback>U</AvatarFallback>
                                          </>
                                        ) : (
                                          <>
                                            <AvatarImage
                                              src={interviewer.avatar}
                                            />
                                            <AvatarFallback>AI</AvatarFallback>
                                          </>
                                        )}
                                      </Avatar>
                                      <div
                                        className={`rounded-lg px-4 py-2 ${
                                          message.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                        }`}
                                      >
                                        <div className="whitespace-pre-wrap">
                                          {message.content}
                                        </div>
                                        {message.role === "assistant" && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 mt-1 text-xs opacity-70 hover:opacity-100"
                                            onClick={() =>
                                              speakMessage(message.content)
                                            }
                                            disabled={
                                              !speechEnabled || isSpeaking
                                            }
                                          >
                                            <Volume2 className="h-3 w-3 mr-1" />
                                            Listen
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {isLoading && (
                                  <div className="flex justify-start">
                                    <div className="flex gap-3 max-w-[80%]">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={interviewer.avatar} />
                                        <AvatarFallback>AI</AvatarFallback>
                                      </Avatar>
                                      <div className="rounded-lg px-4 py-2 bg-muted">
                                        <div className="flex space-x-2">
                                          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce"></div>
                                          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce [animation-delay:0.2s]"></div>
                                          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </ScrollArea>
                        </CardContent>

                        {showCodeEditor && (
                          <div className="px-6 pb-4">
                            <CodeEditor />
                          </div>
                        )}

                        {showWhiteboard && (
                          <div className="px-6 pb-4 h-[400px]">
                            <Whiteboard />
                          </div>
                        )}

                        {showNotes && (
                          <div className="px-6 pb-4 h-[400px]">
                            <NoteTaker />
                          </div>
                        )}

                        <CardFooter>
                          <form
                            onSubmit={handleSubmit}
                            className="w-full space-y-3"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleThinkingTime}
                                disabled={isThinking}
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Thinking Time
                              </Button>

                              {speechEnabled && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={
                                    isListening ? stopListening : startListening
                                  }
                                  className={
                                    isListening
                                      ? "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800"
                                      : ""
                                  }
                                >
                                  {isListening ? (
                                    <>
                                      <Mic className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 animate-pulse" />
                                      Recording...
                                    </>
                                  ) : (
                                    <>
                                      <Mic className="h-4 w-4 mr-2" />
                                      Speak Answer
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>

                            <Textarea
                              placeholder={
                                isThinking
                                  ? "Taking time to think..."
                                  : isListening
                                  ? "Listening to your answer..."
                                  : "Type your answer here..."
                              }
                              value={input}
                              onChange={handleInputChange}
                              className="min-h-[80px]"
                              disabled={isThinking || isListening}
                            />
                            <div className="flex justify-end">
                              <Button
                                type="submit"
                                disabled={
                                  isLoading ||
                                  !input.trim() ||
                                  isThinking ||
                                  isListening
                                }
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send Answer
                              </Button>
                            </div>
                          </form>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Difficulty Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {["beginner", "intermediate", "advanced", "expert"].map(
                      (level) => (
                        <Badge
                          key={level}
                          variant={difficulty === level ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                          onClick={() => handleDifficultyChange(level)}
                        >
                          {level}
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Company Profile</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "tech-startup", label: "Tech Startup" },
                      { id: "enterprise", label: "Enterprise" },
                      { id: "faang", label: "FAANG-level" },
                    ].map((company) => (
                      <Badge
                        key={company.id}
                        variant={
                          companyProfile === company.id ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleCompanyChange(company.id)}
                      >
                        {company.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Interviewer Style
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "friendly", label: "Friendly" },
                      { id: "neutral", label: "Neutral" },
                      { id: "challenging", label: "Challenging" },
                    ].map((mood) => (
                      <Badge
                        key={mood.id}
                        variant={
                          interviewerMood === mood.id ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleInterviewerMoodChange(mood.id)}
                      >
                        {mood.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Speech Settings</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enable-tts"
                        className="mr-2"
                        checked={speechEnabled}
                        onChange={() => setSpeechEnabled((prev) => !prev)}
                        disabled={!window.speechSynthesis}
                      />
                      <label htmlFor="enable-tts" className="text-sm">
                        Enable text-to-speech for interviewer
                      </label>
                    </div>
                    {!window.speechSynthesis && (
                      <p className="text-xs text-red-500">
                        Your browser doesn't support speech synthesis.
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <TopicSelector
                  selectedTopics={selectedTopics}
                  onTopicsChange={handleTopicsChange}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-1">
        <FeedbackPanel
          messages={displayMessages}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
        />
      </div>
    </div>
  );
}
