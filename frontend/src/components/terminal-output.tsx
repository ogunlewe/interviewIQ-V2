import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Send } from 'lucide-react';

interface TerminalOutputProps {
  output: string;
  isLoading: boolean;
  onSubmit?: () => void;
}

export function TerminalOutput({ output, isLoading, onSubmit }: TerminalOutputProps) {
  return (
    <div className="bg-slate-950 text-slate-50 rounded-b-md">
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-400">Output</span>
        {onSubmit && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onSubmit}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
          >
            <Send className="h-4 w-4 mr-1" />
            Submit Code
          </Button>
        )}
      </div>
      <ScrollArea className="h-[150px] p-4">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-slate-600 animate-pulse"></div>
            <div className="h-2 w-2 rounded-full bg-slate-600 animate-pulse [animation-delay:0.2s]"></div>
            <div className="h-2 w-2 rounded-full bg-slate-600 animate-pulse [animation-delay:0.4s]"></div>
          </div>
        ) : output ? (
          <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
        ) : (
          <span className="text-sm text-slate-500">Run your code to see the output here...</span>
        )}
      </ScrollArea>
    </div>
  );
} 