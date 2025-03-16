"use client"

import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface WhiteboardEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function WhiteboardEditor({ value, onChange }: WhiteboardEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={isExpanded ? "absolute inset-0 z-50 bg-background p-4" : "whiteboard-container"}>
      <div className="whiteboard-toolbar mb-2 bg-slate-100 dark:bg-slate-800 rounded p-2 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium">Simple Whiteboard</span>
          <span className="text-xs text-muted-foreground ml-2">(Plain text version for interview notes)</span>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleExpanded} className="p-1 h-8 w-8">
          {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Use this space to work out problems, sketch diagrams (with ASCII art), or make notes for system design..."
        className={`font-mono resize-none whiteboard-text ${isExpanded ? "h-[calc(100vh-120px)]" : "min-h-[300px]"}`}
      />
      <p className="text-xs text-muted-foreground mt-2">
        Tip: Use ASCII characters to create simple diagrams. For example, use "|", "-", "+", and to create boxes and arrows.
      </p>
    </div>
  );
}
