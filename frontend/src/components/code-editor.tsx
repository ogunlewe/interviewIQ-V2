"use client";

import type React from "react";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Play, Copy, Maximize2, Minimize2, Loader2, Send, X } from "lucide-react";
import Editor, { useMonaco, type Monaco, type OnMount } from "@monaco-editor/react";
import { TerminalOutput } from "./terminal-output";
import { Card } from "./ui/card";

interface CodeEditorProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onCodeRun?: (code: string, language: string) => void;
  onSubmit?: () => void;
}

interface CodeSuggestion {
  startLine: number;
  endLine: number;
  suggestion: string;
  isHighlighted: boolean;
}

export interface CodeEditorRef {
  parseSuggestion: (message: string) => void;
}

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({
  isExpanded = false,
  onToggleExpand,
  onCodeRun,
  onSubmit,
}, ref) => {
  const [code, setCode] = useState(`// Write your code here
function example() {
  // Your solution
  return true;
}
`);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const monaco = useMonaco();
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);

  // Function to handle editor mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure editor settings
    editor.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      roundedSelection: true,
      automaticLayout: true,
      glyphMargin: true,
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
      if (language === "javascript") {
        try {
          // Create a sandboxed environment for code execution
          const sandboxedCode = `
            try {
              ${code}
              
              // Execute main function if it exists
              if (typeof main === 'function') {
                main();
              }
            } catch (error) {
              console.error(error);
            }
          `;

          // Create a virtual console to capture output
          const outputs: string[] = [];
          const virtualConsole = {
            log: (...args: any[]) => {
              outputs.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' '));
            },
            error: (...args: any[]) => {
              outputs.push('Error: ' + args.map(arg => 
                arg instanceof Error ? arg.message : String(arg)
              ).join(' '));
            },
            warn: (...args: any[]) => {
              outputs.push('Warning: ' + args.join(' '));
            }
          };

          // Execute the code with the virtual console
          const evaluateCode = new Function('console', sandboxedCode);
          evaluateCode(virtualConsole);

          // Set the output
          if (outputs.length > 0) {
            setOutput(outputs.join('\n'));
          } else {
            setOutput('Code executed successfully. Awaiting review...');
          }

          // Send code for review without showing in chat
          if (onCodeRun) {
            console.log('Sending code for review...');
            const reviewMessage = `@silent_review
Please review this code and provide ONLY line-specific suggestions in the following format:
[LINE X]: suggestion text
or
[LINE X-Y]: suggestion text for multiple lines

Example response format:
[LINE 2]: Consider adding parameter validation
[LINE 5-7]: This loop could be simplified using array methods

Code to review:
\`\`\`${language}
${code}
\`\`\``;
            
            console.log('Review message:', reviewMessage);
            onCodeRun(reviewMessage, language);
          }

        } catch (error: any) {
          setOutput(`Runtime Error: ${error.message}`);
          console.error('Code execution error:', error);
        }
      } else {
        setOutput(`Note: ${language} execution is not yet implemented. Awaiting review...`);
        if (onCodeRun) {
          onCodeRun(`@silent_review\nPlease review this ${language} code and provide line-specific suggestions only.\n\`\`\`${language}\n${code}\n\`\`\``, language);
        }
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
      console.error('Unexpected error:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = () => {
    // Send code to interviewer for final review
    if (onCodeRun) {
      const finalReviewMessage = `
Please provide a final review of this ${language} solution:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Overall assessment
2. What works well
3. What could be improved
4. Final score (1-5)
5. Any specific suggestions for improvement using [LINE X]: format
`;
      onCodeRun(finalReviewMessage, language);
    }
    // Close the editor if onSubmit is provided
    if (onSubmit) {
      onSubmit();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  // Function to add a new suggestion
  const addSuggestion = useCallback((startLine: number, endLine: number, suggestion: string) => {
    setSuggestions(prev => [...prev, {
      startLine,
      endLine,
      suggestion,
      isHighlighted: true
    }]);

    // Highlight the code in the editor
    if (editorRef.current && monaco) {
      const editor = editorRef.current;
      
      // Clear previous decorations
      if (decorationsRef.current.length) {
        editor.deltaDecorations(decorationsRef.current, []);
      }

      // Add new decoration
      const newDecorations = editor.deltaDecorations([], [{
        range: new monaco.Range(startLine, 1, endLine, 1),
        options: {
          isWholeLine: true,
          className: 'highlighted-code-line',
          glyphMarginClassName: 'suggestion-glyph',
          glyphMarginHoverMessage: { value: suggestion },
          marginClassName: 'suggestion-margin'
        }
      }]);

      // Store new decorations
      decorationsRef.current = newDecorations;

      // Remove highlight after 5 seconds
      setTimeout(() => {
        if (editor && decorationsRef.current.length) {
          editor.deltaDecorations(decorationsRef.current, []);
          decorationsRef.current = [];
          setSuggestions(prev => 
            prev.map(s => 
              s.startLine === startLine && s.endLine === endLine
                ? { ...s, isHighlighted: false }
                : s
            )
          );
        }
      }, 5000);
    }
  }, [monaco]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    parseSuggestion: (message: string) => {
      console.log('Parsing suggestion:', message);
      // Extract line numbers and suggestions using regex
      const regex = /\[LINE (\d+)(?:-(\d+))?\]:\s*(.*?)(?=\[LINE|$)/gs;
      let match;
      
      // Clear previous suggestions
      setSuggestions([]);
      
      while ((match = regex.exec(message)) !== null) {
        const startLine = parseInt(match[1]);
        const endLine = match[2] ? parseInt(match[2]) : startLine;
        const suggestion = match[3].trim();
        
        console.log(`Adding suggestion for lines ${startLine}-${endLine}: ${suggestion}`);
        addSuggestion(startLine, endLine, suggestion);
      }
    }
  }), [addSuggestion]);

  return (
    <Card className={`${isExpanded ? 'fixed inset-0 z-50' : 'relative'} bg-background`}>
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center space-x-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 border rounded bg-background"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopyCode}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
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
          <Button variant="outline" size="sm" onClick={onToggleExpand}>
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="default" size="sm" onClick={handleSubmitCode}>
            <Send className="h-4 w-4 mr-1" />
            Submit
          </Button>
        </div>
      </div>

      <style>
        {`
        .highlighted-code-line {
          background-color: rgba(97, 175, 239, 0.1);
          border-left: 2px solid #61afef;
        }
        .suggestion-glyph {
          background-color: #61afef;
          width: 8px !important;
          height: 8px !important;
          border-radius: 50%;
          margin-left: 5px;
          cursor: pointer;
        }
        .suggestion-margin {
          background-color: rgba(97, 175, 239, 0.1);
        }
        `}
      </style>

      <div className={`${isExpanded ? 'h-[calc(100vh-10rem)]' : 'h-[500px]'}`}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 5,
          }}
          onMount={handleEditorDidMount}
        />
      </div>

      {suggestions.length > 0 && (
        <div className="absolute bottom-4 right-4 max-w-md bg-background border rounded-lg shadow-lg p-4 space-y-2 overflow-y-auto max-h-48">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                suggestion.isHighlighted
                  ? 'bg-blue-100 dark:bg-blue-900/20'
                  : 'bg-muted'
              }`}
            >
              <div className="text-xs text-muted-foreground">
                Line {suggestion.startLine}
                {suggestion.endLine !== suggestion.startLine && `-${suggestion.endLine}`}
              </div>
              <div className="text-sm">{suggestion.suggestion}</div>
            </div>
          ))}
        </div>
      )}

      <TerminalOutput
        output={output}
        isLoading={isExecuting}
        onSubmit={handleSubmitCode}
      />
    </Card>
  );
});

export default CodeEditor;
