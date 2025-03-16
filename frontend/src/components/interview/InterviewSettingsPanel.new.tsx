"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Check, ChevronRight, BarChart2, User, Building } from "lucide-react";
import TopicSelector from "../topic-selector";

// Define the interfaces
interface InterviewSettingsProps {
  selectedTopics: string[];
  difficulty: string;
  interviewerMood: string;
  interviewerName: string;
  interviewStage: string;
  companyProfile: string;
  onTopicsChange: (topics: string[]) => void;
  onDifficultyChange: (level: string) => void;
  onInterviewerMoodChange: (mood: string) => void;
  onCompanyChange: (company: string) => void;
  onStartInterview: () => void;
}

interface InterviewSettingsPanelProps {
  onStartInterview: () => void;
  initialSettings?: Partial<InterviewSettingsProps>;
}

// Define available options
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard", "Expert"];
const INTERVIEWER_MOOD_OPTIONS = ["Friendly", "Neutral", "Challenging", "Strict"];
const COMPANY_PROFILE_OPTIONS = [
  "Startup",
  "Mid-size Tech Company",
  "Big Tech (FAANG)",
  "Traditional Enterprise",
  "Consulting Firm",
];
const INTERVIEW_STAGE_OPTIONS = [
  "Initial Phone Screen",
  "Technical Interview",
  "System Design Interview",
  "Final Interview",
];
const INTERVIEWER_NAMES = [
  "Alex",
  "Taylor",
  "Jordan",
  "Morgan",
  "Sam",
  "Jamie",
  "Casey",
  "Riley",
];

export default function InterviewSettingsPanel({
  onStartInterview,
  initialSettings = {},
}: InterviewSettingsPanelProps) {
  // Set up state with initial settings or defaults
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    initialSettings.selectedTopics || []
  );
  const [difficulty, setDifficulty] = useState<string>(
    initialSettings.difficulty || "Medium"
  );
  const [interviewerMood, setInterviewerMood] = useState<string>(
    initialSettings.interviewerMood || "Neutral"
  );
  const [companyProfile, setCompanyProfile] = useState<string>(
    initialSettings.companyProfile || "Mid-size Tech Company"
  );
  const [interviewStage, setInterviewStage] = useState<string>(
    initialSettings.interviewStage || "Technical Interview"
  );
  const [interviewerName, setInterviewerName] = useState<string>(
    initialSettings.interviewerName ||
      INTERVIEWER_NAMES[Math.floor(Math.random() * INTERVIEWER_NAMES.length)]
  );

  // Check if we're ready to start (at least one topic selected)
  const canStart = selectedTopics.length > 0;

  return (
    <Card className="max-w-3xl mx-auto bg-white dark:bg-slate-900 shadow-lg">
      <CardHeader className="border-b pb-3">
        <h2 className="text-xl font-bold">Configure Your Interview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Set up your technical interview by selecting topics and preferences
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Topics Section */}
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 text-xs">
              1
            </span>
            Select Interview Topics
          </h3>
          <TopicSelector
            selectedTopics={selectedTopics}
            onTopicsChange={setSelectedTopics}
          />
        </div>

        {/* Difficulty Section */}
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 text-xs">
              2
            </span>
            <BarChart2 className="h-4 w-4 mr-2" />
            Select Difficulty Level
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIFFICULTY_OPTIONS.map((option) => (
              <Button
                key={option}
                variant={difficulty === option ? "default" : "outline"}
                className={`justify-start hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  difficulty === option
                    ? "border-primary bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
                    : ""
                }`}
                onClick={() => setDifficulty(option)}
              >
                {difficulty === option && <Check className="h-4 w-4 mr-2" />}
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Interviewer Mood Section */}
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 text-xs">
              3
            </span>
            <User className="h-4 w-4 mr-2" />
            Select Interviewer Style
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {INTERVIEWER_MOOD_OPTIONS.map((option) => (
              <Button
                key={option}
                variant={interviewerMood === option ? "default" : "outline"}
                className={`justify-start hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  interviewerMood === option
                    ? "border-primary bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
                    : ""
                }`}
                onClick={() => setInterviewerMood(option)}
              >
                {interviewerMood === option && (
                  <Check className="h-4 w-4 mr-2" />
                )}
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Company Profile Section */}
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 text-xs">
              4
            </span>
            <Building className="h-4 w-4 mr-2" />
            Select Company Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMPANY_PROFILE_OPTIONS.map((option) => (
              <Button
                key={option}
                variant={companyProfile === option ? "default" : "outline"}
                className={`justify-start hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  companyProfile === option
                    ? "border-primary bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
                    : ""
                }`}
                onClick={() => setCompanyProfile(option)}
              >
                {companyProfile === option && (
                  <Check className="h-4 w-4 mr-2" />
                )}
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Interview Stage Section */}
        <div>
          <h3 className="font-medium mb-3">Select Interview Stage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INTERVIEW_STAGE_OPTIONS.map((option) => (
              <Button
                key={option}
                variant={interviewStage === option ? "default" : "outline"}
                className={`justify-start hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  interviewStage === option
                    ? "border-primary bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
                    : ""
                }`}
                onClick={() => setInterviewStage(option)}
              >
                {interviewStage === option && (
                  <Check className="h-4 w-4 mr-2" />
                )}
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Interviewer Name (Optional) */}
        <div>
          <h3 className="font-medium mb-3">Choose Your Interviewer</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {INTERVIEWER_NAMES.map((name) => (
              <Button
                key={name}
                variant={interviewerName === name ? "default" : "outline"}
                className={`justify-start hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  interviewerName === name
                    ? "border-primary bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
                    : ""
                }`}
                onClick={() => setInterviewerName(name)}
              >
                {interviewerName === name && <Check className="h-4 w-4 mr-2" />}
                {name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 mt-4 flex justify-between">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {selectedTopics.length === 0
            ? "Select at least one topic to start"
            : `${selectedTopics.length} topics selected`}
        </div>
        <Button
          onClick={onStartInterview}
          disabled={!canStart}
          className="flex items-center"
        >
          Start Interview <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
