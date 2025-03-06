"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/seperator";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Send, RefreshCw, Cpu } from "lucide-react";
import TopicSelector from "./topic-selector";
import FeedbackPanel from "./feedback-panel";
import { useChat } from "../lib/chat-service";

export default function InterviewSimulator() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "JavaScript",
    "React",
    "Data Structures",
  ]);
  const [difficulty, setDifficulty] = useState<string>("intermediate");
  const [activeTab, setActiveTab] = useState<string>("interview");
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const systemPrompt = `
    You are a professional HR representative or a company owner conducting a job interview for a software developer position. Your goal is to evaluate the candidate's technical skills, problem-solving abilities, and cultural fit for the company. During the interview, follow these guidelines:

    Introduction: Start with a professional greeting and introduce yourself and the company briefly. Share a bit about the company's values, culture, and the role you are hiring for.

Technical Evaluation:

Ask a mix of coding, algorithm, and problem-solving questions based on the candidate's experience level (e.g., beginner, intermediate, or advanced).
Include questions on programming languages, data structures, algorithms, design patterns, and best practices.
Present coding challenges or scenarios and ask the candidate to explain their thought process.
Behavioral and Situational Questions:

Explore the candidate’s experience with teamwork, project management, and dealing with challenges.
Use questions like 'Tell me about a time when...', or 'How would you handle...?' to gauge soft skills and adaptability.
Follow-Up Questions:

Based on the candidate’s responses, ask follow-up questions to dig deeper into their knowledge and approach.
Provide hypothetical scenarios related to software development and ask how they would handle them.
Cultural Fit:

Ask questions that help understand the candidate’s work style, communication skills, and alignment with the company’s culture.
Feedback and Closing:

End with a professional closing, thanking the candidate for their time and explaining the next steps in the interview process.
    
    Current interview topics: ${selectedTopics.join(", ")}
    Difficulty level: ${difficulty}
    
    Ask one technical question at a time related to the selected topics. Wait for the candidate's response before providing feedback and asking the next question.
    
    For each answer:
    1. Provide constructive feedback
    2. Rate the answer on a scale of 1-5

    
    Keep your questions realistic for a ${difficulty} level of software engineering interview.
    Start by introducing yourself briefly and asking the first question.
  `;

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
  } = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "system",
        content: systemPrompt,
      },
    ],
  });

  // Filter out system messages for display
  const displayMessages = messages.filter(
    (message) => message.role !== "system"
  );

  const handleRestart = () => {
    reload();
    setShowFeedback(false);
  };

  const handleTopicsChange = (topics: string[]) => {
    setSelectedTopics(topics);
  };

  const handleDifficultyChange = (level: string) => {
    setDifficulty(level);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interview">Interview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="interview" className="mt-4">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>Interview Session</span>
                  <Button variant="outline" size="sm" onClick={handleRestart}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restart
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {displayMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-slate-500 dark:text-slate-400">
                        <Cpu className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Your interview will begin shortly...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {displayMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex gap-3 max-w-[80%] ${
                              message.role === "user" ? "flex-row-reverse" : ""
                            }`}
                          >
                            <Avatar className="h-8 w-8">
                              {message.role === "user" ? (
                                <>
                                  <AvatarImage src="https://placehold.co/32x32" />
                                  <AvatarFallback>U</AvatarFallback>
                                </>
                              ) : (
                                <>
                                  <AvatarImage src="https://placehold.co/32x32" />
                                  <AvatarFallback>AI</AvatarFallback>
                                </>
                              )}
                            </Avatar>
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <div className="whitespace-pre-wrap">
                                {message.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex gap-3 max-w-[80%]">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="https://placehold.co/32x32" />
                              <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg px-4 py-2 bg-muted">
                              <div className="flex space-x-2">
                                <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce"></div>
                                <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce [animation-delay:0.2s]"></div>
                                <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce [animation-delay:0.4s]"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>

              <CardFooter>
                <form onSubmit={handleSubmit} className="w-full space-y-3">
                  <Textarea
                    placeholder="Type your answer here..."
                    value={input}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Answer
                    </Button>
                  </div>
                </form>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Difficulty Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {["beginner", "intermediate", "advanced", "expert"].map(
                      (level) => (
                        <Badge
                          key={level}
                          variant={difficulty === level ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                          onClick={() => handleDifficultyChange(level)}
                        >
                          {level}
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                <Separator />

                <TopicSelector
                  selectedTopics={selectedTopics}
                  onTopicsChange={handleTopicsChange}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-1">
        <FeedbackPanel
          messages={displayMessages}
          showFeedback={showFeedback}
          setShowFeedback={setShowFeedback}
        />
      </div>
    </div>
  );
}
