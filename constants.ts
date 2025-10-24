// Future icon source: https://icons8.com.br using the CDN link option.

import type { Group, Activity, ProfileStat, Achievement, ProfileActivity, SettingItem, WalletTransaction, AvailableService, ChatMessage, GroupMember, GroupRule, FeaturedContent, MovieInfo } from './types';
import { GroupStatus } from './types';
import {
    UserGroupIcon,
    ClockIcon,
    BanknotesIcon,
    StarIcon,
    // FIX: Replaced ShieldCheckIcon with ShieldIcon as it is the correct exported component name.
    ShieldIcon,
    HeartIcon,
    BellIcon,
    LockClosedIcon,
    HeadphonesIcon,
    UsersIcon,
    RectangleStackIcon,
    EditProfileIcon,
    AccountVerificationIcon,
    GroupHistoryIcon,
    SettingsIconHex,
    DevicePhoneMobileIcon,
    ComputerDesktopIcon,
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
    SpeakerWaveIcon,
    ArrowDownTrayIcon,
} from './components/Icons';

export const TMDB_API_KEY = 'e095c08fa4bd9162e1552eeb58fe58be';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Mapeamento dos nossos IDs de serviço para os IDs de network do TMDB (usado para descobrir conteúdo)
export const TMDB_NETWORK_IDS: Record<string, number> = {
  netflix: 213,
  primevideo: 1024,
  max: 49, // HBO network id is used for Max
  disneyplus: 2739,
};

// Mapeamento dos nossos IDs de serviço para os IDs de provider do TMDB (usado para verificar "onde assistir")
export const TMDB_PROVIDER_IDS: Record<string, number> = {
  netflix: 8,
  primevideo: 119,
  max: 384, // Max provider ID
  disneyplus: 337,
  crunchyroll: 283,
  globoplay: 307,
  paramountplus: 531,
  // Apple TV+ is 350, Star+ is 619, if needed later
};

// Mapeamento das nossas categorias para IDs de gênero do TMDB
export const TMDB_GENRE_IDS: Record<string, number> = {
  music: 10402,
};


export const RECIPIENT_USER_DATA = {
    name: 'Maria Costa',
    cpfMasked: '***.456.***-**',
    walletId: '@maria.costa'
};

export const RECENT_ACTIVITY_DATA: Activity[] = [
  {
    id: 1,
    description: 'Pagamento Netflix realizado',
    timestamp: 'Hoje, 14:30',
    amount: -12.50,
    logo: 'https://img.icons8.com/color/96/netflix.png',
  },
  {
    id: 2,
    description: 'Novo membro no grupo Spotify',
    timestamp: 'Ontem, 16:45',
    amount: null,
    logo: 'https://img.icons8.com/color/96/spotify.png',
  }
];

export const PROFILE_STATS_DATA: ProfileStat[] = [
    { id: 1, value: '3', label: 'Grupos ativos', icon: UserGroupIcon },
    { id: 2, value: '8', label: 'Total de grupos', icon: RectangleStackIcon },
    { id: 3, value: 'R$ 456,78', label: 'Economia total', icon: BanknotesIcon },
    { id: 4, value: '4.8', label: 'Avaliação', icon: StarIcon },
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
    { id: 1, title: 'Conta Verificada', description: 'Documentos confirmados', icon: ShieldIcon },
    { id: 2, title: 'Membro Pontual', description: '100% pagamentos em dia', icon: ClockIcon },
    { id: 3, title: 'Bem Avaliado', description: 'Nota 4.8/5.0', icon: HeartIcon },
    { id: 4, title: 'Participante Ativo', description: '8 grupos participados', icon: UsersIcon },
];

export const PROFILE_ACTIVITY_DATA: ProfileActivity[] = [
    { id: 1, name: 'Netflix Premium', date: '2024-01-15', logo: 'https://img.icons8.com/color/96/netflix.png' },
    { id: 2, name: 'Spotify Premium', date: '2024-01-10', logo: 'https://img.icons8.com/color/96/spotify.png' },
    { id: 3, name: 'Disney+ Premium', date: '2024-01-08', logo: 'https://img.icons8.com/fluency/96/disney-plus.png' },
];

export const SETTINGS_ITEMS: SettingItem[] = [
    { id: 1, label: 'Editar perfil', icon: EditProfileIcon },
    { id: 2, label: 'Verificação de conta', icon: AccountVerificationIcon },
    { id: 3, label: 'Histórico de grupos', icon: GroupHistoryIcon },
    { id: 4, label: 'Minhas avaliações', icon: StarIcon },
    { id: 5, label: 'Notificações', icon: BellIcon },
    { id: 6, label: 'Privacidade e segurança', icon: LockClosedIcon },
    { id: 9, label: 'Sons e Mídia', icon: SpeakerWaveIcon },
    { id: 7, label: 'Suporte', icon: HeadphonesIcon },
    { id: 8, label: 'Configurações', icon: SettingsIconHex },
];

