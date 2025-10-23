
import React from 'react';
import { SearchIcon, WalletIcon, UserIcon, SupportIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';

interface ActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, onClick }) => {
    const { theme } = useTheme();
    const buttonBg = theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white';
    const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
    
    return (
        <button onClick={onClick} className="flex flex-col items-center space-y-2 flex-shrink-0 w-24">
            <div className={`w-16 h-16 ${buttonBg} rounded-2xl flex items-center justify-center text-purple-500 transition-all duration-300 hover:bg-purple-600 hover:text-white group shadow-sm`}>
                <Icon className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className={`text-xs font-medium ${textColor}`}>{label}</span>
        </button>
    );
};

interface QuickActionsProps {
    onNavigateToExplore: () => void;
    onNavigateToWallet: () => void;
    onNavigateToProfile: () => void;
    onNavigateToSupport: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = (props) => {
  const actions = [
    { icon: SearchIcon, label: 'Explorar', onClick: props.onNavigateToExplore },
    { icon: WalletIcon, label: 'Carteira', onClick: props.onNavigateToWallet },
    { icon: UserIcon, label: 'Perfil', onClick: props.onNavigateToProfile },
    { icon: SupportIcon, label: 'Suporte', onClick: props.onNavigateToSupport },
  ];

  return (
    <section>
      <div className="flex justify-between items-center">
        {actions.map((action) => (
          <ActionButton key={action.label} icon={action.icon} label={action.label} onClick={action.onClick} />
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
