
import React, { useState, useEffect } from 'react';
import type { Group, AvailableService, Profile, FeaturedContent } from '../../types';
import type { ExploreDetailItem } from '../App';
import { 
    ArrowLeftIcon, 
    SearchIcon, 
    ChevronDownIcon, 
    PlusIcon,
    UsersIcon
} from '../ui/Icons';
import { AVAILABLE_SERVICES_DATA, TOP_5_SERVICES_IDS, TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, TMDB_PROVIDER_IDS } from '../../utils';
import FeaturedCarousel from '../ui/FeaturedCarousel';
import ServiceCategoryCarousel from './ServiceCategoryCarousel';
import TopServicesCarousel from './TopServicesCarousel';
import CategoryTabsCarousel from './CategoryTabsCarousel';
import RecommendedGroups from '../layout/RecommendedGroups';
import { useTheme } from '../../contexts/ThemeContext';

const SearchBar: React.FC = () => {
    const { theme } = useTheme();
    const bgColor = theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const placeholderColor = theme === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500';

    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Buscar grupos..."
                className={`w-full border-none rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 ${bgColor} ${textColor} ${placeholderColor}`}
            />
        </div>
    );
};
const ExploreHeader: React.FC = () => {
    const { theme } = useTheme();
    const headerBg = theme === 'dark' ? 'bg-[#10081C]/90' : 'bg-white/90';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    
    return (
        <header className={`sticky top-0 backdrop-blur-sm z-10 p-4 ${headerBg}`}>
            <div className={`relative flex justify-center items-center w-full h-8 ${textColor}`}>
                <button className="absolute left-0 p-2 -ml-2">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Explorar Grupos</h1>
            </div>
        </header>
    );
};
const ResultsHeader: React.FC<{ count: number }> = ({ count }) => {
    const { theme } = useTheme();
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    
    return (
        <div className="flex justify-between items-center">
            <p className={`font-semibold ${textColor}`}>{count} grupos encontrados</p>
            <button className={`flex items-center space-x-1 text-sm font-medium ${subTextColor}`}>
                <span>Mais Recentes</span>
                <ChevronDownIcon className="w-4 h-4" />
            </button>
        </div>
    );
};
interface GroupCardProps {
    group: Group;
    onSelectGroup: (group: Group) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onSelectGroup }) => {
    const { theme } = useTheme();
    return (
        <div className={`${theme === 'dark' ? 'bg-[#1C1A27] border-gray-800' : 'bg-white border-gray-100/50'} rounded-2xl shadow-lg overflow-hidden border`}>
             <div className={`relative h-28 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div className={`absolute top-3 left-3 w-10 h-10 rounded-lg flex items-center justify-center p-1 ${theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white'}`}>
                    <img src={group.logo} alt={`${group.name} logo`} className="w-full h-full object-contain" />
                </div>
                <div className="absolute top-3 right-3 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1">
                    <UsersIcon className="w-3 h-3"/>
                    <span>{group.members}/{group.max_members}</span>
                </div>
            </div>
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{group.name}</h3>
                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Anfitrião: {group.host_name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-purple-600">R$ {group.price.toFixed(2).replace('.', ',')}<span className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>/mês</span></p>
                    </div>
                </div>
                
                <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'} pt-3 flex justify-between items-center`}>
                    <div className="flex items-center space-x-2">
                         <img src={group.members_list[0]?.avatarUrl || 'https://img.icons8.com/color/96/yoda.png'} alt={group.host_name} className="w-8 h-8 rounded-full" />
                        <div>
                            <div className="flex items-center space-x-1">
                                <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{group.host_name}</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => onSelectGroup(group)}
                        className="bg-purple-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                        Participar
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ExploreScreenProps {
    groups: Group[];
    myGroups: Group[];
    onSelectGroup: (group: Group) => void;
    onNavigateToCreateGroup: () => void;
    profile: Profile | null;
    onSelectExploreItem: (item: ExploreDetailItem) => void;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ groups, myGroups, onSelectGroup, onNavigateToCreateGroup, profile, onSelectExploreItem }) => {
    const { theme } = useTheme();
    const mainBg = theme === 'dark' ? 'bg-[#10081C]' : 'bg-[#F8F9FA]';
    
    const [featuredContent, setFeaturedContent] = useState<FeaturedContent[]>([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const trendingResponse = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=pt-BR`);
                if (!trendingResponse.ok) throw new Error("Não foi possível buscar os destaques de filmes.");
                const trendingData = await trendingResponse.json();
                
                const featuredMoviesPromises = trendingData.results.slice(0, 8).map(async (movie: any) => {
                    if (!movie.backdrop_path) return null; // Skip movies without images
                    try {
                        const providersResponse = await fetch(`${TMDB_BASE_URL}/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`);
                        if (!providersResponse.ok) return null;
                        const providersData = await providersResponse.json();
                        
                        const brProviders = providersData.results?.BR?.flatrate;
                        if (!brProviders || brProviders.length === 0) return null;

                        // Find the first matching service from our list using provider IDs
                        let service: AvailableService | null = null;
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

                        if (!service) return null; // Only show movies from our known services in the banner

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

                const resolvedContent = await Promise.all(featuredMoviesPromises);
                const mappedContent = resolvedContent.filter(Boolean).slice(0, 5) as FeaturedContent[];
                
                setFeaturedContent(mappedContent);

            } catch (error) {
                console.error("Erro ao buscar destaques:", error);
            }
        };
        fetchFeatured();
    }, []);

    const servicesByCat = AVAILABLE_SERVICES_DATA.reduce((acc, service) => {
        const category = service.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(service);
        return acc;
    }, {} as Record<AvailableService['category'], AvailableService[]>);

    const topServices = TOP_5_SERVICES_IDS.map(id => 
        AVAILABLE_SERVICES_DATA.find(service => service.id === id)
    ).filter((s): s is AvailableService => s !== undefined);

    const categories = [
      { id: 'movie', title: 'Filmes e Séries' },
      { id: 'tv', title: 'Canais de TV' },
      { id: 'music', title: 'Música' },
    ];

    return (
        <div className={`${mainBg} min-h-screen`}>
            <ExploreHeader />
            <main className="pb-4">
                <div className="px-4 pt-4 space-y-4">
                    <FeaturedCarousel items={featuredContent} onSelectExploreItem={onSelectExploreItem} />
                    <SearchBar />
                </div>
                
                <CategoryTabsCarousel categories={categories} onSelectExploreItem={onSelectExploreItem} />

                <ServiceCategoryCarousel title="Todos os Serviços" services={AVAILABLE_SERVICES_DATA} onSelectExploreItem={onSelectExploreItem} />
                
                <RecommendedGroups 
                    groups={groups} 
                    myGroups={myGroups} 
                    profile={profile} 
                    onSelectGroup={onSelectGroup} 
                />

                <div id="todos-os-grupos" className="px-4 mt-6 space-y-4 scroll-mt-24">
                    <ResultsHeader count={groups.length} />
                    {groups.map(group => (
                        <GroupCard key={group.id} group={group} onSelectGroup={onSelectGroup} />
                    ))}
                </div>

                <TopServicesCarousel services={topServices} onSelectExploreItem={onSelectExploreItem} />
                
                <ServiceCategoryCarousel id="filmes-e-series" title="Filmes e Séries" services={servicesByCat.movie} onSelectExploreItem={onSelectExploreItem} />
                <ServiceCategoryCarousel id="canais-de-tv" title="Canais de TV" services={servicesByCat.tv} onSelectExploreItem={onSelectExploreItem} />
                <ServiceCategoryCarousel id="musica" title="Música" services={servicesByCat.music} onSelectExploreItem={onSelectExploreItem} />
                
            </main>
             <button
                onClick={onNavigateToCreateGroup}
                className="fixed bottom-28 right-4 sm:right-6 bg-gradient-to-r from-purple-600 to-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity z-20"
                aria-label="Criar novo grupo"
            >
                <PlusIcon className="w-8 h-8" />
            </button>
        </div>
    );
};

export default ExploreScreen;
