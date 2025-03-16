import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface InterviewerProfileProps {
  interviewerName?: string;
  interviewerAvatar?: string;
  companyProfile: string;
  mood: string;
  interviewStage: string;
}

export function InterviewerProfile({
  interviewerName = "AI Interviewer",
  interviewerAvatar = "https://placehold.co/64x64",
  companyProfile,
  mood,
  interviewStage,
}: InterviewerProfileProps) {
  const getCompanyInfo = () => {
    const companies = {
      "tech-startup": {
        name: "TechLaunch",
        description: "A growing startup focused on innovative solutions.",
        size: "15-50 employees",
        location: "Remote-first",
      },
      "enterprise": {
        name: "GlobeCorp Technologies",
        description: "An established enterprise company with a strong market presence.",
        size: "1000+ employees",
        location: "Hybrid, multiple locations",
      },
      "tech-giant": {
        name: "Apex Technologies",
        description: "A leading technology company known for cutting-edge products.",
        size: "10,000+ employees",
        location: "Headquarters + global offices",
      },
    }[companyProfile] || {
      name: "Company",
      description: "A technology company.",
      size: "Various",
      location: "Multiple locations",
    };

    return companies;
  };

  const getStageName = () => {
    const stages = {
      "intro": "Introduction",
      "technical": "Technical Discussion",
      "coding": "Coding Challenge",
      "system-design": "System Design",
      "behavioral": "Behavioral Questions",
      "wrap-up": "Wrap-up",
    }[interviewStage] || "Interview";

    return stages;
  };

  const companyInfo = getCompanyInfo();

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center space-x-4 space-y-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={interviewerAvatar} />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{interviewerName}</h3>
          <p className="text-sm text-muted-foreground">{companyInfo.name}</p>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">Current Stage</div>
            <Badge variant="outline" className="text-sm">
              {getStageName()}
            </Badge>
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Interviewer Style</div>
            <Badge 
              variant="outline" 
              className={`text-sm ${
                mood === "friendly" 
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" 
                  : mood === "challenging" 
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400" 
                    : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
              }`}
            >
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </Badge>
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Company Details</div>
            <div className="text-sm text-muted-foreground">
              <div>{companyInfo.description}</div>
              <div className="mt-1">Size: {companyInfo.size}</div>
              <div>Location: {companyInfo.location}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
