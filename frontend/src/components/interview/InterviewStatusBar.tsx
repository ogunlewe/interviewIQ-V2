import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Timer, 
  CheckCircle2, 
  XCircle,
  Circle,
  ChevronDown,
  Clock,
  Brain
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface InterviewStatusBarProps {
  difficulty: string;
  timeSpent: number;
  totalTestCases: number;
  passedTestCases: number;
  onDifficultyChange: (difficulty: string) => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const InterviewStatusBar: React.FC<InterviewStatusBarProps> = ({
  difficulty,
  timeSpent,
  totalTestCases,
  passedTestCases,
  onDifficultyChange,
}) => {
  return (
    <Card className="rounded-none border-b flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-6">
        {/* Difficulty Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className={`
                ${difficulty === 'easy' ? 'text-green-500' : ''}
                ${difficulty === 'medium' ? 'text-yellow-500' : ''}
                ${difficulty === 'hard' ? 'text-red-500' : ''}
              `}
            >
              <Brain className="h-4 w-4 mr-2" />
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onDifficultyChange('easy')}>
              <span className="text-green-500">Easy</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDifficultyChange('medium')}>
              <span className="text-yellow-500">Medium</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDifficultyChange('hard')}>
              <span className="text-red-500">Hard</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Time Spent */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatTime(timeSpent)}</span>
        </div>

        {/* Test Cases Status */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {Array.from({ length: totalTestCases }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  i < passedTestCases
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < passedTestCases ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
            ))}
          </div>
          <Badge variant="outline">
            {passedTestCases}/{totalTestCases} Passed
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          Reset
        </Button>
      </div>
    </Card>
  );
};
