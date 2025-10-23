import React, { useEffect, useRef } from 'react';
import { useSoundSettings } from '../../contexts/SoundContext';

const PRIME_SOUND_BASE64 = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjQ1LjEwMAAAAAAAAAAAAAAA//uQxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQxAm READER //uQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQxDsbuQx-..';

interface PrimeVideoIntroProps {
  onEnd: () => void;
}

const PrimeVideoIntro: React.FC<PrimeVideoIntroProps> = ({ onEnd }) => {
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
    }, 500);

    const animationTimeout = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
        setTimeout(() => {
            document.body.style.overflow = '';
            onEnd();
        }, 500);
      }
    }, 3500);

    return () => {
      clearTimeout(soundTimeout);
      clearTimeout(animationTimeout);
      document.body.style.overflow = '';
    };
  }, [onEnd]);
  
  return (
    <div ref={containerRef} className="prime-intro-container">
      <audio ref={audioRef} src={PRIME_SOUND_BASE64} preload="auto" />
      <div className="prime-logo">
        <svg viewBox="0 0 168 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="prime-text" d="M38.82 20.35V6.5H43.9V16.88L52.51 6.5H58.15L48.97 16.59C53.71 17.25 57.64 20.78 57.64 25.86C57.64 32.07 52.4 35.5 45.68 35.5H38.82V20.35ZM43.9 31.52C48.06 31.52 51.5 29.23 51.5 25.86C51.5 22.49 48.06 20.35 43.9 20.35V31.52Z" fill="#fff"/>
            <path className="prime-text" d="M96.35 35.5H91.13V6.5H96.35V35.5Z" fill="#fff"/>
            <path className="prime-text" d="M125.41 35.5H103.5V6.5H125.41V10.48H108.6V17.53H123.63V21.51H108.6V31.52H125.41V35.5Z" fill="#fff"/>
            <path className="prime-text" d="M68.52 35.5V6.5H86.67C92.21 6.5 95.84 9.6 95.84 14.5C95.84 18.2 93.65 20.78 90.7 22.1L97.23 35.5H90.89L85.25 22.9H73.6V35.5H68.52ZM73.6 18.92H85.49C88.62 18.92 90.7 17.3 90.7 14.5C90.7 11.7 88.62 10.48 85.49 10.48H73.6V18.92Z" fill="#fff"/>
            <path className="prime-text" d="M18.88 35.5H13.66V6.5H18.88V35.5Z" fill="#fff"/>
            <path className="prime-text" d="M136.5 6.5V35.5H131.42V10.48L136.5 6.5Z" fill="#fff"/>
            <path className="prime-text" d="M141.28 6.5V35.5H136.2V10.48L141.28 6.5Z" fill="#fff"/>
            <path className="prime-text" d="M145.41 35.5V6.5H150.5V35.5H145.41Z" fill="#fff"/>
            <path className="prime-text" d="M167.39 21.51H152.93V31.52H167.39V35.5H147.85V6.5H167.2V10.48H152.93V17.53H167.39V21.51Z" fill="#fff"/>
            <path className="prime-text" d="M26.43 31.52H35.45V35.5H21.35V6.5H35.26V10.48H26.43V31.52Z" fill="#fff"/>
            <path className="swoosh" d="M1.32,26.54c15.84-6,31.68-6,47.52-6" stroke="#00A8E1" strokeWidth="5" strokeLinecap="round"/>
        </svg>
      </div>
      <style>{`
        .prime-intro-container {
            position: fixed;
            inset: 0;
            background-color: #00050d;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease-out;
            overflow: hidden;
        }
        .prime-logo {
            width: 80%;
            max-width: 400px;
        }
        .prime-text {
            opacity: 0;
            animation: text-fade-in 1.5s ease-out 0.5s forwards;
        }
        .swoosh {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: swoosh-draw 1.5s cubic-bezier(0.65, 0, 0.35, 1) 1s forwards;
        }

        @keyframes text-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes swoosh-draw {
            from { stroke-dashoffset: 100; }
            to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default PrimeVideoIntro;