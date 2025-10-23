import React, { useEffect, useRef } from 'react';
import { useSoundSettings } from '../contexts/SoundContext';

interface NetflixIntroProps {
  onEnd: () => void;
}

const NetflixIntro: React.FC<NetflixIntroProps> = ({ onEnd }) => {
  const { playIntroSound } = useSoundSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let hasEnded = false;
    
    const handleEnd = () => {
      if (!hasEnded) {
        hasEnded = true;
        document.body.style.overflow = '';
        onEndRef.current();
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = !playIntroSound;
      videoElement.play().catch(error => {
        console.warn("Video playback was prevented. User must interact to enable sound.", error);
        // If autoplay fails, we still need to end the intro
        handleEnd();
      });
      videoElement.addEventListener('ended', handleEnd);
    }
    
    // Fallback in case video doesn't fire 'ended' event (video is ~6 seconds)
    const fallbackTimeout = setTimeout(handleEnd, 7000);

    return () => {
      clearTimeout(fallbackTimeout);
      if (videoElement) {
        videoElement.removeEventListener('ended', handleEnd);
      }
      // Ensure cleanup on unmount in case animation is interrupted
      if (!hasEnded) {
        document.body.style.overflow = '';
      }
    };
  }, [playIntroSound]);

  const videoUrl = "https://www.dropbox.com/scl/fi/9xtd540qqlciv5762upk2/Netflix-Intro-Remake-_-4K-4K_60FPS.webm?rlkey=gd5ibxgflc4npnxz008fntu55&st=lzkbo25m&raw=1";

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        playsInline
        className="w-auto h-auto min-w-full min-h-full object-cover"
      />
    </div>
  );
};

export default NetflixIntro;