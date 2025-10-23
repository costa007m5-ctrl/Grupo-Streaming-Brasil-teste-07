import React from 'react';
import { AnimatedLogo } from '../ui/Icons';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[10000]">
      <AnimatedLogo />
    </div>
  );
};

export default LoadingScreen;
