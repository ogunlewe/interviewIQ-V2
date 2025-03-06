"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { ScrollArea } from "./ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { BarChart, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, Download } from "lucide-react"
import type { Message } from "../lib/chat-service"

interface FeedbackPanelProps {
  messages: Message[]
  showFeedback: boolean
  setShowFeedback: (show: boolean) => void
}

export default function FeedbackPanel({ messages, showFeedback, setShowFeedback }: FeedbackPanelProps) {
  const [feedbackTab, setFeedbackTab] = useState<string>("summary")
  const [feedbackData, setFeedbackData] = useState({
    overallScore: 0,
    questionCount: 0,
    strengths: [] as string[],
    improvements: [] as string[],
    topicScores: {} as Record<string, { score: number; count: number }>,
  })

  // Analyze messages to extract feedback data
  useEffect(() => {
    if (messages.length < 2) return

    // This is a simplified analysis - in a real app, you would use AI to extract structured feedback
    const assistantMessages = messages.filter((m) => m.role === "assistant")
    const userMessages = messages.filter((m) => m.role === "user")

    if (assistantMessages.length < 2) return

    // Mock feedback data generation
    const questionCount = Math.floor(assistantMessages.length / 2)
    const overallScore = Math.min(3 + Math.random() * 2, 5)

    const mockTopics = ["JavaScript", "React", "Data Structures"]
    const topicScores = {} as Record<string, { score: number; count: number }>

    mockTopics.forEach((topic) => {
      topicScores[topic] = {
        score: 2.5 + Math.random() * 2.5,
        count: 1 + Math.floor(Math.random() * 3),
      }
    })

    const strengths = [
      "Strong understanding of React component lifecycle",
      "Good knowledge of JavaScript closures",
      "Clear explanation of time complexity",
    ]

    const improvements = [
      "Could improve understanding of async/await patterns",
      "Review React hooks dependency arrays",
      "Practice more complex data structure problems",
    ]

    setFeedbackData({
      overallScore,
      questionCount,
      strengths,
      improvements,
      topicScores,
    })
  }, [messages])

  const handleExportFeedback = () => {
    // In a real app, this would generate a PDF or text file with feedback
    alert("Feedback export functionality would be implemented here")
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            <span>Interview Feedback</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowFeedback(!showFeedback)}>
            {showFeedback ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>

      {showFeedback ? (
        <CardContent>
          {messages.length < 4 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Complete a few questions to see your feedback</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Overall Performance</h3>
                  <Badge variant="outline">{feedbackData.questionCount} Questions</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score</span>
                    <span className="font-medium">{feedbackData.overallScore.toFixed(1)}/5.0</span>
                  </div>
                  <Progress value={feedbackData.overallScore * 20} className="h-2" />
                </div>
              </div>

              <Tabs value={feedbackTab} onValueChange={setFeedbackTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="topics">Topics</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      Strengths
                    </h3>
                    <ScrollArea className="h-[120px]">
                      <ul className="space-y-2 text-sm">
                        {feedbackData.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium flex items-center mb-2">
                      <XCircle className="h-4 w-4 mr-1 text-amber-500" />
                      Areas for Improvement
                    </h3>
                    <ScrollArea className="h-[120px]">
                      <ul className="space-y-2 text-sm">
                        {feedbackData.improvements.map((improvement, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-amber-500 mr-2">•</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="topics" className="mt-4">
                  <ScrollArea className="h-[280px]">
                    <div className="space-y-4">
                      {Object.entries(feedbackData.topicScores).map(([topic, data]) => (
                        <div key={topic}>
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-medium">{topic}</h3>
                            <Badge variant="outline">{data.count} Questions</Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Score</span>
                              <span>{data.score.toFixed(1)}/5.0</span>
                            </div>
                            <Progress value={data.score * 20} className="h-1.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Button variant="outline" size="sm" className="w-full" onClick={handleExportFeedback}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Feedback Report
                </Button>
              </div>
            </>
          )}
        </CardContent>
      ) : (
        <CardContent>
          <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">Click to view feedback</div>
        </CardContent>
      )}
    </Card>
  )
}

