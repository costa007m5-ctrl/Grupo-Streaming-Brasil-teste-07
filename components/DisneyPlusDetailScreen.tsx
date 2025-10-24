import React, { useState, useEffect, useRef } from 'react';
import type { TvShow, Group, Profile, ChatMessage } from '../types';
import { PlayIcon, PlusIcon, XMarkIcon, CheckIcon, ShareIcon, WhatsAppIcon, TelegramIcon, FacebookIcon, DocumentDuplicateIcon, UsersIcon, PauseIcon, BackwardIcon, ForwardIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from './Icons';
import { TMDB_IMAGE_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from '../constants';
import { useSoundSettings } from '../contexts/SoundContext';

interface TMDBMovie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path?: string;
    vote_average: number;
    overview: string;
    release_date: string;
    runtime?: number;
}

type ContentItem = TMDBMovie | TvShow;

interface DisneyPlusDetailScreenProps {
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

interface Credits {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string }[];
}

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`py-3 font-bold text-sm uppercase tracking-wider relative transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
        {label}
        {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"></div>}
    </button>
);


const DisneyPlusDetailScreen: React.FC<DisneyPlusDetailScreenProps> = ({ item, onBack, onSelectGroup, onSelectItem, isInMyList, addToMyList, removeFromMyList, onViewAllGroups, myGroups, profile, onSendMessage }) => {
    const { playTrailerSound } = useSoundSettings();
    const [showJoinOptions, setShowJoinOptions] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [seasons, setSeasons] = useState<any[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
    const [fullDetails, setFullDetails] = useState<any>(null);
    const [credits, setCredits] = useState<Credits | null>(null);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const playerRef = useRef<any>(null);
    const playerReady = useRef(false);

    const isMovie = 'title' in item;
    const title = isMovie ? item.title : item.name;
    const releaseYear = isMovie ? new Date(item.release_date).getFullYear() : (item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'N/A');
    const [activeTab, setActiveTab] = useState(isMovie ? 'similar' : 'episodes');


    useEffect(() => {
        const fetchDetails = async () => {
            const type = isMovie ? 'movie' : 'tv';
            try {
                const [detailsRes, recommendationsRes, creditsRes, videoRes] = await Promise.all([
                    fetch(`${TMDB_BASE_URL}/${type}/${item.id}?api_key=${TMDB_API_KEY}&language=pt-BR`),
                    fetch(`${TMDB_BASE_URL}/${type}/${item.id}/recommendations?api_key=${TMDB_API_KEY}&language=pt-BR`),
                    fetch(`${TMDB_BASE_URL}/${type}/${item.id}/credits?api_key=${TMDB_API_KEY}&language=pt-BR`),
                    fetch(`${TMDB_BASE_URL}/${type}/${item.id}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`)
                ]);
                
                const detailsData = await detailsRes.json();
                setFullDetails(detailsData);
                
                const recData = await recommendationsRes.json();
                setRecommendations(recData.results.filter((r: any) => r.poster_path));

                const creditsData = await creditsRes.json();
                setCredits(creditsData);

                const videoData = await videoRes.json();
                const trailer = videoData.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
                setTrailerKey(trailer?.key || videoData.results?.[0]?.key || null);

                if (!isMovie) {
                    setSeasons(detailsData.seasons.filter((s:any) => s.season_number > 0 && s.episode_count > 0));
                    if (detailsData.seasons.length > 0) setSelectedSeason(1);
                }
            } catch (error) { console.error("Failed to fetch details", error); }
        };
        fetchDetails();
    }, [item.id, isMovie]);

    useEffect(() => {
        if (!isMovie && selectedSeason && seasons.length > 0) {
            const fetchEpisodes = async () => {
                try {
                    const res = await fetch(`${TMDB_BASE_URL}/tv/${item.id}/season/${selectedSeason}?api_key=${TMDB_API_KEY}&language=pt-BR`);
                    const data = await res.json();
                    setEpisodes(data.episodes);
                } catch (error) { console.error("Failed to fetch episodes", error); }
            };
            fetchEpisodes();
        }
    }, [item.id, selectedSeason, isMovie, seasons]);
    
     useEffect(() => {
        if (!trailerKey) return;
        const createPlayer = () => {
             if (playerRef.current && typeof playerRef.current.destroy === 'function') playerRef.current.destroy();
            playerRef.current = new (window as any).YT.Player('youtube-player-disney', {
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
    
    const formatRuntime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h} h ${m} min`;
    };

    const disneyPlusUrl = `https://www.disneyplus.com/search?q=${encodeURIComponent(title)}`;
    const tmdbUrl = `https://www.themoviedb.org/${isMovie ? 'movie' : 'tv'}/${item.id}`;
    const shareText = `Estou de olho em "${title}"! Que tal assistirmos juntos? Podemos criar/entrar em um grupo no app Grupo Streaming.`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(tmdbUrl);

    const socialLinks = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-30 flex items-center justify-center animate-fade-in">
             <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            <div className="bg-[#1A1D29] w-full max-w-3xl h-[95vh] max-h-[850px] rounded-lg shadow-2xl overflow-y-auto relative scrollbar-hide">
                <button onClick={onBack} className="absolute top-4 right-4 z-20 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="relative h-64 sm:h-96 bg-black">
                     {trailerKey ? (
                        <>
                            <div id="youtube-player-disney" className="absolute inset-0 w-full h-full" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center space-x-4 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
                                <button onClick={handleRewind} className="text-white p-2 rounded-full hover:bg-white/20"><BackwardIcon className="w-7 h-7" /></button>
                                <button onClick={handlePlayPause} className="text-white p-2 rounded-full hover:bg-white/20">{isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}</button>
                                <button onClick={handleForward} className="text-white p-2 rounded-full hover:bg-white/20"><ForwardIcon className="w-7 h-7" /></button>
                            </div>
                            <button onClick={handleMuteToggle} className="absolute bottom-4 right-4 z-20 p-1.5 bg-black/60 rounded-full text-white backdrop-blur-sm">{isMuted ? <SpeakerXMarkIcon className="w-4 h-4" /> : <SpeakerWaveIcon className="w-4 h-4" />}</button>
                        </>
                    ) : (
                        <img src={`${TMDB_IMAGE_BASE_URL}${item.backdrop_path}`} alt="" className="absolute inset-0 w-full h-full object-cover"/>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D29] via-[#1A1D29]/70 to-transparent"></div>
                    <div className="absolute bottom-[-1px] left-0 right-0 h-20 bg-gradient-to-t from-[#1A1D29] to-transparent"></div>
                </div>

                <div className="p-6 text-white space-y-4 -mt-24 relative z-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{title}</h1>
                    <div className="flex items-center space-x-3 text-sm font-semibold text-gray-300">
                        <span>{releaseYear}</span>
                        <span>•</span>
                        { isMovie && fullDetails?.runtime && <span>{formatRuntime(fullDetails.runtime)}</span> }
                        { !isMovie && fullDetails?.number_of_seasons && <span>{fullDetails.number_of_seasons} Temporada{fullDetails.number_of_seasons > 1 ? 's' : ''}</span> }
                        <span>•</span>
                        <span className="text-blue-400 font-bold">{item.vote_average.toFixed(1)} de avaliação</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setShowJoinOptions(true)} className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 text-black font-bold py-3 rounded-md hover:bg-gray-300 transition">
                            <PlayIcon className="w-6 h-6"/>
                            <span>Assistir</span>
                        </button>
                        <button onClick={handleMyListToggle} title="Adicionar à Minha Lista" className="flex items-center justify-center w-12 h-12 bg-black/50 border-2 border-gray-400 text-white rounded-md hover:border-white hover:bg-white/10 transition">
                            {isInMyList(item.id) ? <CheckIcon className="w-6 h-6" /> : <PlusIcon className="w-6 h-6"/>}
                        </button>
                         <button onClick={() => setShowShareOptions(true)} title="Compartilhar" className="flex items-center justify-center w-12 h-12 bg-black/50 border-2 border-gray-400 text-white rounded-md hover:border-white hover:bg-white/10 transition">
                            <ShareIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-300 line-clamp-3">{'overview' in item && item.overview ? item.overview : 'Sinopse não disponível.'}</p>
                </div>

                {/* TABS */}
                <div className="px-6 border-b border-gray-700/50">
                    <div className="flex space-x-6">
                        {!isMovie && seasons.length > 0 && <TabButton label="Episódios" isActive={activeTab === 'episodes'} onClick={() => setActiveTab('episodes')} />}
                        {recommendations.length > 0 && <TabButton label="Títulos Semelhantes" isActive={activeTab === 'similar'} onClick={() => setActiveTab('similar')} />}
                        {credits && (credits.cast.length > 0 || credits.crew.length > 0) && <TabButton label="Detalhes" isActive={activeTab === 'details'} onClick={() => setActiveTab('details')} />}
                    </div>
                </div>

                {/* TAB CONTENT */}
                <div className="px-6 py-4">
                    {activeTab === 'episodes' && !isMovie && (
                        <div className="space-y-4">
                            {seasons.length > 1 && (
                                <select value={selectedSeason} onChange={e => setSelectedSeason(Number(e.target.value))} className="w-full sm:w-auto bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {seasons.map(season => <option key={season.id} value={season.season_number}>{season.name}</option>)}
                                </select>
                            )}
                            {episodes.map(ep => (
                                <button key={ep.id} onClick={() => handleEpisodeClick(ep)} className="w-full text-left flex items-start space-x-4 p-2 rounded-md hover:bg-gray-800/50 cursor-pointer">
                                    <span className="text-lg font-bold text-gray-400 pt-3">{ep.episode_number}</span>
                                    <div className="relative w-32 h-20 flex-shrink-0">
                                        <img src={ep.still_path ? `${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${ep.still_path}`: item.poster_path ? `${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${item.poster_path}` : ''} alt={ep.name} className="w-full h-full rounded-md object-cover bg-gray-900" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"><PlayIcon className="w-8 h-8 text-white"/></div>
                                    </div>
                                    <div className="text-sm">
                                        <h4 className="font-bold text-white">{ep.name}</h4>
                                        <p className="text-gray-400 line-clamp-2 mt-1 text-xs">{ep.overview}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                    {activeTab === 'similar' && (
                         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {recommendations.slice(0, 15).map(rec => (
                                <button key={rec.id} onClick={() => onSelectItem(rec as ContentItem)} className="group aspect-[2/3]">
                                    <img src={`${TMDB_IMAGE_BASE_URL.replace('/original', '/w500')}${rec.poster_path}`} alt={'title' in rec ? rec.title : rec.name} className="w-full h-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105" />
                                </button>
                            ))}
                        </div>
                    )}
                    {activeTab === 'details' && credits && (
                        <div className="text-sm text-gray-300 space-y-4">
                            <div>
                                <h3 className="font-bold text-white mb-2">Elenco</h3>
                                <p>{credits.cast.slice(0, 10).map(c => c.name).join(', ')}</p>
                            </div>
                             <div>
                                <h3 className="font-bold text-white mb-2">Direção</h3>
                                <p>{credits.crew.filter(c => c.job === 'Director').map(c => c.name).join(', ')}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showJoinOptions && (
                 <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-[#1A1D29] p-6 rounded-lg shadow-xl w-full max-w-sm text-center relative border border-blue-800">
                        <img src="https://logodownload.org/wp-content/uploads/2020/11/disney-plus-logo-1.png" alt="Disney+ Logo" className="w-24 h-auto mx-auto mb-4"/>
                        <button onClick={() => setShowJoinOptions(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                        <h2 className="text-xl font-bold text-white mb-4">Como você quer assistir?</h2>
                        <div className="space-y-4">
                            <button onClick={() => window.open(disneyPlusUrl, '_blank')} className="w-full bg-gray-200 text-black font-bold py-3 rounded-md text-base hover:bg-gray-300 transition">Já tenho conta (Ir para Disney+)</button>
                            <div className="my-2 text-gray-400 text-sm">OU</div>
                            <button onClick={onViewAllGroups} className="w-full bg-white/10 border border-white/20 text-white font-bold py-3 rounded-md text-base hover:bg-white/20 transition">Encontrar um grupo</button>
                        </div>
                    </div>
                 </div>
            )}
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
                             <h3 className="font-bold text-white mb-3">Sugerir em um grupo</h3>
                             <div className="max-h-40 overflow-y-auto space-y-2">
                                {myGroups.length > 0 ? myGroups.map(group => (
                                    <div key={group.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-md bg-black p-1 flex items-center justify-center"><img src={group.logo} alt={group.name} className="max-w-full max-h-full"/></div>
                                            <span className="text-sm font-semibold">{group.name}</span>
                                        </div>
                                        <button onClick={() => handleShareToGroup(group)} className="bg-purple-600 text-white font-semibold text-xs py-1 px-3 rounded-md">Sugerir</button>
                                    </div>
                                )) : <p className="text-sm text-gray-400 text-center">Você não está em nenhum grupo.</p>}
                             </div>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default DisneyPlusDetailScreen;