"use client"

import React from "react";
import { Textarea } from "./ui/textarea";

interface WhiteboardEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function WhiteboardEditor({ value, onChange }: WhiteboardEditorProps) {
  return (
    <div className="whiteboard-container">
      <div className="whiteboard-toolbar mb-2 bg-slate-100 dark:bg-slate-800 rounded p-2 flex items-center space-x-2">
        <span className="text-sm font-medium">Simple Whiteboard</span>
        <span className="text-xs text-muted-foreground">(Plain text version for interview notes)</span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Use this space to work out problems, sketch diagrams (with ASCII art), or make notes for system design..."
        className="min-h-[300px] font-mono resize-none whiteboard-text"
      />
      <p className="text-xs text-muted-foreground mt-2">
        Tip: Use ASCII characters to create simple diagrams. For example, use "|", "-", "+", and to create boxes and arrows.
      </p>
    </div>
  );
}