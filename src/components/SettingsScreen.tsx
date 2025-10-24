import React, { useState } from 'react';
import type { Profile } from '../types';
import type { ProfileView } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabaseClient';
// FIX: Added SpeakerWaveIcon and SparklesIcon to imports.
import { 
    ArrowLeftIcon,
    CheckBadgeIcon,
    MoonIcon,
    BellIcon,
    EnvelopeIcon,
    ChatBubbleLeftIcon,
    MegaphoneIcon,
    ShieldCheckIcon,
    FingerPrintIcon,
    LockClosedIcon,
    DevicePhoneMobileIcon,
    EyeIcon,
    DocumentTextIcon,
    ClockHistoryIcon,
    HeadphonesIcon,
    PencilSquareIcon,
    StarIcon,
    InformationCircleIcon,
    ArrowLeftOnRectangleIcon,
    TrashIcon,
    PlayCircleIcon,
    ChevronRightIcon,
    ClipboardDocumentListIcon,
    ShieldIcon,
    SparklesIcon,
    SpeakerWaveIcon,
} from './Icons';

interface SettingsScreenProps {
    onBack: () => void;
    onNavigate: (view: ProfileView) => void;
    profile: Profile | null;
    email: string | undefined;
}

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const { theme } = useTheme();
    const headerBg = theme === 'dark' ? 'bg-[#10081C]/80' : 'bg-white/80';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    return (
        <header className={`sticky top-0 ${headerBg} backdrop-blur-sm z-10 p-4`}>
            <div className={`relative flex justify-center items-center ${textColor} w-full h-8`}>
                <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Configurações</h1>
            </div>
        </header>
    );
};

const SettingsUserCard: React.FC<{profile: Profile | null, email: string | undefined}> = ({ profile, email }) => {
    const { theme } = useTheme();
    return (
        <div className={`rounded-2xl p-4 flex items-center space-x-4 ${theme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-red-500 to-purple-700'} bg-gradient-to-l text-white shadow-lg`}>
            <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/30 to-white/10 p-1">
                    <img 
                        src={profile?.avatar_url || 'https://img.icons8.com/color/96/yoda.png'}
                        alt={profile?.full_name || 'Usuário'}
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
            </div>
            <div>
                <h2 className="font-bold text-xl">{profile?.full_name || 'Carregando...'}</h2>
                <p className="opacity-80 text-sm">{email || 'Carregando...'}</p>
                {profile?.is_verified && (
                    <div className="flex items-center space-x-1 mt-1">
                        <CheckBadgeIcon className="w-4 h-4 text-white" />
                        <span className="text-xs font-medium">Conta verificada</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ enabled, onChange }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            enabled ? 'bg-purple-600' : 'bg-gray-300'
        }`}
    >
        <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
        />
    </button>
);


const SettingsSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => {
    const { theme } = useTheme();
    return (
        <section>
            <h3 className={`font-semibold uppercase tracking-wider text-sm mb-2 px-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{title}</h3>
            <div className={`${theme === 'dark' ? 'bg-[#1C1A27] divide-gray-700' : 'bg-white divide-gray-100'} rounded-xl shadow-sm divide-y`}>{children}</div>
        </section>
    );
};

const BaseItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, children: React.ReactNode, action?: React.ReactNode, isDanger?: boolean, onClick?: () => void }> = ({ icon: Icon, children, action, isDanger, onClick }) => {
    const { theme } = useTheme();
    const textColor = isDanger ? 'text-red-600' : (theme === 'dark' ? 'text-white' : 'text-gray-800');
    const iconColor = isDanger ? 'text-red-500' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500');

    return (
        <div onClick={onClick} className={`flex items-center p-4 space-x-4 ${onClick ? 'cursor-pointer' : ''} ${textColor}`}>
            <Icon className={`w-6 h-6 flex-shrink-0 ${iconColor}`} />
            <div className="flex-grow">{children}</div>
            {action && <div className="ml-auto">{action}</div>}
        </div>
    );
};

const SettingsNavigationItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, label: string, sublabel: string, onClick?: () => void }> = ({ icon, label, sublabel, onClick }) => {
    const { theme } = useTheme();
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    return (
        <BaseItem icon={icon} action={<ChevronRightIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />} onClick={onClick}>
            <p className="font-medium">{label}</p>
            <p className={`text-sm ${subTextColor}`}>{sublabel}</p>
        </BaseItem>
    );
};

const SettingsInfoItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, label: string, value: string }> = ({ icon, label, value }) => {
    const { theme } = useTheme();
    return (
         <BaseItem icon={icon}>
            <div className="flex justify-between items-center w-full">
                <p className="font-medium">{label}</p>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{value}</p>
            </div>
        </BaseItem>
    );
};

const SettingsDangerItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, label: string, sublabel: string, onClick: () => void }> = ({ icon, label, sublabel, onClick }) => (
    <BaseItem icon={icon} isDanger onClick={onClick} action={<ChevronRightIcon className="w-5 h-5 text-red-400" />}>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-red-500/80">{sublabel}</p>
    </BaseItem>
);

const SettingsFooter: React.FC = () => {
    const { theme } = useTheme();
    return (
        <footer className="text-center py-6">
            <PlayCircleIcon className={`w-10 h-10 ${theme === 'dark' ? 'text-purple-700' : 'text-purple-300'} mx-auto`} />
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Grupo Streaming Brasil</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Versão 1.0.0</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-1`}>© 2024 Grupo Streaming Brasil. Todos os direitos reservados.</p>
        </footer>
    );
};


const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onNavigate, profile, email }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`${theme === 'dark' ? 'bg-[#10081C]' : 'bg-gray-100'} min-h-screen`}>
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <SettingsUserCard profile={profile} email={email} />

                <SettingsSection title="Preferências">
                    <SettingsNavigationItem icon={SparklesIcon} label="Aparência" sublabel="Alterar tema do aplicativo" onClick={() => onNavigate('designSettings')} />
                    <SettingsNavigationItem icon={SpeakerWaveIcon} label="Sons e Mídia" sublabel="Controlar sons de vinhetas e trailers" onClick={() => onNavigate('soundSettings')} />
                    <SettingsNavigationItem icon={BellIcon} label="Notificações" sublabel="Gerenciar alertas do app, e-mail e SMS" onClick={() => onNavigate('notifications')} />
                </SettingsSection>
                
                <SettingsSection title="Conta">
                    {/* FIX: Replaced screen component with LockClosedIcon component for the icon prop. */}
                    <SettingsNavigationItem icon={LockClosedIcon} label="Segurança" sublabel="2FA, senha, dispositivos conectados" onClick={() => onNavigate('security')} />
                    <SettingsNavigationItem icon={EyeIcon} label="Privacidade" sublabel="Visibilidade do perfil e dados" onClick={() => onNavigate('profilePrivacy')} />
                    <SettingsNavigationItem icon={DocumentTextIcon} label="Dados Pessoais" sublabel="Baixar ou excluir seus dados" onClick={() => onNavigate('personalData')} />
                    <SettingsNavigationItem icon={ClockHistoryIcon} label="Histórico de Atividades" sublabel="Ver seu histórico de transações" onClick={() => onNavigate('activityHistory')} />
                </SettingsSection>

                <SettingsSection title="Suporte">
                    <SettingsNavigationItem icon={HeadphonesIcon} label="Central de Ajuda" sublabel="FAQ e suporte técnico" onClick={() => onNavigate('support')} />
                    <SettingsNavigationItem icon={PencilSquareIcon} label="Enviar Feedback" sublabel="Ajude-nos a melhorar" onClick={() => window.location.href = 'mailto:suporte@grupostreamingbrasil.com?subject=Feedback sobre o App'} />
                    <SettingsNavigationItem icon={StarIcon} label="Avaliar App" sublabel="Avalie na loja de apps" onClick={() => alert('Em breve na sua loja de aplicativos!')} />
                </SettingsSection>

                <SettingsSection title="Sobre">
                    <SettingsInfoItem icon={InformationCircleIcon} label="Versão do app" value="1.0.0" />
                    <SettingsNavigationItem icon={ClipboardDocumentListIcon} label="Termos de Uso" sublabel="Leia nossos termos e condições" onClick={() => onNavigate('termsOfUse')} />
                    <SettingsNavigationItem icon={ShieldIcon} label="Política de Privacidade" sublabel="Como protegemos seus dados" onClick={() => onNavigate('privacyPolicy')} />
                </SettingsSection>

                <SettingsFooter />
            </main>
        </div>
    );
};

export default SettingsScreen;
