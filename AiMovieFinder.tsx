import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { MovieInfo, Group, AvailableService } from '../types';
import { SparklesIcon, UsersIcon } from './Icons';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, AVAILABLE_SERVICES_DATA, TMDB_PROVIDER_IDS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

interface AiMovieFinderProps {
    onSelectMovie: (movieId: number) => void;
    onSelectGroup: (group: Group) => void;
    allGroups: Group[];
}

interface AiResult {
    movie: MovieInfo;
    providers: AvailableService[];
    relevantGroups: Group[];
}

const MovieResultCard: React.FC<{ result: AiResult; onSelectMovie: (id: number) => void; onSelectGroup: (group: Group) => void; }> = ({ result, onSelectMovie, onSelectGroup }) => {
    const { theme } = useTheme();
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

    return (
        <div className="mt-4 space-y-4 animate-fade-in">
            <div className={`flex items-start space-x-4 p-4 ${cardBg} rounded-lg`}>
                <img src={result.movie.posterUrl} alt={result.movie.title} className="w-24 h-36 rounded-lg shadow-md object-cover" />
                <div className="flex-1">
                    <h3 className={`text-lg font-bold ${textColor}`}>{result.movie.title} ({result.movie.releaseYear})</h3>
                    <p className={`text-xs ${subTextColor} line-clamp-3 mt-1`}>{result.movie.description}</p>
                    <button onClick={() => onSelectMovie(result.movie.id)} className="text-sm font-semibold text-purple-600 mt-2">Ver mais detalhes</button>
                </div>
            </div>
            
            {result.providers.length > 0 && (
                <div>
                    <h4 className={`font-semibold ${textColor} mb-2`}>Disponível em:</h4>
                    <div className="flex flex-wrap gap-2">
                        {result.providers.map(p => (
                            <div key={p.id} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg px-2 py-1 flex items-center space-x-1.5`}>
                                <img src={p.logoUrl} alt={p.name} className="w-5 h-5 object-contain" />
                                <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {result.relevantGroups.length > 0 && (
                <div>
                    <h4 className={`font-semibold ${textColor} mb-2`}>Grupos disponíveis:</h4>
                    <div className="space-y-2">
                        {result.relevantGroups.map(group => (
                            <div key={group.id} className={`border p-3 rounded-lg flex justify-between items-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                <div>
                                    <p className={`font-semibold text-sm ${textColor}`}>{group.name}</p>
                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                        <div className="flex items-center space-x-1"><UsersIcon className="w-3 h-3"/><span>{group.members}/{group.max_members}</span></div>
                                        <span>•</span>
                                        <p>R$ {group.price.toFixed(2).replace('.', ',')}</p>
                                    </div>
                                </div>
                                <button onClick={() => onSelectGroup(group)} className="bg-purple-600 text-white font-semibold text-sm py-2 px-4 rounded-lg">Entrar</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             {result.providers.length > 0 && result.relevantGroups.length === 0 && (
                <p className={`text-sm text-center p-3 rounded-lg ${theme === 'dark' ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-100'}`}>Nenhum grupo encontrado para este filme no momento. Que tal criar um?</p>
             )}
        </div>
    );
};

const AiMovieFinder: React.FC<AiMovieFinderProps> = ({ onSelectMovie, onSelectGroup, allGroups }) => {
    const { theme } = useTheme();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AiResult | null>(null);

    const mainBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
    const inputBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    
    const runAiSearch = async (aiPrompt: string) => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const systemInstruction = 'Você é um especialista em cinema que recomenda filmes. Sua resposta deve ser estritamente um objeto JSON com as chaves "title" e, opcionalmente, "year", sem nenhum texto ou formatação extra. O título do filme deve ser em Português do Brasil.';
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "O título do filme." },
                    year: { type: Type.STRING, description: "O ano de lançamento do filme (opcional)." }
                },
                required: ["title"]
            };

            const apiResponse = await fetch('/api/ai-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: aiPrompt,
                    systemInstruction: systemInstruction,
                    responseSchema: responseSchema
                })
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                throw new Error(errorData.error || "A IA não conseguiu responder.");
            }

            const movieSuggestion = await apiResponse.json();
            
            if (!movieSuggestion.title) {
                throw new Error("A IA não conseguiu sugerir um filme. Tente uma descrição diferente.");
            }

            let searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(movieSuggestion.title)}`;
            if (movieSuggestion.year) {
                searchUrl += `&year=${movieSuggestion.year}`;
            }
            const tmdbSearchRes = await fetch(searchUrl);
            const tmdbSearchData = await tmdbSearchRes.json();
            const movieDetails = tmdbSearchData.results?.[0];

            if (!movieDetails) {
                throw new Error(`Não encontramos o filme "${movieSuggestion.title}" em nosso banco de dados.`);
            }

            const providersRes = await fetch(`${TMDB_BASE_URL}/movie/${movieDetails.id}/watch/providers?api_key=${TMDB_API_KEY}`);
            const providersData = await providersRes.json();
            const brProviders = providersData.results?.BR?.flatrate || [];

            const availableServices: AvailableService[] = [];
            for (const provider of brProviders) {
                const knownServiceId = Object.keys(TMDB_PROVIDER_IDS).find(
                    key => TMDB_PROVIDER_IDS[key] === provider.provider_id
                );
                if (knownServiceId) {
                    const knownService = AVAILABLE_SERVICES_DATA.find(s => s.id === knownServiceId);
                    if (knownService && !availableServices.some(s => s.id === knownService.id)) {
                        availableServices.push(knownService);
                    }
                }
            }

            const movieInfo: MovieInfo = {
                id: movieDetails.id,
                title: movieDetails.title,
                description: movieDetails.overview,
                backdropUrl: `${TMDB_IMAGE_BASE_URL}${movieDetails.backdrop_path}`,
                posterUrl: `${TMDB_IMAGE_BASE_URL}${movieDetails.poster_path}`,
                rating: movieDetails.vote_average,
                genres: [],
                releaseYear: new Date(movieDetails.release_date).getFullYear(),
                serviceId: availableServices[0]?.id || '',
                serviceName: availableServices[0]?.name || 'N/A',
                serviceLogoUrl: availableServices[0]?.logoUrl || '',
            };
            
            const serviceIds = availableServices.map(s => s.id);
            const serviceNames = availableServices.map(s => s.name.toLowerCase().split(' ')[0]);
            const relevantGroups = allGroups.filter(g => 
                serviceIds.some(id => (g.logo || '').includes(id)) ||
                serviceNames.some(name => g.name.toLowerCase().includes(name))
            ).slice(0, 3);
            
            setResult({
                movie: movieInfo,
                providers: availableServices,
                relevantGroups: relevantGroups,
            });

        } catch (err: any) {
            console.error("AI Movie Finder Error:", err);
            setError(err.message || "Ocorreu um erro. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscover = () => {
        if (!prompt.trim()) {
            setError("Por favor, descreva o filme que você quer encontrar.");
            return;
        }
        const aiPrompt = `Sugira um filme com base na seguinte descrição: "${prompt}"`;
        runAiSearch(aiPrompt);
    };

    const handleChoiceOfDay = () => {
        const aiPrompt = `Sugira um filme popular e bem avaliado para hoje, que você chamaria de "A Escolha do Dia".`;
        runAiSearch(aiPrompt);
    };

    return (
        <div className={`${mainBg} p-4 rounded-2xl shadow-sm space-y-4`}>
            <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
            <div className="text-center">
                <SparklesIcon className="w-8 h-8 mx-auto text-purple-500" />
                <h2 className={`text-xl font-bold ${textColor}`}>Buscador Mágico (IA)</h2>
                <p className={`text-sm ${subTextColor}`}>Não sabe o nome do filme? Deixe que a gente descobre!</p>
            </div>
            
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: um filme sobre um espião que viaja no tempo para impedir um desastre..."
                className={`w-full h-20 ${inputBg} border ${inputBorder} rounded-lg p-3 ${textColor} focus:ring-2 focus:ring-purple-500`}
            />
            <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={handleDiscover} disabled={isLoading} className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400">
                    Descobrir Filme
                </button>
                <button onClick={handleChoiceOfDay} disabled={isLoading} className={`flex-1 font-bold py-3 rounded-xl text-base shadow-lg transition-colors disabled:bg-gray-400 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-700 text-white hover:bg-gray-800'}`}>
                    Escolha do Dia
                </button>
            </div>
            
            {isLoading && (
                <div className="flex flex-col items-center justify-center p-6">
                    <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                    <p className={`mt-4 font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Nossa IA está procurando...</p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-center text-sm font-semibold">
                    {error}
                </div>
            )}

            {result && (
                <MovieResultCard result={result} onSelectMovie={onSelectMovie} onSelectGroup={onSelectGroup} />
            )}
        </div>
    );
};

export default AiMovieFinder;