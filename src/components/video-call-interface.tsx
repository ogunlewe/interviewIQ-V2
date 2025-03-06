"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  MessageSquare,
  Users,
  Settings,
  Wifi,
  WifiOff,
} from "lucide-react";

interface VideoCallInterfaceProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  interviewerName: string;
  interviewerAvatar: string;
  networkQuality: number; // 0-3, where 0 is disconnected and 3 is excellent
}

export default function VideoCallInterface({
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  interviewerName,
  interviewerAvatar,
  networkQuality,
}: VideoCallInterfaceProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Initialize local video stream
  useEffect(() => {
    if (videoEnabled && !localStream) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: audioEnabled })
        .then((stream) => {
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing media devices:", err);
        });
    } else if (!videoEnabled && localStream) {
      localStream.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.stop();
        }
      });

      // Keep audio tracks if audio is enabled
      if (audioEnabled) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            setLocalStream(stream);
          })
          .catch((err) => {
            console.error("Error accessing audio devices:", err);
          });
      } else {
        setLocalStream(null);
      }
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoEnabled, audioEnabled, localStream]);

  // Update audio tracks when audio is toggled
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = audioEnabled;
      });
    }
  }, [audioEnabled, localStream]);

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Initial timeout
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Handle screen sharing
  const toggleScreenSharing = () => {
    if (!isScreenSharing) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then((stream) => {
          // Save current video stream to restore later
          const videoTrack = localStream?.getVideoTracks()[0];

          // Replace video track with screen share
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          // Listen for when user stops screen sharing
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            if (videoEnabled && videoTrack && localVideoRef.current) {
              const newStream = new MediaStream([videoTrack]);
              localVideoRef.current.srcObject = newStream;
            }
          };

          setIsScreenSharing(true);
        })
        .catch((err) => {
          console.error("Error sharing screen:", err);
        });
    } else {
      // Stop screen sharing
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      // Restore camera if video is enabled
      if (videoEnabled) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        });
      }

      setIsScreenSharing(false);
    }
  };

  // Network quality indicator
  const getNetworkIndicator = () => {
    switch (networkQuality) {
      case 0:
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case 1:
        return <Wifi className="h-4 w-4 text-red-400" />;
      case 2:
        return <Wifi className="h-4 w-4 text-yellow-400" />;
      case 3:
        return <Wifi className="h-4 w-4 text-green-400" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
      {/* Main video (interviewer) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {videoEnabled ? (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <img
              src={interviewerAvatar || "/placeholder.svg"}
              alt={interviewerName}
              className="max-w-full max-h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <img
                src={interviewerAvatar || "/placeholder.svg"}
                alt={interviewerName}
              />
            </Avatar>
          </div>
        )}
      </div>

      {/* Local video (user) */}
      <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
        {videoEnabled || isScreenSharing ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
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
        <Badge
          variant="outline"
          className="bg-black/50 text-white border-none flex items-center gap-1"
        >
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
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full ${
              audioEnabled ? "bg-gray-700" : "bg-red-600"
            } border-none text-white hover:bg-gray-600`}
            onClick={onToggleAudio}
          >
            {audioEnabled ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={`rounded-full ${
              videoEnabled ? "bg-gray-700" : "bg-red-600"
            } border-none text-white hover:bg-gray-600`}
            onClick={onToggleVideo}
          >
            {videoEnabled ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={`rounded-full ${
              isScreenSharing ? "bg-green-600" : "bg-gray-700"
            } border-none text-white hover:bg-gray-600`}
            onClick={toggleScreenSharing}
          >
            <ScreenShare className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-gray-700 border-none text-white hover:bg-gray-600"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-gray-700 border-none text-white hover:bg-gray-600"
          >
            <Users className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-gray-700 border-none text-white hover:bg-gray-600"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-red-600 border-none text-white hover:bg-red-700"
            onClick={onEndCall}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
