"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Textarea } from "./ui/textarea"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  Users,
  Settings,
  Wifi,
  WifiOff,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react"
import type { Message } from "../lib/chat-service"
import { SpeechRecognitionService } from "../lib/speech-service"

interface EnhancedVideoCallInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => Promise<void>
  audioEnabled: boolean
  videoEnabled: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onEndCall: () => void
  interviewerName: string
  interviewerAvatar: string
  networkQuality: number // 0-3, where 0 is disconnected and 3 is excellent
  isLoading: boolean
  isSpeaking: boolean
  onStopSpeaking: () => void
  continuousSpeech: boolean
  onToggleContinuousSpeech: () => void
  spokenMessageIds: Set<string>
  onMessageSpoken: (messageId: string) => void
}

export default function EnhancedVideoCallInterface({
  messages,
  onSendMessage,
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  interviewerName,
  interviewerAvatar,
  networkQuality,
  isLoading,
  isSpeaking,
  onStopSpeaking,
  continuousSpeech,
  onToggleContinuousSpeech,
  spokenMessageIds,
  onMessageSpoken,
}: EnhancedVideoCallInterfaceProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [showControls, setShowControls] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [interviewerVideo, setInterviewerVideo] = useState<string | null>(null)
  const [interviewerState, setInterviewerState] = useState<"idle" | "thinking" | "speaking">("idle")

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null)

  const INTERVIEWER_VIDEOS = {
    idle: "/interviewer-idle.mp4", // This would be a short loop of the interviewer looking attentive
    thinking: "/interviewer-thinking.mp4", // This would be a short loop of the interviewer thinking
    speaking: "/interviewer-speaking.mp4", // This would be a short loop of the interviewer speaking
  }

  // Initialize speech recognition service
  useEffect(() => {
    try {
      speechRecognitionRef.current = SpeechRecognitionService.getInstance()
    } catch (error) {
      console.error("Speech recognition not available:", error)
    }

    return () => {
      if (speechRecognitionRef.current && speechRecognitionRef.current.isRecognizing()) {
        speechRecognitionRef.current.stop()
      }
    }
  }, [])

  // Set up interviewer videos
  useEffect(() => {
    // In a real implementation, we would load actual video files
    // For this example, we'll just use the avatar image as a placeholder
    setInterviewerVideo(interviewerAvatar)
  }, [interviewerAvatar])

  // Update interviewer state based on messages and loading state
  useEffect(() => {
    if (isSpeaking) {
      setInterviewerState("speaking")
    } else if (isLoading) {
      setInterviewerState("thinking")
    } else {
      setInterviewerState("idle")
    }
  }, [isLoading, isSpeaking])

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Initialize local video stream
  useEffect(() => {
    if (videoEnabled && !localStream) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: audioEnabled })
        .then((stream) => {
          setLocalStream(stream)
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error("Error accessing media devices:", err)
        })
    } else if (!videoEnabled && localStream) {
      localStream.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.stop()
        }
      })

      // Keep audio tracks if audio is enabled
      if (audioEnabled) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            setLocalStream(stream)
          })
          .catch((err) => {
            console.error("Error accessing audio devices:", err)
          })
      } else {
        setLocalStream(null)
      }
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [videoEnabled, audioEnabled, localStream])

  // Update audio tracks when audio is toggled
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = audioEnabled
      })
    }
  }, [audioEnabled, localStream])

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Auto-hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Initial timeout
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Handle screen sharing
  const toggleScreenSharing = () => {
    if (!isScreenSharing) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then((stream) => {
          // Save current video stream to restore later
          const videoTrack = localStream?.getVideoTracks()[0]

          // Replace video track with screen share
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }

          // Listen for when user stops screen sharing
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false)
            if (videoEnabled && videoTrack && localVideoRef.current) {
              const newStream = new MediaStream([videoTrack])
              localVideoRef.current.srcObject = newStream
            }
          }

          setIsScreenSharing(true)
        })
        .catch((err) => {
          console.error("Error sharing screen:", err)
        })
    } else {
      // Stop screen sharing
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }

      // Restore camera if video is enabled
      if (videoEnabled) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }
        })
      }

      setIsScreenSharing(false)
    }
  }

  // Network quality indicator
  const getNetworkIndicator = () => {
    switch (networkQuality) {
      case 0:
        return <WifiOff className="h-4 w-4 text-red-500" />
      case 1:
        return <Wifi className="h-4 w-4 text-red-400" />
      case 2:
        return <Wifi className="h-4 w-4 text-yellow-400" />
      case 3:
        return <Wifi className="h-4 w-4 text-green-400" />
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />
    }
  }

  // Start speech recognition
  const startListening = () => {
    if (!speechRecognitionRef.current) return

    setIsListening(true)

    speechRecognitionRef.current.start(
      (transcript) => {
        // Update input field with transcript
        setInput(transcript)
      },
      () => {
        setIsListening(false)
      },
    )
  }

  // Stop speech recognition
  const stopListening = () => {
    if (speechRecognitionRef.current && speechRecognitionRef.current.isRecognizing()) {
      speechRecognitionRef.current.stop()
      setIsListening(false)
    }
  }

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return
    await onSendMessage(input)
    setInput("")
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] bg-black rounded-lg overflow-hidden">
        {/* Main video (interviewer) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {videoEnabled ? (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              {/* In a real implementation, we would use actual videos for different states */}
              {interviewerState === "speaking" ? (
                <div className="relative w-full h-full">
                  <img
                    src={interviewerAvatar || "/placeholder.svg"}
                    alt={interviewerName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-green-500 h-3 w-3 rounded-full animate-pulse"></div>
                </div>
              ) : interviewerState === "thinking" ? (
                <div className="relative w-full h-full">
                  <img
                    src={interviewerAvatar || "/placeholder.svg"}
                    alt={interviewerName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 flex space-x-1 bg-black/30 p-1 rounded-full">
                    <div className="bg-yellow-500 h-2 w-2 rounded-full animate-bounce"></div>
                    <div className="bg-yellow-500 h-2 w-2 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="bg-yellow-500 h-2 w-2 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              ) : (
                <img
                  src={interviewerAvatar || "/placeholder.svg"}
                  alt={interviewerName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <Avatar className="h-32 w-32">
                <img src={interviewerAvatar || "/placeholder.svg"} alt={interviewerName} />
              </Avatar>
            </div>
          )}
        </div>

        {/* Local video (user) */}
        <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
          {videoEnabled || isScreenSharing ? (
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <Avatar className="h-12 w-12">
                <span>You</span>
              </Avatar>
            </div>
          )}
        </div>

        {/* Call info */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <Badge variant="outline" className="bg-black/50 text-white border-none">
            {formatTime(elapsedTime)}
          </Badge>
          <Badge variant="outline" className="bg-black/50 text-white border-none flex items-center gap-1">
            {getNetworkIndicator()}
            {networkQuality === 0
              ? "Disconnected"
              : networkQuality === 1
                ? "Poor"
                : networkQuality === 2
                  ? "Good"
                  : "Excellent"}
          </Badge>
        </div>

        {/* Participant name */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full">
          <span className="text-white text-sm">{interviewerName}</span>
        </div>

        {/* Call controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-8 w-8 sm:h-10 sm:w-10 ${audioEnabled ? "bg-gray-700" : "bg-red-600"} border-none text-white hover:bg-gray-600`}
              onClick={onToggleAudio}
            >
              {audioEnabled ? <Mic className="h-4 w-4 sm:h-5 sm:w-5" /> : <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-8 w-8 sm:h-10 sm:w-10 ${videoEnabled ? "bg-gray-700" : "bg-red-600"} border-none text-white hover:bg-gray-600`}
              onClick={onToggleVideo}
            >
              {videoEnabled ? <Video className="h-4 w-4 sm:h-5 sm:w-5" /> : <VideoOff className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-8 w-8 sm:h-10 sm:w-10 ${isScreenSharing ? "bg-green-600" : "bg-gray-700"} border-none text-white hover:bg-gray-600`}
              onClick={toggleScreenSharing}
            >
              <ScreenShare className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-8 w-8 sm:h-10 sm:w-10 ${continuousSpeech ? "bg-green-600" : "bg-gray-700"} border-none text-white hover:bg-gray-600`}
              onClick={onToggleContinuousSpeech}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" onClick={onStopSpeaking} /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10 bg-gray-700 border-none text-white hover:bg-gray-600"
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10 bg-gray-700 border-none text-white hover:bg-gray-600"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10 bg-red-600 border-none text-white hover:bg-red-700"
              onClick={onEndCall}
            >
              <PhoneOff className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="flex flex-col h-[250px] sm:h-[300px]">
            <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-8 w-8">
                        {message.role === "user" ? (
                          <img src="/placeholder.svg?height=32&width=32" alt="You" />
                        ) : (
                          <img src={interviewerAvatar || "/placeholder.svg"} alt={interviewerName} />
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        {message.role === "assistant" && !continuousSpeech && !spokenMessageIds.has(message.id) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 mt-1 text-xs opacity-70 hover:opacity-100"
                            onClick={() => {
                              // Speak this message and mark it as spoken
                              onMessageSpoken(message.id)
                            }}
                            disabled={isSpeaking}
                          >
                            <Volume2 className="h-3 w-3 mr-1" />
                            Listen
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <img src={interviewerAvatar || "/placeholder.svg"} alt={interviewerName} />
                      </Avatar>
                      <div className="rounded-lg px-4 py-2 bg-muted">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce"></div>
                          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce [animation-delay:0.2s]"></div>
                          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-slate-200 dark:border-slate-800 p-3">
              <div className="flex space-x-2">
                <Textarea
                  placeholder={isListening ? "Listening to your answer..." : "Type your answer here..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 min-h-[60px] resize-none"
                  disabled={isListening}
                />
                <div className="flex flex-col space-y-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={isListening ? stopListening : startListening}
                    className={
                      isListening ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" : ""
                    }
                  >
                    {isListening ? <Mic className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button type="button" size="icon" onClick={handleSend} disabled={!input.trim() || isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

