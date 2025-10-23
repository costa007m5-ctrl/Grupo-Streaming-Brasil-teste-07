import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Group, AvailableService } from '../../types';
import { SparklesIcon, ArrowDownTrayIcon, PencilSquareIcon, CheckCircleIcon, XMarkIcon } from './Icons';
import { AVAILABLE_SERVICES_DATA, TMDB_PROVIDER_IDS, TMDB_API_KEY, TMDB_BASE_URL } from '../../utils';

const CATCHY_PHRASES = [
    "Sua maratona começa aqui, por um precinho.",
    "Assista sem limites, pagando o mínimo.",
    "Acesso total por uma fração do valor.",
    "Junte-se ao grupo e comece a economizar de verdade!",
    "Vagas limitadas! Garanta sua diversão.",
    "O melhor do streaming, sem pesar no bolso.",
    "Seu filme favorito está te esperando. E a economia também.",
    "Dividir é somar. Some-se ao nosso grupo!",
    "Por que pagar mais? Acesso premium por menos.",
    "Entre para o clube dos espertos. Assine junto.",
    "A pipoca é por sua conta, a economia é por nossa.",
    "Desbloqueie um universo de entretenimento.",
];

interface AdvertisingViewProps {
    groups: Group[];
}

type Platform = 'post' | 'story' | 'feed';
const platformConfig: Record<Platform, { label: string; aspectRatio: '1:1' | '9:16' | '16:9' }> = {
    post: { label: 'Post (1:1)', aspectRatio: '1:1' },
    story: { label: 'Story (9:16)', aspectRatio: '9:16' },
    feed: { label: 'Feed (16:9)', aspectRatio: '16:9' },
};

interface Banner {
    id: number;
    url: string;
    services: string[];
    platform: Platform;
}

const generationOptions = [
    { value: 'automatic', label: 'Automático', logoUrl: null },
    { value: 'all', label: 'Todos', logoUrl: null },
    ...AVAILABLE_SERVICES_DATA
        .filter(s => TMDB_PROVIDER_IDS[s.id])
        .map(s => ({ value: s.id, label: s.name, logoUrl: s.logoUrl }))
];

