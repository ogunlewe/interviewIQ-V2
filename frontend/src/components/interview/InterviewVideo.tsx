import React from 'react';
import EnhancedVideoCallInterface from '../enhanced-video-call-interface';

interface InterviewVideoProps {
  videoEnabled: boolean;
  audioEnabled: boolean;
  networkQuality: number;
  onVideoToggle: () => void;
  onAudioToggle: () => void;
}

export const InterviewVideo: React.FC<InterviewVideoProps> = ({
  videoEnabled,
  audioEnabled,
  networkQuality,
  onVideoToggle,
  onAudioToggle,
}) => {
  return (
    <div className="h-[240px] border-b">
      <EnhancedVideoCallInterface
        videoEnabled={videoEnabled}
        audioEnabled={audioEnabled}
        onVideoToggle={onVideoToggle}
        onAudioToggle={onAudioToggle}
        networkQuality={networkQuality}
      />
    </div>
  );
};
