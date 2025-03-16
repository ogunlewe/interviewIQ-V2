"use client"

import React from "react";
import { Textarea } from "./ui/textarea";

interface NotesEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NotesEditor({ value, onChange }: NotesEditorProps) {
  return (
    <div className="notes-container">
      <div className="notes-toolbar mb-2 bg-slate-100 dark:bg-slate-800 rounded p-2 flex items-center space-x-2">
        <span className="text-sm font-medium">Interview Notes</span>
        <span className="text-xs text-muted-foreground">(Track your key points and insights)</span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Use this space to take notes during the interview. Write down key points, questions you want to ask, or insights you want to remember..."
        className="min-h-[300px] resize-none notes-text"
      />
      <p className="text-xs text-muted-foreground mt-2">
        💡 Tip: Taking good notes during an interview can help you remember key discussion points when following up or for later reflection.
      </p>
    </div>
  );
}
