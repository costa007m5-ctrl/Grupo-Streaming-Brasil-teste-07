import React, { useEffect } from 'react';
import { BellIcon, XMarkIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';

interface ToastProps {
    title: string;
    body: string;
    onClose: () => void;
    onClick?: (data?: any) => void;
    data?: any;
}

const Toast: React.FC<ToastProps> = ({ title, body, onClose, onClick, data }) => {
    const { theme } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-close after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleMainClick = () => {
        if (onClick) {
            onClick(data);
        }
        onClose(); // Always close on click
    };

    return (
        <div 
            className={`fixed top-4 right-4 max-w-sm w-full z-[9999] animate-slide-in-right`}
            role="alert"
            aria-live="assertive"
        >
             <style>{`
                @keyframes slide-in-right {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
                }
            `}</style>
            <button 
                onClick={handleMainClick} 
                className={`w-full text-left rounded-xl shadow-lg p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            >
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <BellIcon className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-bold">{title}</p>
                        <p className="mt-1 text-sm">{body}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onClose(); }} 
                            className={`rounded-md inline-flex focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default Toast;
