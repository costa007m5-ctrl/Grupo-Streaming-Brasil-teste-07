import React, { useEffect, useRef } from 'react';

interface DisneyPlusIntroProps {
  onEnd: () => void;
}

const DisneyPlusIntro: React.FC<DisneyPlusIntroProps> = ({ onEnd }) => {
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
      videoElement.play().catch(error => {
        console.warn("Video playback was prevented. User must interact to enable sound.", error);
        handleEnd();
      });
      videoElement.addEventListener('ended', handleEnd);
    }
    
    // Fallback in case video doesn't fire 'ended' event (video is ~5 seconds)
    const fallbackTimeout = setTimeout(handleEnd, 6000);

    return () => {
      clearTimeout(fallbackTimeout);
      if (videoElement) {
        videoElement.removeEventListener('ended', handleEnd);
      }
      if (!hasEnded) {
        document.body.style.overflow = '';
      }
    };
  }, []);

  const videoUrl = "https://press.disneyplus.com/public/asset/a/27a0dafe-e8a7-473d-8153-27768564a59f/disney_logo_animation_march_2024.mp4";

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0C19] flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        playsInline
        muted
        className="w-auto h-auto min-w-full min-h-full object-cover"
      />
    </div>
  );
};

export default DisneyPlusIntro;