export const WALLET_TRANSACTIONS_DATA: WalletTransaction[] = [
   // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
   {
    id: 7,
    name: 'Transferência para @maria.costa',
    date: 'Hoje • 10:12',
    status: 'Concluído',
    amount: -25.00,
    logo: 'transfer_out',
    type: 'transfer_out',
    metadata: { recipient_id: 'some-uuid-for-maria' },
  },
  // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
  {
    id: 1,
    name: 'Cashback Netflix',
    date: '14/01/2024 • 14:35',
    status: 'Concluído',
    amount: 2.50,
    logo: 'cashback',
    type: 'cashback',
    metadata: { group_id: 1 },
  },
  // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
  {
    id: 2,
    name: 'Spotify Premium',
    date: '09/01/2024 • 09:15',
    status: 'Concluído',
    amount: -8.50,
    logo: 'spotify',
    type: 'payment',
    metadata: { group_id: 2 },
  },
  // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
  {
    id: 3,
    name: 'Depósito PIX',
    date: '07/01/2024 • 16:20',
    status: 'Concluído',
    amount: 100.00,
    logo: 'pix',
    type: 'deposit',
    metadata: {},
  },
    // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
    {
    id: 4,
    name: 'Disney+ Premium',
    date: '04/01/2024 • 11:45',
    status: 'Concluído',
    amount: -9.90,
    logo: 'disney',
    type: 'payment',
    metadata: { group_id: 4 },
  },
  // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
  {
    id: 5,
    name: 'Reembolso Amazon Prime',
    date: '02/01/2024 • 13:10',
    status: 'Concluído',
    amount: 7.25,
    logo: 'amazon',
    type: 'cashback',
    metadata: { group_id: 5 },
  },
  // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
  {
    id: 6,
    name: 'Netflix Premium',
    date: '14/01/2024 • 14:30',
    status: 'Concluído',
    amount: -12.50,
    logo: 'netflix',
    type: 'payment',
    metadata: { group_id: 1 },
  },
  // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
  {
    id: 8,
    name: 'Saque PIX',
    date: 'Ontem • 18:55',
    status: 'Concluído',
    amount: -50.00,
    logo: 'withdraw',
    type: 'withdrawal',
    metadata: {},
  },
];

export const MY_REVIEWS_DATA = [
    {
        id: 1,
        serviceName: 'Netflix Premium',
        hostName: 'Maria Silva',
        date: '20/12/2023',
        rating: 5,
        review: 'Excelente anfitriã, sempre muito atenciosa e organizada. O acesso foi liberado rapidamente. Recomendo a todos!',
        logo: 'https://img.icons8.com/color/96/netflix.png',
    },
    {
        id: 2,
        serviceName: 'Spotify Premium',
        hostName: 'Carlos Lima',
        date: '15/11/2023',
        rating: 4,
        review: 'Grupo bom, tudo funcionou como o esperado. Apenas um pequeno atraso para receber o convite, mas nada que atrapalhasse.',
        logo: 'https://img.icons8.com/color/96/spotify.png',
    }
];

export const GROUP_HISTORY_DATA = [
    {
        id: 1,
        serviceName: 'YouTube Premium',
        period: 'Jun 2023 - Dez 2023',
        status: 'Encerrado',
        hostName: 'Ana Costa',
        logo: 'https://img.icons8.com/color/48/youtube-play.png',
    },
    {
        id: 2,
        serviceName: 'Max',
        period: 'Mar 2023 - Ago 2023',
        status: 'Encerrado',
        hostName: 'Pedro Lima',
        logo: 'https://logodownload.org/wp-content/uploads/2023/04/max-logo-1.png',
    }
];

export const CONNECTED_DEVICES_DATA = [
    {
        id: 1,
        isCurrent: true,
        device: 'iPhone 14 Pro',
        location: 'São Paulo, BR',
        lastActive: 'Agora mesmo',
        icon: DevicePhoneMobileIcon,
    },
    {
        id: 2,
        isCurrent: false,
        device: 'Desktop Windows',
        location: 'Rio de Janeiro, BR',
        lastActive: 'Ontem às 20:45',
        icon: ComputerDesktopIcon,
    },
    {
        id: 3,
        isCurrent: false,
        device: 'Samsung Galaxy S22',
        location: 'Belo Horizonte, BR',
        lastActive: '2 dias atrás',
        icon: DevicePhoneMobileIcon,
    }
];

