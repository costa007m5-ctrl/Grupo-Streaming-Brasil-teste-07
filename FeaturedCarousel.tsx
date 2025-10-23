import React, { useState, useEffect, useRef } from 'react';
import type { FeaturedContent } from '../types';
import type { ExploreDetailItem } from '../App';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';


interface FeaturedCarouselProps {
    items: FeaturedContent[];
    onSelectExploreItem: (item: ExploreDetailItem) => void;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ items, onSelectExploreItem }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<number | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        if (items.length > 1) { // Only set timeout if there's more than one item
            resetTimeout();
            timeoutRef.current = window.setTimeout(
                () => setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length),
                5000 // Change slide every 5 seconds
            );
        }
        return () => {
            resetTimeout();
        };
    }, [currentIndex, items.length]);


    if (!items || items.length === 0) {
        return (
            <div className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden shadow-lg mx-auto mb-4 bg-gray-200 animate-pulse">
            </div>
        );
    }

    const handlePrev = () => {
        const newIndex = (currentIndex - 1 + items.length) % items.length;
        setCurrentIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = (currentIndex + 1) % items.length;
        setCurrentIndex(newIndex);
    };

    const handleSelect = (item: FeaturedContent) => {
        // FIX: The click on a featured item (which is always a movie) should navigate to the movie detail, not the service detail.
        onSelectExploreItem({ type: 'movie', id: item.id.toString() });
    };

    return (
        <div className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden shadow-lg mx-auto mb-4">
            {/* Slides */}
            {items.map((item, index) => (
                <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    {/* Background Image */}
                    <img src={item.backgroundImageUrl} alt={item.title} className="w-full h-full object-cover" />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 p-5 text-white w-full text-left">
                        <div className="flex items-center space-x-2 mb-1">
                            <img src={item.logoUrl} alt={`${item.serviceName} logo`} className="w-6 h-6 bg-white/20 p-0.5 rounded-md object-contain" />
                            <span className="font-semibold text-sm">{item.serviceName}</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight h-14 overflow-hidden">{item.title}</h2>
                        <p className="text-xs opacity-80 mt-1 h-8 overflow-hidden">{item.description}</p>
                    </div>
                </button>
            ))}

            {/* Navigation Buttons */}
            {items.length > 1 && (
              <>
                <button
                    onClick={handlePrev}
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10"
                    aria-label="Slide anterior"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10"
                    aria-label="Próximo slide"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}


            {/* Pagination Dots */}
            {items.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-6 bg-white' : 'bg-white/50'}`}
                            aria-label={`Ir para o slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeaturedCarousel;