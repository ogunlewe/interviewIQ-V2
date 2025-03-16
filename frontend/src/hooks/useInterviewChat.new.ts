import { useState, useRef, useCallback } from "react";
import { nanoid } from "nanoid";
import type { Message } from "../lib/chat-service";

interface UseChatInterfaceProps {
  onThinking?: () => void;
  onChatComplete?: (content: string) => void;
}

export function useChatInterface({
  onThinking,
  onChatComplete,
}: UseChatInterfaceProps = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const abortControllerRef = useRef<AbortController | null>(null);

  const generateSystemPrompt = (
    selectedTopics: string[],
    difficulty: string,
    interviewerMood: string,
    companyProfile: string,
    interviewStage: string,
    interviewerName: string
  ) => {
    return `You are a seasoned technical interviewer at ${companyProfile}. Your role is to simulate a realistic, engaging, and challenging interview environment.

Interview Context:
- Topics: The candidate will be assessed on the following technical topics: ${selectedTopics.join(
      ", "
    )}.
- Difficulty: The interview will have a ${difficulty} difficulty level to challenge the candidate appropriately.
- Interviewer Mood: Your demeanor today is ${interviewerMood}—professional yet approachable.
- Interview Stage: This is the ${interviewStage} stage of the interview process.

Your Responsibilities:
- Introduction: Begin by introducing yourself (e.g., "Hello, my name is ${interviewerName} and I'll be your interviewer today.").
- Questioning: Ask clear, concise technical questions that progressively challenge the candidate. Tailor your questions based on the interview stage and topics.
- Feedback: Provide constructive feedback and ask follow-up questions to dig deeper into the candidate's thought process.
- Engagement: Maintain a natural, conversational tone, ensuring the conversation flows smoothly.
- Realism: Avoid generic or scripted responses. Ensure your responses adapt naturally based on the candidate's answers.
- Follow-Up: For every candidate response, your follow-up questions should delve deeper and encourage further explanation.

Remember, your goal is to simulate an authentic interview experience, challenging yet supportive.`;
  };

  const resetChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setMessages([]);
    setDisplayMessages([]);
    setIsLoading(false);
    setError(undefined);
  }, []);

  const addMessage = useCallback((role: string, content: string) => {
    const newMessage = {
      id: nanoid(),
      role,
      content,
    };

    setMessages((prev) => [...prev, newMessage]);

    // We only display user and assistant messages
    if (role !== "system") {
      setDisplayMessages((prev) => [...prev, newMessage]);
    }

    return newMessage;
  }, []);

  const sendChatRequest = useCallback(
    async (
      systemPrompt: string,
      conversationHistory: Message[],
      interviewerName: string,
      thinking = false
    ) => {
      setIsLoading(true);
      setError(undefined);

      if (thinking && onThinking) {
        onThinking();
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const apiUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}`;


        const requestBody = {
          messages: conversationHistory,
          systemPrompt,
          interviewerName,
          interviewerPersonality: systemPrompt, // full system prompt for context
        };

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.response;

        if (onChatComplete) {
          onChatComplete(aiResponse);
        }

        return aiResponse;
      } catch (e: any) {
        if (e.name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.error("Error in chat API:", e);
          setError(
            "Failed to communicate with the interviewer. Please try again."
          );
        }
        return null;
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [onThinking, onChatComplete]
  );

  const sendMessage = useCallback(
    async (
      userInput: string,
      systemPrompt: string,
      interviewerName: string
    ) => {
      if (!userInput.trim() || isLoading) return;

      // Add user's message to state
      addMessage("user", userInput);

      // Include all messages so far in the conversation history
      const response = await sendChatRequest(
        systemPrompt,
        [...messages, { id: nanoid(), role: "user", content: userInput }],
        interviewerName
      );

      if (response) {
        addMessage("assistant", response);
      }
    },
    [messages, isLoading, addMessage, sendChatRequest]
  );

  const startInterview = useCallback(
    async (
      selectedTopics: string[],
      difficulty: string,
      interviewerMood: string,
      companyProfile: string,
      interviewStage: string,
      interviewerName: string
    ) => {
      resetChat();

      // Generate system prompt with all details
      const systemPrompt = generateSystemPrompt(
        selectedTopics,
        difficulty,
        interviewerMood,
        companyProfile,
        interviewStage,
        interviewerName
      );

      addMessage("system", systemPrompt);

      // Display a static greeting first
      const greeting = `Hello! My name is ${interviewerName}, and I'll be your interviewer today. Let's begin.`;
      addMessage("assistant", greeting);

      // Send the first interview question based on context,
      // using only the system prompt in conversation history (or you might include the greeting if needed)
      const response = await sendChatRequest(
        systemPrompt,
        [{ id: nanoid(), role: "assistant", content: greeting }],
        interviewerName
      );

      if (response) {
        addMessage("assistant", response);
      }
    },
    [resetChat, addMessage, sendChatRequest]
  );

  return {
    // State
    messages,
    displayMessages,
    isLoading,
    error,

    // Actions
    startInterview,
    sendMessage,
    resetChat,
    addMessage,
    setError,
  };
}
