"use client"

import React from "react";
import type { Message } from "../../lib/chat-service";
import { FormEvent } from "react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { 
  Mic, MicOff, 
  Video, VideoOff, 
  PhoneOff, 
  Send, 
  Volume2, 
  VolumeX,
  Wifi,
  WifiOff
} from "lucide-react";

interface EnhancedVideoCallInterfaceProps {
  messages: Message[];
  onSendMessage: (e: FormEvent<HTMLFormElement>, message: string) => void;
  audioEnabled: boolean;
  videoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  interviewerName: string;
  interviewerAvatar: string;
  networkQuality: number;
  isLoading: boolean;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  continuousSpeech: boolean;
  onToggleContinuousSpeech: () => void;
  spokenMessageIds: Set<string>;
  onMessageSpoken: (messageId: string) => void;
}

export default function EnhancedVideoCallInterface({
  messages,
  onSendMessage,
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  interviewerName,
  interviewerAvatar,
  networkQuality,
  isLoading,
  isSpeaking,
  onStopSpeaking,
  continuousSpeech,
  onToggleContinuousSpeech,
  spokenMessageIds,
  onMessageSpoken,
}: EnhancedVideoCallInterfaceProps) {
  const [userInput, setUserInput] = React.useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    
    onSendMessage(e, userInput);
    setUserInput("");
  };

  // Helper function to render network quality indicator
  const renderNetworkQuality = () => {
    switch (networkQuality) {
      case 0: return <WifiOff className="h-4 w-4 text-red-500" />;
      case 1: return <Wifi className="h-4 w-4 text-red-400" />;
      case 2: return <Wifi className="h-4 w-4 text-yellow-400" />;
      case 3: return <Wifi className="h-4 w-4 text-green-400" />;
      default: return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[550px]">
      {/* Video area */}
      <div className="md:col-span-8 bg-slate-900 rounded-lg overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center space-x-2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
            {renderNetworkQuality()}
            <span>
              {networkQuality === 0 ? "Disconnected" : 
               networkQuality === 1 ? "Poor" : 
               networkQuality === 2 ? "Good" : "Excellent"}
            </span>
          </div>
        </div>
        
        {/* Main interviewer video */}
        <div className="flex flex-col items-center justify-center h-full">
          <Avatar className="h-32 w-32">
            <img src={interviewerAvatar} alt={interviewerName} />
          </Avatar>
          <h3 className="text-white mt-4 font-medium">{interviewerName}</h3>
          <div className="text-slate-400 text-sm">
            {isSpeaking ? "Speaking..." : "Listening..."}
          </div>
        </div>

        {/* User self-view */}
        <div className="absolute bottom-4 right-4 w-32 h-24 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center border-2 border-slate-700">
          <div className="text-center text-slate-400 text-xs">
            {videoEnabled ? "Your camera" : "Camera off"}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full bg-slate-800 border-slate-700 hover:bg-slate-700 ${
              !audioEnabled ? "bg-red-900 hover:bg-red-800" : ""
            }`}
            onClick={onToggleAudio}
          >
            {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full bg-slate-800 border-slate-700 hover:bg-slate-700 ${
              !videoEnabled ? "bg-red-900 hover:bg-red-800" : ""
            }`}
            onClick={onToggleVideo}
          >
            {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full"
            onClick={onEndCall}
          >
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat area */}
      <div className="md:col-span-4 flex flex-col border rounded-lg border-slate-200 dark:border-slate-800">
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="font-medium text-sm">Chat</h3>
          <Button
            variant={continuousSpeech ? "default" : "outline"}
            size="sm"
            onClick={isSpeaking ? onStopSpeaking : onToggleContinuousSpeech}
            className={
              isSpeaking
                ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                : continuousSpeech
                ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                : ""
            }
          >
            {isSpeaking ? (
              <VolumeX className="h-4 w-4" />
            ) : continuousSpeech ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-[85%] ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  {message.role === "assistant" && !continuousSpeech && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onMessageSpoken(message.id)}
                      className="mt-1 text-xs opacity-60 hover:opacity-100"
                    >
                      <Volume2 className="h-3 w-3 mr-1" />
                      Speak
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 animate-pulse">
                  <div className="flex space-x-2 items-center">
                    <div className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:200ms]"></div>
                    <div className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:400ms]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSubmit} className="p-3 border-t">
          <div className="relative">
            <Textarea
              placeholder="Type a message..."
              className="min-h-[60px] resize-none pr-10 text-sm"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 bottom-1 h-8 w-8"
              disabled={!userInput.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
