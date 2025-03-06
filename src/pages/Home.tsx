"use client";

import { useState } from "react";
import InterviewSimulator from "../components/interview-simulator";
import InterviewPrep from "../components/interview-prep";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Calendar, Clock, FileText, Briefcase, BookOpen } from "lucide-react";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState("interview");

  const handleStartInterview = () => {
    setShowIntro(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {showIntro ? (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-3xl w-full text-center space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
              DevInterviewPro
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              Your AI-powered interview assistant for software engineering
              interviews. Practice with realistic questions and get instant
              feedback.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <Calendar className="h-10 w-10 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">
                  Realistic Interviews
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Experience interviews that simulate real-world technical
                  discussions.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <Clock className="h-10 w-10 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">
                  Real-time Feedback
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Get immediate feedback on your answers and performance.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <FileText className="h-10 w-10 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Detailed Reports</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Receive comprehensive reports to track your progress over
                  time.
                </p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleStartInterview}
              className="text-lg px-8 py-6"
            >
              Start Your Interview
            </Button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                DevInterviewPro
              </h1>
              <Button variant="outline" onClick={() => setShowIntro(true)}>
                Back to Home
              </Button>
            </div>
            <div className="mt-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="interview" className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Interview Session
                  </TabsTrigger>
                  <TabsTrigger value="prep" className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Interview Prep
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="interview" className="mt-6">
                  <InterviewSimulator />
                </TabsContent>

                <TabsContent value="prep" className="mt-6">
                  <InterviewPrep />
                </TabsContent>
              </Tabs>
            </div>
          </header>
        </div>
      )}
    </main>
  );
}
