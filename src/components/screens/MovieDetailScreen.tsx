import React, { useState, useEffect, useRef } from 'react';
import type { MovieInfo, Group } from '../../types';
import { ArrowLeftIcon, StarIcon, UsersIcon, PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, SpeakerWaveIcon, SpeakerXMarkIcon, PlusIcon, CheckIcon } from '../ui/Icons';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '../../utils';
import { useSoundSettings } from '../../contexts/SoundContext';

interface MovieDetailScreenProps {
  movie: MovieInfo;
  allGroups: Group[];
  onBack: () => void;
  onSelectGroup: (group: Group) => void;
  onSelectMovie: (movieId: number) => void;
  myList: number[];
  addToMyList: (id: number) => void;
  removeFromMyList: (id: number) => void;
  isInMyList: (id: number) => boolean;
}

const GroupCard: React.FC<{ group: Group; onSelect: () => void }> = ({ group, onSelect }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100/50">
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">{group.name}</h3>
                    <p className="text-sm text-gray-500">Anfitrião: {group.host_name}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xl font-bold text-purple-700">R$ {group.price.toFixed(2).replace('.', ',')}</p>
                    <div className="flex items-center justify-end space-x-1 text-xs text-gray-500 font-medium">
                        <UsersIcon className="w-3 h-3"/>
                        <span>{group.members}/{group.max_members}</span>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <img src={group.members_list[0]?.avatarUrl || 'https://img.icons8.com/color/96/yoda.png'} alt={group.host_name} className="w-8 h-8 rounded-full" />
                    <p className="text-sm font-semibold text-gray-800">{group.host_name}</p>
                </div>
                <button 
                    onClick={onSelect}
                    className="bg-purple-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                    Participar
                </button>
            </div>
        </div>
    </div>
);


