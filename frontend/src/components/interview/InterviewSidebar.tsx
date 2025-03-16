import React from 'react';
import { Message } from '../../lib/chat-service';
import { Button } from '../ui/button';
import { Mic, MicOff, Video, VideoOff, Send, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '../../lib/utils';

interface InterviewSidebarProps {
  showVideoCall: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
  networkQuality: number;
  messages: Message[];
  userInput: string;
  isThinking: boolean;
  isLoading: boolean;
  onVideoToggle: () => void;
  onAudioToggle: () => void;
  onUserInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const InterviewSidebar: React.FC<InterviewSidebarProps> = ({
  showVideoCall,
  videoEnabled,
  audioEnabled,
  networkQuality,
  messages,
  userInput,
  isThinking,
  isLoading,
  onVideoToggle,
  onAudioToggle,
  onUserInputChange,
  onSubmit,
}) => {
  return (
    <div className="w-[400px] border-r bg-background flex flex-col">
      {/* Video call section */}
      {showVideoCall && (
        <div className="p-4 border-b">
          <Card className="aspect-video relative overflow-hidden bg-muted">
            {/* Video placeholder or stream */}
            <div className="absolute inset-0 flex items-center justify-center">
              {videoEnabled ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/interviewer-avatar.png" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <VideoOff className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            {/* Controls overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg">
              <Button
                variant={audioEnabled ? "default" : "destructive"}
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={onAudioToggle}
              >
                {audioEnabled ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant={videoEnabled ? "default" : "destructive"}
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={onVideoToggle}
              >
                {videoEnabled ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <VideoOff className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Network quality indicator */}
            <Badge
              variant="secondary"
              className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
            >
              {networkQuality > 2 ? "Good" : networkQuality > 1 ? "Fair" : "Poor"} Connection
            </Badge>
          </Card>
        </div>
      )}

      {/* Chat section */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  message.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                {/* Avatar */}
                <Avatar className="h-8 w-8 mt-0.5">
                  <AvatarImage
                    src={message.role === "user" ? "/user-avatar.png" : "/interviewer-avatar.png"}
                  />
                  <AvatarFallback>
                    {message.role === "user" ? "U" : "AI"}
                  </AvatarFallback>
                </Avatar>

                {/* Message bubble */}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/interviewer-avatar.png" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl px-4 py-2 text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">Thinking</span>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input section */}
        <form onSubmit={onSubmit} className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="relative">
            <Textarea
              value={userInput}
              onChange={(e) => onUserInputChange(e.target.value)}
              placeholder="Type your response..."
              className="min-h-[80px] pr-12 resize-none"
              disabled={isLoading}
            />
            <Button
              size="icon"
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
