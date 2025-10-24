import React, { useState } from 'react';
import { 
    ArrowLeftIcon,
    BellIcon,
    BanknotesIcon,
    UserGroupIcon,
    CalendarDaysIcon,
    MegaphoneIcon,
    SparklesIcon
} from '../ui/Icons';
import { 
    requestPermissionAndToken,
    sendPaymentNotification,
    sendNewMemberNotification,
    sendPaymentReminderNotification,
    sendChatMessageNotification,
    sendPromotionNotification,
    sendNewContentNotification
} from '../../lib';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Notificações</h1>
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

const NotificationsScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    const handleTestNotification = async (type: string) => {
        setTestStatus('testing');
        
        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                await requestPermissionAndToken();
                
                switch(type) {
                    case 'payment':
                        await sendPaymentNotification(150.00, 'João Silva');
                        break;
                    case 'member':
                        await sendNewMemberNotification('Netflix Premium 4K', 'Maria Santos', 'https://img.icons8.com/color/96/user-female-circle.png');
                        break;
                    case 'reminder':
                        await sendPaymentReminderNotification('Disney+ Premium', 45.90, 'amanhã');
                        break;
                    case 'chat':
                        await sendChatMessageNotification('Prime Video Família', 'Carlos Oliveira', 'Pessoal, alguém sabe a senha atualizada?', 'https://img.icons8.com/color/96/user-male-circle.png');
                        break;
                    case 'promo':
                        await sendPromotionNotification('Oferta Especial!', 'Ganhe R$ 50 ao convidar 3 amigos para o GSB! 🎁');
                        break;
                    case 'content':
                        await sendNewContentNotification('Netflix', 'Stranger Things - Temporada 5', 'https://img.icons8.com/fluency/480/netflix.png');
                        break;
                }
                
                setTestStatus('success');
                setTimeout(() => setTestStatus('idle'), 2000);
            } else {
                setTestStatus('error');
                setTimeout(() => setTestStatus('idle'), 3000);
            }
        } catch (error) {
            console.error('Erro ao testar notificação:', error);
            setTestStatus('error');
            setTimeout(() => setTestStatus('idle'), 3000);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <SettingsSection title="Testar Notificações Ricas">
                    <div className="p-4 space-y-3">
                        <p className="text-xs text-gray-500 text-center mb-3">
                            Teste diferentes tipos de notificações expandidas com imagens e botões de ação
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleTestNotification('payment')}
                                disabled={testStatus === 'testing'}
                                className="flex flex-col items-center justify-center space-y-1 py-3 px-2 rounded-lg font-medium transition bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                <span className="text-2xl">💰</span>
                                <span className="text-xs">Pagamento</span>
                            </button>
                            
                            <button
                                onClick={() => handleTestNotification('member')}
                                disabled={testStatus === 'testing'}
                                className="flex flex-col items-center justify-center space-y-1 py-3 px-2 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                <span className="text-2xl">👥</span>
                                <span className="text-xs">Novo Membro</span>
                            </button>
                            
                            <button
                                onClick={() => handleTestNotification('reminder')}
                                disabled={testStatus === 'testing'}
                                className="flex flex-col items-center justify-center space-y-1 py-3 px-2 rounded-lg font-medium transition bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
                            >
                                <span className="text-2xl">⏰</span>
                                <span className="text-xs">Lembrete</span>
                            </button>
                            
                            <button
                                onClick={() => handleTestNotification('chat')}
                                disabled={testStatus === 'testing'}
                                className="flex flex-col items-center justify-center space-y-1 py-3 px-2 rounded-lg font-medium transition bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                            >
                                <span className="text-2xl">💬</span>
                                <span className="text-xs">Mensagem</span>
                            </button>
                            
                            <button
                                onClick={() => handleTestNotification('promo')}
                                disabled={testStatus === 'testing'}
                                className="flex flex-col items-center justify-center space-y-1 py-3 px-2 rounded-lg font-medium transition bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50"
                            >
                                <span className="text-2xl">🎁</span>
                                <span className="text-xs">Promoção</span>
                            </button>
                            
                            <button
                                onClick={() => handleTestNotification('content')}
                                disabled={testStatus === 'testing'}
                                className="flex flex-col items-center justify-center space-y-1 py-3 px-2 rounded-lg font-medium transition bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                <span className="text-2xl">🎬</span>
                                <span className="text-xs">Conteúdo</span>
                            </button>
                        </div>
                        
                        {testStatus === 'success' && (
                            <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center text-sm font-medium">
                                ✓ Notificação enviada! Verifique sua barra de notificações
                            </div>
                        )}
                        
                        {testStatus === 'error' && (
                            <div className="bg-red-100 text-red-800 p-3 rounded-lg text-center text-sm font-medium">
                                ✗ Erro - Verifique as permissões de notificação
                            </div>
                        )}
                    </div>
                </SettingsSection>
                <SettingsSection title="Geral">
                    <SettingsToggleItem icon={BellIcon} label="Todas as notificações" sublabel="Ativar ou desativar tudo" />
                </SettingsSection>
                <SettingsSection title="Minha Carteira">
                    <SettingsToggleItem icon={BanknotesIcon} label="Pagamentos e transferências" sublabel="Recebimentos, envios, depósitos" defaultEnabled={true} />
                </SettingsSection>
                <SettingsSection title="Meus Grupos">
                    <SettingsToggleItem icon={UserGroupIcon} label="Atividade nos grupos" sublabel="Novos membros, mensagens no chat" defaultEnabled={true} />
                    <SettingsToggleItem icon={CalendarDaysIcon} label="Lembretes de pagamento" sublabel="Avisos sobre vencimento de faturas" defaultEnabled={true} />
                </SettingsSection>
                <SettingsSection title="Outros">
                     <SettingsToggleItem icon={MegaphoneIcon} label="Promoções e novidades" sublabel="Ofertas especiais e atualizações do app" />
                </SettingsSection>
            </main>
        </div>
    );
};

// FIX: Add default export to resolve import error in App.tsx
export default NotificationsScreen;
