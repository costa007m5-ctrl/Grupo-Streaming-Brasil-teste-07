import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, TMDB_PROVIDER_IDS, AVAILABLE_SERVICES_DATA } from '../constants';
import { SearchIcon, StarIcon, CrownIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from './Icons';
import type { FeaturedContent, TvShow, Genre, AvailableService, Group } from '../types';
import type { ExploreDetailItem } from '../App';
import FeaturedCarousel from './FeaturedCarousel';
import AiMovieFinder from './AiMovieFinder';
import { GoogleGenAI, Type } from "@google/genai";
import { useTheme } from '../contexts/ThemeContext';


interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
}

type ContentItem = Movie | TvShow;
type ContentType = 'movie' | 'tv';

interface ContentCarouselProps {
    title: string;
    items: ContentItem[];
    onSelectItem: (id: number) => void;
    contentType: ContentType;
    isTopList?: boolean;
}

const ContentPosterCard: React.FC<{ item: ContentItem; onSelect: () => void; rank?: number, contentType: ContentType }> = ({ item, onSelect, rank, contentType }) => {
    const { theme } = useTheme();
    const [isHovering, setIsHovering] = useState(false);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const hoverTimeout = useRef<number | null>(null);

    const fetchTrailer = useCallback(async () => {
        if (trailerKey) return;
        try {
            const response = await fetch(`${TMDB_BASE_URL}/${contentType}/${item.id}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`);
            if (!response.ok) return;
            const data = await response.json();
            const trailer = data.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
            if (trailer) {
                setTrailerKey(trailer.key);
            }
        } catch (e) {
            console.error('Failed to fetch trailer', e);
        }
    }, [item.id, contentType, trailerKey]);

    const handleMouseEnter = () => {
        hoverTimeout.current = window.setTimeout(() => {
            setIsHovering(true);
            fetchTrailer();
        }, 500); // 500ms delay before showing trailer
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
        }
        setIsHovering(false);
    };
    
    return (
        <div className="flex-shrink-0 w-36 text-left group">
            <div 
                className="relative w-full h-52 rounded-lg shadow-lg overflow-hidden bg-black cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={onSelect}
            >
                {isHovering && trailerKey ? (
                    <>
                        <iframe
                            className="w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailerKey}&showinfo=0&iv_load_policy=3&modestbranding=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                        ></iframe>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMuted(prev => !prev);
                            }}
                            className="absolute bottom-2 right-2 z-20 p-1.5 bg-black/60 rounded-full text-white backdrop-blur-sm"
                            aria-label={isMuted ? "Ativar som" : "Desativar som"}
                        >
                            {isMuted ? <SpeakerXMarkIcon className="w-4 h-4" /> : <SpeakerWaveIcon className="w-4 h-4" />}
                        </button>
                    </>
                ) : (
                    <img 
                        src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${item.poster_path}`} 
                        alt={'title' in item ? item.title : item.name} 
                        className="w-full h-full object-cover" 
                    />
                )}
                 <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full pointer-events-none">
                    <StarIcon className="w-3 h-3 text-yellow-400" solid />
                    <span>{item.vote_average.toFixed(1)}</span>
                </div>
                {rank && (
                  <div className="absolute bottom-2 left-2 flex items-center space-x-1.5 bg-black/70 pr-3 pl-1.5 py-1 rounded-full backdrop-blur-sm border border-white/20 pointer-events-none">
                    <CrownIcon className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-white text-sm -mb-0.5">{rank}</span>
                  </div>
                )}
            </div>
            <h3 className={`text-sm font-semibold mt-2 truncate group-hover:text-purple-700 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{('title' in item) ? item.title : item.name}</h3>
        </div>
    );
};

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, items, onSelectItem, contentType, isTopList }) => {
    const { theme } = useTheme();
    return (
        <section>
            <h2 className={`text-xl font-bold mb-4 px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
            <div className="flex space-x-4 overflow-x-auto pb-6 px-4 -mb-6 scrollbar-hide">
                {items.map((item, index) => (
                    <ContentPosterCard key={item.id} item={item} onSelect={() => onSelectItem(item.id)} rank={isTopList ? index + 1 : undefined} contentType={contentType} />
                ))}
                <div className="flex-shrink-0 w-1"></div>
            </div>
        </section>
    );
};

const ProviderCard: React.FC<{ provider: AvailableService; onSelect: () => void; }> = ({ provider, onSelect }) => (
    <button 
        onClick={onSelect} 
        className={`flex-shrink-0 w-40 h-24 rounded-2xl flex items-center justify-center p-4 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1`}
        style={{ backgroundColor: provider.bgColor || '#f0f0f0' }}
    >
        <img src={provider.logoUrl} alt={provider.name} className="max-w-full max-h-full object-contain" />
    </button>
);

interface MoviesScreenProps {
    onSelectMovie: (movieId: number) => void;
    onSelectSeries: (seriesId: number) => void;
    onSelectProvider: (service: AvailableService) => void;
    allGroups: Group[];
    onSelectGroup: (group: Group) => void;
}

const MoviesScreen: React.FC<MoviesScreenProps> = ({ onSelectMovie, onSelectSeries, onSelectProvider, allGroups, onSelectGroup }) => {
    const { theme } = useTheme();
    const [topMoviesWeek, setTopMoviesWeek] = useState<Movie[]>([]);
    const [topSeriesWeek, setTopSeriesWeek] = useState<TvShow[]>([]);
    const [recommendedForYou, setRecommendedForYou] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [featuredContent, setFeaturedContent] = useState<FeaturedContent[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    
    const streamingProviders = AVAILABLE_SERVICES_DATA.filter(p => 
        ['netflix', 'primevideo', 'disneyplus', 'max', 'paramountplus', 'globoplay', 'crunchyroll'].includes(p.id)
    );
    
    const fetchContent = useCallback(async (endpoint: string, setter: React.Dispatch<React.SetStateAction<any[]>>, limit: number = 20) => {
        try {
            const response = await fetch(`${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}&language=pt-BR&region=BR`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const validItems = data.results.filter((m: Movie | TvShow) => m.poster_path);
            setter(validItems.slice(0, limit));
        } catch (e: any) {
            console.error(`Failed to fetch from ${endpoint}`, e);
            setError(`Não foi possível carregar o conteúdo. Verifique sua conexão.`);
        }
    }, []);

    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
    
        await Promise.all([
            fetchContent('/trending/movie/week?', setTopMoviesWeek, 10),
            fetchContent('/trending/tv/week?', setTopSeriesWeek, 10),
            fetchContent('/movie/popular?', setRecommendedForYou, 20),
        ]);
        setIsLoading(false);
    
    }, [fetchContent]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=pt-BR`);
                const data = await response.json();
                setGenres(data.genres);
            } catch (e) {
                console.error("Failed to fetch genres", e);
            }
        };
        fetchGenres();
        fetchAllData();
        const intervalId = setInterval(fetchAllData, 4 * 60 * 60 * 1000); // 4 hours
        return () => clearInterval(intervalId);
    }, [fetchAllData]);

    useEffect(() => {
        if (topMoviesWeek.length > 0) {
            const createFeaturedContent = async () => {
                const featuredPromises = topMoviesWeek.slice(0, 8).map(async (movie: any) => {
                    if (!movie.backdrop_path) return null;
                    try {
                        const providersResponse = await fetch(`${TMDB_BASE_URL}/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`);
                        if (!providersResponse.ok) return null;
                        const providersData = await providersResponse.json();
                        
                        const brProviders = providersData.results?.BR?.flatrate;
                        if (!brProviders || brProviders.length === 0) return null;

                        let service: { id: string; name: string; logoUrl: string; } | null = null;
                        for (const provider of brProviders) {
                            const knownServiceId = Object.keys(TMDB_PROVIDER_IDS).find(
                                key => TMDB_PROVIDER_IDS[key] === provider.provider_id
                            );
                            if (knownServiceId) {
                                const knownService = AVAILABLE_SERVICES_DATA.find(s => s.id === knownServiceId);
                                if (knownService) {
                                    service = knownService;
                                    break;
                                }
                            }
                        }

                        if (!service) return null;

                        return {
                            id: movie.id,
                            title: movie.title,
                            description: movie.overview,
                            backgroundImageUrl: `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`,
                            logoUrl: service.logoUrl,
                            serviceName: service.name,
                            serviceId: service.id,
                        };
                    } catch (e) {
                        console.error(`Error fetching providers for movie ${movie.id}`, e);
                        return null;
                    }
                });

                const resolvedContent = await Promise.all(featuredPromises);
                setFeaturedContent(resolvedContent.filter(Boolean).slice(0, 5) as FeaturedContent[]);
            };
            createFeaturedContent();
        }
    }, [topMoviesWeek]);

    const handleSearch = async (query: string) => {
        setSearchTerm(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        setError(null);
    
        const simpleSearchFallback = async () => {
            try {
                const response = await fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}&language=pt-BR&region=BR`);
                if (!response.ok) throw new Error('Falha na busca.');
                const data = await response.json();
                setSearchResults(data.results.filter((m: Movie) => m.poster_path));
            } catch (fallbackError: any) {
                 setError(fallbackError.message);
            }
        };
    
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Classifique a seguinte busca de filme: "${query}". A busca é um título de filme, nome de pessoa (ator/diretor) ou um gênero de filme? Responda estritamente com um JSON contendo "type" ('title', 'person', 'genre') e "value" (o termo de busca extraído em português). Por exemplo, para "Tom Hanks", a resposta deve ser {"type": "person", "value": "Tom Hanks"}. Para "filmes de ação", {"type": "genre", "value": "ação"}. Para "O Poderoso Chefão", {"type": "title", "value": "O Poderoso Chefão"}. Se não tiver certeza, classifique como 'title'.`;
            const systemInstruction = `Responda sempre em Português do Brasil. Você é um especialista em cinema que classifica buscas. Sua resposta deve ser estritamente um objeto JSON contendo "type" ('title', 'person', 'genre') e "value" (o termo de busca extraído em português).`;
    
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, description: "Pode ser 'title', 'person', ou 'genre'." },
                            value: { type: Type.STRING, description: "O termo de busca extraído em português." }
                        },
                        required: ["type", "value"]
                    }
                }
            });
    
            const classification = JSON.parse(response.text);
            const { type, value } = classification;
            
            let movies: any[] = [];
            
            if (type === 'title') {
                const res = await fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(value)}&api_key=${TMDB_API_KEY}&language=pt-BR&region=BR`);
                const data = await res.json();
                movies = data.results;
            } else if (type === 'person') {
                const personRes = await fetch(`${TMDB_BASE_URL}/search/person?query=${encodeURIComponent(value)}&api_key=${TMDB_API_KEY}&language=pt-BR`);
                const personData = await personRes.json();
                const personId = personData.results?.[0]?.id;
                if (personId) {
                    const creditsRes = await fetch(`${TMDB_BASE_URL}/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}&language=pt-BR`);
                    const creditsData = await creditsRes.json();
                    movies = creditsData.cast;
                }
            } else if (type === 'genre') {
                const foundGenre = genres.find(g => g.name.toLowerCase() === value.toLowerCase());
                if (foundGenre) {
                    const discoverRes = await fetch(`${TMDB_BASE_URL}/discover/movie?with_genres=${foundGenre.id}&api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=popularity.desc&region=BR`);
                    const discoverData = await discoverRes.json();
                    movies = discoverData.results;
                } else {
                    await simpleSearchFallback();
                    setIsSearching(false);
                    return;
                }
            } else {
                await simpleSearchFallback();
                setIsSearching(false);
                return;
            }
    
            setSearchResults(movies.filter((m) => m.poster_path) as Movie[]);
    
        } catch (e: any) {
            setError("A busca inteligente falhou. Realizando busca simples...");
            await simpleSearchFallback();
        }
        setIsSearching(false);
    };
    
    const handleSelectFeatured = (item: ExploreDetailItem) => {
        if (item.type === 'movie' && item.id) {
            onSelectMovie(parseInt(item.id, 10));
        }
    };

    const mainBg = theme === 'dark' ? 'bg-[#10081C]' : 'bg-[#F8F9FA]';
    const headerBg = theme === 'dark' ? 'bg-[#10081C]/90' : 'bg-white/90';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
    const placeholderColor = theme === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500';

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-96"><div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-500"></div></div>;
        }
        if (error && !isSearching) {
            return <div className={`text-center py-10 px-4 font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</div>
        }

        if (searchTerm.trim() !== '') {
             return (
                <div className="px-4">
                    <h2 className={`text-xl font-bold ${textColor} mb-4`}>{isSearching ? `Buscando por "${searchTerm}"...` : `Resultados para "${searchTerm}"`}</h2>
                    {isSearching ? (
                         <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-purple-500"></div></div>
                    ) : searchResults.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
                            {searchResults.map(item => <ContentPosterCard key={item.id} item={item} onSelect={() => onSelectMovie(item.id)} contentType={'name' in item ? 'tv' : 'movie'} />)}
                        </div>
                    ) : (
                        <p className={`text-center py-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Nenhum resultado encontrado.</p>
                    )}
                     {error && isSearching && <p className={`text-center text-sm mt-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</p>}
                </div>
            );
        }
        
        return (
            <div className="space-y-8">
                {topMoviesWeek.length > 0 && <ContentCarousel title="Top 10 Filmes da Semana no Brasil" items={topMoviesWeek} onSelectItem={onSelectMovie} contentType="movie" isTopList />}
                {topSeriesWeek.length > 0 && <ContentCarousel title="Top 10 Séries da Semana no Brasil" items={topSeriesWeek} onSelectItem={onSelectSeries} contentType="tv" isTopList />}
                {recommendedForYou.length > 0 && <ContentCarousel title="Recomendado para Você" items={recommendedForYou} onSelectItem={onSelectMovie} contentType="movie" />}
            </div>
        );
    }

    return (
        <div className={`${mainBg} min-h-screen`}>
            <header className={`sticky top-0 ${headerBg} backdrop-blur-sm z-10 p-4 space-y-4`}>
                <h1 className={`text-2xl font-bold ${textColor} text-center`}>Filmes e Séries</h1>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Buscar por título, ator, gênero..."
                        className={`w-full ${inputBg} border-none rounded-full py-3 pl-12 pr-4 ${textColor} ${placeholderColor} focus:ring-2 focus:ring-purple-500`}
                    />
                </div>
            </header>
            
            <main className="py-4">
                {searchTerm.trim() === '' && (
                    <>
                        <div className="px-4">
                            <FeaturedCarousel items={featuredContent} onSelectExploreItem={handleSelectFeatured} />
                        </div>
                        <div className="px-4 mt-6">
                            <AiMovieFinder 
                                onSelectMovie={onSelectMovie}
                                onSelectGroup={onSelectGroup}
                                allGroups={allGroups}
                            />
                        </div>
                        <section className="py-4 space-y-4 mt-6">
                            <h2 className={`text-xl font-bold ${textColor} px-4`}>Navegar por Serviço</h2>
                            <div className="flex space-x-4 overflow-x-auto pb-6 px-4 -mb-6 scrollbar-hide">
                                {streamingProviders.map(provider => (
                                   <ProviderCard 
                                        key={provider.id}
                                        provider={provider}
                                        onSelect={() => onSelectProvider(provider)}
                                   />
                                ))}
                            </div>
                        </section>
                    </>
                )}
                <div className="mt-8">
                  {renderContent()}
                </div>
            </main>
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
};

export default MoviesScreen;