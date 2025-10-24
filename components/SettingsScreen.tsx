import React, { useState } from 'react';
// FIX: Import missing icons ClipboardDocumentListIcon and ShieldIcon.
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
} from './Icons';

const SettingsHeader: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Configurações</h1>
        </div>
    </header>
);

const SettingsUserCard: React.FC = () => (
    <div className="rounded-2xl p-4 flex items-center space-x-4 from-red-500 to-purple-700 bg-gradient-to-l text-white shadow-lg">
        <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/30 to-white/10 p-1">
                <img 
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                    alt="João Silva"
                    className="w-full h-full rounded-full object-cover"
                />
            </div>
        </div>
        <div>
            <h2 className="font-bold text-xl">João Silva</h2>
            <p className="opacity-80 text-sm">joao.silva@email.com</p>
            <div className="flex items-center space-x-1 mt-1">
                <CheckBadgeIcon className="w-4 h-4 text-white" />
                <span className="text-xs font-medium">Conta verificada</span>
            </div>
        </div>
    </div>
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

const BaseItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, children: React.ReactNode, action?: React.ReactNode, isDanger?: boolean, onClick?: () => void }> = ({ icon: Icon, children, action, isDanger, onClick }) => (
    <div onClick={onClick} className={`flex items-center p-4 space-x-4 ${onClick ? 'cursor-pointer' : ''} ${isDanger ? 'text-red-600' : 'text-gray-800'}`}>
        <Icon className={`w-6 h-6 flex-shrink-0 ${isDanger ? 'text-red-500' : 'text-gray-500'}`} />
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

const SettingsNavigationItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, label: string, sublabel: string, onClick?: () => void }> = ({ icon, label, sublabel, onClick }) => (
    <BaseItem icon={icon} action={<ChevronRightIcon className="w-5 h-5 text-gray-400" />} onClick={onClick}>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">{sublabel}</p>
    </BaseItem>
);

const SettingsInfoItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, label: string, value: string }> = ({ icon, label, value }) => (
     <BaseItem icon={icon}>
        <div className="flex justify-between items-center w-full">
            <p className="font-medium">{label}</p>
            <p className="text-sm text-gray-500 font-medium">{value}</p>
        </div>
    </BaseItem>
);

const SettingsDangerItem: React.FC<{ icon: React.ComponentType<{ className?: string }>, label: string, sublabel: string }> = ({ icon, label, sublabel }) => (
    <BaseItem icon={icon} isDanger onClick={() => {}}>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">{sublabel}</p>
    </BaseItem>
);


const SettingsFooter: React.FC = () => (
    <footer className="text-center py-6">
        <PlayCircleIcon className="w-10 h-10 text-purple-300 mx-auto" />
        <p className="text-sm font-semibold text-gray-600 mt-2">Grupo Streaming Brasil</p>
        <p className="text-xs text-gray-400">Versão 1.0.0</p>
        <p className="text-xs text-gray-400 mt-1">© 2024 Grupo Streaming Brasil. Todos os direitos reservados.</p>
    </footer>
);


const SettingsScreen: React.FC<{ onBack: () => void; onNavigateToSupport: () => void; }> = ({ onBack, onNavigateToSupport }) => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <SettingsHeader onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <SettingsUserCard />

                <SettingsSection title="Aparência">
                    <SettingsToggleItem icon={MoonIcon} label="Modo escuro" sublabel="Ativar tema escuro" />
                </SettingsSection>

                <SettingsSection title="Notificações">
                    <SettingsToggleItem icon={BellIcon} label="Notificações push" sublabel="Receber notificações no app" defaultEnabled={true} />
                    <SettingsToggleItem icon={EnvelopeIcon} label="Receber por e-mail" sublabel="Receber e-mails importantes" defaultEnabled={true} />
                    <SettingsToggleItem icon={ChatBubbleLeftIcon} label="SMS" sublabel="Receber SMS de segurança" />
                    <SettingsToggleItem icon={MegaphoneIcon} label="Marketing" sublabel="Ofertas e promoções" />
                </SettingsSection>

                <SettingsSection title="Segurança">
                    <SettingsToggleItem icon={ShieldCheckIcon} label="Autenticação em 2 fatores" sublabel="Maior segurança para sua conta" defaultEnabled={true} />
                    <SettingsToggleItem icon={FingerPrintIcon} label="Biometria" sublabel="Login com impressão digital" />
                    <SettingsNavigationItem icon={LockClosedIcon} label="Alterar senha" sublabel="Modificar sua senha atual" />
                    <SettingsNavigationItem icon={DevicePhoneMobileIcon} label="Dispositivos conectados" sublabel="Gerenciar dispositivos autorizados" />
                </SettingsSection>

                <SettingsSection title="Privacidade">
                    <SettingsNavigationItem icon={EyeIcon} label="Privacidade do perfil" sublabel="Controlar visibilidade do perfil" />
                    <SettingsNavigationItem icon={DocumentTextIcon} label="Dados pessoais" sublabel="Baixar ou excluir seus dados" />
                    <SettingsNavigationItem icon={ClockHistoryIcon} label="Histórico de atividades" sublabel="Ver seu histórico completo" />
                </SettingsSection>

                <SettingsSection title="Suporte">
                    <SettingsNavigationItem icon={HeadphonesIcon} label="Central de ajuda" sublabel="FAQ e suporte técnico" onClick={onNavigateToSupport} />
                    <SettingsNavigationItem icon={PencilSquareIcon} label="Enviar feedback" sublabel="Ajude-nos a melhorar" />
                    <SettingsNavigationItem icon={StarIcon} label="Avaliar app" sublabel="Avalie na loja de apps" />
                </SettingsSection>

                <SettingsSection title="Sobre">
                    <SettingsInfoItem icon={InformationCircleIcon} label="Versão do app" value="1.0.0" />
                    <SettingsNavigationItem icon={ClipboardDocumentListIcon} label="Termos de uso" sublabel="Leia nossos termos" />
                    <SettingsNavigationItem icon={ShieldIcon} label="Política de privacidade" sublabel="Como protegemos seus dados" />
                </SettingsSection>
                
                 <SettingsSection title="Zona de perigo">
                    <SettingsDangerItem icon={ArrowLeftOnRectangleIcon} label="Sair de todos os dispositivos" sublabel="Desconectar de todas as sessões" />
                    <SettingsDangerItem icon={TrashIcon} label="Excluir conta" sublabel="Remover permanentemente sua conta" />
                </SettingsSection>

                <SettingsFooter />

            </main>
        </div>
    );
};

export default SettingsScreen;