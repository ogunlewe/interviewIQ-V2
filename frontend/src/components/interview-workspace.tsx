import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Clock, Brain, Lightbulb, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface InterviewWorkspaceProps {
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  hints: string[];
  progress: {
    completed: number;
    total: number;
  };
  timeSpent: number;
  className?: string;
}

export const InterviewWorkspace: React.FC<InterviewWorkspaceProps> = ({
  question,
  difficulty,
  topic,
  hints,
  progress,
  timeSpent,
  className
}) => {
  const difficultyColors = {
    easy: 'text-green-500 bg-green-500/10 border-green-500/20',
    medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    hard: 'text-red-500 bg-red-500/10 border-red-500/20'
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("flex flex-col h-full p-6 bg-background", className)}>
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className={difficultyColors[difficulty]}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
          <Badge variant="secondary">
            {topic}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatTime(timeSpent)}</span>
          <span className="mx-2">•</span>
          <Brain className="h-4 w-4" />
          <span>{progress.completed}/{progress.total} Complete</span>
        </div>
      </div>

      {/* Question section */}
      <Card className="flex-1 p-6 mb-6 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">Problem Statement</h2>
            <div className="space-y-4" dangerouslySetInnerHTML={{ __html: question }} />
          </div>
        </ScrollArea>
      </Card>

      {/* Hints and Progress section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Hints */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <h3 className="font-medium">Hints</h3>
          </div>
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {hints.map((hint, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 text-sm"
                >
                  <span className="font-mono text-xs bg-primary/10 rounded px-1.5 py-0.5 text-primary">
                    #{index + 1}
                  </span>
                  {hint}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Progress */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <h3 className="font-medium">Progress</h3>
          </div>
          <div className="space-y-4">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{
                  width: `${(progress.completed / progress.total) * 100}%`
                }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{Math.round((progress.completed / progress.total) * 100)}% Complete</span>
              <span>{progress.completed} of {progress.total} steps</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
