
import React, { useState, useEffect, useCallback, useMemo } from 'react';
// FIX: Corrected typo in imported constant name from TMDB_API_key to TMDB_API_KEY.
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '../../utils';
import type { TvShow } from '../../types';
import { ArrowLeftIcon, PlayIcon, InformationCircleIcon, SearchIcon, XMarkIcon } from '../ui/Icons';

// Local types to match TMDB API response
interface TMDBMovie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    overview: string;
    release_date: string;
}

type ContentItem = TMDBMovie | TvShow;

const NETFLIX_NETWORK_ID = 213;
const NETFLIX_PROVIDER_ID = 8; // Provider ID for Netflix on TMDB

const NetflixHeader: React.FC<{ 
    onBack: () => void;
    isSearching: boolean;
    onSearchToggle: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}> = ({ onBack, isSearching, onSearchToggle, searchQuery, onSearchChange }) => (
    <header className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent transition-all duration-300">
        {isSearching ? (
            <div className="flex items-center space-x-2 w-full">
                <SearchIcon className="w-6 h-6 text-gray-300" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Buscar títulos, gêneros..."
                    className="flex-1 bg-transparent border-b-2 border-white/50 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                    autoFocus
                />
                <button onClick={onSearchToggle} className="p-1 rounded-full text-white hover:bg-white/20">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
        ) : (
            <>
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="p-1 rounded-full text-white hover:bg-white/20">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.0002 0.400391V31.6004H14.7302V13.7504L8.91016 31.6004H2.61016V0.400391H8.88016V18.2504L14.7002 0.400391H21.0002Z" fill="#E50914"/>
                    </svg>
                </div>
                <button onClick={onSearchToggle} className="p-1 rounded-full text-white hover:bg-white/20">
                    <SearchIcon className="w-6 h-6" />
                </button>
            </>
        )}
    </header>
);

const FeaturedBanner: React.FC<{ item: ContentItem; onSelect: () => void; }> = ({ item, onSelect }) => (
    <div className="relative h-96 sm:h-[500px] text-white w-full">
        <img src={`${TMDB_IMAGE_BASE_URL}${('backdrop_path' in item && item.backdrop_path) ? item.backdrop_path : item.poster_path}`} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/60"></div>
        <div className="absolute bottom-0 left-0 p-4 sm:p-8 w-full sm:w-2/3 lg:w-1/2" style={{paddingBottom: 'clamp(5rem, 15vh, 7rem)'}}>
            <h1 className="text-3xl sm:text-5xl font-extrabold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                {'title' in item ? item.title : item.name}
            </h1>
            <p className="text-xs sm:text-sm mt-2 line-clamp-3" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                {'overview' in item && item.overview ? item.overview : 'Sem sinopse disponível.'}
            </p>
            <div className="flex items-center space-x-3 mt-4">
                <button onClick={onSelect} className="flex items-center justify-center space-x-2 bg-white text-black font-bold py-2 px-6 rounded-md hover:bg-gray-200 transition">
                    <PlayIcon className="w-6 h-6"/>
                    <span>Assistir</span>
                </button>
                 <button onClick={onSelect} className="flex items-center justify-center space-x-2 bg-white/30 text-white font-bold py-2 px-6 rounded-md hover:bg-white/40 transition backdrop-blur-sm">
                    <InformationCircleIcon className="w-6 h-6"/>
                    <span>Mais info</span>
                </button>
            </div>
        </div>
    </div>
);

const RotatingFeaturedBanner: React.FC<{ items: ContentItem[]; onSelect: (item: ContentItem) => void; }> = ({ items, onSelect }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length);
        }, 7000); // Rotação a cada 7 segundos
        return () => clearInterval(interval);
    }, [items.length]);

    if (items.length === 0) return <div className="h-96 sm:h-[500px] bg-gray-900 animate-pulse"></div>;

    return (
        <div className="relative h-96 sm:h-[500px] text-white">
            {items.map((item, index) => (
                <div key={item.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <FeaturedBanner item={item} onSelect={() => onSelect(item)} />
                </div>
            ))}
        </div>
    );
};

