import React from 'react';
import { 
    ArrowLeftIcon,
    ChevronRightIcon,
    ShieldCheckIcon,
    FingerPrintIcon,
    LockClosedIcon,
    DevicePhoneMobileIcon,
    EyeIcon,
    DocumentTextIcon,
    ClockHistoryIcon,
} from '../ui/Icons';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Privacidade e Segurança</h1>
        </div>
    </header>
);

const SettingsSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <section>
        <h3 className="text-gray-500 font-semibold uppercase tracking-wider text-sm mb-2 px-4">{title}</h3>
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">{children}</div>
    </section>
);

const BaseItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, children: React.ReactNode, action?: React.ReactNode, onClick?: () => void }> = ({ icon: Icon, children, action, onClick }) => (
    <div onClick={onClick} className={`flex items-center p-4 space-x-4 ${onClick ? 'cursor-pointer' : ''} text-gray-800`}>
        <Icon className={`w-6 h-6 flex-shrink-0 text-gray-500`} />
        <div className="flex-grow">{children}</div>
        {action && <div className="ml-auto">{action}</div>}
    </div>
);

const SettingsNavigationItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, label: string, sublabel: string, onClick?: () => void }> = ({ icon, label, sublabel, onClick }) => (
    <BaseItem icon={icon} action={<ChevronRightIcon className="w-5 h-5 text-gray-400" />} onClick={onClick}>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">{sublabel}</p>
    </BaseItem>
);

interface SecurityPrivacyScreenProps {
  onBack: () => void;
  onNavigateToTwoFactorAuth: () => void;
  onNavigateToBiometrics: () => void;
  onNavigateToChangePassword: () => void;
  onNavigateToConnectedDevices: () => void;
  onNavigateToProfilePrivacy: () => void;
  onNavigateToPersonalData: () => void;
  onNavigateToActivityHistory: () => void;
}

const SecurityPrivacyScreen: React.FC<SecurityPrivacyScreenProps> = ({ 
    onBack,
    onNavigateToTwoFactorAuth,
    onNavigateToBiometrics,
    onNavigateToChangePassword,
    onNavigateToConnectedDevices,
    onNavigateToProfilePrivacy,
    onNavigateToPersonalData,
    onNavigateToActivityHistory
}) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                 <SettingsSection title="Segurança">
                    <SettingsNavigationItem icon={ShieldCheckIcon} label="Autenticação em 2 fatores" sublabel="Ativada" onClick={onNavigateToTwoFactorAuth} />
                    <SettingsNavigationItem icon={FingerPrintIcon} label="Biometria" sublabel="Login com impressão digital" onClick={onNavigateToBiometrics}/>
                    <SettingsNavigationItem icon={LockClosedIcon} label="Alterar senha" sublabel="Modificar sua senha atual" onClick={onNavigateToChangePassword} />
                    <SettingsNavigationItem icon={DevicePhoneMobileIcon} label="Dispositivos conectados" sublabel="Gerenciar dispositivos autorizados" onClick={onNavigateToConnectedDevices} />
                </SettingsSection>

                <SettingsSection title="Privacidade">
                    <SettingsNavigationItem icon={EyeIcon} label="Privacidade do perfil" sublabel="Controlar visibilidade do perfil" onClick={onNavigateToProfilePrivacy} />
                    <SettingsNavigationItem icon={DocumentTextIcon} label="Dados pessoais" sublabel="Baixar ou excluir seus dados" onClick={onNavigateToPersonalData}/>
                    <SettingsNavigationItem icon={ClockHistoryIcon} label="Histórico de atividades" sublabel="Ver seu histórico completo" onClick={onNavigateToActivityHistory} />
                </SettingsSection>
            </main>
        </div>
    );
};

export default SecurityPrivacyScreen;