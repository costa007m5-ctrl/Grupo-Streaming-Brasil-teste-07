import React from 'react';
import type { AvailableService } from '../../types';

interface ProviderLoadingScreenProps {
    service: AvailableService;
}

const ProviderLoadingScreen: React.FC<ProviderLoadingScreenProps> = ({ service }) => {
    const bgColor = service.bgColor || '#141414'; // Default to a dark gray if no color is provided

    return (
        <div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500"
            style={{ backgroundColor: bgColor }}
        >
            <style>
                {`
                @keyframes pulse-grow {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.9;
                    }
                }
                .animate-pulse-grow {
                    animation: pulse-grow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                `}
            </style>
            <div className="w-40 h-40 animate-pulse-grow">
                <img 
                    src={service.logoUrl} 
                    alt={`${service.name} logo`} 
                    className="w-full h-full object-contain"
                />
            </div>
            <p className="mt-6 text-white/80 font-semibold text-lg animate-pulse">
                Carregando conteúdo...
            </p>
        </div>
    );
};

export default ProviderLoadingScreen;