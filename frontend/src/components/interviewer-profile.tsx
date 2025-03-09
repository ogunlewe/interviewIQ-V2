import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"

interface InterviewerProfileProps {
  companyProfile: string
  mood: string
  interviewStage: string
}

export default function InterviewerProfile({ companyProfile, mood, interviewStage }: InterviewerProfileProps) {
  // Define interviewer details based on company profile
  const getInterviewerDetails = () => {
    switch (companyProfile) {
      case "tech-startup":
        return {
          name: "Alex Chen",
          role: "Senior Developer & Co-founder",
          company: "InnovateTech",
          experience: "8 years",
          expertise: ["JavaScript", "React", "Node.js"],
          avatar: "https://placehold.co/200x200",
        }
      case "enterprise":
        return {
          name: "Sarah Johnson",
          role: "Engineering Manager",
          company: "Enterprise Solutions Inc.",
          experience: "12 years",
          expertise: ["Java", "System Architecture", "Team Leadership"],
          avatar: "https://placehold.co/200x200",
        }
      case "faang":
        return {
          name: "Michael Rodriguez",
          role: "Principal Engineer",
          company: "TechGiant",
          experience: "15 years",
          expertise: ["Distributed Systems", "Algorithms", "System Design"],
          avatar: "https://placehold.co/200x200",
        }
      default:
        return {
          name: "Alex Chen",
          role: "Senior Developer",
          company: "InnovateTech",
          experience: "8 years",
          expertise: ["JavaScript", "React", "Node.js"],
          avatar: "https://placehold.co/200x200",
        }
    }
  }

  const interviewer = getInterviewerDetails()

  // Get current focus based on interview stage
  const getCurrentFocus = () => {
    switch (interviewStage) {
      case "intro":
        return "Getting to know your background and experience"
      case "technical":
        return "Assessing your technical knowledge and problem-solving skills"
      case "coding":
        return "Evaluating your coding abilities and approach"
      case "system-design":
        return "Understanding your system design and architecture skills"
      case "behavioral":
        return "Exploring how you handle workplace situations"
      case "wrap-up":
        return "Answering your questions about the role and company"
      default:
        return "Conducting a comprehensive technical assessment"
    }
  }

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm h-full">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-medium">Interviewer</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-14 w-14 border border-slate-200 dark:border-slate-800">
            <AvatarImage src={interviewer.avatar} />
            <AvatarFallback>
              {interviewer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h3 className="font-medium text-sm">{interviewer.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{interviewer.role}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{interviewer.company}</p>
          </div>
          
          <div className="w-full space-y-4 pt-2">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Expertise</p>
              <div className="flex flex-wrap gap-1">
                {interviewer.expertise.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs py-0 h-5">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Interview Style</p>
              <Badge variant="outline" className="capitalize text-xs py-0 h-5">
                {mood}
              </Badge>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Focus</p>
              <p className="text-xs italic">{getCurrentFocus()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

