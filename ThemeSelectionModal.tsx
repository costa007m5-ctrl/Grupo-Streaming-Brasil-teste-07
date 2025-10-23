
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MoonIcon, SparklesIcon } from './Icons';

interface ThemeSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ThemeSelectionModal: React.FC<ThemeSelectionModalProps> = ({ isOpen, onClose }) => {
    const { setTheme } = useTheme();

    const handleSelectTheme = (theme: 'dark' | 'light') => {
        setTheme(theme);
        localStorage.setItem('hasChosenTheme', 'true');
        onClose();
    };
    
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl text-center animate-fade-in-up">
                <SparklesIcon className="w-10 h-10 text-purple-500 mx-auto mb-2" />
                <h2 id="modal-title" className="text-2xl font-bold text-gray-900">Escolha sua experiência</h2>
                <p className="text-gray-600 mt-2 mb-6">Selecione o tema que mais combina com você.</p>
                
                <div className="space-y-4">
                    <button 
                        onClick={() => handleSelectTheme('dark')}
                        className="w-full p-4 border-2 border-gray-200 rounded-lg text-left flex items-center space-x-4 hover:border-purple-500 transition-colors"
                    >
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                            <MoonIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Tema Escuro</h3>
                            <p className="text-sm text-gray-500">Moderno e imersivo, ideal para a noite.</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => handleSelectTheme('light')}
                        className="w-full p-4 border-2 border-gray-200 rounded-lg text-left flex items-center space-x-4 hover:border-purple-500 transition-colors"
                    >
                         <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <SparklesIcon className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Tema Clássico</h3>
                            <p className="text-sm text-gray-500">Leve e limpo, perfeito para o dia a dia.</p>
                        </div>
                    </button>
                </div>
                 <style>{`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(20px) scale(0.95); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 0.3s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ThemeSelectionModal;
