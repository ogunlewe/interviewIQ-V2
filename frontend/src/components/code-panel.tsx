import React, { useState } from 'react';
import { Card } from './ui/card';
import CodeEditor from './code-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Play, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface CodePanelProps {
  onCodeSubmit?: (code: string) => void;
  onCodeRun?: (code: string) => void;
}

interface TestCase {
  input: string;
  output: string;
  status: 'pending' | 'success' | 'error';
  runtime?: string;
}

export const CodePanel: React.FC<CodePanelProps> = ({
  onCodeSubmit,
  onCodeRun,
}) => {
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: 'num = 100', output: 'Expected: "202"', status: 'pending' },
    { input: 'num = -7', output: 'Expected: "-10"', status: 'pending' },
  ]);

  const handleRunCode = async () => {
    setIsRunning(true);
    // Simulate test case execution
    setTestCases(cases => 
      cases.map(c => ({ ...c, status: 'pending' }))
    );

    // Simulate running test cases
    for (let i = 0; i < testCases.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTestCases(cases => 
        cases.map((c, index) => 
          index === i 
            ? { 
                ...c, 
                status: Math.random() > 0.3 ? 'success' : 'error',
                runtime: `${Math.floor(Math.random() * 100)}ms`
              }
            : c
        )
      );
    }
    
    setIsRunning(false);
  };

  return (
    <Card className="h-full rounded-none flex flex-col">
      <div className="flex items-center justify-between p-2 border-b bg-muted/40">
        <Select
          value={language}
          onValueChange={setLanguage}
        >
          <SelectTrigger className="w-[180px]">
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
            variant="secondary" 
            size="sm"
            onClick={handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Clock className="h-4 w-4 mr-1 animate-spin" />
                Running
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Run
              </>
            )}
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => onCodeSubmit?.('// Code submission coming soon')}
          >
            <Send className="h-4 w-4 mr-1" />
            Submit
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Code Editor */}
        <div className="flex-1">
          <CodeEditor
            onSubmit={onCodeSubmit}
            isExpanded={false}
          />
        </div>

        {/* Test Cases Panel */}
        <div className="w-[300px] border-l bg-background flex flex-col">
          <div className="p-3 border-b bg-muted/40">
            <h3 className="font-medium">Test Cases</h3>
          </div>
          <div className="flex-1 overflow-auto">
            {testCases.map((testCase, index) => (
              <div
                key={index}
                className="p-3 border-b last:border-b-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Case {index + 1}</span>
                  {testCase.status === 'success' ? (
                    <Badge variant="success" className="bg-green-500/10 text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {testCase.runtime}
                    </Badge>
                  ) : testCase.status === 'error' ? (
                    <Badge variant="destructive" className="bg-red-500/10 text-red-500">
                      <XCircle className="h-3 w-3 mr-1" />
                      Failed
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Pending
                    </Badge>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="font-mono bg-muted p-2 rounded text-xs">
                    Input: {testCase.input}
                  </div>
                  <div className="font-mono bg-muted p-2 rounded text-xs">
                    {testCase.output}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
