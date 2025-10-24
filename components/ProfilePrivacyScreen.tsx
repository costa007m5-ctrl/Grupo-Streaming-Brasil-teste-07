import React, { useState } from 'react';
import { 
    ArrowLeftIcon,
    EyeIcon,
    SearchIcon,
    UserGroupIcon,
} from './Icons';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Privacidade do Perfil</h1>
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

const SettingsToggleItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, label: string, sublabel: string, defaultEnabled?: boolean }> = ({ icon, label, sublabel, defaultEnabled = false }) => {
    const [enabled, setEnabled] = useState(defaultEnabled);
    return (
        <BaseItem icon={icon} action={<ToggleSwitch enabled={enabled} onChange={setEnabled} />}>
            <p className="font-medium">{label}</p>
            <p className="text-sm text-gray-500">{sublabel}</p>
        </BaseItem>
    );
};

const ProfilePrivacyScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <SettingsSection title="Visibilidade">
                    <SettingsToggleItem icon={EyeIcon} label="Perfil Privado" sublabel="Apenas membros dos seus grupos podem ver" />
                    <SettingsToggleItem icon={SearchIcon} label="Visível em buscas" sublabel="Permitir que outros encontrem seu perfil" defaultEnabled={true} />
                </SettingsSection>

                <SettingsSection title="Informações">
                     <SettingsToggleItem icon={UserGroupIcon} label="Mostrar grupos em comum" sublabel="Exibir grupos que vocês compartilham" defaultEnabled={true} />
                </SettingsSection>
            </main>
        </div>
    );
};

export default ProfilePrivacyScreen;
