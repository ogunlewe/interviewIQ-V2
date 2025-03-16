"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"

const AVAILABLE_TOPICS = [
  // Frontend
  "JavaScript",
  "TypeScript",
  "React",
  "Vue",
  "Angular",
  "Next.js",
  "CSS",
  "HTML",
  "Redux",
  // Backend
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring Boot",
  "ASP.NET",
  "Ruby on Rails",
  // Languages
  "Python",
  "Java",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  // Data Structures & Algorithms
  "Data Structures",
  "Algorithms",
  "Big O Notation",
  "Dynamic Programming",
  "Recursion",
  // Databases
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Firebase",
  // DevOps & Cloud
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "CI/CD",
  "Git",
  // Architecture
  "System Design",
  "Microservices",
  "REST API",
  "GraphQL",
  "Design Patterns",
  // Testing
  "Unit Testing",
  "Integration Testing",
  "TDD",
  "Jest",
  "Cypress",
  // Soft Skills
  "Problem Solving",
  "Communication",
  "Teamwork",
  "Project Management",
]

interface TopicSelectorProps {
  selectedTopics: string[]
  onTopicsChange: (topics: string[]) => void
}

export default function TopicSelector({ selectedTopics, onTopicsChange }: TopicSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [customTopic, setCustomTopic] = useState("")
  const [showTopicSelector, setShowTopicSelector] = useState(false)

  const filteredTopics = AVAILABLE_TOPICS.filter(
    (topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedTopics.includes(topic),
  )

  const handleAddTopic = (topic: string) => {
    if (!selectedTopics.includes(topic) && topic.trim() !== "") {
      onTopicsChange([...selectedTopics, topic])
      setShowTopicSelector(false)
    }
  }

  const handleRemoveTopic = (topic: string) => {
    onTopicsChange(selectedTopics.filter((t) => t !== topic))
  }

  const handleAddCustomTopic = () => {
    if (customTopic.trim() !== "" && !selectedTopics.includes(customTopic)) {
      onTopicsChange([...selectedTopics, customTopic])
      setCustomTopic("")
      setShowTopicSelector(false)
    }
  }

  const toggleTopicSelector = () => {
    setShowTopicSelector(!showTopicSelector)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {selectedTopics.length === 0 ? (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            No topics selected. Click "Select Topics" below to add some.
          </div>
        ) : (
          selectedTopics.map((topic) => (
            <Badge key={topic} variant="secondary" className="flex items-center gap-1">
              {topic}
              <button
                onClick={() => handleRemoveTopic(topic)}
                className="ml-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 p-0.5"
                aria-label={`Remove ${topic} topic`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleTopicSelector}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Select Topics
      </Button>

      {showTopicSelector && (
        <div className="border rounded-md p-4 mt-2 bg-background shadow-md">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add custom topic..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" variant="outline" onClick={handleAddCustomTopic} disabled={customTopic.trim() === ""}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          <div>
            <Input
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />

            <ScrollArea className="h-[200px]">
              <div className="grid grid-cols-2 gap-2">
                {filteredTopics.map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    className="justify-start h-auto py-2 px-3 text-sm"
                    onClick={() => handleAddTopic(topic)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                    <span className="truncate">{topic}</span>
                  </Button>
                ))}
                {filteredTopics.length === 0 && searchTerm && (
                  <div className="col-span-2 text-center py-4 text-sm text-slate-500 dark:text-slate-400">
                    No matching topics found
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  )
}
