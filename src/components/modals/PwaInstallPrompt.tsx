import React from 'react';
import { ArrowDownTrayIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';

interface PwaInstallPromptProps {
    onInstall: () => void;
    onDismiss: () => void;
}

const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ onInstall, onDismiss }) => {
    const { theme } = useTheme();

    return (
        <div className={`fixed bottom-24 sm:bottom-4 left-1/2 -translate-x-1/2 max-w-sm w-[calc(100%-2rem)] z-50 animate-fade-in-up`}>
             <div className={`rounded-xl shadow-lg p-4 flex items-center space-x-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <div className="flex-shrink-0">
                    <img src="https://img.icons8.com/fluency/96/play-button-circled.png" alt="App Icon" className="w-12 h-12" />
                </div>
                <div className="flex-1">
                    <p className="font-bold">Instale o App GSB</p>
                    <p className="text-sm">Tenha a melhor experiência, com acesso rápido pela sua tela de início.</p>
                </div>
                <div className="flex flex-col space-y-2 items-center">
                     <button onClick={onInstall} className="bg-purple-600 text-white font-semibold py-2 px-3 rounded-lg text-sm w-full">
                        Instalar
                    </button>
                    <button onClick={onDismiss} className="text-xs text-gray-400 hover:text-gray-200">
                        Agora não
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PwaInstallPrompt;