const MovieDetailScreen: React.FC<MovieDetailScreenProps> = ({ movie, allGroups, onBack, onSelectGroup, onSelectMovie, myList, addToMyList, removeFromMyList, isInMyList }) => {
    const { playTrailerSound } = useSoundSettings();
    const [similarMovies, setSimilarMovies] = useState<any[]>([]);
    const [providers, setProviders] = useState<any[]>([]);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true); // Autoplay starts as true
    const [loadingExtras, setLoadingExtras] = useState(true);
    
    const playerRef = useRef<any>(null);
    const playerReady = useRef(false);

    const relevantGroups = allGroups.filter(g => 
        ((g.logo || '').includes(movie.serviceId)) || 
        ((g.name || '').toLowerCase().includes(movie.serviceName.split(' ')[0].toLowerCase()))
    );

    useEffect(() => {
        const fetchDetails = async () => {
            setLoadingExtras(true);
            setTrailerKey(null);
            playerReady.current = false;
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                playerRef.current.destroy();
                playerRef.current = null;
            }
            
            try {
                const [similarRes, providersRes, videoRes] = await Promise.all([
                    fetch(`${TMDB_BASE_URL}/movie/${movie.id}/recommendations?api_key=${TMDB_API_KEY}&language=pt-BR`),
                    fetch(`${TMDB_BASE_URL}/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`),
                    fetch(`${TMDB_BASE_URL}/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`)
                ]);

                const similarData = await similarRes.json();
                setSimilarMovies(similarData.results || []);

                const providersData = await providersRes.json();
                setProviders(providersData.results?.BR?.flatrate || []);
                
                const videoData = await videoRes.json();
                const trailer = videoData.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
                if (trailer) {
                    setTrailerKey(trailer.key);
                }

            } catch (e) {
                console.error("Failed to fetch extra movie details", e);
            } finally {
                setLoadingExtras(false);
            }
        };

        if (movie.id) {
            fetchDetails();
        }
    }, [movie.id]);

    useEffect(() => {
        if (!trailerKey) return;

        const createPlayer = () => {
             if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                playerRef.current.destroy();
            }
            playerRef.current = new (window as any).YT.Player('youtube-player', {
                videoId: trailerKey,
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    controls: 0,
                    loop: 1,
                    playlist: trailerKey,
                    showinfo: 0,
                    iv_load_policy: 3,
                    modestbranding: 1,
                    rel: 0
                },
                events: {
                    onReady: () => {
                        playerReady.current = true;
                        setIsPlaying(true);
                        if (playTrailerSound) {
                            playerRef.current.unMute();
                            setIsMuted(false);
                        } else {
                            playerRef.current.mute();
                            setIsMuted(true);
                        }
                    },
                    onStateChange: (event: any) => {
                        setIsPlaying(event.data === (window as any).YT.PlayerState.PLAYING);
                    }
                }
            });
        };

        if (!(window as any).YT || !(window as any).YT.Player) {
            const tag = document.createElement('script');
            if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            }
            (window as any).onYouTubeIframeAPIReady = createPlayer;
        } else {
            createPlayer();
        }

        return () => {
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                playerRef.current.destroy();
            }
             if ((window as any).onYouTubeIframeAPIReady) {
                (window as any).onYouTubeIframeAPIReady = null;
            }
        };
    }, [trailerKey, playTrailerSound]);

    const handlePlayPause = () => {
        if (!playerReady.current) return;
        const playerState = playerRef.current.getPlayerState();
        if (playerState === (window as any).YT.PlayerState.PLAYING) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const handleMuteToggle = () => {
        if (!playerReady.current) return;
        if (playerRef.current.isMuted()) {
            playerRef.current.unMute();
            setIsMuted(false);
        } else {
            playerRef.current.mute();
            setIsMuted(true);
        }
    };

    const handleRewind = () => {
        if (!playerReady.current) return;
        const currentTime = playerRef.current.getCurrentTime();
        playerRef.current.seekTo(currentTime - 10, true);
    };

    const handleForward = () => {
        if (!playerReady.current) return;
        const currentTime = playerRef.current.getCurrentTime();
        playerRef.current.seekTo(currentTime + 10, true);
    };

    const handleMyListToggle = () => {
        if (isInMyList(movie.id)) {
            removeFromMyList(movie.id);
        } else {
            addToMyList(movie.id);
        }
    };


    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="relative h-64 sm:h-80 bg-black group">
                 {trailerKey ? (
                    <div id="youtube-player" className="absolute inset-0 w-full h-full" />
                ) : (
                    <>
                        <img src={movie.backdropUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-gray-100/70 to-transparent"></div>
                    </>
                )}

                {trailerKey && (
                    <>
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center space-x-6 z-10">
                            <button onClick={handleRewind} className="text-white p-2 rounded-full hover:bg-white/20 transition-colors">
                                <BackwardIcon className="w-8 h-8" />
                            </button>
                            <button onClick={handlePlayPause} className="text-white p-2 rounded-full hover:bg-white/20 transition-colors">
                                {isPlaying ? <PauseIcon className="w-12 h-12" /> : <PlayIcon className="w-12 h-12" />}
                            </button>
                            <button onClick={handleForward} className="text-white p-2 rounded-full hover:bg-white/20 transition-colors">
                                <ForwardIcon className="w-8 h-8" />
                            </button>
                        </div>
                        <button
                            onClick={handleMuteToggle}
                            className="absolute bottom-4 right-4 z-20 p-2 bg-black/60 rounded-full text-white backdrop-blur-sm transition-opacity hover:opacity-80"
                            aria-label={isMuted ? "Ativar som" : "Desativar som"}
                        >
                            {isMuted ? <SpeakerXMarkIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                        </button>
                    </>
                )}
                
                <header className="absolute top-0 left-0 right-0 p-4 z-20">
                     <button onClick={onBack} className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                </header>
            </div>

            <main className="-mt-32 relative px-4 pb-10 space-y-6">
                <section className="flex items-end space-x-4">
                    <img src={movie.posterUrl} alt={`Pôster de ${movie.title}`} className="w-32 h-48 rounded-lg shadow-2xl object-cover flex-shrink-0" />
                    <div className="space-y-1 text-gray-800 pb-2">
                        <h1 className="text-3xl font-extrabold leading-tight" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>{movie.title}</h1>
                        <div className="flex items-center space-x-3 text-sm font-medium text-gray-600">
                             <div className="flex items-center space-x-1">
                                <StarIcon className="w-4 h-4 text-yellow-500" solid />
                                <span>{movie.rating.toFixed(1)}</span>
                            </div>
                            <span>•</span>
                            <span>{movie.releaseYear}</span>
                        </div>
                    </div>
                </section>
                
                 <div className="flex items-center space-x-3">
                    <button className="flex-grow flex items-center justify-center space-x-2 bg-gray-800 text-white font-bold py-3 rounded-md hover:bg-gray-900 transition">
                        <PlayIcon className="w-6 h-6"/>
                        <span>Assistir</span>
                    </button>
                    <button onClick={handleMyListToggle} title="Adicionar à Minha Lista" className="flex items-center justify-center w-12 h-12 border-2 border-gray-400 text-gray-800 rounded-md hover:border-gray-800 transition">
                        {isInMyList(movie.id) ? <CheckIcon className="w-6 h-6" /> : <PlusIcon className="w-6 h-6"/>}
                    </button>
                </div>


                <section>
                    <div className="flex flex-wrap gap-2">
                        {movie.genres.map(genre => (
                            <span key={genre} className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">{genre}</span>
                        ))}
                    </div>
                </section>

                <section className="bg-white p-4 rounded-xl shadow-sm">
                     <h2 className="font-bold text-gray-800 text-lg mb-2">Sinopse</h2>
                     <p className="text-gray-600 leading-relaxed text-sm">{movie.description}</p>
                </section>
                
                <section className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="font-bold text-gray-800 text-lg mb-3">Disponível em</h2>
                    {providers.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {providers.map(provider => (
                                <div key={provider.provider_id} className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                                    <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w92')}${provider.logo_path}`} alt={provider.provider_name} className="w-8 h-8 rounded-md" />
                                    <span className="text-sm font-semibold text-gray-700">{provider.provider_name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Informação de streaming não encontrada para esta região.</p>
                    )}
                </section>

                <section>
                    <h2 className="font-bold text-gray-800 text-xl mb-3">Grupos disponíveis para assistir</h2>
                    <div className="space-y-4">
                        {relevantGroups.length > 0 ? (
                            relevantGroups.map(group => (
                                <GroupCard key={group.id} group={group} onSelect={() => onSelectGroup(group)} />
                            ))
                        ) : (
                            <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                                <p className="font-semibold text-gray-600">Nenhum grupo encontrado</p>
                                <p className="text-sm text-gray-400 mt-1">Ainda não há grupos disponíveis para {movie.serviceName}.</p>
                                <button className="mt-4 bg-purple-100 text-purple-700 font-semibold py-2 px-4 rounded-lg">Criar um grupo</button>
                            </div>
                        )}
                    </div>
                </section>

                {similarMovies.length > 0 && (
                    <section>
                        <h2 className="font-bold text-gray-800 text-xl mb-3">Filmes Parecidos</h2>
                        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                            {similarMovies.slice(0, 10).map(similar => (
                                similar.poster_path && (
                                    <button key={similar.id} onClick={() => onSelectMovie(similar.id)} className="flex-shrink-0 w-32 text-left group">
                                        <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${similar.poster_path}`} alt={similar.title} className="w-full h-48 rounded-lg shadow-lg object-cover mb-2 transition-transform duration-300 group-hover:scale-105" />
                                        <h3 className="text-sm font-semibold text-gray-800 truncate">{similar.title}</h3>
                                    </button>
                                )
                            ))}
                        </div>
                         <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
                    </section>
                )}
            </main>
        </div>
    );
};

export default MovieDetailScreen;