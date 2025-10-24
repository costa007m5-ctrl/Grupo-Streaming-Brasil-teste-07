

import React from 'react';
import { HomeIcon, SearchIcon, WalletIcon, UserIcon, PlayCircleIcon } from './Icons';
import type { AppView } from '../App';
import { useTheme } from '../contexts/ThemeContext';

interface NavItemProps {
  icon: React.ComponentType<{ className?: string, solid?: boolean }>;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick }) => {
  const { theme } = useTheme();

  const activeClasses = 'text-purple-600';
  const inactiveClasses = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';

  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center space-y-1 flex-1 transition-colors hover:text-purple-600 h-full focus:outline-none">
      <Icon className={`w-7 h-7 ${active ? activeClasses : inactiveClasses}`} solid={active} />
      <span className={`text-xs font-semibold ${active ? activeClasses : inactiveClasses}`}>
        {label}
      </span>
    </button>
  );
};

interface BottomNavProps {
    activeView: AppView;
    setActiveView: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const { theme } = useTheme();
  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Início' },
    { id: 'explore', icon: SearchIcon, label: 'Explorar' },
    { id: 'movies', icon: PlayCircleIcon, label: 'Filmes' },
    { id: 'wallet', icon: WalletIcon, label: 'Carteira' },
    { id: 'profile', icon: UserIcon, label: 'Perfil' },
  ] as const;

  const navBg = theme === 'dark' ? 'bg-[#101010] border-gray-800' : 'bg-white border-gray-200';

  return (
    <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t shadow-[0_-2px_10px_rgba(0,0,0,0.04)] ${navBg}`}>
       <div className="flex justify-around items-center h-20">
        {navItems.map((item) => (
            <NavItem 
                key={item.id}
                icon={item.icon} 
                label={item.label} 
                active={activeView === item.id}
                onClick={() => setActiveView(item.id)}
            />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;