
import React from 'react';
import { ArrowLeftIcon, MoonIcon, SparklesIcon, CheckCircleIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Aparência</h1>
        </div>
    </header>
);

const ThemeOptionCard: React.FC<{
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    isSelected: boolean;
    onSelect: () => void;
    iconBg: string;
    iconColor: string;
}> = ({ label, description, icon: Icon, isSelected, onSelect, iconBg, iconColor }) => (
    <button 
        onClick={onSelect}
        className={`relative w-full p-4 border-2 rounded-lg text-left flex items-center space-x-4 transition-colors ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-300'}`}
    >
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
            <h3 className="font-bold text-gray-800">{label}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        {isSelected && <CheckCircleIcon className="absolute top-2 right-2 w-6 h-6" iconClassName="w-4 h-4" />}
    </button>
);


const DesignSettingsScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-4">
                <ThemeOptionCard 
                    label="Tema Escuro"
                    description="Moderno e imersivo, ideal para a noite."
                    icon={MoonIcon}
                    isSelected={theme === 'dark'}
                    onSelect={() => setTheme('dark')}
                    iconBg="bg-gray-800"
                    iconColor="text-purple-400"
                />
                <ThemeOptionCard 
                    label="Tema Clássico"
                    description="Leve e limpo, perfeito para o dia a dia."
                    icon={SparklesIcon}
                    isSelected={theme === 'light'}
                    onSelect={() => setTheme('light')}
                    iconBg="bg-gray-100"
                    iconColor="text-purple-500"
                />
            </main>
        </div>
    );
};

export default DesignSettingsScreen;
