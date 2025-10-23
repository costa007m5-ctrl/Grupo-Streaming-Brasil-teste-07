import React from 'react';
import { BellIcon, XMarkIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';

interface NotificationPermissionPromptProps {
    onAllow: () => void;
    onDismiss: () => void;
}

const NotificationPermissionPrompt: React.FC<NotificationPermissionPromptProps> = ({ onAllow, onDismiss }) => {
    const { theme } = useTheme();

    return (
        <div 
            className={`fixed bottom-24 sm:bottom-4 left-1/2 -translate-x-1/2 max-w-md w-full p-4 z-50 animate-fade-in-up`}
            role="dialog"
            aria-labelledby="notification-prompt-title"
        >
            <div className={`rounded-xl shadow-lg p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <BellIcon className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="ml-3 flex-1">
                        <p id="notification-prompt-title" className="text-sm font-bold">Fique por dentro!</p>
                        <p className="mt-1 text-sm">Ative as notificações para receber atualizações sobre seus grupos, pagamentos e novidades.</p>
                    </div>
                     <div className="ml-4 flex-shrink-0">
                        <button onClick={onDismiss} className={`rounded-md inline-flex focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                            <span className="sr-only">Fechar</span>
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="mt-4 flex space-x-3">
                     <button 
                        onClick={onAllow}
                        className="flex-1 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-purple-700 transition"
                    >
                        Ativar notificações
                    </button>
                     <button 
                        onClick={onDismiss}
                        className="flex-1 bg-transparent text-sm font-bold py-2 px-4 rounded-lg"
                    >
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

export default NotificationPermissionPrompt;
