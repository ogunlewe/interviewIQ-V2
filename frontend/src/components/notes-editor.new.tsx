"use client"

import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface NotesEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NotesEditor({ value, onChange }: NotesEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={isExpanded ? "absolute inset-0 z-50 bg-background p-4" : "notes-container"}>
      <div className="notes-toolbar mb-2 bg-slate-100 dark:bg-slate-800 rounded p-2 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium">Interview Notes</span>
          <span className="text-xs text-muted-foreground ml-2">(Take notes during your interview)</span>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleExpanded} className="p-1 h-8 w-8">
          {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Use this space to take important notes during the interview..."
        className={`resize-none notes-text ${isExpanded ? "h-[calc(100vh-120px)]" : "min-h-[300px]"}`}
      />
      <p className="text-xs text-muted-foreground mt-2">
        Tip: Jot down key points from the interview to reference later or prepare follow-up questions.
      </p>
    </div>
  );
}
