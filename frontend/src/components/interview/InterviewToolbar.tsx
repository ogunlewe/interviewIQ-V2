import React from "react";
import { Button } from "../ui/button";
import {
  Play,
  Pause,
  RefreshCw,
  PenTool,
  Layers,
  StickyNote,
  SkipForward,
  Clock,
} from "lucide-react";

interface InterviewToolbarProps {
  isTimerRunning: boolean;
  elapsedTime: number;
  showCodeEditor: boolean;
  showWhiteboard: boolean;
  showNotes: boolean;
  onPauseInterview: () => void;
  onRestart: () => void;
  onToggleCodeEditor: () => void;
  onToggleWhiteboard: () => void;
  onToggleNotes: () => void;
  onNextStage: () => void;
  onThinkingTime: () => void;
}

export function InterviewToolbar({
  isTimerRunning,
  elapsedTime,
  showCodeEditor,
  showWhiteboard,
  showNotes,
  onPauseInterview,
  onRestart,
  onToggleCodeEditor,
  onToggleWhiteboard,
  onToggleNotes,
  onNextStage,
  onThinkingTime,
}: InterviewToolbarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-between mb-4 pb-4 border-b">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onThinkingTime}
          title="Take thinking time"
        >
          <Clock className="h-4 w-4 mr-1" />
          Think
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleCodeEditor}
          className={showCodeEditor ? "bg-slate-100 dark:bg-slate-700" : ""}
          title="Toggle code editor"
        >
          <PenTool className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleWhiteboard}
          className={showWhiteboard ? "bg-slate-100 dark:bg-slate-700" : ""}
          title="Toggle whiteboard"
        >
          <Layers className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleNotes}
          className={showNotes ? "bg-slate-100 dark:bg-slate-700" : ""}
          title="Toggle notes"
        >
          <StickyNote className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextStage}
          title="Move to next interview stage"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="text-sm font-medium">{formatTime(elapsedTime)}</div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPauseInterview}
          title={isTimerRunning ? "Pause interview" : "Resume interview"}
        >
          {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRestart}
          title="Restart interview"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