const ContentPosterCard: React.FC<{ item: ContentItem; onSelect: () => void }> = ({ item, onSelect }) => (
    <button onClick={onSelect} className="flex-shrink-0 w-36 h-52 rounded-md overflow-hidden bg-gray-800 transition-transform duration-300 hover:scale-110 hover:z-20 z-10">
        <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${item.poster_path}`} alt={'title' in item ? item.title : item.name} className="w-full h-full object-cover" />
    </button>
);

const ContentRow: React.FC<{ title: string; items: ContentItem[]; onSelectItem: (item: ContentItem) => void; isTop10?: boolean }> = ({ title, items, onSelectItem, isTop10 }) => (
    <section className="py-4">
        <h2 className="text-xl font-bold text-white mb-3 px-4 sm:px-8">{title}</h2>
        <div className={`flex overflow-x-auto pb-4 px-4 sm:px-8 -mb-4 scrollbar-hide ${isTop10 ? 'space-x-8' : 'space-x-2 sm:space-x-4'}`}>
            {items.map((item, index) => (
                 <div key={item.id} className="flex-shrink-0 group relative">
                    {isTop10 && (
                        <span 
                            className="absolute -left-10 bottom-[-20px] font-black text-[160px] leading-none text-[#141414] z-0" 
                            style={{ WebkitTextStroke: '4px #808080' }}
                        >
                            {index + 1}
                        </span>
                    )}
                    <button onClick={() => onSelectItem(item)} className={`relative ${isTop10 ? 'w-32 h-48' : 'w-36 h-52'} rounded-md overflow-hidden bg-gray-800 transition-transform duration-300 group-hover:scale-110 group-hover:z-20 z-10`}>
                        <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${item.poster_path}`} alt={'title' in item ? item.title : item.name} className="w-full h-full object-cover" />
                    </button>
                </div>
            ))}
        </div>
    </section>
);

interface NetflixScreenProps {
    onBack: () => void;
    onSelectItem: (item: ContentItem) => void;
    myList: number[];
    onViewAllGroups: () => void;
}


