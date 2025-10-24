import React, { useState, useRef } from 'react';
import { BellIcon, CodeBracketIcon } from './Icons';
import type { Profile } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
    profile: Profile | null;
    onOpenDevMenu: () => void;
    onEnterAdminMode: () => void;
    notificationCount: number;
    onNotificationClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ profile, onOpenDevMenu, onEnterAdminMode, notificationCount, onNotificationClick }) => {
  const { theme } = useTheme();
  const firstName = profile ? profile.full_name.split(' ')[0] : 'Usuário';

  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<number | null>(null);

  const handleAvatarClick = () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    tapTimeoutRef.current = window.setTimeout(() => {
      setTapCount(0);
    }, 1500); // Reseta após 1.5 segundos

    if (newTapCount === 5) {
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
      setTapCount(0);
      onEnterAdminMode();
    }
  };
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const buttonBg = theme === 'dark' ? 'bg-[#1C1A27] hover:bg-[#2C2A3A]' : 'bg-white hover:bg-gray-100';
  const iconColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <header className="flex items-center justify-between p-4 sm:p-6">
      <div className="flex items-center space-x-4" onClick={handleAvatarClick} style={{ cursor: 'pointer' }} title="Toque 5x para modo admin">
        <div className="relative">
          <img 
            src={profile?.avatar_url || 'https://img.icons8.com/color/96/yoda.png'} 
            alt="Avatar" 
            className="w-14 h-14 rounded-full border-2 border-purple-500/50 shadow-lg" 
          />
          <div className="absolute inset-0 rounded-full border-2 border-purple-500 blur-sm animate-pulse"></div>
        </div>
        <div>
          <p className={`text-sm ${subTextColor}`}>Bem-vindo de volta,</p>
          <h1 className={`text-2xl font-bold ${textColor}`}>{firstName}!</h1>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button onClick={onNotificationClick} className={`relative w-11 h-11 flex items-center justify-center rounded-full transition-colors ${buttonBg}`}>
          <BellIcon className={`w-6 h-6 ${iconColor}`} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {notificationCount}
            </span>
          )}
        </button>
         <button onClick={onOpenDevMenu} className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${buttonBg}`}>
            <CodeBracketIcon className={`w-6 h-6 ${iconColor}`} />
        </button>
      </div>
    </header>
  );
};

export default Header;