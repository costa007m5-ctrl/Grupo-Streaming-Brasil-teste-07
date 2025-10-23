import React, { useState, useEffect, useRef } from 'react';
import type { TvShow, Group, Profile, ChatMessage } from '../../types';
import { PlayIcon, PlusIcon, XMarkIcon, CheckIcon, ShareIcon, PauseIcon, BackwardIcon, ForwardIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '../ui/Icons';
import { TMDB_IMAGE_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from '../../utils';
import { useSoundSettings } from '../../contexts/SoundContext';

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

interface PrimeVideoDetailScreenProps {
    item: ContentItem;
    onBack: () => void;
    onSelectGroup: (group: Group) => void;
    onSelectItem: (item: ContentItem) => void;
    myList: number[];
    addToMyList: (id: number) => void;
    removeFromMyList: (id: number) => void;
    isInMyList: (id: number) => boolean;
    onViewAllGroups: () => void;
    myGroups: Group[];
    profile: Profile | null;
    onSendMessage: (groupId: number, message: ChatMessage) => void;
}

const PrimeVideoDetailScreen: React.FC<PrimeVideoDetailScreenProps> = ({ item, onBack, onSelectGroup, onSelectItem, isInMyList, addToMyList, removeFromMyList, onViewAllGroups, myGroups, profile, onSendMessage }) => {
    const { playTrailerSound } = useSoundSettings();
    const [showJoinOptions, setShowJoinOptions] = useState(false);
    const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const playerRef = useRef<any>(null);
    const playerReady = useRef(false);
    
    const isMovie = 'title' in item;
    const title = isMovie ? item.title : item.name;
    const releaseYear = isMovie ? new Date(item.release_date).getFullYear() : (item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'N/A');

    useEffect(() => {
        const fetchDetails = async () => {
            const type = isMovie ? 'movie' : 'tv';
            try {
                const [recommendationsRes, videoRes] = await Promise.all([
                    fetch(`${TMDB_BASE_URL}/${type}/${item.id}/recommendations?api_key=${TMDB_API_KEY}&language=pt-BR`),
                    fetch(`${TMDB_BASE_URL}/${type}/${item.id}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`)
                ]);

                const recData = await recommendationsRes.json();
                setRecommendations(recData.results.filter((r: any) => r.poster_path));

                const videoData = await videoRes.json();
                const trailer = videoData.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
                setTrailerKey(trailer?.key || videoData.results?.[0]?.key || null);

            } catch (error) {
                console.error("Failed to fetch details", error);
            }
        };
        fetchDetails();
    }, [item.id, isMovie]);
    
    useEffect(() => {
        if (!trailerKey) return;
        const createPlayer = () => {
             if (playerRef.current && typeof playerRef.current.destroy === 'function') playerRef.current.destroy();
            playerRef.current = new (window as any).YT.Player('youtube-player-prime', {
                videoId: trailerKey,
                playerVars: { autoplay: 1, mute: 1, controls: 0, loop: 1, playlist: trailerKey, showinfo: 0, iv_load_policy: 3, modestbranding: 1, rel: 0 },
                events: {
                    onReady: () => {
                        playerReady.current = true;
                        setIsPlaying(true);
                        if (playTrailerSound) { playerRef.current.unMute(); setIsMuted(false); }
                        else { playerRef.current.mute(); setIsMuted(true); }
                    },
                    onStateChange: (event: any) => setIsPlaying(event.data === (window as any).YT.PlayerState.PLAYING)
                }
            });
        };
        if (!(window as any).YT || !(window as any).YT.Player) {
            const tag = document.createElement('script');
            if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
                tag.src = "https://www.youtube.com/iframe_api";
                document.head.appendChild(tag);
            }
            (window as any).onYouTubeIframeAPIReady = createPlayer;
        } else { createPlayer(); }
        return () => {
            if (playerRef.current && typeof playerRef.current.destroy === 'function') playerRef.current.destroy();
            if ((window as any).onYouTubeIframeAPIReady) (window as any).onYouTubeIframeAPIReady = null;
        };
    }, [trailerKey, playTrailerSound]);

    const handleMyListToggle = () => {
        isInMyList(item.id) ? removeFromMyList(item.id) : addToMyList(item.id);
    };

     const handlePlayPause = () => {
        if (!playerReady.current) return;
        isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
    };
    const handleMuteToggle = () => {
        if (!playerReady.current) return;
        playerRef.current.isMuted() ? playerRef.current.unMute() : playerRef.current.mute();
        setIsMuted(prev => !prev);
    };
    const handleRewind = () => {
        if (!playerReady.current) return;
        playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10, true);
    };
    const handleForward = () => {
        if (!playerReady.current) return;
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10, true);
    };

    const primeVideoUrl = `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(title)}&ie=UTF8`;

    return (
        <div className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center animate-fade-in">
             <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            <div className="bg-[#0F171E] w-full max-w-3xl h-[90vh] max-h-[800px] rounded-lg shadow-2xl overflow-y-auto relative scrollbar-hide">
                <button onClick={onBack} className="absolute top-4 right-4 z-20 bg-gray-800/80 rounded-full p-1 text-white hover:bg-gray-700">
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="relative h-64 sm:h-80 bg-black">
                     {trailerKey ? (
                        <>
                            <div id="youtube-player-prime" className="absolute inset-0 w-full h-full" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center space-x-4 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
                                <button onClick={handleRewind} className="text-white p-2 rounded-full hover:bg-white/20"><BackwardIcon className="w-7 h-7" /></button>
                                <button onClick={handlePlayPause} className="text-white p-2 rounded-full hover:bg-white/20">{isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}</button>
                                <button onClick={handleForward} className="text-white p-2 rounded-full hover:bg-white/20"><ForwardIcon className="w-7 h-7" /></button>
                            </div>
                            <button onClick={handleMuteToggle} className="absolute bottom-4 right-4 z-20 p-1.5 bg-black/60 rounded-full text-white backdrop-blur-sm">{isMuted ? <SpeakerXMarkIcon className="w-4 h-4" /> : <SpeakerWaveIcon className="w-4 h-4" />}</button>
                        </>
                    ) : (
                        <img src={`${TMDB_IMAGE_BASE_URL}${('backdrop_path' in item && item.backdrop_path) ? item.backdrop_path : item.poster_path}`} alt="" className="absolute inset-0 w-full h-full object-cover"/>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                         <div className="flex items-center space-x-3 mt-4">
                            <button onClick={() => setShowJoinOptions(true)} className="flex-grow flex items-center justify-center space-x-2 bg-white text-black font-bold py-3 rounded-md hover:bg-gray-200 transition">
                                <PlayIcon className="w-6 h-6"/>
                                <span>Reproduzir</span>
                            </button>
                            <button onClick={handleMyListToggle} title="Adicionar à Minha Lista" className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-md hover:bg-white/30 transition">
                                {isInMyList(item.id) ? <CheckIcon className="w-6 h-6" /> : <PlusIcon className="w-6 h-6"/>}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 text-white space-y-3">
                     <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
                    <div className="flex items-center space-x-3 text-sm font-semibold text-gray-400">
                        <span>{releaseYear}</span>
                        <span>•</span>
                        <span className="text-green-500 font-bold">{item.vote_average.toFixed(1)} de avaliação</span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-300">{'overview' in item && item.overview ? item.overview : 'Sinopse não disponível.'}</p>
                </div>
                
                {recommendations.length > 0 && (
                    <div className="px-6 py-4 mt-4">
                        <h2 className="text-xl font-bold text-white mb-4">Clientes também assistiram</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {recommendations.slice(0, 10).map(rec => (
                                <button key={rec.id} onClick={() => onSelectItem(rec as ContentItem)} className="group">
                                    <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${rec.poster_path}`} alt={'title' in rec ? rec.title : rec.name} className="w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Join Options Modal */}
            {showJoinOptions && (
                 <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-[#1A242F] p-6 rounded-lg shadow-xl w-full max-w-sm text-center relative border border-blue-800">
                        <button onClick={() => setShowJoinOptions(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-white mb-4">Como você quer assistir?</h2>
                        
                        <div className="space-y-4">
                            <button onClick={() => window.open(primeVideoUrl, '_blank')} className="w-full bg-blue-500 text-white font-bold py-3 rounded-md text-base hover:bg-blue-600 transition">
                                Já sou Prime (Ir para Prime Video)
                            </button>
                            <div className="my-2 text-gray-400 text-sm">OU</div>
                             <div className="space-y-3 text-left">
                                <h3 className="font-bold text-white">Entre em um grupo para ter acesso:</h3>
                                <button onClick={onViewAllGroups} className="w-full bg-gray-600 text-white font-bold py-3 rounded-md text-base hover:bg-gray-500 transition">
                                    Ver grupos disponíveis
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default PrimeVideoDetailScreen;