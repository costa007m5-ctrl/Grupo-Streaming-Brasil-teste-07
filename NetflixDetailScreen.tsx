import React, { useState, useEffect, useRef } from 'react';
import type { TvShow, Group, Profile, ChatMessage } from '../types';
import { PlayIcon, PlusIcon, XMarkIcon, UsersIcon, CheckIcon, ShareIcon, WhatsAppIcon, TelegramIcon, FacebookIcon, DocumentDuplicateIcon, PauseIcon, BackwardIcon, ForwardIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from './Icons';
import { TMDB_IMAGE_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from '../constants';
import { useSoundSettings } from '../contexts/SoundContext';


// Local type to match the data structure being passed from NetflixScreen
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

interface NetflixDetailScreenProps {
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

interface Episode {
    id: number;
    name: string;
    overview: string;
    still_path: string;
    episode_number: number;
}

const NetflixDetailScreen: React.FC<NetflixDetailScreenProps> = ({ item, onBack, onSelectGroup, onSelectItem, isInMyList, addToMyList, removeFromMyList, onViewAllGroups, myGroups, profile, onSendMessage }) => {
    const { playTrailerSound } = useSoundSettings();
    const [showJoinOptions, setShowJoinOptions] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [credits, setCredits] = useState<{ cast: any[], crew: any[] }>({ cast: [], crew: [] });
    const [seasons, setSeasons] = useState<any[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
    const [otherProviders, setOtherProviders] = useState<any[]>([]);
    
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
                const [creditsRes, recommendationsRes, providersRes, videoRes] = await Promise.all([
                    fetch(`${TMDB_BASE_URL}/${type}/${item.id}/credits?api_key=${TMDB_API_KEY}&language=pt-BR`),
                    fetch(`${TMDB_BASE_URL}/${type}/${item.id}/recommendations?api_key=${TMDB_API_KEY}&language=pt-BR`),
                    fetch(`${TMDB_BASE_URL}/${type}/${item.id}/watch/providers?api_key=${TMDB_API_KEY}`),
                    fetch(`${TMDB_BASE_URL}/${type}/${item.id}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`)
                ]);

                const creditsData = await creditsRes.json();
                setCredits(creditsData);
                
                const recData = await recommendationsRes.json();
                setRecommendations(recData.results.filter((r: any) => r.poster_path));

                const providersData = await providersRes.json();
                const allBrProviders = providersData.results?.BR?.flatrate || [];
                setOtherProviders(allBrProviders.filter((p: any) => p.provider_id !== 8)); // 8 is Netflix ID

                const videoData = await videoRes.json();
                const trailer = videoData.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
                setTrailerKey(trailer?.key || videoData.results?.[0]?.key || null);

                if (!isMovie) {
                    const seriesDetailsRes = await fetch(`${TMDB_BASE_URL}/tv/${item.id}?api_key=${TMDB_API_KEY}&language=pt-BR`);
                    const seriesData = await seriesDetailsRes.json();
                    setSeasons(seriesData.seasons.filter((s:any) => s.season_number > 0 && s.episode_count > 0)); // Filter out "Specials" season
                    if (seriesData.seasons.length > 0) {
                        setSelectedSeason(1);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch details", error);
            }
        };
        fetchDetails();
    }, [item.id, isMovie]);

    useEffect(() => {
        if (!isMovie && selectedSeason) {
            const fetchEpisodes = async () => {
                try {
                    const res = await fetch(`${TMDB_BASE_URL}/tv/${item.id}/season/${selectedSeason}?api_key=${TMDB_API_KEY}&language=pt-BR`);
                    const data = await res.json();
                    setEpisodes(data.episodes);
                } catch (error) {
                    console.error("Failed to fetch episodes", error);
                }
            };
            fetchEpisodes();
        }
    }, [item.id, selectedSeason, isMovie]);
    
     useEffect(() => {
        if (!trailerKey) return;
        const createPlayer = () => {
             if (playerRef.current && typeof playerRef.current.destroy === 'function') playerRef.current.destroy();
            playerRef.current = new (window as any).YT.Player('youtube-player-netflix', {
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
        if (isInMyList(item.id)) {
            removeFromMyList(item.id);
        } else {
            addToMyList(item.id);
        }
    };
    
    const handleShareToGroup = (group: Group) => {
        if (!profile) return;
        const tmdbLink = `https://www.themoviedb.org/${isMovie ? 'movie' : 'tv'}/${item.id}`;
        const text = `Pessoal, que tal assistirmos a "${title}"? Parece muito bom! Veja mais aqui: ${tmdbLink}`;
        const message: ChatMessage = {
            id: Date.now(),
            senderName: profile.full_name,
            avatarUrl: profile.avatar_url,
            text: text,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            isYou: true,
        };
        onSendMessage(group.id, message);
        alert(`Sua sugestão foi enviada para o grupo "${group.name}"!`);
        setShowShareOptions(false);
    };

    const handleEpisodeClick = async (episode: Episode) => {
        if (!playerRef.current || isMovie) return;
        try {
            const res = await fetch(`${TMDB_BASE_URL}/tv/${item.id}/season/${selectedSeason}/episode/${episode.episode_number}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`);
            const data = await res.json();
            const clip = data.results?.find((v: any) => v.site === 'YouTube') || null;
            if (clip) {
                playerRef.current.loadVideoById(clip.key);
                playerRef.current.playVideo();
            } else {
                alert(`Nenhum clipe encontrado para "${episode.name}"`);
            }
        } catch (error) { console.error("Failed to fetch episode video", error); }
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


    const netflixSearchUrl = `https://www.netflix.com/search?q=${encodeURIComponent(title)}`;
    const tmdbUrl = `https://www.themoviedb.org/${isMovie ? 'movie' : 'tv'}/${item.id}`;
    const shareText = `Estou assistindo a ${title}! Que tal assistirmos juntos? Podemos criar um grupo no app Grupo Streaming.`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(tmdbUrl);

    const socialLinks = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };


    return (
        <div className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center animate-fade-in">
             <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            <div className="bg-[#181818] w-full max-w-3xl h-[90vh] max-h-[800px] rounded-lg shadow-2xl overflow-y-auto relative scrollbar-hide">
                <button onClick={onBack} className="absolute top-4 right-4 z-20 bg-gray-800/80 rounded-full p-1 text-white hover:bg-gray-700">
                    <XMarkIcon className="w-6 h-6" />
                </button>

                 <div className="relative h-64 sm:h-80 bg-black">
                    {trailerKey ? (
                        <>
                            <div id="youtube-player-netflix" className="absolute inset-0 w-full h-full" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center space-x-4 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
                                <button onClick={handleRewind} className="text-white p-2 rounded-full hover:bg-white/20"><BackwardIcon className="w-7 h-7" /></button>
                                <button onClick={handlePlayPause} className="text-white p-2 rounded-full hover:bg-white/20">{isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}</button>
                                <button onClick={handleForward} className="text-white p-2 rounded-full hover:bg-white/20"><ForwardIcon className="w-7 h-7" /></button>
                            </div>
                            <button
                                onClick={handleMuteToggle}
                                className="absolute bottom-4 right-4 z-20 p-1.5 bg-black/60 rounded-full text-white backdrop-blur-sm"
                                aria-label={isMuted ? "Ativar som" : "Desativar som"}
                            >
                                {isMuted ? <SpeakerXMarkIcon className="w-4 h-4" /> : <SpeakerWaveIcon className="w-4 h-4" />}
                            </button>
                        </>
                    ) : (
                        <img src={`${TMDB_IMAGE_BASE_URL}${('backdrop_path' in item && item.backdrop_path) ? item.backdrop_path : item.poster_path}`} alt="" className="absolute inset-0 w-full h-full object-cover"/>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>{title}</h1>
                         <div className="flex items-center space-x-3 mt-4">
                            <button onClick={() => setShowJoinOptions(true)} className="flex items-center justify-center space-x-2 bg-white text-black font-bold py-2 px-6 rounded-md hover:bg-gray-200 transition">
                                <PlayIcon className="w-6 h-6"/>
                                <span>Assistir</span>
                            </button>
                            <button onClick={handleMyListToggle} title="Adicionar à Minha Lista" className="flex items-center justify-center w-10 h-10 border-2 border-gray-400 text-white rounded-full hover:border-white transition">
                                {isInMyList(item.id) ? <CheckIcon className="w-6 h-6" /> : <PlusIcon className="w-6 h-6"/>}
                            </button>
                             <button onClick={() => setShowShareOptions(true)} title="Compartilhar" className="flex items-center justify-center w-10 h-10 border-2 border-gray-400 text-white rounded-full hover:border-white transition">
                                <ShareIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 text-white grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                         <div className="flex items-center space-x-3 text-sm font-semibold text-gray-300">
                            <span>{releaseYear}</span>
                            <span>•</span>
                            <span className="text-green-500 font-bold">{item.vote_average.toFixed(1)} de avaliação</span>
                        </div>
                        <p className="text-sm leading-relaxed">{'overview' in item && item.overview ? item.overview : 'Sinopse não disponível.'}</p>
                    </div>
                    <div className="text-sm space-y-2 text-gray-400">
                        {credits.cast.length > 0 && (
                            <div>
                                <span className="font-semibold text-gray-500">Elenco: </span>
                                {credits.cast.slice(0, 3).map(c => c.name).join(', ')}
                            </div>
                        )}
                         {credits.crew.length > 0 && (
                            <div>
                                <span className="font-semibold text-gray-500">Direção: </span>
                                {credits.crew.find(c => c.job === 'Director')?.name || 'N/A'}
                            </div>
                        )}
                    </div>
                </div>

                {!isMovie && seasons.length > 0 && (
                    <div className="px-6 py-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Episódios</h2>
                            {seasons.length > 1 && (
                                <select value={selectedSeason} onChange={e => setSelectedSeason(Number(e.target.value))} className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500">
                                    {seasons.map(season => <option key={season.id} value={season.season_number}>Temporada {season.season_number}</option>)}
                                </select>
                            )}
                        </div>
                        <div className="space-y-4">
                            {episodes.map(ep => (
                                <button key={ep.id} onClick={() => handleEpisodeClick(ep)} className="w-full text-left flex items-start space-x-4 p-2 rounded-md hover:bg-gray-800">
                                    <span className="text-xl font-bold text-gray-400 pt-3">{ep.episode_number}</span>
                                    {ep.still_path ? (
                                      <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${ep.still_path}`} alt={ep.name} className="w-32 h-20 rounded-md object-cover flex-shrink-0 bg-gray-900" />
                                    ) : (
                                      <div className="w-32 h-20 rounded-md bg-gray-900 flex-shrink-0"></div>
                                    )}
                                    <div className="text-sm">
                                        <h4 className="font-bold text-white">{ep.name}</h4>
                                        <p className="text-gray-400 line-clamp-2 mt-1">{ep.overview}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {recommendations.length > 0 && (
                    <div className="px-6 py-4 mt-4">
                        <h2 className="text-xl font-bold text-white mb-4">Títulos Semelhantes</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {recommendations.slice(0, 10).map(rec => (
                                <button key={rec.id} onClick={() => onSelectItem(rec as ContentItem)} className="group">
                                    <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${rec.poster_path}`} alt={'title' in rec ? rec.title : rec.name} className="w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {otherProviders.length > 0 && (
                    <div className="px-6 py-4 mt-4">
                        <h2 className="text-xl font-bold text-white">Também disponível em</h2>
                        <div className="flex flex-wrap gap-3 mt-4">
                            {otherProviders.map(p => (
                                <div key={p.provider_id} className="flex items-center space-x-2 bg-gray-700 rounded-lg p-2">
                                    <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w92')}${p.logo_path}`} alt={p.provider_name} className="w-8 h-8 rounded-md" />
                                    <span className="text-sm font-semibold text-white">{p.provider_name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Join Options Modal */}
            {showJoinOptions && (
                 <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-xl w-full max-w-sm text-center relative">
                        <button onClick={() => setShowJoinOptions(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-white mb-4">Como você quer assistir?</h2>
                        
                        <div className="space-y-4">
                            <button onClick={() => window.open(netflixSearchUrl, '_blank')} className="w-full bg-red-600 text-white font-bold py-3 rounded-md text-base hover:bg-red-700 transition">
                                Já tenho conta (Ir para Netflix)
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
             {/* Share Options Modal */}
            {showShareOptions && (
                 <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center" onClick={() => setShowShareOptions(false)}>
                    <div className="bg-[#2a2a2a] w-full max-w-md rounded-t-2xl p-6 text-white" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-white mb-4 text-center">Compartilhar "{title}"</h2>
                        <div className="flex justify-around items-center py-4 border-b border-gray-700">
                           <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-2 text-xs"><WhatsAppIcon className="w-10 h-10 text-[#25D366]"/><span>WhatsApp</span></a>
                           <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-2 text-xs"><TelegramIcon className="w-10 h-10 text-[#0088cc]"/><span>Telegram</span></a>
                           <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-2 text-xs"><FacebookIcon className="w-10 h-10 text-[#1877F2]"/><span>Facebook</span></a>
                           <button onClick={() => { navigator.clipboard.writeText(tmdbUrl); alert('Link copiado!'); }} className="flex flex-col items-center space-y-2 text-xs"><DocumentDuplicateIcon className="w-10 h-10 text-gray-400"/><span>Copiar Link</span></button>
                        </div>
                        <div className="pt-4">
                             <h3 className="font-bold text-white mb-3">Compartilhar em um grupo</h3>
                             <div className="max-h-40 overflow-y-auto space-y-2">
                                {myGroups.map(group => (
                                    <div key={group.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <img src={group.logo} alt={group.name} className="w-8 h-8 rounded-md"/>
                                            <span className="text-sm font-semibold">{group.name}</span>
                                        </div>
                                        <button onClick={() => handleShareToGroup(group)} className="bg-purple-600 text-white font-semibold text-xs py-1 px-3 rounded-md">Enviar</button>
                                    </div>
                                ))}
                                {myGroups.length === 0 && <p className="text-sm text-gray-400 text-center">Você não está em nenhum grupo.</p>}
                             </div>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default NetflixDetailScreen;