const ServiceCarousel: React.FC<{ options: typeof generationOptions, selected: string[], onSelect: (value: string) => void }> = ({ options, selected, onSelect }) => {
    return (
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {options.map(option => {
                const isSelected = selected.includes(option.value);
                return (
                    <button 
                        key={option.value}
                        onClick={() => onSelect(option.value)}
                        className={`relative flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-xl transition-all border-2 ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'}`}
                    >
                        <div className={`w-20 h-16 flex items-center justify-center ${option.logoUrl ? '' : 'bg-gray-100 rounded-lg'}`}>
                            {option.logoUrl ? (
                                <img src={option.logoUrl} alt={option.label} className="max-w-full max-h-full object-contain" />
                            ) : (
                                <SparklesIcon className="w-8 h-8 text-purple-500" />
                            )}
                        </div>
                        <p className={`text-xs font-semibold mt-1 ${isSelected ? 'text-purple-700' : 'text-gray-600'}`}>{option.label}</p>
                        {isSelected && <CheckCircleIcon className="absolute top-1 right-1 w-5 h-5" iconClassName="w-3 h-3"/>}
                    </button>
                )
            })}
             <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
};

const BrandAssetsView = () => {
    // Helper functions for download
    const downloadSvg = (svgString: string, filename: string) => {
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const downloadPng = (svgString: string, filename: string, width = 512, height = 512) => {
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const pngUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };
    
    // Logo definitions
    const iconOnlySvgString = (color: string) => `
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 75 L20 45 L50 30 L80 45 L80 60 L50 75 L80 90 L80 105 L50 90 L20 105 Z" />
            <path d="M20 75 L50 90" />
            <g>
                <path d="M50 5 L 65 20 L 35 20 Z" />
                <path d="M30 15 L 15 25" />
                <path d="M70 15 L 85 25" />
            </g>
        </g>
    </svg>`;

    const fullLogoSvgString = (iconColor: string, textColor: string) => `
    <svg viewBox="0 0 420 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="420" height="120">
      <g transform="translate(10, 0)">
        <g stroke="${iconColor}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 75 L20 45 L50 30 L80 45 L80 60 L50 75 L80 90 L80 105 L50 90 L20 105 Z" />
            <path d="M20 75 L50 90" />
            <g>
                <path d="M50 5 L 65 20 L 35 20 Z" />
                <path d="M30 15 L 15 25" />
                <path d="M70 15 L 85 25" />
            </g>
        </g>
      </g>
      <text x="130" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" letter-spacing="0.15em" fill="${textColor}">GRUPO STREAMING</text>
      <text x="130" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" letter-spacing="0.15em" fill="${textColor}">BRASIL</text>
    </svg>`;
    
    const profileSvgString = (iconColor: string, background: 'gradient' | 'white' | 'black') => {
        const backgroundFill = background === 'gradient' ? 'url(#profileGrad)' : background;
        const defs = background === 'gradient' ? `
        <defs>
            <radialGradient id="profileGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stop-color="#a855f7" />
                <stop offset="100%" stop-color="#6366f1" />
            </radialGradient>
        </defs>` : '';
    
        return `
        <svg width="512" height="512" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            ${defs}
            <rect width="120" height="120" fill="${backgroundFill}" />
            <g transform="translate(10, 0)">
                <g stroke="${iconColor}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none">
                    <path d="M20 75 L20 45 L50 30 L80 45 L80 60 L50 75 L80 90 L80 105 L50 90 L20 105 Z" />
                    <path d="M20 75 L50 90" />
                    <g>
                        <path d="M50 5 L 65 20 L 35 20 Z" />
                        <path d="M30 15 L 15 25" />
                        <path d="M70 15 L 85 25" />
                    </g>
                </g>
            </g>
        </svg>
        `;
    };

    const fullLogoSvgWithBackground = (iconColor: string, textColor: string, background: 'gradient' | 'white' | 'black') => {
        const backgroundFill = background === 'gradient' ? 'url(#fullLogoGrad)' : background;
        const defs = background === 'gradient' ? `
        <defs>
            <linearGradient id="fullLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#a855f7" />
                <stop offset="100%" stop-color="#6366f1" />
            </linearGradient>
        </defs>` : '';

        return `
        <svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
            ${defs}
            <rect width="1280" height="720" fill="${backgroundFill}" />
            <svg x="${(1280 - 420) / 2}" y="${(720 - 120) / 2}" width="420" height="120">${fullLogoSvgString(iconColor, textColor)}</svg>
        </svg>
        `;
    };

    const assets = [
        {
            title: "Ícone (Preto)",
            svgString: iconOnlySvgString('black'),
            filename: 'gsb-icon-black',
            width: 100,
            height: 120,
        },
        {
            title: "Ícone (Branco)",
            svgString: iconOnlySvgString('white'),
            filename: 'gsb-icon-white',
            darkBg: true,
            width: 100,
            height: 120,
        },
        {
            title: "Logo Completo (Preto)",
            svgString: fullLogoSvgString('black', 'black'),
            filename: 'gsb-logo-black',
            width: 420,
            height: 120,
        },
        {
            title: "Logo Completo (Branco)",
            svgString: fullLogoSvgString('white', 'white'),
            filename: 'gsb-logo-white',
            darkBg: true,
            width: 420,
            height: 120,
        }
    ];

    const profileAssets = [
        {
            title: "Perfil (Gradiente)",
            svgString: profileSvgString('white', 'gradient'),
            filename: 'gsb-profile-gradient',
            width: 512,
            height: 512,
        },
        {
            title: "Perfil (Branco)",
            svgString: profileSvgString('black', 'white'),
            filename: 'gsb-profile-white',
            width: 512,
            height: 512,
        },
        {
            title: "Perfil (Preto)",
            svgString: profileSvgString('white', 'black'),
            filename: 'gsb-profile-black',
            darkBg: true,
            width: 512,
            height: 512,
        },
    ];

    const fullLogoAssets = [
        {
            title: "Logo Completo (Gradiente)",
            svgString: fullLogoSvgWithBackground('white', 'white', 'gradient'),
            filename: 'gsb-full-logo-gradient',
            width: 1280,
            height: 720,
        },
        {
            title: "Logo Completo (Fundo Branco)",
            svgString: fullLogoSvgWithBackground('black', 'black', 'white'),
            filename: 'gsb-full-logo-white-bg',
            width: 1280,
            height: 720,
        },
        {
            title: "Logo Completo (Fundo Preto)",
            svgString: fullLogoSvgWithBackground('white', 'white', 'black'),
            filename: 'gsb-full-logo-black-bg',
            darkBg: true,
            width: 1280,
            height: 720,
        }
    ];

    return (
        <div className="space-y-4 animate-fade-in">
             <div>
                <h3 className="text-lg font-bold text-gray-800 pt-4">Fotos de Perfil (Instagram/WhatsApp)</h3>
                <p className="text-sm text-gray-500 -mt-1 mb-2">Logos quadrados otimizados para visualização em perfis circulares.</p>
                {profileAssets.map(asset => (
                    <div key={asset.title} className="bg-white p-4 rounded-xl shadow-sm mb-4">
                        <h3 className="font-bold text-gray-800 mb-3">{asset.title}</h3>
                        <div className={`p-4 rounded-lg flex items-center justify-center ${asset.darkBg ? 'bg-gray-100' : 'bg-gray-100'}`}>
                            <img src={`data:image/svg+xml;base64,${btoa(asset.svgString)}`} alt={asset.title} className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md" />
                        </div>
                        <div className="flex justify-end space-x-2 mt-3">
                            <button onClick={() => downloadPng(asset.svgString, `${asset.filename}.png`, asset.width, asset.height)} className="flex items-center space-x-1 bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md hover:bg-gray-300">
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                <span>PNG</span>
                            </button>
                            <button onClick={() => downloadSvg(asset.svgString, `${asset.filename}.svg`)} className="flex items-center space-x-1 bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md hover:bg-gray-300">
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                <span>SVG</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="text-lg font-bold text-gray-800 pt-4">Banners com Logo</h3>
                <p className="text-sm text-gray-500 -mt-1 mb-2">Imagens em alta resolução para fundos de tela e posts.</p>
                {fullLogoAssets.map(asset => (
                    <div key={asset.title} className="bg-white p-4 rounded-xl shadow-sm mb-4">
                        <h3 className="font-bold text-gray-800 mb-3">{asset.title}</h3>
                        <div className={`p-4 rounded-lg flex items-center justify-center ${asset.darkBg ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <img src={`data:image/svg+xml;base64,${btoa(asset.svgString)}`} alt={asset.title} className="h-24 w-auto object-contain" />
                        </div>
                        <div className="flex justify-end space-x-2 mt-3">
                            <button onClick={() => downloadPng(asset.svgString, `${asset.filename}.png`, asset.width, asset.height)} className="flex items-center space-x-1 bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md hover:bg-gray-300">
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                <span>PNG (HD)</span>
                            </button>
                            <button onClick={() => downloadSvg(asset.svgString, `${asset.filename}.svg`)} className="flex items-center space-x-1 bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md hover:bg-gray-300">
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                <span>SVG</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                 <h3 className="text-lg font-bold text-gray-800 pt-4">Logos Padrão</h3>
                {assets.map(asset => (
                    <div key={asset.title} className="bg-white p-4 rounded-xl shadow-sm mt-4">
                        <h3 className="font-bold text-gray-800 mb-3">{asset.title}</h3>
                        <div className={`p-4 rounded-lg flex items-center justify-center ${asset.darkBg ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <img src={`data:image/svg+xml;base64,${btoa(asset.svgString)}`} alt={asset.title} className="h-24" />
                        </div>
                        <div className="flex justify-end space-x-2 mt-3">
                            <button onClick={() => downloadPng(asset.svgString, `${asset.filename}.png`, asset.width * 2, asset.height * 2)} className="flex items-center space-x-1 bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md hover:bg-gray-300">
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                <span>PNG</span>
                            </button>
                            <button onClick={() => downloadSvg(asset.svgString, `${asset.filename}.svg`)} className="flex items-center space-x-1 bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md hover:bg-gray-300">
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                <span>SVG</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdvertisingView: React.FC<AdvertisingViewProps> = ({ groups }) => {
    const [banners, setBanners] = useState<Banner[]>(() => {
        try {
            const savedBanners = localStorage.getItem('generatedBanners');
            return savedBanners ? JSON.parse(savedBanners) : [];
        } catch (error) {
            console.error("Failed to load banners from localStorage", error);
            return [];
        }
    });
    
    useEffect(() => {
        try {
            localStorage.setItem('generatedBanners', JSON.stringify(banners));
        } catch (error) {
            console.error("Failed to save banners to localStorage", error);
        }
    }, [banners]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [platform, setPlatform] = useState<Platform>('post');
    const [selectedGenerationTypes, setSelectedGenerationTypes] = useState<string[]>(['automatic']);
    const [activeTab, setActiveTab] = useState<'generator' | 'gallery' | 'assets'>('generator');
    const [galleryFilter, setGalleryFilter] = useState('all');
    
    // State for editing modal
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [editPrompt, setEditPrompt] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // New state for timer
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef<number | null>(null);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${remainingSeconds}`;
    };

    // Cleanup interval on component unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const handleSelectGenerationType = (value: string) => {
        setPrompt(''); // Clear custom prompt when a type is selected
        if (value === 'automatic' || value === 'all') {
            setSelectedGenerationTypes([value]);
            return;
        }

        const newSelection = selectedGenerationTypes.filter(s => s !== 'automatic' && s !== 'all');
        
        if (newSelection.includes(value)) {
            const filtered = newSelection.filter(s => s !== value);
            setSelectedGenerationTypes(filtered.length > 0 ? filtered : ['automatic']);
        } else {
            setSelectedGenerationTypes([...newSelection, value]);
        }
    };
    
    const generateBanner = async (generationPrompt: string, services: string[]) => {
        const response = await fetch('/api/ai-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                requestType: 'image-generate',
                prompt: generationPrompt,
            }),
        });
        const data = await response.json();

        if (!response.ok || data.error) throw new Error(data.error || "Falha ao gerar banner.");
        if (!data.image) throw new Error("A IA não retornou uma imagem.");

        const imageUrl = `data:image/png;base64,${data.image}`;
        const newBanner: Banner = { id: Date.now(), url: imageUrl, services, platform };
        setBanners(prev => [newBanner, ...prev]);
        setActiveTab('gallery');
    };
    
    const getPopularMovieForService = async (providerId: number, serviceName: string) => {
        const movieRes = await fetch(`${TMDB_BASE_URL}/discover/movie?with_watch_providers=${providerId}&watch_region=BR&sort_by=popularity.desc&api_key=${TMDB_API_KEY}&language=pt-BR`);
        if (!movieRes.ok) throw new Error(`Falha ao buscar filmes populares para ${serviceName}.`);
        const movieData = await movieRes.json();
        const popularMovie = movieData.results?.[Math.floor(Math.random() * Math.min(10, movieData.results.length))];

        if (!popularMovie) {
            const trendingRes = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=pt-BR`);
            const trendingData = await trendingRes.json();
            const fallbackMovie = trendingData.results?.[0];
            if (!fallbackMovie) throw new Error(`Não foram encontrados filmes para ${serviceName}.`);
            return fallbackMovie;
        }
        return popularMovie;
    };
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setElapsedTime(0);
        timerRef.current = window.setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        try {
            if (prompt.trim()) {
                const systemInstruction = 'Você é um especialista em cinema que recomenda filmes. Sua resposta deve ser estritamente um objeto JSON com a chave "title", sem nenhum texto ou formatação extra. O título do filme deve ser em Português do Brasil.';
                const responseSchema = { type: Type.OBJECT, properties: { title: { type: Type.STRING, description: "O título do filme." } }, required: ["title"] };
                const aiResponse = await fetch('/api/ai-search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        requestType: 'text',
                        prompt: `Sugira um filme real e popular com base na seguinte descrição: "${prompt}"`,
                        systemInstruction,
                        responseSchema
                    })
                });
                if (!aiResponse.ok) { const errorData = await aiResponse.json(); throw new Error(errorData.error || "A IA não conseguiu identificar um filme."); }
                const movieSuggestion = await aiResponse.json();
                if (!movieSuggestion.title) throw new Error("A IA não sugeriu um filme. Tente uma descrição diferente.");

                const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(movieSuggestion.title)}`;
                const tmdbSearchRes = await fetch(searchUrl);
                const tmdbSearchData = await tmdbSearchRes.json();
                const tmdbMovie = tmdbSearchData.results?.[0];
                if (!tmdbMovie) throw new Error(`Não encontramos o filme "${movieSuggestion.title}" em nosso banco de dados.`);

                const providersRes = await fetch(`${TMDB_BASE_URL}/movie/${tmdbMovie.id}/watch/providers?api_key=${TMDB_API_KEY}`);
                const providersData = await providersRes.json();
                const brProviders = providersData.results?.BR?.flatrate || [];
                let service: AvailableService | undefined;
                for (const provider of brProviders) {
                    const knownServiceId = Object.keys(TMDB_PROVIDER_IDS).find(key => TMDB_PROVIDER_IDS[key] === provider.provider_id);
                    if (knownServiceId) { service = AVAILABLE_SERVICES_DATA.find(s => s.id === knownServiceId); if (service) break; }
                }
                if (!service) throw new Error(`O filme "${tmdbMovie.title}" não parece estar disponível nos serviços que cobrimos.`);

                const finalPrompt = `Crie uma arte de divulgação profissional para o filme "${tmdbMovie.title}", no estilo de um pôster oficial para o serviço de streaming "${service.name}". A imagem deve ser vibrante, atraente e baseada em elementos visuais reais do filme.`;
                await generateBanner(finalPrompt, ['custom', service.id]);
            } else {
                if (selectedGenerationTypes.length === 0) throw new Error("Por favor, selecione um tipo de conteúdo.");
                
                if (selectedGenerationTypes.length > 1) {
                    const serviceIds = selectedGenerationTypes;
                    const moviePromises = serviceIds.map(id => {
                        const service = AVAILABLE_SERVICES_DATA.find(s => s.id === id)!;
                        const providerId = TMDB_PROVIDER_IDS[id];
                        return getPopularMovieForService(providerId, service.name).then(movie => ({ movie, service }));
                    });
                    const results = await Promise.all(moviePromises);

                    const randomResult = results[Math.floor(Math.random() * results.length)];
                    const { movie, service } = randomResult;
                    const collagePrompt = `Crie uma arte de divulgação profissional para o filme "${movie.title}", no estilo de um pôster oficial para o serviço de streaming "${service.name}". A imagem deve ser vibrante, atraente e baseada em elementos visuais reais do filme.`;
                    await generateBanner(collagePrompt, serviceIds);
                } else {
                    const selection = selectedGenerationTypes[0];
                    let service: AvailableService | undefined;
                    let providerId: number | undefined;

                    if (selection === 'automatic') {
                        const availableGroups = groups.filter(g => AVAILABLE_SERVICES_DATA.some(s => s.logoUrl === g.logo && TMDB_PROVIDER_IDS[s.id]));
                        if (availableGroups.length === 0) throw new Error("Não há grupos com serviços de streaming válidos para a geração automática.");
                        const randomGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];
                        service = AVAILABLE_SERVICES_DATA.find(s => s.logoUrl === randomGroup.logo);
                    } else if (selection === 'all') {
                        const allAvailableServices = AVAILABLE_SERVICES_DATA.filter(s => TMDB_PROVIDER_IDS[s.id]);
                        service = allAvailableServices[Math.floor(Math.random() * allAvailableServices.length)];
                    } else {
                        service = AVAILABLE_SERVICES_DATA.find(s => s.id === selection);
                    }

                    if (!service) throw new Error("Não foi possível selecionar um serviço.");
                    providerId = TMDB_PROVIDER_IDS[service.id];
                    if (!providerId) throw new Error(`Serviço "${service.name}" não está configurado para busca.`);
                    
                    const movie = await getPopularMovieForService(providerId, service.name);
                    const finalPrompt = `Crie uma arte de divulgação profissional para o filme "${movie.title}", no estilo de um pôster oficial para o serviço de streaming "${service.name}". A imagem deve ser vibrante, atraente e baseada em elementos visuais reais do filme.`;
                    
                    await generateBanner(finalPrompt, [service.id]);
                }
            }
        } catch (err: any) {
            console.error("Erro ao gerar banner:", err);
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };
    
    const handleEditImage = async () => {
        if (!editingBanner || !editPrompt.trim()) return;
        setIsEditing(true);
        setError(null);
        setElapsedTime(0);
        timerRef.current = window.setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        try {
            const base64Image = editingBanner.url.split(',')[1];

            const response = await fetch('/api/ai-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestType: 'image-edit',
                    prompt: editPrompt,
                    base64Image: base64Image
                })
            });
            const data = await response.json();
            if (!response.ok || data.error) throw new Error(data.error);

            const newImageUrl = `data:image/png;base64,${data.image}`;
            setBanners(prev => prev.map(b => b.id === editingBanner.id ? { ...b, url: newImageUrl } : b));
            setEditingBanner(null);
            setEditPrompt('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsEditing(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const filteredBanners = banners.filter(b => galleryFilter === 'all' || b.services.includes(galleryFilter));
    const galleryServices = [{ id: 'all', name: 'Todos' }, ...AVAILABLE_SERVICES_DATA.filter(s => banners.some(b => b.services.includes(s.id)))];

    return (
        <div className="p-4 space-y-4">
            <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
            <div className="flex justify-center bg-gray-200 p-1 rounded-lg">
                <button onClick={() => setActiveTab('generator')} className={`w-1/3 py-2 rounded-md font-semibold text-sm ${activeTab === 'generator' ? 'bg-white shadow' : 'text-gray-600'}`}>Gerador</button>
                <button onClick={() => setActiveTab('gallery')} className={`w-1/3 py-2 rounded-md font-semibold text-sm ${activeTab === 'gallery' ? 'bg-white shadow' : 'text-gray-600'}`}>Galeria</button>
                <button onClick={() => setActiveTab('assets')} className={`w-1/3 py-2 rounded-md font-semibold text-sm ${activeTab === 'assets' ? 'bg-white shadow' : 'text-gray-600'}`}>Kit de Mídia</button>
            </div>

            {activeTab === 'generator' && (
                <div className="space-y-4 animate-fade-in">
                     <div className="p-4 bg-white rounded-xl shadow-sm space-y-3">
                        <h3 className="font-bold text-gray-800">1. Escolha o Conteúdo</h3>
                        <ServiceCarousel options={generationOptions} selected={selectedGenerationTypes} onSelect={handleSelectGenerationType} />
                    </div>

                    <div className="p-4 bg-white rounded-xl shadow-sm space-y-3">
                        <h3 className="font-bold text-gray-800">2. Ou descreva sua ideia (Opcional)</h3>
                        <div className="relative">
                            <PencilSquareIcon className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => { setPrompt(e.target.value); setSelectedGenerationTypes([]); }}
                                placeholder="Ex: Aquele filme do cara de matrix com o cachorro"
                                className="w-full bg-gray-100 border-gray-200 rounded-lg p-3 pl-10 text-gray-800 focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl shadow-sm space-y-3">
                        <h3 className="font-bold text-gray-800">3. Escolha o Formato</h3>
                        <div className="flex space-x-2">
                            {Object.entries(platformConfig).map(([key, config]) => (
                                <button
                                    key={key}
                                    onClick={() => setPlatform(key as Platform)}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${platform === key ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    {config.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center text-sm font-semibold">{error}</div>}

                    <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-red-500 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <SparklesIcon className="w-5 h-5" />
                        )}
                        <span>{isLoading ? `Gerando Mágica... (${formatTime(elapsedTime)})` : 'Gerar Banner com IA'}</span>
                    </button>
                    {isLoading && <p className="text-sm text-center text-gray-500 mt-2">A IA está criando sua obra de arte. Isso pode levar um momento...</p>}
                </div>
            )}
            
            {activeTab === 'gallery' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                        {galleryServices.map(service => (
                            <button key={service.id} onClick={() => setGalleryFilter(service.id)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold ${galleryFilter === service.id ? 'bg-purple-600 text-white' : 'bg-white'}`}>{service.name}</button>
                        ))}
                    </div>
                    {banners.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {filteredBanners.map(banner => (
                                <div key={banner.id} className="relative group aspect-w-1 aspect-h-1">
                                    <img src={banner.url} alt="Banner gerado" className="w-full h-full object-cover rounded-lg shadow-md" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                                        <a href={banner.url} download={`gsb-banner-${banner.id}.png`} className="p-2 bg-white/80 rounded-full text-gray-800 hover:scale-110 transition-transform" title="Baixar Imagem">
                                            <ArrowDownTrayIcon className="w-5 h-5" />
                                        </a>
                                        <button onClick={() => setEditingBanner(banner)} className="p-2 bg-white/80 rounded-full text-gray-800 hover:scale-110 transition-transform" title="Editar com IA">
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-lg">
                            <p className="font-semibold text-gray-600">Sua galeria está vazia</p>
                            <p className="text-sm text-gray-400 mt-1">Gere um banner para vê-lo aqui.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'assets' && <BrandAssetsView />}

            {editingBanner && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-xl text-gray-800">Editar Banner com IA</h3>
                            <button onClick={() => setEditingBanner(null)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100"><XMarkIcon className="w-6 h-6"/></button>
                        </div>
                        <img src={editingBanner.url} alt="Banner para editar" className="rounded-lg max-h-64 mx-auto" />
                        <textarea
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="Descreva a alteração. Ex: 'Adicione fogos de artifício no céu' ou 'Mude a cor de fundo para azul escuro'."
                            className="w-full h-20 bg-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                        />
                        {error && isEditing && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setEditingBanner(null)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg">Cancelar</button>
                            <button onClick={handleEditImage} disabled={isEditing || !editPrompt} className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg disabled:bg-gray-400 flex items-center space-x-2">
                               {isEditing && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                               <span>{isEditing ? `Gerando... (${formatTime(elapsedTime)})` : 'Regenerar'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvertisingView;
