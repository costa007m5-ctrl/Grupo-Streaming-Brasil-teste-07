import React, { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon,
    EyeIcon,
    SearchIcon,
    UserGroupIcon,
} from './Icons';
import type { Profile } from '../types';

const Header: React.FC<{ onBack: () => void; onSave: () => void; hasChanges: boolean; }> = ({ onBack, onSave, hasChanges }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Privacidade do Perfil</h1>
             <button onClick={onSave} disabled={!hasChanges} className="absolute right-0 p-2 -mr-2 text-purple-600 font-semibold disabled:text-gray-400">
                Salvar
            </button>
        </div>
    </header>
);

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

const SettingsSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <section>
        <h3 className="text-gray-500 font-semibold uppercase tracking-wider text-sm mb-2 px-4">{title}</h3>
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">{children}</div>
    </section>
);

const BaseItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, children: React.ReactNode, action?: React.ReactNode }> = ({ icon: Icon, children, action }) => (
    <div className={`flex items-center p-4 space-x-4 text-gray-800`}>
        <Icon className={`w-6 h-6 flex-shrink-0 text-gray-500`} />
        <div className="flex-grow">{children}</div>
        {action && <div className="ml-auto">{action}</div>}
    </div>
);

const SettingsToggleItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, label: string, sublabel: string, enabled: boolean, onToggle: (enabled: boolean) => void }> = ({ icon, label, sublabel, enabled, onToggle }) => (
    <BaseItem icon={icon} action={<ToggleSwitch enabled={enabled} onChange={onToggle} />}>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">{sublabel}</p>
    </BaseItem>
);

// FIX: Add profile and onSave to props to satisfy interface and handle state changes.
interface ProfilePrivacyScreenProps {
    onBack: () => void;
    profile: Profile | null;
    onSave: (updates: { is_profile_private?: boolean; is_searchable?: boolean; }) => void;
}


const ProfilePrivacyScreen: React.FC<ProfilePrivacyScreenProps> = ({ onBack, profile, onSave }) => {
    const [isPrivate, setIsPrivate] = useState(profile?.is_profile_private ?? false);
    const [isSearchable, setIsSearchable] = useState(profile?.is_searchable ?? true);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const initialPrivate = profile?.is_profile_private ?? false;
        const initialSearchable = profile?.is_searchable ?? true;
        setHasChanges(isPrivate !== initialPrivate || isSearchable !== initialSearchable);
    }, [isPrivate, isSearchable, profile]);

    const handleSave = () => {
        onSave({
            is_profile_private: isPrivate,
            is_searchable: isSearchable,
        });
        setHasChanges(false);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} onSave={handleSave} hasChanges={hasChanges} />
            <main className="p-4 pt-2 space-y-6">
                <SettingsSection title="Visibilidade">
                    <SettingsToggleItem 
                        icon={EyeIcon} 
                        label="Perfil Privado" 
                        sublabel="Apenas membros dos seus grupos podem ver"
                        enabled={isPrivate}
                        onToggle={setIsPrivate}
                    />
                    <SettingsToggleItem 
                        icon={SearchIcon} 
                        label="Visível em buscas" 
                        sublabel="Permitir que outros encontrem seu perfil" 
                        enabled={isSearchable}
                        onToggle={setIsSearchable}
                    />
                </SettingsSection>

                <SettingsSection title="Informações">
                     <SettingsToggleItem 
                        icon={UserGroupIcon} 
                        label="Mostrar grupos em comum" 
                        sublabel="Exibir grupos que vocês compartilham" 
                        enabled={true}
                        onToggle={() => {}} // Placeholder for future implementation
                    />
                </SettingsSection>
            </main>
        </div>
    );
};

export default ProfilePrivacyScreen;
