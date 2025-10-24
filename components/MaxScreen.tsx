import React, { useState, useEffect, useCallback } from 'react';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '../constants';
import type { TvShow } from '../types';
import { ArrowLeftIcon, PlayIcon, InformationCircleIcon, SearchIcon } from './Icons';

// FIX: Added 'release_date' and 'vote_average' to the TMDBMovie interface to align it with the data being fetched from the TMDB API and resolve type mismatches with parent components.
interface TMDBMovie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path?: string;
    overview: string;
    release_date: string;
    vote_average: number;
}

type ContentItem = TMDBMovie | TvShow;

const MAX_PROVIDER_ID = 384;
const HBO_NETWORK_ID = 49;

const Header: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <header className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
        <button onClick={onBack} className="p-1 rounded-full text-white hover:bg-white/20">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <svg className="w-16 h-auto" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10 V 40 L 30 25 L 50 40 V 10 L 30 25 Z" fill="url(#grad1_max)"/>
            <path d="M60 10 H 75 V 25 H 85 V 10 H 100 V 40 H 85 V 25 H 75 V 40 H 60 Z" fill="url(#grad1_max)"/>
            <path d="M110 10 L 125 40 L 140 10 H 125 Z M 118 25 H 132" stroke="url(#grad1_max)" strokeWidth="4" fill="none"/>
        </svg>
        <SearchIcon className="w-6 h-6 text-white"/>
    </header>
);

const FeaturedBanner: React.FC<{ item: ContentItem; onSelect: () => void; }> = ({ item, onSelect }) => (
    <div className="relative h-[60vh] text-white">
        <img src={`${TMDB_IMAGE_BASE_URL}${item.backdrop_path}`} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10081C] via-transparent to-black/60"></div>
        <div className="absolute bottom-0 left-0 p-4 sm:p-8 w-full sm:w-2/3 lg:w-1/2" style={{paddingBottom: 'clamp(3rem, 10vh, 5rem)'}}>
            <h1 className="text-3xl sm:text-5xl font-extrabold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                {'title' in item ? item.title : item.name}
            </h1>
            <div className="flex items-center space-x-3 mt-4">
                <button onClick={onSelect} className="flex items-center justify-center space-x-2 bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition">
                    <PlayIcon className="w-6 h-6"/>
                    <span>Reproduzir</span>
                </button>
                 <button onClick={onSelect} className="flex items-center justify-center space-x-2 bg-white/20 text-white font-bold py-2 px-6 rounded-full hover:bg-white/30 transition backdrop-blur-sm">
                    <InformationCircleIcon className="w-6 h-6"/>
                    <span>Mais Informações</span>
                </button>
            </div>
        </div>
    </div>
);

const ContentRow: React.FC<{ title: string; items: ContentItem[]; onSelectItem: (item: ContentItem) => void; }> = ({ title, items, onSelectItem }) => (
    <section className="py-4">
        <h2 className="text-xl font-bold text-white mb-3 px-4 sm:px-8">{title}</h2>
        <div className="flex overflow-x-auto pb-4 px-4 sm:px-8 -mb-4 scrollbar-hide space-x-3">
            {items.map(item => (
                <button key={item.id} onClick={() => onSelectItem(item)} className="flex-shrink-0 w-36 h-52 rounded-md overflow-hidden bg-gray-800 transition-transform duration-300 hover:scale-105 hover:z-10">
                    <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${item.poster_path}`} alt={'title' in item ? item.title : item.name} className="w-full h-full object-cover" />
                </button>
            ))}
        </div>
    </section>
);

interface MaxScreenProps {
    onBack: () => void;
    onSelectItem: (item: ContentItem) => void;
    myList: number[];
}

const MaxScreen: React.FC<MaxScreenProps> = ({ onBack, onSelectItem, myList }) => {
    const [featuredContent, setFeaturedContent] = useState<ContentItem | null>(null);
    const [hboOriginals, setHboOriginals] = useState<TvShow[]>([]);
    const [topMovies, setTopMovies] = useState<TMDBMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchContent = useCallback(async (endpoint: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        try {
            const response = await fetch(`${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}&language=pt-BR`);
            const data = await response.json();
            setter(data.results.filter((i: any) => i.poster_path));
        } catch (e) {
            console.error(`Failed to fetch ${endpoint}:`, e);
        }
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            const hboEndpoint = `/discover/tv?with_networks=${HBO_NETWORK_ID}&sort_by=popularity.desc`;
            const moviesEndpoint = `/discover/movie?with_watch_providers=${MAX_PROVIDER_ID}&watch_region=BR&sort_by=popularity.desc`;

            await Promise.all([
                fetchContent(hboEndpoint, setHboOriginals),
                fetchContent(moviesEndpoint, (data: any[]) => {
                    setTopMovies(data);
                    const validBanner = data.find(item => item.backdrop_path);
                    setFeaturedContent(validBanner);
                }),
            ]);
            setIsLoading(false);
        };
        fetchAll();
    }, [fetchContent]);

    return (
        <div className="bg-[#10081C] min-h-screen">
             <svg width="0" height="0" className="absolute">
                <defs>
                    <radialGradient id="grad1_max" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" style={{stopColor: '#D8B4FE', stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor: '#6B21A8', stopOpacity:1}} />
                    </radialGradient>
                </defs>
            </svg>
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            <Header onBack={onBack} />
            
            {isLoading || !featuredContent ? (
                <div className="h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-400"></div></div>
            ) : (
                <FeaturedBanner item={featuredContent} onSelect={() => onSelectItem(featuredContent)} />
            )}
             <main className="pb-10 space-y-8">
                {topMovies.length > 0 && <ContentRow title="Filmes Populares na Max" items={topMovies} onSelectItem={onSelectItem} />}
                {hboOriginals.length > 0 && <ContentRow title="Séries Originais HBO" items={hboOriginals} onSelectItem={onSelectItem} />}
             </main>
        </div>
    );
};

export default MaxScreen;