export const ACTIVITY_HISTORY_DATA = [
     {
        id: 1,
        icon: LockClosedIcon,
        description: 'Senha alterada com sucesso',
        timestamp: 'Hoje, 09:30',
        details: 'IP: 189.12.34.56'
    },
    {
        id: 2,
        icon: ComputerDesktopIcon,
        description: 'Login em novo dispositivo',
        timestamp: 'Ontem, 20:45',
        details: 'Desktop Windows - Rio de Janeiro, BR'
    },
    {
        id: 3,
        icon: DevicePhoneMobileIcon,
        description: 'Sessão desconectada',
        timestamp: '3 dias atrás',
        details: 'Macbook Pro - Salvador, BR'
    }
];

export const AVAILABLE_SERVICES_DATA: AvailableService[] = [
  { id: 'netflix', name: 'Netflix', logoUrl: 'https://img.icons8.com/color/96/netflix.png', bgColor: '#000000', category: 'movie', originalPrice: 55.90, officialUrl: 'https://www.netflix.com/signup' },
  { id: 'spotify', name: 'Spotify', logoUrl: 'https://img.icons8.com/color/96/spotify.png', bgColor: '#1DB954', category: 'music', originalPrice: 21.90, officialUrl: 'https://www.spotify.com/br-pt/premium/' },
  { id: 'disneyplus', name: 'Disney+', logoUrl: 'https://img.icons8.com/fluency/96/disney-plus.png', bgColor: '#001e61', category: 'movie', originalPrice: 33.90, officialUrl: 'https://www.disneyplus.com/' },
  { id: 'primevideo', name: 'Prime Video', logoUrl: 'https://img.icons8.com/color/96/amazon-prime-video.png', bgColor: '#00A8E1', category: 'movie', originalPrice: 14.90, officialUrl: 'https://www.primevideo.com/' },
  { id: 'youtubepremium', name: 'YouTube Premium', logoUrl: 'https://img.icons8.com/color/48/youtube-play.png', bgColor: '#FFFFFF', category: 'music', originalPrice: 20.90, officialUrl: 'https://www.youtube.com/premium' },
  { id: 'max', name: 'Max', logoUrl: 'https://logodownload.org/wp-content/uploads/2023/04/max-logo-1.png', bgColor: '#9062F4', category: 'movie', originalPrice: 29.90, officialUrl: 'https://www.max.com/' },
  { id: 'crunchyroll', name: 'Crunchyroll', logoUrl: 'https://img.icons8.com/color/96/crunchyroll.png', bgColor: '#F47521', category: 'movie', originalPrice: 25.00, officialUrl: 'https://www.crunchyroll.com/' },
  { id: 'deezer', name: 'Deezer', logoUrl: 'https://img.icons8.com/color/96/deezer.png', bgColor: '#191414', category: 'music', originalPrice: 19.90, officialUrl: 'https://www.deezer.com/' },
  { id: 'globoplay', name: 'Globoplay', logoUrl: 'https://logodownload.org/wp-content/uploads/2020/11/globoplay-logo-1.png', bgColor: '#FFFFFF', category: 'tv', originalPrice: 22.90, officialUrl: 'https://globoplay.globo.com/assine/' },
  { id: 'amazonmusic', name: 'Amazon Music', logoUrl: 'https://img.icons8.com/color/96/amazon-music.png', bgColor: '#333745', category: 'music', originalPrice: 16.90, officialUrl: 'https://www.amazon.com.br/music/unlimited' },
  { id: 'paramountplus', name: 'Paramount+', logoUrl: 'https://logodownload.org/wp-content/uploads/2021/04/paramount-plus-logo-0.png', bgColor: '#FFFFFF', category: 'movie', originalPrice: 19.90, officialUrl: 'https://www.paramountplus.com/' },
  { id: 'skyplus', name: 'Sky+', logoUrl: 'https://logodownload.org/wp-content/uploads/2018/12/sky-logo-5.png', bgColor: '#FFFFFF', category: 'tv', originalPrice: 29.90, officialUrl: 'https://www.sky.com.br/sky-mais' },
  { id: 'clarotv', name: 'Claro TV+', logoUrl: 'https://logodownload.org/wp-content/uploads/2021/08/claro-tv-mais-logo-1.png', bgColor: '#FFFFFF', category: 'tv', originalPrice: 59.90, officialUrl: 'https://www.claro.com.br/tv' },
];

export const TOP_5_SERVICES_IDS: string[] = [
  'netflix',
  'primevideo',
  'spotify',
  'disneyplus',
  'youtubepremium',
];