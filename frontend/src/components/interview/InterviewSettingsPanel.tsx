import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import TopicSelector from "../topic-selector";

interface InterviewSettingsProps {
  selectedTopics: string[];
  difficulty: string;
  interviewerMood: string;
  companyProfile: string;
  onTopicsChange: (topics: string[]) => void;
  onDifficultyChange: (level: string) => void;
  onInterviewerMoodChange: (mood: string) => void;
  onCompanyChange: (company: string) => void;
  onStartInterview: () => void;
}

export function InterviewSettingsPanel({
  selectedTopics,
  difficulty,
  interviewerMood,
  companyProfile,
  onTopicsChange,
  onDifficultyChange,
  onInterviewerMoodChange,
  onCompanyChange,
  onStartInterview,
}: InterviewSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Topics</label>
          <TopicSelector selectedTopics={selectedTopics} onChange={onTopicsChange} />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Difficulty Level</label>
          <div className="flex space-x-2">
            {["beginner", "intermediate", "advanced"].map((level) => (
              <Button
                key={level}
                variant={difficulty === level ? "default" : "outline"}
                size="sm"
                onClick={() => onDifficultyChange(level)}
                className="capitalize"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Interviewer Style</label>
          <div className="flex space-x-2">
            {["friendly", "neutral", "challenging"].map((mood) => (
              <Button
                key={mood}
                variant={interviewerMood === mood ? "default" : "outline"}
                size="sm"
                onClick={() => onInterviewerMoodChange(mood)}
                className="capitalize"
              >
                {mood}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Company Profile</label>
          <div className="flex space-x-2">
            {[
              { id: "tech-startup", label: "Startup" },
              { id: "enterprise", label: "Enterprise" },
              { id: "tech-giant", label: "Tech Giant" },
            ].map((company) => (
              <Button
                key={company.id}
                variant={companyProfile === company.id ? "default" : "outline"}
                size="sm"
                onClick={() => onCompanyChange(company.id)}
              >
                {company.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onStartInterview}>
          Start Interview
        </Button>
      </CardFooter>
    </Card>
  );
}
