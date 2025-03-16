import type React from "react";
import { useState } from "react";
import { generateUniqueId } from "./utils";

// In development, use the proxy through Vite's dev server
const API_URL = import.meta.env.VITE_API_URL || '/api/chat';


export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendMessage(
  messages: Message[]
): Promise<{ response: string }> {
  try {
    console.log('Sending request to:', API_URL);
    console.log('Messages:', messages);
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      // If we get a network error, fall back to local execution only
      if (response.status === 0 || response.status === 404) {
        return {
          response: "Note: Code review is temporarily unavailable. Your code has been executed locally."
        };
      }

      const errorText = await response.text();
      console.error('Server response:', response.status, errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } catch (e) {
        throw new Error(`Server error: ${response.status}`);
      }
    }

    const jsonResponse = await response.json();
    console.log('Received response:', jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error sending message:", error);
    // Return a fallback response for network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        response: "Note: Code review is temporarily unavailable. Your code has been executed locally."
      };
    }
    throw error;
  }
}

export function useChat(options: {
  initialMessages?: Message[];
  api?: string;
}) {
  const [messages, setMessages] = useState<Message[]>(
    options.initialMessages || []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | { preventDefault: () => void }, 
    customInput?: string,
    isSilentReview?: boolean
  ) => {
    e.preventDefault();
    
    const messageContent = customInput || input;
    if (!messageContent.trim()) return;

    // Don't add silent review requests to the chat
    if (!isSilentReview) {
      const userMessage: Message = {
        id: generateUniqueId(),
        role: "user",
        content: messageContent,
      };
      setMessages((prev) => [...prev, userMessage]);
    }

    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending message:', messageContent);
      console.log('Is silent review:', isSilentReview);

      const allMessages = isSilentReview 
        ? [...messages, { id: generateUniqueId(), role: "user" as const, content: messageContent }]
        : [...messages, { id: generateUniqueId(), role: "user" as const, content: messageContent }];

      const { response } = await sendMessage(allMessages);

      // Only add response to chat if it's not a silent review
      if (!isSilentReview) {
        const assistantMessage: Message = {
          id: generateUniqueId(),
          role: "assistant",
          content: response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }

      // Return the response for silent reviews
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      // Return a fallback response
      return "Note: Code review is temporarily unavailable.";
    } finally {
      setIsLoading(false);
    }
  };

  const reload = () => {
    const systemMessage = messages.find((m) => m.role === "system");
    setMessages(systemMessage ? [systemMessage] : []);
    setError(null);
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
  };
}
