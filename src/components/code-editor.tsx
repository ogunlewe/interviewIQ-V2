"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Play, Copy } from "lucide-react";

export default function CodeEditor() {
  const [code, setCode] = useState(`// Write your code here
function example() {
  // Your solution
  return true;
}
`);
  const [language, setLanguage] = useState("javascript");

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleRunCode = () => {
    // In a real app, this would execute the code or send it to a backend
    alert("Code execution would happen here");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-slate-100 dark:bg-slate-800 p-2 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">Language:</span>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={handleCopyCode}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button size="sm" variant="outline" onClick={handleRunCode}>
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={handleCodeChange}
        className="w-full h-64 p-4 font-mono text-sm bg-white dark:bg-slate-900 border-0 focus:outline-none"
        spellCheck="false"
      />
    </div>
  );
}
