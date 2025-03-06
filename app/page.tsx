import type { Metadata } from "next";
import InterviewSimulator from "@/components/interview-simulator";

export const metadata: Metadata = {
  title: "DevInterviewPro - AI Interview Assistant",
  description: "Practice technical interviews with AI-powered feedback",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            DevInterviewPro
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Your AI-powered interview assistant for software engineering
            interviews. Practice with realistic questions and get instant
            feedback.
          </p>
        </header>

        <InterviewSimulator />
      </div>
    </main>
  );
}
