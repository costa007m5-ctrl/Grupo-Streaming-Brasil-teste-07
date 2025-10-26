import React, { useState, useEffect } from 'react';
import type { Group, AvailableService, FeaturedContent } from '../types';
import type { ExploreDetailItem } from '../App';
import { 
    ArrowLeftIcon,
    UsersIcon,
    StarIcon
} from './Icons';
import { AVAILABLE_SERVICES_DATA, TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, TMDB_NETWORK_IDS, TMDB_GENRE_IDS } from '../constants';
import FeaturedCarousel from './FeaturedCarousel';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => {
    const { theme } = useTheme();
    const headerBg = theme === 'dark' ? 'bg-[#10081C]/90' : 'bg-white/90';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    
    return (
        <header className={`sticky top-0 ${headerBg} backdrop-blur-sm z-10 p-4`}>
            <div className={`relative flex justify-center items-center w-full h-8 ${textColor}`}>
                <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">{title}</h1>
            </div>
        </header>
    );
};


const GroupCard: React.FC<{ group: Group; onSelectGroup: (group: Group) => void }> = ({ group, onSelectGroup }) => {
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
                            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{group.host_name}</p>
                            {(group.host_rating_count ?? 0) > 0 && (
                                <div className="flex items-center space-x-0.5 -mt-0.5">
                                    <StarIcon className="w-3 h-3 text-yellow-400" solid />
                                    <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{group.host_rating_avg?.toFixed(1)}</span>
                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>({group.host_rating_count})</span>
                                </div>
                            )}
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


interface ServiceDetailScreenProps {
    item: ExploreDetailItem;
    groups: Group[];
    onBack: () => void;
    onSelectGroup: (group: Group) => void;
    onSelectExploreItem: (item: ExploreDetailItem) => void;
}

const categoryMap: Record<string, { title: string; category: AvailableService['category'] }> = {
    'movie': { title: 'Filmes e Séries', category: 'movie' },
    'tv': { title: 'Canais de TV', category: 'tv' },
    'music': { title: 'Música', category: 'music' },
};


const ServiceDetailScreen: React.FC<ServiceDetailScreenProps> = ({ item, groups, onBack, onSelectGroup, onSelectExploreItem }) => {
    const { theme } = useTheme();
    const mainBg = theme === 'dark' ? 'bg-[#10081C]' : 'bg-[#F8F9FA]';
    const [featuredContent, setFeaturedContent] = useState<FeaturedContent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    let title = "Detalhes";
    let filteredGroups: Group[] = [];

    if (item.type === 'service') {
        const service = AVAILABLE_SERVICES_DATA.find(s => s.id === item.id);
        if (service) {
            title = service.name;
            filteredGroups = groups.filter(g => (g.name || '').toLowerCase().includes(service.name.toLowerCase()));
        }
    } else if (item.type === 'category') {
        const categoryInfo = categoryMap[item.id];
        if (categoryInfo) {
            title = categoryInfo.title;
            const servicesInCategory = AVAILABLE_SERVICES_DATA.filter(s => s.category === categoryInfo.category);
            const serviceNames = servicesInCategory.map(s => s.name.toLowerCase());
            filteredGroups = groups.filter(g => serviceNames.some(name => (g.name || '').toLowerCase().includes(name)));
        }
    }

     useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            let url = '';
            let service: AvailableService | undefined;

            if (item.type === 'service') {
                const networkId = TMDB_NETWORK_IDS[item.id];
                service = AVAILABLE_SERVICES_DATA.find(s => s.id === item.id);
                if (networkId) {
                    url = `${TMDB_BASE_URL}/discover/movie?with_networks=${networkId}&language=pt-BR&sort_by=popularity.desc&api_key=${TMDB_API_KEY}`;
                } else if (service) {
                    url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(service.name)}&language=pt-BR&api_key=${TMDB_API_KEY}`;
                }
            } else if (item.type === 'category') {
                const genreId = TMDB_GENRE_IDS[item.id];
                 if (genreId) {
                    url = `${TMDB_BASE_URL}/discover/movie?with_genres=${genreId}&language=pt-BR&sort_by=popularity.desc&api_key=${TMDB_API_KEY}`;
                } else if (item.id === 'tv') {
                    url = `${TMDB_BASE_URL}/tv/popular?language=pt-BR&api_key=${TMDB_API_KEY}`;
                } else {
                    url = `${TMDB_BASE_URL}/movie/popular?language=pt-BR&api_key=${TMDB_API_KEY}`;
                }
            }
            
            if (!url) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Não foi possível buscar o conteúdo.");
                const data = await response.json();

                const mappedContent: FeaturedContent[] = data.results.slice(0, 5).map((content: any) => ({
                    id: content.id,
                    title: content.title || content.name,
                    description: content.overview,
                    backgroundImageUrl: `${TMDB_IMAGE_BASE_URL}${content.backdrop_path}`,
                    logoUrl: service?.logoUrl || 'https://img.icons8.com/ios-filled/50/movie-projector.png',
                    serviceName: service?.name || title,
                    serviceId: service?.id,
                }));
                setFeaturedContent(mappedContent);

            } catch (error) {
                console.error("Erro ao buscar conteúdo do serviço:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, [item, title]);

    return (
        <div className={`${mainBg} min-h-screen`}>
            <Header title={title} onBack={onBack} />
            <main className="pb-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-purple-500"></div></div>
                ) : featuredContent.length > 0 && (
                     <div className="px-4 pt-4">
                        <FeaturedCarousel items={featuredContent} onSelectExploreItem={onSelectExploreItem} />
                    </div>
                )}

                <div className="px-4 mt-6 space-y-4">
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Grupos Disponíveis</h2>
                    {filteredGroups.length > 0 ? (
                        filteredGroups.map(group => (
                            <GroupCard key={group.id} group={group} onSelectGroup={onSelectGroup} />
                        ))
                    ) : (
                        <div className={`text-center py-10 rounded-xl shadow-sm ${theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white'}`}>
                            <p className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Nenhum grupo encontrado</p>
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Ainda não há grupos disponíveis para {title}.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ServiceDetailScreen;
