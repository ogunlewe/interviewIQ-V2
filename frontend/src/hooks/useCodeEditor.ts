import { useState, useRef, useEffect } from "react";
import { useChat } from "../lib/chat-service";
import { useMonaco } from "@monaco-editor/react";

export interface TestCase {
  input: string;
  expected: string;
  actual: string;
  status: "pending" | "running" | "success" | "error";
}

interface ExecuteCodeResult {
  result: any;
  output: string;
}

interface UseCodeEditorProps {
  initialCode?: string;
  initialLanguage?: string;
  onCodeChange?: (code: string) => void;
  onRunCode?: (code: string) => void;
  onTestCaseStatusChange?: (status: TestCase[]) => void;
  initialTestCases?: TestCase[];
}

export function useCodeEditor({
  initialCode = `function solution() {\n  // Write your solution here\n  \n}`,
  initialLanguage = "javascript",
  onCodeChange,
  onRunCode,
  onTestCaseStatusChange,
  initialTestCases = [
    { input: "solution()", expected: "true", actual: "", status: "pending" },
    { input: "solution()", expected: "true", actual: "", status: "pending" }
  ]
}: UseCodeEditorProps = {}) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const editorRef = useRef<any>(null);
  const monaco = useMonaco();

  // Chat service for code review
  const { handleSubmit: submitToGemini, isLoading: isReviewing } = useChat({
    initialMessages: [{
      id: "system",
      role: "system",
      content: "You are a technical interviewer reviewing code. Provide specific, line-by-line feedback on code quality, efficiency, and potential improvements."
    }]
  });

  // Define editor theme when Monaco is available
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('leetcode-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6b737c' },
          { token: 'keyword', foreground: 'c792ea' },
          { token: 'string', foreground: 'c3e88d' },
          { token: 'number', foreground: 'f78c6c' },
        ],
        colors: {
          'editor.background': '#1e1e1e',
          'editor.foreground': '#d4d4d4',
          'editorLineNumber.foreground': '#6b737c',
          'editorLineNumber.activeForeground': '#fff',
          'editor.selectionBackground': '#264f78',
          'editor.lineHighlightBackground': '#2f3139',
          'editorCursor.foreground': '#fff',
        }
      });
      monaco.editor.setTheme('leetcode-dark');
    }
  }, [monaco]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      roundedSelection: false,
      padding: { top: 16 },
      lineHeight: 21,
      fontFamily: "'Fira Code', monospace",
      renderLineHighlight: 'all',
      cursorStyle: 'line',
      cursorWidth: 2,
      automaticLayout: true,
    });
  };

  const handleLanguageChange = (value: string) => {
    const languageMap: { [key: string]: string } = {
      javascript: "javascript",
      typescript: "typescript",
      python: "python",
      java: "java",
      cpp: "cpp"
    };
    setLanguage(value);

    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco?.editor.setModelLanguage(model, languageMap[value]);
      }
    }
  };

  const executeCode = async (codeToExecute: string): Promise<ExecuteCodeResult> => {
    try {
      // Create a safe environment for code execution
      const safeEval = new Function(
        'return async function() { ' +
        'try {' +
        '  const console = { log: function(...args) { return args.join(" ") + "\\n"; } };' +
        '  const output = [];' +
        '  const originalLog = window.console.log;' +
        '  window.console.log = (...args) => { output.push(args.join(" ")); originalLog.apply(console, args); };' +
        '  ' + codeToExecute + '\n' +
        '  const result = await (async () => { try { return await solution(); } catch(e) { return e.toString(); } })();' +
        '  window.console.log = originalLog;' +
        '  return { result, output };' +
        '} catch(e) { return { error: e.toString() }; } ' +
        '}'
      )();

      const { result, output, error } = await safeEval();
      
      if (error) {
        throw new Error(error);
      }

      return {
        result,
        output: output ? output.join('\n') : String(result)
      };
    } catch (error: any) {
      throw new Error(`Runtime Error: ${error.message}`);
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    
    setIsExecuting(true);
    setOutput("");
    setFeedback(null);
    setShowFeedback(false);
    setTestCases(cases => cases.map(c => ({ ...c, status: "running" })));

    try {
      // Execute test cases
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const { result, output } = await executeCode(code);
        
        setTestCases(cases =>
          cases.map((c, index) =>
            index === i
              ? {
                  ...c,
                  status: String(result) === c.expected ? "success" : "error",
                  actual: String(result)
                }
              : c
          )
        );

        setOutput(prev => prev + (output ? `\n${output}` : ""));
      }

      // Call the external run code handler if provided
      if (onRunCode) {
        onRunCode(code);
      }

      // Notify about test case status changes
      if (onTestCaseStatusChange) {
        onTestCaseStatusChange(testCases);
      }

      try {
        // Get AI review silently
        const review = await submitToGemini(
          { preventDefault: () => {} },
          `Please review this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``,
          true // Silent review
        );

        if (review) {
          setFeedback(review);
          setShowFeedback(true);
        }
      } catch (error) {
        // Don't fail the whole run if AI review fails
        console.warn("AI review failed:", error);
        setOutput(prev => prev + "\n\nNote: Code review is temporarily unavailable.");
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
      setTestCases(cases => cases.map(c => ({ ...c, status: "error" })));
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  // Handle acknowledging feedback
  const acknowledgeFeedback = () => {
    setShowFeedback(false);
  };

  return {
    // State
    code,
    language,
    isExecuting,
    output,
    testCases,
    feedback,
    showFeedback,
    isReviewing,
    editorRef,
    
    // Actions
    setCode,
    setLanguage,
    setTestCases,
    handleEditorDidMount,
    handleLanguageChange,
    handleRunCode,
    handleCodeChange,
    acknowledgeFeedback
  };
}
