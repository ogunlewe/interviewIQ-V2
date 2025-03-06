import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { BookOpen, Code, Brain, MessageSquare, Download } from "lucide-react";

export default function InterviewPrep() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interview Preparation Resources</CardTitle>
          <CardDescription>
            Review these materials to prepare for your technical interview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="technical">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="technical" className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                Technical
              </TabsTrigger>
              <TabsTrigger value="behavioral" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Behavioral
              </TabsTrigger>
              <TabsTrigger value="concepts" className="flex items-center">
                <Brain className="mr-2 h-4 w-4" />
                Key Concepts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="technical" className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>JavaScript Fundamentals</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>
                        Review these key JavaScript concepts before your
                        interview:
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Closures and scope</li>
                        <li>Prototypal inheritance</li>
                        <li>Event loop and asynchronous programming</li>
                        <li>
                          ES6+ features (arrow functions, destructuring, etc.)
                        </li>
                        <li>Promises and async/await</li>
                      </ul>
                      <Button variant="outline" size="sm" className="mt-2">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Study Guide
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>React Best Practices</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>Important React concepts to understand:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Component lifecycle and hooks</li>
                        <li>State management approaches</li>
                        <li>Performance optimization</li>
                        <li>Context API vs Redux</li>
                        <li>React Router and navigation</li>
                      </ul>
                      <Button variant="outline" size="sm" className="mt-2">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Study Guide
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Data Structures & Algorithms
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>Common data structures and algorithms to review:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Arrays, linked lists, stacks, and queues</li>
                        <li>Hash tables and sets</li>
                        <li>Trees and graphs</li>
                        <li>Sorting and searching algorithms</li>
                        <li>Dynamic programming</li>
                      </ul>
                      <Button variant="outline" size="sm" className="mt-2">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Study Guide
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="behavioral" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Common Behavioral Questions
                </h3>
                <ul className="space-y-3">
                  <li className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="font-medium">
                      Tell me about a challenging project you worked on.
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Focus on your role, challenges faced, and how you overcame
                      them.
                    </p>
                  </li>
                  <li className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="font-medium">
                      Describe a time when you had a conflict with a team
                      member.
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Emphasize communication, compromise, and positive
                      resolution.
                    </p>
                  </li>
                  <li className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="font-medium">
                      How do you handle tight deadlines?
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Discuss prioritization, time management, and maintaining
                      quality.
                    </p>
                  </li>
                </ul>

                <div className="mt-4">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download STAR Method Guide
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="concepts" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">System Design</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Scalability and load balancing</li>
                      <li>Caching strategies</li>
                      <li>Database design and optimization</li>
                      <li>Microservices architecture</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Web Technologies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>HTTP/HTTPS protocols</li>
                      <li>RESTful API design</li>
                      <li>Authentication methods</li>
                      <li>Web security (CORS, XSS, CSRF)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Browser rendering pipeline</li>
                      <li>JavaScript performance optimization</li>
                      <li>Network optimization techniques</li>
                      <li>Memory management</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Testing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Unit, integration, and E2E testing</li>
                      <li>TDD and BDD approaches</li>
                      <li>Mocking and stubbing</li>
                      <li>Test coverage and metrics</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
