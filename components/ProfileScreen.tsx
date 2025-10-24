import React, { useState, useEffect } from 'react';
// FIX: Import supabase client to get session data.
import { supabase } from '../lib/supabaseClient';
import {
    PROFILE_STATS_DATA,
    ACHIEVEMENTS_DATA,
    PROFILE_ACTIVITY_DATA,
    SETTINGS_ITEMS,
} from '../constants';
import type { Profile, ProfileStat, Achievement, ProfileActivity, SettingItem } from '../types';
import {
    ArrowLeftIcon,
    EllipsisHorizontalIcon,
    CheckBadgeIcon,
    ChevronRightIcon,
    DocumentDuplicateIcon,
    SparklesIcon,
    StarIcon,
} from './Icons';
import { useTheme } from '../contexts/ThemeContext';

// Subcomponente para o cabeçalho do perfil
const ProfileHeader: React.FC = () => (
    <div className="from-purple-600 to-red-500 bg-gradient-to-br p-4 pt-6 text-white relative h-48">
        <div className="flex justify-between items-center">
            {/* The back button is handled by the main App component's navigation logic */}
        </div>
    </div>
);

// Subcomponente para as informações do usuário
const UserInfo: React.FC<{ profile: Profile | null }> = ({ profile }) => {
    const { theme } = useTheme();
    const [copySuccess, setCopySuccess] = useState('');
    // FIX: supabase.auth.getSession() is asynchronous and must be awaited.
    // The component state is used to store and display the email once it's fetched.
    const [email, setEmail] = useState('carregando...');

    const walletId = profile?.wallet_id || '@carregando...';
    
    useEffect(() => {
        const fetchEmail = async () => {
            if (profile?.id) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.email) {
                    setEmail(session.user.email);
                } else {
                    setEmail('E-mail não encontrado');
                }
            }
        };
        fetchEmail();
    }, [profile]);

    const handleCopyId = () => {
        if (copySuccess || !profile) return;

        navigator.clipboard.writeText(walletId).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Falhou!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };
    
    return (
        <div className="flex flex-col items-center -mt-24">
            <div className="relative">
                <img 
                    className={`w-28 h-28 rounded-full border-4 ${theme === 'dark' ? 'border-gray-800' : 'border-white'} shadow-md object-cover`} 
                    src={profile?.avatar_url || 'https://img.icons8.com/color/96/yoda.png'}
                    alt={profile?.full_name || 'Usuário'} 
                />
                {profile?.is_verified && (
                    <div className="absolute -bottom-1 -right-1">
                        <CheckBadgeIcon className={`w-8 h-8 text-blue-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-full p-0.5`} />
                    </div>
                )}
            </div>
            <h2 className={`mt-4 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{profile?.full_name || 'Carregando...'}</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{email}</p>
            
            {(profile?.host_rating_count ?? 0) > 0 && (
                <div className={`mt-2 flex items-center space-x-1.5 rounded-full py-1 px-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <StarIcon className="w-4 h-4 text-yellow-400" solid />
                    <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{profile?.host_rating_avg?.toFixed(1)}</span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Anfitrião ({profile?.host_rating_count})</span>
                </div>
            )}
            
            <div className="mt-2 relative">
                <div 
                    onClick={handleCopyId}
                    className={`flex items-center space-x-2 rounded-full py-1.5 px-4 cursor-pointer transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>ID da conta: {walletId}</span>
                    <DocumentDuplicateIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                {copySuccess && (
                    <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg animate-fade-in-out">
                        {copySuccess}
                    </div>
                )}
            </div>

            <p className="mt-4 text-sm text-gray-400">Membro desde Março 2023</p>
        </div>
    );
};

// Subcomponente para os cartões de estatísticas
const StatCard: React.FC<{ stat: ProfileStat }> = ({ stat }) => {
    const { theme } = useTheme();
    return (
        <div className={`${theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white'} p-4 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-start space-x-3`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <stat.icon className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
            <div>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
        </div>
    );
};

const StatsGrid: React.FC = () => (
    <div className="grid grid-cols-2 gap-4 mt-6">
        {PROFILE_STATS_DATA.map(stat => <StatCard key={stat.id} stat={stat} />)}
    </div>
);

// Subcomponente para os cartões de conquistas
const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const { theme } = useTheme();
    return (
        <div className={`${theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white'} p-4 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)]`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} mb-2`}>
                <achievement.icon className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{achievement.title}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{achievement.description}</p>
        </div>
    );
};

const AchievementsGrid: React.FC = () => {
    const { theme } = useTheme();
    return (
        <section className="mt-8">
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4`}>Conquistas</h3>
            <div className="grid grid-cols-2 gap-4">
                {ACHIEVEMENTS_DATA.map(ach => <AchievementCard key={ach.id} achievement={ach} />)}
            </div>
        </section>
    );
};


