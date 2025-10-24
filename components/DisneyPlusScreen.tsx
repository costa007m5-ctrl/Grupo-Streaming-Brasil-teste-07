import React, { useState, useEffect, useCallback } from 'react';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '../constants';
import type { TvShow, Brand } from '../types';
import { ArrowLeftIcon, SearchIcon, XMarkIcon, PlayIcon, InformationCircleIcon } from './Icons';

interface TMDBMovie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path?: string;
    vote_average: number;
    overview: string;
    release_date: string;
}

type ContentItem = TMDBMovie | TvShow;

const DISNEY_PROVIDER_ID = 337;

const Header: React.FC<{ 
    onBack: () => void;
    isSearching: boolean;
    onSearchToggle: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}> = ({ onBack, isSearching, onSearchToggle, searchQuery, onSearchChange }) => {
    
    const handleBackAction = () => {
        if (isSearching) {
            onSearchToggle();
        } else {
            onBack();
        }
    };

    return (
        <header className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent transition-all duration-300">
             <button onClick={handleBackAction} className="p-1 rounded-full text-white hover:bg-white/20">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            
            {isSearching ? (
                <div className="flex items-center space-x-2 flex-grow mx-4">
                    <SearchIcon className="w-5 h-5 text-gray-300" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar títulos, personagens..."
                        className="flex-1 bg-transparent border-b-2 border-white/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                        autoFocus
                    />
                </div>
            ) : (
                 <img src="https://logodownload.org/wp-content/uploads/2020/11/disney-plus-logo-1.png" alt="Disney+ Logo" className="w-24 h-auto" />
            )}

            <div className="flex items-center space-x-4">
                <button onClick={onSearchToggle} className="p-1 rounded-full text-white hover:bg-white/20">
                    {isSearching ? <XMarkIcon className="w-6 h-6" /> : <SearchIcon className="w-6 h-6" />}
                </button>
                {!isSearching && (
                    <div className="relative">
                        <img src="https://img.icons8.com/color/96/yoda.png" alt="Profile" className="w-8 h-8 rounded-full"/>
                        <img src="https://logospng.org/download/star-plus/logo-star-plus-icon-1024.png" alt="Star+ mini logo" className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full p-0.5" />
                    </div>
                )}
            </div>
        </header>
    );
};

const BrandCard: React.FC<{ brand: Brand, onSelect: () => void }> = ({ brand, onSelect }) => {
    const { name, logo, video } = brand;
    const [isHovered, setIsHovered] = useState(false);
    return (
        <button 
            onClick={onSelect}
            className="relative aspect-video rounded-lg shadow-lg overflow-hidden border-2 border-[hsla(0,0%,100%,.1)] bg-gradient-to-b from-gray-800 to-gray-900 hover:border-white transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={logo} alt={name} className={`absolute inset-0 w-full h-full object-contain p-4 z-10 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />
            <video
                src={video}
                autoPlay
                loop
                muted
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
        </button>
    );
};

