import React, { useState, useEffect } from 'react';
import type { Brand, FeaturedContent } from '../../types';
import type { ExploreDetailItem } from '../App';
import { ArrowLeftIcon } from '../ui/Icons';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '../../utils';
import FeaturedCarousel from './FeaturedCarousel';

interface TMDBContent {
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    backdrop_path?: string;
}

const Header: React.FC<{ brand: Brand; onBack: () => void }> = ({ brand, onBack }) => (
    <header className="sticky top-0 bg-[#040714]/80 backdrop-blur-sm z-10 p-4 flex items-center space-x-3 border-b border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 text-white">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="w-24 h-12 flex items-center justify-center p-1">
            <img src={brand.logo} alt={`${brand.name} logo`} className="max-w-full max-h-full object-contain" />
        </div>
    </header>
);

const ContentPosterCard: React.FC<{ item: TMDBContent; onSelect: () => void; }> = ({ item, onSelect }) => (
    <button onClick={onSelect} className="flex-shrink-0 w-36 text-left group">
        <div className="relative w-full h-52 rounded-lg shadow-lg overflow-hidden bg-gray-900 cursor-pointer">
            <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${item.poster_path}`} alt={item.title || item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <h3 className="text-sm font-semibold text-gray-300 mt-2 truncate group-hover:text-white">{item.title || item.name}</h3>
    </button>
);

const ContentRow: React.FC<{ title: string; items: TMDBContent[]; onSelectItem: (item: ExploreDetailItem) => void; }> = ({ title, items, onSelectItem }) => (
    <section>
        <h2 className="text-xl font-bold text-white mb-4 px-4">{title}</h2>
        <div className="flex space-x-4 overflow-x-auto pb-6 px-4 -mb-6 scrollbar-hide">
            {items.map((item) => (
                <ContentPosterCard key={item.id} item={item} onSelect={() => onSelectItem({type: 'movie', id: item.id.toString()})} />
            ))}
            <div className="flex-shrink-0 w-1"></div>
        </div>
    </section>
);

interface BrandDetailScreenProps {
    brand: Brand;
    onBack: () => void;
    onSelectExploreItem: (item: ExploreDetailItem) => void;
}

const BrandDetailScreen: React.FC<BrandDetailScreenProps> = ({ brand, onBack, onSelectExploreItem }) => {
    const [content, setContent] = useState<{ title: string; items: TMDBContent[] }[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBrandData = async () => {
            setIsLoading(true);
            
            let baseParams = `api_key=${TMDB_API_KEY}&language=pt-BR&watch_region=BR`;
            switch(brand.tmdb.type) {
                case 'company':
                    baseParams += `&with_companies=${brand.tmdb.id}`;
                    break;
                case 'keyword':
                    baseParams += `&with_keywords=${brand.tmdb.id}`;
                    break;
                case 'provider':
                    baseParams += `&with_watch_providers=${brand.tmdb.id}`;
                    break;
            }

            const endpoints = {
                "Filmes Populares": `/discover/movie?${baseParams}&sort_by=popularity.desc`,
                "Séries Populares": `/discover/tv?${baseParams}&sort_by=popularity.desc`,
                "Lançamentos Recentes": `/discover/movie?${baseParams}&sort_by=primary_release_date.desc&primary_release_date.lte=${new Date().toISOString().split('T')[0]}`,
                "Em Ordem de Lançamento": `/discover/movie?${baseParams}&sort_by=primary_release_date.asc`,
            };

            try {
                const responses = await Promise.all(
                    Object.values(endpoints).map(endpoint => fetch(`${TMDB_BASE_URL}${endpoint}`).then(res => res.json()))
                );
                
                const categorizedContent = Object.keys(endpoints).map((title, index) => {
                    return {
                        title,
                        items: responses[index].results.filter((i: any) => i.poster_path)
                    };
                }).filter(category => category.items.length > 0);

                setContent(categorizedContent);

            } catch (error) {
                console.error(`Failed to fetch data for ${brand.name}:`, error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBrandData();
    }, [brand]);

    const topFiveForBanner = content?.find(c => c.title === "Filmes Populares")?.items.slice(0, 5) || [];
    const featuredContent: FeaturedContent[] = topFiveForBanner
        .filter(item => item.backdrop_path)
        .map(item => ({
            id: item.id,
            title: item.title || item.name || '',
            description: '',
            backgroundImageUrl: `${TMDB_IMAGE_BASE_URL}${item.backdrop_path}`,
            logoUrl: brand.logo,
            serviceName: brand.name,
            serviceId: brand.name
    }));


    return (
        <div className="bg-[#040714] min-h-screen">
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            
            <div className="relative h-[50vh] flex flex-col justify-between">
                <video
                    src={brand.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-[#040714]/50 to-transparent z-0"></div>
                <div className="z-10"><Header brand={brand} onBack={onBack} /></div>
                
                <div className="z-10 w-full px-4 pb-4">
                    {featuredContent.length > 0 && <FeaturedCarousel items={featuredContent} onSelectExploreItem={onSelectExploreItem} />}
                </div>
            </div>

            <main className="pb-4 space-y-8 -mt-8">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-400"></div></div>
                ) : (
                    content && content.map(category => (
                        <ContentRow key={category.title} title={category.title} items={category.items} onSelectItem={onSelectExploreItem} />
                    ))
                )}
                 {content?.length === 0 && !isLoading && (
                    <div className="text-center py-10 px-4">
                        <p className="font-semibold text-gray-400">Conteúdo não encontrado</p>
                        <p className="text-sm text-gray-500 mt-1">Não foi possível carregar os títulos para esta marca no momento.</p>
                    </div>
                )}
             </main>
        </div>
    );
};

export default BrandDetailScreen;