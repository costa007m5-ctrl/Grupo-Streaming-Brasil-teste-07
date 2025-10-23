import React, { useState, useEffect } from 'react';
import type { AvailableService, FeaturedContent, Genre } from '../../types';
import type { ExploreDetailItem } from '../App';
import { ArrowLeftIcon, StarIcon } from '../ui/Icons';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, TMDB_PROVIDER_IDS } from '../../utils';
import FeaturedCarousel from './FeaturedCarousel';
import ProviderLoadingScreen from './ProviderLoadingScreen';
import { useTheme } from '../../contexts/ThemeContext';


interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
}

const Header: React.FC<{ service: AvailableService; onBack: () => void }> = ({ service, onBack }) => {
    const { theme } = useTheme();
    const headerBg = theme === 'dark' ? 'bg-[#10081C]/90' : 'bg-white/90';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-100';

    return (
        <header className={`sticky top-0 ${headerBg} backdrop-blur-sm z-10 p-4 flex items-center space-x-3 border-b ${borderColor}`}>
            <button onClick={onBack} className="p-2 -ml-2">
                <ArrowLeftIcon className={`w-6 h-6 ${textColor}`} />
            </button>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center p-1" style={{backgroundColor: service.bgColor || (theme === 'dark' ? '#1f2937' : '#f3f4f6')}}>
                <img src={service.logoUrl} alt={`${service.name} logo`} className="w-full h-full object-contain" />
            </div>
            <h1 className={`text-xl font-bold ${textColor}`}>{service.name}</h1>
        </header>
    );
};

const ContentPosterCard: React.FC<{ item: Movie; onSelect: () => void; }> = ({ item, onSelect }) => {
    const { theme } = useTheme();
    return (
        <button onClick={onSelect} className="flex-shrink-0 w-36 text-left group">
            <div className="relative w-full h-52 rounded-lg shadow-lg overflow-hidden bg-black cursor-pointer">
                <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${item.poster_path}`} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full">
                    <StarIcon className="w-3 h-3 text-yellow-400" solid />
                    <span>{item.vote_average.toFixed(1)}</span>
                </div>
            </div>
            <h3 className={`text-sm font-semibold mt-2 truncate group-hover:text-purple-700 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{item.title}</h3>
        </button>
    );
};


interface ContentCarouselProps {
    title: string;
    items: Movie[];
    onSelectItem: (id: number) => void;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, items, onSelectItem }) => {
    const { theme } = useTheme();
    return (
        <section>
            <h2 className={`text-xl font-bold mb-4 px-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
            <div className="flex space-x-4 overflow-x-auto pb-6 px-4 -mb-6 scrollbar-hide">
                {items.map((item) => (
                    <ContentPosterCard key={item.id} item={item} onSelect={() => onSelectItem(item.id)} />
                ))}
                <div className="flex-shrink-0 w-1"></div>
            </div>
        </section>
    );
};


interface ProviderDetailScreenProps {
    service: AvailableService;
    onBack: () => void;
    onSelectMovie: (movieId: number) => void;
    onSelectSeries: (seriesId: number) => void;
}

const ProviderDetailScreen: React.FC<ProviderDetailScreenProps> = ({ service, onBack, onSelectMovie, onSelectSeries }) => {
    const { theme } = useTheme();
    const [featuredContent, setFeaturedContent] = useState<FeaturedContent[]>([]);
    const [moviesByGenre, setMoviesByGenre] = useState<Record<string, Movie[]>>({});
    const [genres, setGenres] = useState<Genre[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProviderData = async () => {
            setIsLoading(true);
            const providerTmdbId = TMDB_PROVIDER_IDS[service.id];
            if (!providerTmdbId) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch popular movies for the banner
                const popularRes = await fetch(`${TMDB_BASE_URL}/discover/movie?with_watch_providers=${providerTmdbId}&watch_region=BR&sort_by=popularity.desc&api_key=${TMDB_API_KEY}&language=pt-BR`);
                const popularData = await popularRes.json();
                const bannerContent = popularData.results.slice(0, 5).map((m: any): FeaturedContent => ({
                    id: m.id,
                    title: m.title,
                    description: m.overview,
                    backgroundImageUrl: `${TMDB_IMAGE_BASE_URL}${m.backdrop_path}`,
                    logoUrl: service.logoUrl,
                    serviceName: service.name,
                    serviceId: service.id,
                }));
                setFeaturedContent(bannerContent);

                // Fetch genres
                const genreRes = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=pt-BR`);
                const genreData = await genreRes.json();
                const allGenres: Genre[] = genreData.genres;
                setGenres(allGenres);

                // Fetch movies for a selection of genres
                const genresToFetch = allGenres.filter(g => ['Ação', 'Comédia', 'Ficção científica', 'Suspense', 'Animação'].includes(g.name));
                const genrePromises = genresToFetch.map(genre => 
                    fetch(`${TMDB_BASE_URL}/discover/movie?with_watch_providers=${providerTmdbId}&watch_region=BR&with_genres=${genre.id}&sort_by=popularity.desc&api_key=${TMDB_API_KEY}&language=pt-BR`)
                    .then(res => res.json())
                );
                const results = await Promise.all(genrePromises);
                
                const moviesByGenreData: Record<string, Movie[]> = {};
                genresToFetch.forEach((genre, index) => {
                    const validItems = results[index].results.filter((m: Movie) => m.poster_path);
                    if (validItems.length > 0) {
                        moviesByGenreData[genre.name] = validItems.slice(0, 10);
                    }
                });
                setMoviesByGenre(moviesByGenreData);

            } catch (error) {
                console.error("Failed to fetch provider details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProviderData();
    }, [service]);
    
    const handleSelectFeatured = (item: ExploreDetailItem) => {
        if (item.type === 'movie' && item.id) {
            onSelectMovie(parseInt(item.id, 10));
        }
    };

    if (isLoading) {
        return <ProviderLoadingScreen service={service} />;
    }

    const mainBg = theme === 'dark' ? 'bg-[#10081C]' : 'bg-[#F8F9FA]';

    return (
        <div className={`${mainBg} min-h-screen`}>
            <Header service={service} onBack={onBack} />
            <main className="pb-4">
                <div className="space-y-8">
                    <div className="px-4 pt-4">
                         <FeaturedCarousel items={featuredContent} onSelectExploreItem={handleSelectFeatured} />
                    </div>
                    {Object.entries(moviesByGenre).map(([genreName, movies]) => (
                        <ContentCarousel key={genreName} title={genreName} items={movies} onSelectItem={onSelectMovie} />
                    ))}
                     {Object.keys(moviesByGenre).length === 0 && !isLoading && (
                        <div className="text-center py-10 px-4">
                            <p className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Conteúdo não encontrado</p>
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Não foi possível carregar os filmes e séries para este serviço no momento.</p>
                        </div>
                    )}
                </div>
            </main>
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
};

export default ProviderDetailScreen;