const ContentRow: React.FC<{ title: string; items: ContentItem[]; onSelectItem: (item: ContentItem) => void; isTop10?: boolean }> = ({ title, items, onSelectItem, isTop10 }) => (
    <section className="py-4">
        <h2 className="text-xl font-bold text-white mb-3 px-4 sm:px-8">{title}</h2>
        <div className={`flex overflow-x-auto pb-4 px-4 sm:px-8 -mb-4 scrollbar-hide ${isTop10 ? 'space-x-8' : 'space-x-3'}`}>
            {items.map((item, index) => (
                 <div key={item.id} className="flex-shrink-0 group relative">
                    {isTop10 && (
                        <span 
                            className="absolute -left-10 bottom-[-20px] font-black text-[160px] leading-none text-[#040714] z-0" 
                            style={{ WebkitTextStroke: '4px #334155' }}
                        >
                            {index + 1}
                        </span>
                    )}
                    <button onClick={() => onSelectItem(item)} className={`relative ${isTop10 ? 'w-32 h-48' : 'w-36 h-52'} rounded-md overflow-hidden bg-gray-800 transition-transform duration-300 group-hover:scale-105 group-hover:z-20 z-10`}>
                        <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${item.poster_path}`} alt={'title' in item ? item.title : item.name} className="w-full h-full object-cover" />
                    </button>
                </div>
            ))}
        </div>
    </section>
);

const brands: Brand[] = [
    { name: 'Disney', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/1024px-Disney%2B_logo.svg.png', video: 'https://vod-bgc-eu-west-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564674844-disney.mp4', tmdb: { type: 'company', id: 2 } },
    { name: 'Pixar', logo: 'https://www.freelogovectors.net/wp-content/uploads/2023/10/pixar-logo-freelogovectors.net_.png', video: 'https://vod-bgc-eu-west-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564676714-pixar.mp4', tmdb: { type: 'company', id: 3 } },
    { name: 'Marvel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1024px-Marvel_Logo.svg.png', video: 'https://vod-bgc-eu-west-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564676115-marvel.mp4', tmdb: { type: 'company', id: 420 } },
    { name: 'Star Wars', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/1024px-Star_Wars_Logo.svg.png', video: 'https://vod-bgc-eu-west-1.media.dssott.com/bgui/ps01/disney/bgui/2020/12/17/1608229455-star-wars.mp4', tmdb: { type: 'keyword', id: 833 } },
    { name: 'National Geographic', logo: 'https://logo.com/image-cdn/images/kts928pd/production/3b42730e3a8384f0f176eb8822b4e12aa09715ad-1600x900.png?w=1200&q=72&fm=webp', video: 'https://vod-bgc-eu-west-1.media.dssott.com/bgui/ps01/disney/bgui/2019/08/01/1564676391-national-geographic.mp4', tmdb: { type: 'company', id: 7521 } },
    { name: 'Star', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Hulu_logo_%282018%29.svg/1024px-Hulu_logo_%282018%29.svg.png', video: 'https://www.dropbox.com/scl/fi/vfxzwwk4v571k09252sly/hulu.mp4?rlkey=2woq9qr7acb9dt5fyhvl5g8lg&raw=1', tmdb: { type: 'provider', id: 257 } }, // Hulu provider ID
];

const FeaturedBanner: React.FC<{ item: ContentItem; onSelect: () => void; }> = ({ item, onSelect }) => (
    <div className="relative h-full text-white w-full">
        <img src={`${TMDB_IMAGE_BASE_URL}${('backdrop_path' in item && item.backdrop_path) ? item.backdrop_path : item.poster_path}`} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-transparent to-black/60"></div>
        <div className="absolute bottom-0 left-0 p-4 sm:p-8 w-full sm:w-2/3 lg:w-1/2" style={{paddingBottom: 'clamp(5rem, 15vh, 7rem)'}}>
            <h1 className="text-3xl sm:text-5xl font-extrabold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                {'title' in item ? item.title : item.name}
            </h1>
            <div className="flex items-center space-x-3 mt-4">
                <button onClick={onSelect} className="flex items-center justify-center space-x-2 bg-gray-200 text-black font-bold py-2 px-6 rounded-md hover:bg-gray-300 transition">
                    <PlayIcon className="w-6 h-6"/>
                    <span>Assistir</span>
                </button>
                 <button onClick={onSelect} className="flex items-center justify-center space-x-2 bg-white/20 text-white font-bold py-2 px-6 rounded-md hover:bg-white/30 transition backdrop-blur-sm">
                    <InformationCircleIcon className="w-6 h-6"/>
                    <span>Mais info</span>
                </button>
            </div>
        </div>
    </div>
);

const RotatingFeaturedBanner: React.FC<{ items: ContentItem[]; onSelectItem: (item: ContentItem) => void; }> = ({ items, onSelectItem }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length);
        }, 5000); // Change every 5 seconds
        return () => clearInterval(interval);
    }, [items.length]);

    if (items.length === 0) return null;

    return (
        <div className="relative h-[50vh] text-white">
            {items.map((item, index) => (
                <div key={item.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <FeaturedBanner item={item} onSelect={() => onSelectItem(item)} />
                </div>
            ))}
        </div>
    );
};

interface DisneyPlusScreenProps {
    onBack: () => void;
    onSelectItem: (item: ContentItem) => void;
    onSelectBrand: (brand: Brand) => void;
}

const DisneyPlusScreen: React.FC<DisneyPlusScreenProps> = ({ onBack, onSelectItem, onSelectBrand }) => {
    const [featuredContent, setFeaturedContent] = useState<ContentItem[]>([]);
    const [trending, setTrending] = useState<ContentItem[]>([]);
    const [newReleases, setNewReleases] = useState<ContentItem[]>([]);
    const [top10Movies, setTop10Movies] = useState<TMDBMovie[]>([]);
    const [top10Series, setTop10Series] = useState<TvShow[]>([]);
    const [pixar, setPixar] = useState<TMDBMovie[]>([]);
    const [marvel, setMarvel] = useState<TMDBMovie[]>([]);
    const [starWars, setStarWars] = useState<TMDBMovie[]>([]);
    const [natGeo, setNatGeo] = useState<TMDBMovie[]>([]);
    const [disneyOriginals, setDisneyOriginals] = useState<TvShow[]>([]);
    const [animations, setAnimations] = useState<TMDBMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Search State
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const fetchContent = useCallback(async (endpoint: string, setter: React.Dispatch<React.SetStateAction<any[]>>, limit: number = 20) => {
        try {
            const response = await fetch(`${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}&language=pt-BR`);
            const data = await response.json();
            setter(data.results.filter((i: any) => i.poster_path).slice(0, limit));
        } catch (e) {
            console.error(`Failed to fetch ${endpoint}:`, e);
        }
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            const discoverMovie = `/discover/movie?with_watch_providers=${DISNEY_PROVIDER_ID}&watch_region=BR`;
            const discoverTv = `/discover/tv?with_watch_providers=${DISNEY_PROVIDER_ID}&watch_region=BR`;
            const newReleasesEndpoint = `${discoverMovie}&primary_release_date.gte=${new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0]}`;

            const [trendingData] = await Promise.all([
                fetch(`${TMDB_BASE_URL}${discoverMovie}&sort_by=popularity.desc&api_key=${TMDB_API_KEY}&language=pt-BR`).then(res => res.json()),
                fetchContent(newReleasesEndpoint, setNewReleases),
                fetchContent(`${discoverMovie}&sort_by=vote_average.desc&vote_count.gte=1000`, setTop10Movies, 10),
                fetchContent(`${discoverTv}&sort_by=vote_average.desc&vote_count.gte=500`, setTop10Series, 10),
                fetchContent(`${discoverMovie}&with_companies=3&sort_by=popularity.desc`, setPixar),
                fetchContent(`${discoverMovie}&with_companies=420&sort_by=popularity.desc`, setMarvel),
                fetchContent(`${discoverMovie}&with_keywords=833&sort_by=popularity.desc`, setStarWars),
                fetchContent(`${discoverMovie}&with_companies=7521&sort_by=popularity.desc`, setNatGeo),
                fetchContent(`/discover/tv?with_networks=2739&sort_by=popularity.desc`, setDisneyOriginals),
                fetchContent(`${discoverMovie}&with_genres=16&sort_by=popularity.desc`, setAnimations),
            ]);
            
            const validBannerItems = trendingData.results.filter((item: any) => item.backdrop_path).slice(0, 5);
            setFeaturedContent(validBannerItems);
            setTrending(trendingData.results.filter((item: any) => item.poster_path));
            
            setIsLoading(false);
        };
        fetchAll();
    }, [fetchContent]);

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
                const searchPromises = [
                    fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(searchQuery)}&api_key=${TMDB_API_KEY}&language=pt-BR`),
                    fetch(`${TMDB_BASE_URL}/search/tv?query=${encodeURIComponent(searchQuery)}&api_key=${TMDB_API_KEY}&language=pt-BR`)
                ];
                const [movieRes, tvRes] = await Promise.all(searchPromises);
                const movieData = await movieRes.json();
                const tvData = await tvRes.json();
                const combined = [...movieData.results, ...tvData.results];
                
                const providerPromises = combined.map(item => 
                    fetch(`${TMDB_BASE_URL}/${'title' in item ? 'movie' : 'tv'}/${item.id}/watch/providers?api_key=${TMDB_API_KEY}`)
                        .then(res => res.json())
                );
                const providerResults = await Promise.all(providerPromises);

                const disneyContent = combined.filter((item, index) => {
                    const providers = providerResults[index]?.results?.BR?.flatrate || [];
                    return providers.some((p: any) => p.provider_id === DISNEY_PROVIDER_ID);
                });

                setSearchResults(disneyContent.filter((r: any) => r.poster_path));

            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearchLoading(false);
            }
        }, 500); // Debounce search

        return () => clearTimeout(handler);
    }, [searchQuery, isSearching]);
    
    const handleSearchToggle = () => {
        setIsSearching(!isSearching);
    };

    return (
        <div className="bg-[#040714] min-h-screen">
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            <Header onBack={onBack} isSearching={isSearching} onSearchToggle={handleSearchToggle} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            
            {isSearching ? (
                 <main className="pt-24 px-4 sm:px-8 pb-10">
                    {isSearchLoading ? (
                        <div className="flex justify-center"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-400"></div></div>
                    ) : searchResults.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                           {searchResults.map(item => (
                                <button key={item.id} onClick={() => onSelectItem(item)} className="group">
                                    <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${item.poster_path}`} alt={'title' in item ? item.title : item.name} className="w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105" />
                                </button>
                           ))}
                        </div>
                    ) : searchQuery && !isSearchLoading ? (
                        <p className="text-center text-gray-400">Nenhum resultado para "{searchQuery}"</p>
                    ) : null}
                </main>
            ) : (
                <>
                    {isLoading || featuredContent.length === 0 ? (
                        <div className="h-[50vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-400"></div></div>
                    ) : (
                        <RotatingFeaturedBanner items={featuredContent} onSelectItem={onSelectItem} />
                    )}
                    <main className="pb-10 relative z-10 space-y-8" style={{ marginTop: '-15vh' }}>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 px-4 sm:px-8">
                            {brands.map(brand => <BrandCard key={brand.name} brand={brand} onSelect={() => onSelectBrand(brand)} />)}
                        </div>
                        {newReleases.length > 0 && <ContentRow title="Novidades no Disney+" items={newReleases} onSelectItem={onSelectItem} />}
                        {top10Movies.length > 0 && <ContentRow title="Top 10 Filmes no Brasil" items={top10Movies} onSelectItem={onSelectItem} isTop10 />}
                        {top10Series.length > 0 && <ContentRow title="Top 10 Séries no Brasil" items={top10Series} onSelectItem={onSelectItem} isTop10 />}
                        {trending.length > 0 && <ContentRow title="Em alta" items={trending} onSelectItem={onSelectItem} />}
                        {disneyOriginals.length > 0 && <ContentRow title="Originais Disney+" items={disneyOriginals} onSelectItem={onSelectItem} />}
                        {pixar.length > 0 && <ContentRow title="Pixar" items={pixar} onSelectItem={onSelectItem} />}
                        {marvel.length > 0 && <ContentRow title="Marvel" items={marvel} onSelectItem={onSelectItem} />}
                        {starWars.length > 0 && <ContentRow title="Star Wars" items={starWars} onSelectItem={onSelectItem} />}
                        {natGeo.length > 0 && <ContentRow title="National Geographic" items={natGeo} onSelectItem={onSelectItem} />}
                        {animations.length > 0 && <ContentRow title="Animações" items={animations} onSelectItem={onSelectItem} />}
                    </main>
                </>
            )}
        </div>
    );
};

export default DisneyPlusScreen;