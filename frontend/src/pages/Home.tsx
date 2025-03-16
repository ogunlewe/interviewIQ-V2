"use client";

import { useState } from "react";
import { InterviewSimulator } from "../components/interview-simulator.new";
import InterviewPrep from "../components/interview-prep";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Calendar, Clock, FileText, Briefcase, BookOpen } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState("interview");
  const { currentUser, logout } = useAuth();

  const handleStartInterview = () => {
    setShowIntro(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {showIntro ? (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">
                  {currentUser?.displayName || currentUser?.email}
                </p>
                <Button
                  variant="link"
                  onClick={logout}
                  className="h-auto p-0 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Log out
                </Button>
              </div>

              <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                <AvatarImage src={currentUser?.photoURL || undefined} />
                <AvatarFallback>
                  {currentUser?.displayName
                    ? currentUser.displayName.charAt(0).toUpperCase()
                    : currentUser?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="max-w-3xl w-full text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              interviewIQ
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Practice technical interviews with AI-powered feedback
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-100 dark:border-slate-800">
                <Calendar className="h-8 w-8 text-slate-500 dark:text-slate-400 mb-4 mx-auto" />
                <h3 className="text-base font-medium mb-2">
                  Realistic Interviews
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Experience interviews that simulate real-world scenarios
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-100 dark:border-slate-800">
                <Clock className="h-8 w-8 text-slate-500 dark:text-slate-400 mb-4 mx-auto" />
                <h3 className="text-base font-medium mb-2">
                  Real-time Feedback
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Get immediate insights on your performance
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-100 dark:border-slate-800">
                <FileText className="h-8 w-8 text-slate-500 dark:text-slate-400 mb-4 mx-auto" />
                <h3 className="text-base font-medium mb-2">Detailed Reports</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Track your progress over time
                </p>
              </div>
            </div>

            <Button
              onClick={handleStartInterview}
              className="mt-8 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900"
            >
              Start Your Interview
            </Button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-4 md:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                interviewIQ
              </h1>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">
                    {currentUser?.displayName || currentUser?.email}
                  </p>
                  <Button
                    variant="link"
                    onClick={logout}
                    className="h-auto p-0 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Log out
                  </Button>
                </div>

                <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                  <AvatarImage src={currentUser?.photoURL || undefined} />
                  <AvatarFallback>
                    {currentUser?.displayName
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : currentUser?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          <div className="mt-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-900">
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
        </div>
      )}
    </main>
  );
}
