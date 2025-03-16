import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, BookOpen, ThumbsUp, MessageSquare } from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface QuestionPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  question: {
    title: string;
    description: string;
    examples: Array<{
      input: string;
      output: string;
    }>;
    constraints?: string[];
  };
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  isCollapsed,
  onToggleCollapse,
  question,
}) => {
  return (
    <Card className="h-full rounded-none border-r">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-muted/40">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{question.title}</h2>
          <Badge variant="secondary">Medium</Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span>Acceptance Rate: 65.2%</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2 text-sm">
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          <span>Likes: 2.4K</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2 text-sm">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span>Discussion: 342</span>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100%-8.5rem)]">
        <div className="p-6 space-y-6">
          {/* Description */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed">
              {question.description}
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Examples
            </h3>
            {question.examples.map((example, index) => (
              <div
                key={index}
                className="bg-muted/50 rounded-lg overflow-hidden"
              >
                <div className="px-4 py-2 bg-muted/70 border-b">
                  <span className="text-sm font-medium">Example {index + 1}</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Input:</div>
                    <div className="font-mono text-sm bg-background/50 p-2 rounded">
                      {example.input}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Output:</div>
                    <div className="font-mono text-sm bg-background/50 p-2 rounded">
                      {example.output}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Constraints */}
          {question.constraints && question.constraints.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Constraints
              </h3>
              <ul className="space-y-2 list-none pl-0">
                {question.constraints.map((constraint, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="font-mono text-xs bg-muted/50 px-1.5 py-0.5 rounded">
                      •
                    </span>
                    <span className="font-mono">{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Topics */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Related Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Math</Badge>
              <Badge variant="outline">String</Badge>
              <Badge variant="outline">Recursion</Badge>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};
