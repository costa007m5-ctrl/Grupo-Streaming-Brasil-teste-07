import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, GrupoStreamingBrasilLogo } from './Icons';
import { AVAILABLE_SERVICES_DATA, TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '../constants';
import type { MovieInfo } from '../types';


interface WelcomeScreenProps {
    onNavigateToLogin: () => void;
    onNavigateToSignUp: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigateToLogin, onNavigateToSignUp }) => {
    const [movies, setMovies] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`);
                const data = await response.json();
                const movieData = data.results
                  .filter((m: any) => m.poster_path)
                  .map((movie: any) => ({
                    id: movie.id,
                    posterUrl: `${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${movie.poster_path}`,
                    title: movie.title,
                }));
                // Duplicate the array to ensure smooth looping for the animation
                setMovies([...movieData, ...movieData]);
            } catch (error) {
                console.error("Failed to fetch popular movies for welcome screen:", error);
            }
        };
        fetchPopularMovies();
    }, []);

    const streamingLogos = AVAILABLE_SERVICES_DATA.slice(0, 8).map(s => s.logoUrl);

    return (
        <div className="min-h-screen bg-[#10081C] text-white flex flex-col overflow-hidden">
            <style>{`
                @keyframes scroll-col {
                    from { transform: translateY(0); }
                    to { transform: translateY(-50%); }
                }
                .poster-column {
                    animation: scroll-col linear infinite;
                }
            `}</style>
            
            <div className="absolute inset-0 z-0 h-full w-full overflow-hidden mask-image-gradient">
                <div className="absolute inset-0 flex justify-center gap-4 opacity-20">
                   {Array.from({ length: 5 }).map((_, colIndex) => (
                       <div 
                         key={colIndex} 
                         className="poster-column flex flex-col gap-4 w-1/5"
                         style={{ 
                            animationDuration: `${20 + colIndex * 5}s`,
                            animationDirection: colIndex % 2 === 0 ? 'normal' : 'reverse'
                         }}
                       >
                           {movies.map((movie, movieIndex) => (
                               <div key={`${colIndex}-${movieIndex}-${movie.id}`} className="aspect-[2/3] w-full flex-shrink-0">
                                   <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover rounded-lg" loading="lazy" />
                               </div>
                           ))}
                       </div>
                   ))}
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#10081C] via-[#10081C]/80 to-transparent z-10"></div>
            
            <main className="flex-grow flex flex-col justify-center items-center text-center p-6 relative z-10">
                <GrupoStreamingBrasilLogo svgClassName="w-24" textClassName="text-lg" />
                 <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-4" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
                    Todos os streamings, <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-red-400">um só lugar.</span>
                </h1>
                <p className="mt-4 text-gray-300 max-w-sm mx-auto" style={{textShadow: '0 1px 5px rgba(0,0,0,0.5)'}}>
                    A forma mais inteligente de compartilhar suas assinaturas e economizar, descobrindo novos filmes e séries.
                </p>
            </main>

            <footer className="sticky bottom-0 z-20 p-6">
                <div className="space-y-4 max-w-md mx-auto">
                    <button 
                        onClick={onNavigateToSignUp}
                        className="w-full bg-gradient-to-r from-purple-600 to-red-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                    >
                        <span>Criar conta grátis</span>
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={onNavigateToLogin}
                        className="w-full bg-white/10 backdrop-blur-sm text-white font-bold py-4 rounded-xl text-lg shadow-sm border border-white/20 hover:bg-white/20 transition-colors"
                    >
                        Já tenho conta
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default WelcomeScreen;