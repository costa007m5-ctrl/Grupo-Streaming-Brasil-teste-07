import React, { useState, useEffect, useCallback } from 'react';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '../../utils';
import type { TvShow } from '../../types';
import { ArrowLeftIcon, PlayIcon, PlusIcon, SearchIcon, CheckIcon } from '../ui/Icons';

// FIX: Added 'release_date' and 'vote_average' to the TMDBMovie interface to align it with the data structure from the TMDB API and resolve type mismatches with other components.
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

const PRIME_VIDEO_PROVIDER_ID = 119;
const PRIME_VIDEO_NETWORK_ID = 1024;

const Header: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <header className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
        <button onClick={onBack} className="p-1 rounded-full text-white hover:bg-white/20">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png" alt="Prime Video Logo" className="w-28 h-auto"/>
        <SearchIcon className="w-6 h-6 text-white"/>
    </header>
);

const FeaturedBanner: React.FC<{ item: ContentItem; onSelect: () => void; }> = ({ item, onSelect }) => (
    <div className="relative h-96 sm:h-[500px] text-white">
        <img src={`${TMDB_IMAGE_BASE_URL}${item.backdrop_path}`} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E] via-[#0F171E]/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 sm:p-8 w-full sm:w-2/3 lg:w-1/2" style={{paddingBottom: 'clamp(5rem, 15vh, 7rem)'}}>
            <h1 className="text-3xl sm:text-5xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                {'title' in item ? item.title : item.name}
            </h1>
            <p className="text-xs sm:text-sm mt-2 line-clamp-2 text-gray-300" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                {item.overview}
            </p>
            <div className="flex items-center space-x-3 mt-4">
                <button onClick={onSelect} className="flex items-center justify-center space-x-2 bg-white text-black font-bold py-2 px-6 rounded-md hover:bg-gray-200 transition">
                    <PlayIcon className="w-6 h-6"/>
                    <span>Reproduzir</span>
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

interface PrimeVideoScreenProps {
    onBack: () => void;
    onSelectItem: (item: ContentItem) => void;
    myList: number[];
}

const PrimeVideoScreen: React.FC<PrimeVideoScreenProps> = ({ onBack, onSelectItem, myList }) => {
    const [featuredContent, setFeaturedContent] = useState<ContentItem[]>([]);
    const [originals, setOriginals] = useState<TvShow[]>([]);
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
            const originalsEndpoint = `/discover/tv?with_networks=${PRIME_VIDEO_NETWORK_ID}&sort_by=popularity.desc`;
            const topMoviesEndpoint = `/discover/movie?with_watch_providers=${PRIME_VIDEO_PROVIDER_ID}&watch_region=BR&sort_by=popularity.desc`;

            await Promise.all([
                fetchContent(originalsEndpoint, setOriginals),
                fetchContent(topMoviesEndpoint, setTopMovies),
            ]);
            setIsLoading(false);
        };
        fetchAll();
    }, [fetchContent]);

    useEffect(() => {
        const contentForBanner = [...originals, ...topMovies]
            .filter(c => c.backdrop_path)
            // FIX: The 'vote_average' property was missing from the local TMDBMovie type, causing a sort error.
            // This is now resolved by the updated interface.
            .sort((a,b) => (b.vote_average || 0) - (a.vote_average || 0));
        setFeaturedContent(contentForBanner.slice(0, 5));
    }, [originals, topMovies]);

    return (
        <div className="bg-[#0F171E] min-h-screen">
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            <Header onBack={onBack} />
            
            {isLoading || featuredContent.length === 0 ? (
                <div className="h-96 sm:h-[500px] flex items-center justify-center"><div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-400"></div></div>
            ) : (
                <FeaturedBanner item={featuredContent[0]} onSelect={() => onSelectItem(featuredContent[0])} />
            )}
             <main className="pb-10 space-y-8">
                {topMovies.length > 0 && <ContentRow title="Filmes que achamos que você vai gostar" items={topMovies} onSelectItem={onSelectItem} />}
                {originals.length > 0 && <ContentRow title="Séries Amazon Originals e exclusivas" items={originals} onSelectItem={onSelectItem} />}
             </main>
        </div>
    );
};

export default PrimeVideoScreen;
