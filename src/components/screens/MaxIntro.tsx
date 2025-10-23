import React, { useEffect, useRef } from 'react';
import { useSoundSettings } from '../../contexts/SoundContext';

const MAX_SOUND_BASE64 = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjQ1LjEwMAAAAAAAAAAAAAAA//uQxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQxAm READER //uQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQx-..';

interface MaxIntroProps {
  onEnd: () => void;
}

const MaxIntro: React.FC<MaxIntroProps> = ({ onEnd }) => {
  const { playIntroSound } = useSoundSettings();
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !playIntroSound;
    }
  }, [playIntroSound]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const soundTimeout = setTimeout(() => {
      audioRef.current?.play().catch(error => console.warn("Audio playback was prevented.", error));
    }, 200);

    const animationTimeout = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
        setTimeout(() => {
            document.body.style.overflow = '';
            onEnd();
        }, 500);
      }
    }, 4000);

    return () => {
      clearTimeout(soundTimeout);
      clearTimeout(animationTimeout);
      document.body.style.overflow = '';
    };
  }, [onEnd]);
  
  return (
    <div ref={containerRef} className="max-intro-container">
      <audio ref={audioRef} src={MAX_SOUND_BASE64} preload="auto" />
      <div className="max-logo">
        <div className="static-overlay"></div>
        <svg viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10 V 40 L 30 25 L 50 40 V 10 L 30 25 Z" fill="url(#grad1)"/>
            <path d="M60 10 H 75 V 25 H 85 V 10 H 100 V 40 H 85 V 25 H 75 V 40 H 60 Z" fill="url(#grad1)"/>
            <path d="M110 10 L 125 40 L 140 10 H 125 Z M 118 25 H 132" stroke="url(#grad1)" strokeWidth="4" fill="none"/>
        </svg>
      </div>
       <svg width="0" height="0">
        <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: '#D8B4FE', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor: '#6B21A8', stopOpacity:1}} />
            </radialGradient>
        </defs>
      </svg>
      <style>{`
        .max-intro-container {
            position: fixed;
            inset: 0;
            background-color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease-out;
            overflow: hidden;
        }
        .max-logo {
            position: relative;
            width: 50%;
            max-width: 250px;
            opacity: 0;
            animation: logo-fade-in 2s ease-out 1.5s forwards;
        }
        .static-overlay {
            position: absolute;
            inset: -50%;
            background: repeating-linear-gradient(#000 0 2px, transparent 2px 4px),
                        repeating-linear-gradient(90deg, #fff 0 2px, #000 2px 4px);
            background-size: 100% 100%, 100% 100%;
            animation: static-anim 0.1s infinite, static-fade-out 1.5s forwards;
            opacity: 0.15;
            z-index: 10;
        }
        
        @keyframes static-anim {
            0% { transform: translate(2px, 2px); }
            25% { transform: translate(-2px, 2px); }
            50% { transform: translate(-2px, -2px); }
            75% { transform: translate(2px, -2px); }
            100% { transform: translate(2px, 2px); }
        }
        @keyframes static-fade-out {
            0% { opacity: 0.15; }
            99% { opacity: 0; }
            100% { display: none; }
        }
        @keyframes logo-fade-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MaxIntro;