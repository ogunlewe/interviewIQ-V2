import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Play, Send, Maximize2, Minimize2, Clock, MessageSquare, Sparkles, Check } from "lucide-react";
import { Card } from "./ui/card";
import { TerminalOutput } from "./terminal-output";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/seperator";
import { ScrollArea } from "./ui/scroll-area";
import Editor, {useMonaco} from "@monaco-editor/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useCodeEditor, TestCase } from "../hooks/useCodeEditor";





interface CodeEditorProps {
  onSubmit: ((code: string) => void) | undefined;
  code: string
  editorRef: any
  isExpanded: false
}




const CodeEditor = forwardRef<any, CodeEditorProps>(({
  editorRef,
  onSubmit,
}, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const monaco = useMonaco();
    const monacoEditorRef = useRef(null);
  const {
    code,
    language,
    isExecuting,
    output,
    testCases,
    feedback,
    showFeedback,
    isReviewing,
    handleLanguageChange,
    handleRunCode,
    handleCodeChange,
    acknowledgeFeedback,

  } = useCodeEditor({
    onCodeChange: (newCode) => {
      // Additional actions on code change if needed
    }
  });

  const handleSubmitCode = () => {
    if (onSubmit) {
      onSubmit(code);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setTimeout(() => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.layout();
      }
    }, 100);
  };

  const handleEditorDidMount = (editor: any) => {
    monacoEditorRef.current = editor;

    if (editorRef) {
      editorRef.current = {
        getCode: () => editor.getValue(),
      };
    }
  };

  return (
    <Card className={`${isExpanded ? 'fixed inset-0 z-50' : 'h-full'} bg-[#1e1e1e] flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2f3139]">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[140px] h-8 text-sm bg-transparent border-[#2f3139]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRunCode}
            disabled={isExecuting}
            className="h-8 px-3 hover:bg-[#2f3139] text-[#d4d4d4]"
          >
            {isExecuting ? (
              <>
                <Clock className="h-4 w-4 mr-1.5 animate-spin" />
                Running
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1.5" />
                Run
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSubmitCode}
            className="h-8 px-3 hover:bg-[#2f3139] text-[#d4d4d4]"
          >
            <Send className="h-4 w-4 mr-1.5" />
            Submit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpand}
            className="h-8 w-8 hover:bg-[#2f3139] text-[#d4d4d4]"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex">
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            language={language}
            value={code}
            onChange={handleCodeChange}
            options={{
              readOnly: false,
              minimap: { enabled: isExpanded },
              fontSize: 14,
              lineNumbers: "on",
              wordWrap: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              padding: { top: 16 },
              lineHeight: 21,
              fontFamily: "'Fira Code', monospace",
              renderLineHighlight: 'all',
              cursorStyle: 'line',
              cursorWidth: 2, 
              automaticLayout: true,
            }}
            onMount = {handleEditorDidMount}
          />
        </div>

        {/* Test Cases & Output Panel */}
        <div className="w-[300px] border-l border-[#2f3139] bg-[#1e1e1e] flex flex-col">
          <Tabs defaultValue="testcases" className="flex flex-col h-full">
            <TabsList className="px-2 pt-2 justify-start bg-transparent border-b border-[#2f3139]">
              <TabsTrigger value="testcases" className="data-[state=active]:bg-[#2f3139] data-[state=active]:text-white">
                Test Cases
              </TabsTrigger>
              <TabsTrigger 
                value="feedback" 
                className="data-[state=active]:bg-[#2f3139] data-[state=active]:text-white relative"
                disabled={!feedback}
              >
                Feedback
                {showFeedback && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-purple-500"></span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="testcases" className="flex-1 overflow-auto">
              <div className="flex-1 overflow-auto">
                {testCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="p-3 border-b border-[#2f3139] last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#d4d4d4]">Case {index + 1}</span>
                      <Badge
                        variant={
                          testCase.status === "success" ? "success" :
                          testCase.status === "error" ? "destructive" :
                          "secondary"
                        }
                        className={
                          testCase.status === "success" ? "bg-green-500/10 text-green-500" :
                          testCase.status === "error" ? "bg-red-500/10 text-red-500" :
                          ""
                        }
                      >
                        {testCase.status === "running" ? (
                          <>
                            <Clock className="h-3 w-3 mr-1 animate-spin" />
                            Running
                          </>
                        ) : testCase.status === "success" ? (
                          "Passed"
                        ) : testCase.status === "error" ? (
                          "Failed"
                        ) : (
                          "Pending"
                        )}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="font-mono bg-[#2f3139] p-2 rounded text-xs text-[#d4d4d4]">
                        Input: {testCase.input}
                      </div>
                      <div className="font-mono bg-[#2f3139] p-2 rounded text-xs text-[#d4d4d4]">
                        Expected: {testCase.expected}
                      </div>
                      {testCase.actual && (
                        <div className="font-mono bg-[#2f3139] p-2 rounded text-xs text-[#d4d4d4]">
                          Output: {testCase.actual}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Terminal Output */}
              {output && (
                <>
                  <Separator className="bg-[#2f3139]" />
                  <div className="p-3">
                    <h3 className="font-medium mb-2 text-[#d4d4d4]">Console Output</h3>
                    <TerminalOutput output={output} isLoading={isReviewing} />
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="feedback" className="flex-1 overflow-hidden flex flex-col p-0">
              {feedback ? (
                <div className="flex-1 overflow-auto">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#d4d4d4]">Interviewer Feedback</h3>
                        <p className="text-xs text-[#a0a0a0]">Code review and suggestions</p>
                      </div>
                    </div>
                    
                    <ScrollArea className="h-[calc(100vh-200px)]">
                      <div className="bg-[#2a2a2a] rounded-md p-4 text-sm text-[#d4d4d4] whitespace-pre-wrap leading-relaxed">
                        {feedback.split('\n\n').map((paragraph, i) => (
                          <p key={i} className="mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
                        onClick={acknowledgeFeedback}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[#6b737c]">
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 text-[#6b737c]" />
                    <p>Run your code to get interviewer feedback</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  );
});

CodeEditor.displayName = "CodeEditor";

export default CodeEditor;