// Subcomponente para a lista de atividades recentes do perfil
const ProfileActivityItem: React.FC<{ activity: ProfileActivity }> = ({ activity }) => {
    const { theme } = useTheme();
    return (
        <div className="flex items-center justify-between py-3 px-2">
            <div className="flex items-center space-x-4">
                <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} overflow-hidden`}>
                    <img src={activity.logo} alt={activity.name} className="object-contain w-full h-full p-1.5" />
                </div>
                <div>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{activity.name}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{activity.date}</p>
                </div>
            </div>
        </div>
    );
};

const ProfileRecentActivity: React.FC = () => {
     const { theme } = useTheme();
    return (
        <section className="mt-8">
            <div className="flex justify-between items-center mb-2">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Atividade recente</h3>
                <a href="#" className="text-sm font-semibold text-purple-600 hover:text-purple-800">
                    Ver todas
                </a>
            </div>
            <div className={`${theme === 'dark' ? 'bg-[#1C1A27] divide-gray-700' : 'bg-white divide-gray-100'} p-2 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] divide-y`}>
                {PROFILE_ACTIVITY_DATA.map(act => <ProfileActivityItem key={act.id} activity={act} />)}
            </div>
        </section>
    );
};

// Subcomponente para a lista de configurações
const SettingsListItem: React.FC<{ item: SettingItem, onClick?: () => void }> = ({ item, onClick }) => {
    const { theme } = useTheme();
    return (
        <button onClick={onClick} className={`w-full flex items-center justify-between py-4 ${theme === 'dark' ? 'border-b border-gray-700 last:border-b-0' : 'border-b border-gray-100 last:border-b-0'} disabled:opacity-50`} disabled={!onClick}>
            <div className="flex items-center space-x-4">
              <div className={`w-11 h-11 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-full`}>
                <item.icon className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <span className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{item.label}</span>
            </div>
            <ChevronRightIcon className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
        </button>
    );
};

interface SettingsListProps {
  onNavigateToSettings: () => void;
  onNavigateToEditProfile: () => void;
  onNavigateToSupport: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToSecurity: () => void;
  onNavigateToReviews: () => void;
  onNavigateToGroupHistory: () => void;
  onNavigateToAccountVerification: () => void;
  onNavigateToSoundSettings: () => void;
  onNavigateToDesignSettings: () => void;
}

const SettingsList: React.FC<SettingsListProps> = (props) => {
    const { theme } = useTheme();
    const allSettingsItems = [
        ...SETTINGS_ITEMS,
        { id: 10, label: 'Aparência', icon: SparklesIcon }
    ];

    return (
        <section className="mt-8">
             <div className={`${theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white'} p-4 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)]`}>
                {allSettingsItems.map(item => {
                    let action;
                    switch(item.id) {
                        case 1: action = props.onNavigateToEditProfile; break;
                        case 2: action = props.onNavigateToAccountVerification; break;
                        case 3: action = props.onNavigateToGroupHistory; break;
                        case 4: action = props.onNavigateToReviews; break;
                        case 5: action = props.onNavigateToNotifications; break;
                        case 6: action = props.onNavigateToSecurity; break;
                        case 7: action = props.onNavigateToSupport; break;
                        case 8: action = props.onNavigateToSettings; break;
                        case 9: action = props.onNavigateToSoundSettings; break;
                        case 10: action = props.onNavigateToDesignSettings; break;
                    }
                    return (
                        <SettingsListItem 
                            key={item.id} 
                            item={item}
                            onClick={action}
                        />
                    );
                })}
            </div>
        </section>
    );
};
interface ProfileScreenProps extends SettingsListProps {
    onLogout: () => void;
    profile: Profile | null;
}


const ProfileScreen: React.FC<ProfileScreenProps> = (props) => {
    const { theme } = useTheme();

    return (
        <div className={theme === 'dark' ? 'bg-[#10081C] min-h-screen' : 'bg-[#F8F9FA] min-h-screen'}>
            <style>{`
                @keyframes fade-in-out {
                    0% { opacity: 0; transform: translateY(10px) translateX(-50%); }
                    20% { opacity: 1; transform: translateY(0) translateX(-50%); }
                    80% { opacity: 1; transform: translateY(0) translateX(-50%); }
                    100% { opacity: 0; transform: translateY(10px) translateX(-50%); }
                }
                .animate-fade-in-out {
                    animation: fade-in-out 2s ease-in-out forwards;
                }
            `}</style>
            <ProfileHeader />
            <main className="p-4 sm:p-6">
                <UserInfo profile={props.profile} />
                <StatsGrid />
                <AchievementsGrid />
                <ProfileRecentActivity />
                <SettingsList {...props} />

                <div className="mt-8">
                    <button onClick={props.onLogout} className={`w-full text-center py-4 font-semibold rounded-xl transition-colors text-base ${theme === 'dark' ? 'bg-red-900/40 text-red-400 hover:bg-red-900/60' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
                        Sair da conta
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ProfileScreen;