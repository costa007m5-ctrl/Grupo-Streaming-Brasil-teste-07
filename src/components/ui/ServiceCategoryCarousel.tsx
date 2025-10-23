import React from 'react';
import type { AvailableService } from '../../types';
import type { ExploreDetailItem } from '../App';
import { DecorativePattern } from './Icons';
import { useTheme } from '../../contexts/ThemeContext';

interface ServiceCategoryCarouselProps {
    title: string;
    services: AvailableService[];
    id?: string;
    onSelectExploreItem: (item: ExploreDetailItem) => void;
}

const ServiceIconCard: React.FC<{ service: AvailableService, onSelect: () => void; }> = ({ service, onSelect }) => {
    const { theme } = useTheme();
    return (
        <button onClick={onSelect} className={`relative flex-shrink-0 flex flex-col items-center justify-between p-4 space-y-2 w-36 h-48 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border`}>
            <DecorativePattern className="absolute inset-0 w-full h-full text-gray-500 opacity-10 group-hover:opacity-20 transition-opacity" />
            <div 
                className="relative w-28 h-28 rounded-2xl flex items-center justify-center p-3 transition-all duration-300"
            >
                <div 
                    className="absolute inset-0 rounded-2xl opacity-10"
                    style={{ backgroundColor: service.bgColor || '#9333ea' }}
                ></div>
                <img src={service.logoUrl} alt={`${service.name} logo`} className="w-full h-full object-contain" />
            </div>
            <p className={`relative font-bold text-sm text-center truncate w-full ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{service.name}</p>
        </button>
    );
};

const ServiceCategoryCarousel: React.FC<ServiceCategoryCarouselProps> = ({ title, services, id, onSelectExploreItem }) => {
    const { theme } = useTheme();
    if (!services || services.length === 0) {
        return null;
    }

    return (
        <section id={id} className="py-4 scroll-mt-24">
            <h2 className={`text-xl font-bold mb-4 px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
            <div className="flex space-x-4 overflow-x-auto pb-6 px-4 -mb-6 scrollbar-hide">
                {services.map((service) => (
                    <ServiceIconCard 
                        key={service.id} 
                        service={service} 
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

export default ServiceCategoryCarousel;