"use client";

import type React from "react";
import { useState } from "react";
import { generateUniqueId } from "./utils";


const API_URL = import.meta.env.VITE_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://interview-api-coral.vercel.app/api/chat'
    : 'http://localhost:3001/api/chat');

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}


export async function sendMessage(
  messages: Message[]
): Promise<{ response: string }> {
  try {
    console.log('Sending request to:', API_URL); // Debug log
    console.log('Messages:', messages); // Debug log
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', response.status, errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } catch (e) {
        throw new Error(`Server error: ${response.status}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

   
    const userMessage: Message = {
      id: generateUniqueId(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {

      const { response } = await sendMessage([...messages, userMessage]);


      const assistantMessage: Message = {
        id: generateUniqueId(),
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
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
