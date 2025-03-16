import React, { useRef, useState, useEffect, FormEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Send,
  AlertCircle,
  Clock,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { Message } from "../../lib/chat-service";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  error?: string;
  isThinking: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  speechEnabled: boolean;
  continuousSpeech: boolean;
  spokenMessageIds: Set<string>;
  interviewerAvatar: string;
  onSendMessage: (e: FormEvent<HTMLFormElement>, message: string) => void;
  onStopThinking: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  onToggleContinuousSpeech: () => void;
  onMessageSpoken?: (messageId: string) => void;
}

export function ChatInterface({
  messages,
  isLoading,
  error,
  isThinking,
  isSpeaking,
  isListening,
  speechEnabled,
  continuousSpeech,
  spokenMessageIds,
  interviewerAvatar,
  onSendMessage,
  onStopThinking,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  onToggleContinuousSpeech,
  onMessageSpoken,
}: ChatInterfaceProps) {
  const [userInput, setUserInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollArea = document.getElementById("chat-scroll-area");
    if (scrollArea) {
      const scrollContainer = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Check if we should show scroll button
  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = document.getElementById("chat-scroll-area");
      if (scrollArea) {
        const scrollContainer = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          const { scrollTop, scrollHeight, clientHeight } = scrollContainer as HTMLElement;
          const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 100;
          setShowScrollButton(!isAtBottom);
        }
      }
    };

    const scrollArea = document.getElementById("chat-scroll-area");
    if (scrollArea) {
      const scrollContainer = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll);
        return () => scrollContainer.removeEventListener("scroll", handleScroll);
      }
    }
  }, []);

  const scrollToBottom = () => {
    const scrollArea = document.getElementById("chat-scroll-area");
    if (scrollArea) {
      const scrollContainer = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    
    onSendMessage(e, userInput);
    setUserInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <>
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
            <Button size="sm" variant="outline" onClick={onStopThinking}>
              Done Thinking
            </Button>
          </div>
          <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
            Take your time to think about your answer. The interviewer is waiting.
          </p>
        </div>
      )}

      <ScrollArea className="h-[400px] pr-4 relative" id="chat-scroll-area" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-500 dark:text-slate-400">
              <p>Your interview will begin shortly...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    {message.role === "user" ? (
                      <>
                        <AvatarImage src="https://placehold.co/32x32" />
                        <AvatarFallback>U</AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src={interviewerAvatar} />
                        <AvatarFallback>AI</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.role === "assistant" && !continuousSpeech && speechEnabled && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onMessageSpoken && onMessageSpoken(message.id)}
                        className="mt-2 text-xs opacity-60 hover:opacity-100"
                      >
                        <Volume2 className="h-3 w-3 mr-1" />
                        Speak
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
                    <AvatarImage src={interviewerAvatar} />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2 animate-pulse">
                    <div className="flex space-x-2 items-center">
                      <div className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:200ms]"></div>
                      <div className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:400ms]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {showScrollButton && (
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background shadow-md"
            onClick={scrollToBottom}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        )}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Type your message..."
            className="min-h-[80px] resize-none pr-20"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <div className="absolute right-2 bottom-2 flex space-x-2">
            {speechEnabled && (
              <Button
                type="button"
                size="icon"
                variant="outline"
                className={`rounded-full h-9 w-9 ${
                  isListening 
                    ? "bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400" 
                    : ""
                }`}
                disabled={isLoading}
                onClick={isListening ? onStopListening : onStartListening}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !userInput.trim()}
              className="rounded-full h-9 w-9"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      {speechEnabled && (
        <div className="flex justify-center mt-4">
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
              <>
                <VolumeX className="h-4 w-4 mr-1" />
                Stop Speaking
              </>
            ) : continuousSpeech ? (
              <>
                <Volume2 className="h-4 w-4 mr-1" />
                Voice Mode: On
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-1" />
                Enable Voice Mode
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}
