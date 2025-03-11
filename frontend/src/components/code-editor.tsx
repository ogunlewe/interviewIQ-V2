"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Play, Copy, Maximize2, Minimize2, Loader2, Send } from "lucide-react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { TerminalOutput } from "./terminal-output";

interface CodeEditorProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onCodeRun?: (code: string, language: string) => void;
  onSubmit?: () => void;
}

export default function CodeEditor({
  isExpanded = false,
  onToggleExpand,
  onCodeRun,
  onSubmit,
}: CodeEditorProps) {
  const [code, setCode] = useState(`// Write your code here
function example() {
  // Your solution
  return true;
}
`);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const editorRef = useRef(null);
  const monaco = useMonaco();

  // Function to handle editor mount
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    // Configure editor settings
    editor.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      roundedSelection: true,
      automaticLayout: true,
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleLanguageChange = (value: string) => {
    // Map language values to Monaco language IDs
    const languageMap: { [key: string]: string } = {
      javascript: "javascript",
      typescript: "typescript",
      python: "python",
      java: "java",
      csharp: "csharp",
    };
    setLanguage(value);

    // Update Monaco language if editor is mounted
    if (editorRef.current) {
      const model = (editorRef.current as any).getModel();
      if (model) {
        monaco?.editor.setModelLanguage(model, languageMap[value]);
      }
    }
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput(""); // Clear previous output

    try {
      // First, try to execute the code in a safe environment
      if (language === "javascript") {
        try {
          // Create a safe context for evaluation
          const AsyncFunction = Object.getPrototypeOf(
            async function () {}
          ).constructor;
          const consoleOutput: string[] = [];
          const mockConsole = {
            log: (...args: any[]) => {
              consoleOutput.push(
                args
                  .map((arg) =>
                    typeof arg === "object"
                      ? JSON.stringify(arg, null, 2)
                      : String(arg)
                  )
                  .join(" ")
              );
            },
            error: (...args: any[]) => {
              consoleOutput.push(`Error: ${args.join(" ")}`);
            },
          };

          // Execute any top-level code first
          const wrappedCode = `
            "use strict";
            const console = mockConsole;
            ${code}
            
            // If there's a main function, execute it
            if (typeof main === 'function') {
              main();
            }
          `;

          const execFunc = new AsyncFunction("mockConsole", wrappedCode);
          const result = await execFunc(mockConsole);

          // Combine function output and console logs
          setOutput(
            [
              ...consoleOutput,
              result !== undefined ? `\nReturn value: ${result}` : "",
            ]
              .filter(Boolean)
              .join("\n")
          );
        } catch (error: any) {
          setOutput(`Runtime Error: ${error.message}`);
        }
      } else {
        // For other languages, we'll need to send to backend
        setOutput(`Execution of ${language} code will be implemented soon.`);
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = () => {
    // Send code to interviewer for review if callback is provided
    if (onCodeRun) {
      onCodeRun(code, language);
    }
    // Close the editor if onSubmit is provided
    if (onSubmit) {
      onSubmit();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div
      className={`border rounded-md overflow-hidden ${
        isExpanded
          ? "fixed inset-0 z-50 bg-white dark:bg-slate-900"
          : "relative"
      }`}
    >
      <div className="bg-slate-100 dark:bg-slate-800 p-2 flex justify-between items-center sticky top-0 z-10">
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
          <Button
            size="sm"
            variant="outline"
            onClick={handleRunCode}
            disabled={isExecuting}
          >
            {isExecuting ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            {isExecuting ? "Running..." : "Run"}
          </Button>
          {onToggleExpand && (
            <Button size="sm" variant="outline" onClick={onToggleExpand}>
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      <div className={`${isExpanded ? "h-[calc(100vh-264px)]" : "h-64"}`}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: true,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            quickSuggestions: true,
          }}
          onMount={handleEditorDidMount}
        />
      </div>
      <TerminalOutput
        output={output}
        isLoading={isExecuting}
        onSubmit={handleSubmitCode}
      />
    </div>
  );
}
