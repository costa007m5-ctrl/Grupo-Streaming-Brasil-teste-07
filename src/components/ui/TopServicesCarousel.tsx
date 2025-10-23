import React from 'react';
import type { AvailableService } from '../../types';
import type { ExploreDetailItem } from '../App';
import { useTheme } from '../../contexts/ThemeContext';


interface TopServicesCarouselProps {
    services: AvailableService[];
    onSelectExploreItem: (item: ExploreDetailItem) => void;
}

const TopServiceCard: React.FC<{ service: AvailableService, rank: number, onSelect: () => void }> = ({ service, rank, onSelect }) => {
    const { theme } = useTheme();
    return (
        <button onClick={onSelect} className={`relative flex-shrink-0 w-44 h-56 rounded-3xl shadow-2xl overflow-hidden p-6 flex flex-col justify-center items-center group transition-transform duration-300 hover:-translate-y-2 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-white border border-gray-200'}`}>
            <span 
                className={`absolute top-0 right-0 text-[160px] font-black -mt-8 -mr-8 transition-transform duration-300 group-hover:scale-110 ${theme === 'dark' ? 'text-white/10' : 'text-gray-900/5'}`}
                style={{ lineHeight: 1 }}
            >
                {rank}
            </span>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div 
                    className={`w-24 h-24 rounded-full flex items-center justify-center p-3 backdrop-blur-sm shadow-lg ${theme === 'dark' ? 'bg-white/10 border border-white/20' : 'bg-gray-100 border border-gray-200/50'}`}
                >
                    <img src={service.logoUrl} alt={`${service.name} logo`} className="w-full h-full object-contain" />
                </div>
                <p className={`font-bold text-base truncate w-full ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{service.name}</p>
            </div>
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${service.bgColor || '#9333ea'} 0%, transparent 70%)`
                }}
            ></div>
        </button>
    );
};


const TopServicesCarousel: React.FC<TopServicesCarouselProps> = ({ services, onSelectExploreItem }) => {
    const { theme } = useTheme();
    return (
        <section className={`py-8 mt-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50 border-y border-gray-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Top 5 Mais Usados no Brasil</h2>
            <div className="flex space-x-6 overflow-x-auto pb-4 px-4 -mb-4 scrollbar-hide">
                {services.map((service, index) => (
                    <TopServiceCard 
                        key={service.id} 
                        service={service} 
                        rank={index + 1}
                        onSelect={() => onSelectExploreItem({ type: 'service', id: service.id })}
                    />
                ))}
                <div className="flex-shrink-0 w-1"></div>
            </div>
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default TopServicesCarousel;