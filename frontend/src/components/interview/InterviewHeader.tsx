import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Code2,
  StickyNote,
  Play,
  Pause,
  Settings,
  HelpCircle
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface InterviewHeaderProps {
  elapsedTime: number;
  interviewStarted: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  speechEnabled: boolean;
  showCodeEditor: boolean;
  showNotes: boolean;
  onStartInterview: () => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleCodeEditor: () => void;
  onToggleNotes: () => void;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  elapsedTime,
  interviewStarted,
  audioEnabled,
  videoEnabled,
  speechEnabled,
  showCodeEditor,
  showNotes,
  onStartInterview,
  onToggleAudio,
  onToggleVideo,
  onToggleCodeEditor,
  onToggleNotes,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TooltipProvider>
      <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-full flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Technical Interview</h1>
            {interviewStarted ? (
              <Badge variant="secondary" className="gap-1">
                {elapsedTime >= 0 ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    {formatTime(elapsedTime)}
                  </>
                ) : (
                  'Starting...'
                )}
              </Badge>
            ) : null}
          </div>

          {/* Center section - Controls */}
          <div className="flex items-center gap-2">
            {/* Start/Pause Interview */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={interviewStarted ? "secondary" : "default"}
                  size="sm"
                  onClick={onStartInterview}
                  className="gap-2"
                >
                  {interviewStarted ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Start Interview
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {interviewStarted ? 'Pause interview' : 'Start interview'}
              </TooltipContent>
            </Tooltip>

            <div className="h-6 w-px bg-border mx-2" />

            {/* Audio control */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={audioEnabled ? "ghost" : "destructive"}
                  size="icon"
                  onClick={onToggleAudio}
                  className="h-9 w-9"
                >
                  {audioEnabled ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {audioEnabled ? 'Disable microphone' : 'Enable microphone'}
              </TooltipContent>
            </Tooltip>

            {/* Video control */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={videoEnabled ? "ghost" : "destructive"}
                  size="icon"
                  onClick={onToggleVideo}
                  className="h-9 w-9"
                >
                  {videoEnabled ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <VideoOff className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {videoEnabled ? 'Disable camera' : 'Enable camera'}
              </TooltipContent>
            </Tooltip>

            <div className="h-6 w-px bg-border mx-2" />

            {/* Code Editor toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showCodeEditor ? "secondary" : "ghost"}
                  size="icon"
                  onClick={onToggleCodeEditor}
                  className="h-9 w-9"
                >
                  <Code2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showCodeEditor ? 'Hide code editor' : 'Show code editor'}
              </TooltipContent>
            </Tooltip>

            {/* Notes toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showNotes ? "secondary" : "ghost"}
                  size="icon"
                  onClick={onToggleNotes}
                  className="h-9 w-9"
                >
                  <StickyNote className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showNotes ? 'Hide notes' : 'Show notes'}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  Audio settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Video settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Interview preferences
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Help & Documentation
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
