"use client"

import { useState, useEffect, useRef } from "react"

interface InterviewerVideoProps {
  state: "idle" | "thinking" | "speaking"
  avatarUrl: string
}

export default function InterviewerVideo({ state, avatarUrl }: InterviewerVideoProps) {
  const [videoPaused, setVideoPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Simulate a video of the interviewer with different states
  // In a real implementation, you would use actual video files

  useEffect(() => {
    // This is a simplified simulation with no actual videos
    // In a real implementation, you would load different video files

    if (videoRef.current) {
      // Reset any existing animation classes
      videoRef.current.classList.remove("animate-pulse-opacity", "animate-breathe")

      // Add animation based on state
      if (state === "speaking") {
        videoRef.current.classList.add("animate-breathe")
      } else if (state === "thinking") {
        videoRef.current.classList.add("animate-pulse-opacity")
      }
    }
  }, [state])

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
      {/* In a real implementation, we would use actual video files */}
      <img
        ref={videoRef as any}
        src={avatarUrl || "/placeholder.svg"}
        alt="Interviewer"
        className="w-full h-full object-cover"
      />

      {/* Status indicators */}
      {state === "speaking" && (
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 px-2 py-1 rounded-full">
          <div className="bg-green-500 h-2 w-2 rounded-full"></div>
          <span className="text-white text-xs">Speaking</span>
        </div>
      )}

      {state === "thinking" && (
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 px-2 py-1 rounded-full">
          <div className="flex space-x-1">
            <div className="bg-yellow-500 h-2 w-2 rounded-full animate-bounce"></div>
            <div className="bg-yellow-500 h-2 w-2 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="bg-yellow-500 h-2 w-2 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
          <span className="text-white text-xs">Thinking</span>
        </div>
      )}
    </div>
  )
}

