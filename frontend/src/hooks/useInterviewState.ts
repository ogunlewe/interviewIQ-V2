import { useState } from 'react';

export interface InterviewConfig {
  selectedTopics: string[];
  difficulty: string;
  interviewerMood: string;
  companyProfile: string;
}

export interface Interviewer {
  name: string;
  avatar: string;
}

export function useInterviewState() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["JavaScript", "React", "Data Structures"]);
  const [difficulty, setDifficulty] = useState<string>("intermediate");
  const [interviewerMood, setInterviewerMood] = useState<string>("neutral");
  const [companyProfile, setCompanyProfile] = useState<string>("tech-startup");
  const [userInput, setUserInput] = useState('');

  // Add interviewer information based on company profile
  const getInterviewer = (): Interviewer => {
    switch (companyProfile) {
      case "tech-startup":
        return {
          name: "Alex Chen",
          avatar: "/images/interviewers/startup-interviewer.png",
        };
      case "enterprise":
        return {
          name: "Sarah Johnson",
          avatar: "/images/interviewers/enterprise-interviewer.png",
        };
      case "tech-giant":
        return {
          name: "Michael Rodriguez",
          avatar: "/images/interviewers/tech-giant-interviewer.png",
        };
      default:
        return {
          name: "Jamie Smith",
          avatar: "/images/interviewers/default-interviewer.png",
        };
    }
  };

  const generateSystemPrompt = () => {
    const persona = companyProfile === "tech-startup" 
      ? "As a Senior Developer & Co-founder at InnovateTech, I've helped grow our team from 5 to 50 engineers. I value creativity and problem-solving ability."
      : companyProfile === "enterprise"
      ? "As an Engineering Manager at Enterprise Solutions Inc., I oversee multiple teams working on large-scale systems. I focus on maintainable and scalable solutions."
      : "As a Principal Engineer at TechGiant, I've worked on systems that serve millions of users. I look for exceptional problem-solving skills.";

    const style = interviewerMood === "friendly"
      ? "warm and encouraging, while still being thorough"
      : interviewerMood === "challenging"
      ? "demanding but fair, pushing candidates to demonstrate their knowledge"
      : "professional and balanced, providing direct feedback";

    return `You are a real technical interviewer conducting an interview. Maintain a consistent personality throughout.

${persona}

I conduct interviews in a ${style} manner. Today we'll discuss: ${selectedTopics.join(", ")} at a ${difficulty} level.

Key Behaviors:
1. Act like a real person, not an AI. Use natural language and show genuine interest.
2. Stay in character - draw from your years of industry experience.
3. React naturally to responses - show approval, skepticism, or interest.
4. Ask relevant follow-up questions based on responses.
5. Share brief experiences from your career when relevant.
6. Reference specific challenges from your company.
7. Use conversational language and natural transitions.`;
  };

  return {
    selectedTopics,
    setSelectedTopics,
    difficulty,
    setDifficulty,
    interviewerMood,
    setInterviewerMood,
    companyProfile,
    setCompanyProfile,
    userInput,
    setUserInput,
    systemPrompt: generateSystemPrompt(),
    interviewer: getInterviewer()
  };
}