const NetflixScreen: React.FC<NetflixScreenProps> = ({ onBack, onSelectItem, myList, onViewAllGroups }) => {
    const [featuredContent, setFeaturedContent] = useState<ContentItem[]>([]);
    const [top10Movies, setTop10Movies] = useState<TMDBMovie[]>([]);
    const [top10Series, setTop10Series] = useState<TvShow[]>([]);
    const [originals, setOriginals] = useState<TvShow[]>([]);
    const [trending, setTrending] = useState<ContentItem[]>([]);
    const [actionMovies, setActionMovies] = useState<TMDBMovie[]>([]);
    const [comedyMovies, setComedyMovies] = useState<TMDBMovie[]>([]);
    const [horrorMovies, setHorrorMovies] = useState<TMDBMovie[]>([]);
    const [romanceMovies, setRomanceMovies] = useState<TMDBMovie[]>([]);
    const [documentaries, setDocumentaries] = useState<TMDBMovie[]>([]);
    const [scifiMovies, setScifiMovies] = useState<TMDBMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Search state
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    
    // My List state
    const [myListItems, setMyListItems] = useState<ContentItem[]>([]);

    const fetchContent = useCallback(async (endpoint: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
        try {
            const response = await fetch(`${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}&language=pt-BR`);
            const data = await response.json();
            setter(data.results.filter((i: any) => i.poster_path));
        } catch (e) {
            console.error(`Failed to fetch ${endpoint}:`, e);
        }
    }, []);
    
    // Fetch My List items
    useEffect(() => {
        const fetchMyListItems = async () => {
            if (myList.length === 0) {
                setMyListItems([]);
                return;
            }
            const items = await Promise.all(
                myList.map(async (id) => {
                    try {
                        const movieRes = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`);
                        if(movieRes.ok) return movieRes.json();
                        const tvRes = await fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`);
                        if(tvRes.ok) return tvRes.json();
                        return null;
                    } catch {
                        return null;
                    }
                })
            );
            setMyListItems(items.filter(Boolean) as ContentItem[]);
        };
        fetchMyListItems();
    }, [myList]);

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchContent(`/discover/tv?with_networks=${NETFLIX_NETWORK_ID}&sort_by=popularity.desc`, setOriginals),
                fetchContent(`/discover/movie?with_watch_providers=${NETFLIX_PROVIDER_ID}&watch_region=BR&sort_by=popularity.desc`, setTop10Movies),
                fetchContent(`/discover/tv?with_watch_providers=${NETFLIX_PROVIDER_ID}&watch_region=BR&sort_by=popularity.desc`, setTop10Series),
                fetchContent(`/trending/all/week?`, setTrending),
                fetchContent(`/discover/movie?with_watch_providers=${NETFLIX_PROVIDER_ID}&watch_region=BR&with_genres=28`, setActionMovies),
                fetchContent(`/discover/movie?with_watch_providers=${NETFLIX_PROVIDER_ID}&watch_region=BR&with_genres=35`, setComedyMovies),
                fetchContent(`/discover/movie?with_watch_providers=${NETFLIX_PROVIDER_ID}&watch_region=BR&with_genres=27`, setHorrorMovies),
                fetchContent(`/discover/movie?with_watch_providers=${NETFLIX_PROVIDER_ID}&watch_region=BR&with_genres=10749`, setRomanceMovies),
                fetchContent(`/discover/movie?with_watch_providers=${NETFLIX_PROVIDER_ID}&watch_region=BR&with_genres=99`, setDocumentaries),
                fetchContent(`/discover/movie?with_watch_providers=${NETFLIX_PROVIDER_ID}&watch_region=BR&with_genres=878`, setScifiMovies),
            ]);
            setIsLoading(false);
        };
        fetchAll();
    }, [fetchContent]);
    
    // Search effect
    useEffect(() => {
        if (!isSearching) {
            setSearchQuery('');
            setSearchResults([]);
            return;
        }
        const handler = setTimeout(async () => {
            if (searchQuery.trim() === '') {
                setSearchResults([]);
                return;
            }
            setIsSearchLoading(true);
            try {
                const response = await fetch(`${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(searchQuery)}&api_key=${TMDB_API_KEY}&language=pt-BR`);
                const data = await response.json();
                const validResults = data.results.filter((r: any) => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path);
                setSearchResults(validResults);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery, isSearching]);

    useEffect(() => {
        let contentForBanner: ContentItem[] = [];
        if (originals.length > 0) {
            contentForBanner = originals.slice(0, 5);
        } else if (top10Movies.length > 0) {
            contentForBanner = top10Movies.slice(0, 5);
        }
        setFeaturedContent(contentForBanner.filter(c => c.backdrop_path));
    }, [originals, top10Movies]);

    return (
        <div className="bg-[#141414] min-h-screen">
             <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            <NetflixHeader 
                onBack={onBack} 
                isSearching={isSearching}
                onSearchToggle={() => setIsSearching(!isSearching)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            {isSearching ? (
                <main className="pt-24 px-4 sm:px-8 pb-10">
                    {isSearchLoading ? (
                        <div className="flex justify-center"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-red-600"></div></div>
                    ) : searchResults.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4">
                            {searchResults.map(item => <ContentPosterCard key={item.id} item={item} onSelect={() => onSelectItem(item)} />)}
                        </div>
                    ) : searchQuery && !isSearchLoading ? (
                        <p className="text-center text-gray-400">Nenhum resultado para "{searchQuery}"</p>
                    ) : null}
                </main>
            ) : (
                <>
                    {isLoading ? (
                        <div className="h-96 sm:h-[500px] flex items-center justify-center"><div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-red-600"></div></div>
                    ) : (
                        <RotatingFeaturedBanner items={featuredContent} onSelect={onSelectItem} />
                    )}
                    <main className="pb-10 relative z-10 space-y-4" style={{marginTop: '-7rem'}}>
                        {myListItems.length > 0 && <ContentRow title="Minha Lista" items={myListItems} onSelectItem={onSelectItem} />}
                        {trending.length > 0 && <ContentRow title="Em alta" items={trending} onSelectItem={onSelectItem} />}
                        {top10Movies.length > 0 && <ContentRow title="Top 10 Filmes na Netflix Brasil" items={top10Movies.slice(0,10)} onSelectItem={onSelectItem} isTop10 />}
                        {originals.length > 0 && <ContentRow title="Originais Netflix" items={originals} onSelectItem={onSelectItem} />}
                        {top10Series.length > 0 && <ContentRow title="Top 10 Séries na Netflix Brasil" items={top10Series.slice(0,10)} onSelectItem={onSelectItem} isTop10 />}
                        {actionMovies.length > 0 && <ContentRow title="Ação e Aventura" items={actionMovies} onSelectItem={onSelectItem} />}
                        {comedyMovies.length > 0 && <ContentRow title="Comédias" items={comedyMovies} onSelectItem={onSelectItem} />}
                        {horrorMovies.length > 0 && <ContentRow title="Filmes de Terror" items={horrorMovies} onSelectItem={onSelectItem} />}
                        {romanceMovies.length > 0 && <ContentRow title="Romance" items={romanceMovies} onSelectItem={onSelectItem} />}
                        {scifiMovies.length > 0 && <ContentRow title="Ficção Científica" items={scifiMovies} onSelectItem={onSelectItem} />}
                        {documentaries.length > 0 && <ContentRow title="Documentários" items={documentaries} onSelectItem={onSelectItem} />}
                    </main>
                </>
            )}
        </div>
    );
};

export default NetflixScreen;
