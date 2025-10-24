import React, { useState } from 'react';
import type { Group, Profile } from '../types';
import { ArrowLeftIcon, CardIcon, DocumentDuplicateIcon, QrCodeIcon, ShieldIcon, WalletIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';

type PaymentMethod = 'pix' | 'credit-card' | 'wallet';

const PaymentHeader: React.FC<{ onBack: () => void, title?: string }> = ({ onBack, title = "Pagamento Seguro" }) => {
    const { theme } = useTheme();
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    return (
        <header className="p-4 flex flex-col items-center relative text-center">
            <button onClick={onBack} className="absolute left-4 top-1/2 -translate-y-1/2 p-2">
                <ArrowLeftIcon className={`w-6 h-6 ${textColor}`} />
            </button>
            <h1 className={`text-xl font-bold ${textColor}`}>{title}</h1>
            {title === "Pagamento Seguro" && <p className="text-sm text-purple-500 font-medium">Reembolso automático em caso de problemas.</p>}
        </header>
    );
};

const OrderSummary: React.FC<{ group: Group }> = ({ group }) => {
    const { theme } = useTheme();
    return (
        <section className={`p-4 rounded-2xl shadow-sm space-y-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Resumo do pedido</h2>
            <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center p-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-black'}`}>
                    <img src={group.logo} alt={group.name} className="w-full h-full object-contain" />
                </div>
                <div>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{group.name}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Anfitrião: {group.host_name}</p>
                </div>
                <div className="ml-auto text-right">
                     <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>R$ {group.price.toFixed(2).replace('.', ',')}</p>
                     <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>por mês</p>
                </div>
            </div>
            <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} pt-3 space-y-2`}>
                <div className={`flex justify-between text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span>Subtotal</span>
                    <span>R$ {group.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className={`flex justify-between text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span>Taxa de segurança</span>
                    <span>R$ 0,00</span>
                </div>
                <div className={`flex justify-between font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <span>Total</span>
                    <span>R$ {group.price.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </section>
    );
};

const EscrowInfo: React.FC = () => {
    const { theme } = useTheme();
    return (
        <section className={`p-4 rounded-2xl shadow-sm flex items-start space-x-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <ShieldIcon className="w-10 h-10 text-purple-500 flex-shrink-0 mt-1" />
            <div>
                <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pagamento com custódia</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Seu dinheiro fica protegido em nossa custódia até que o anfitrião confirme seu acesso ao serviço. Reembolso automático em caso de problemas.</p>
            </div>
        </section>
    );
};

const PaymentMethodOption: React.FC<{ icon: React.ComponentType<{ className?: string }>, title: string, subtitle: string, recommended?: boolean, selected: boolean, onClick: () => void, value?: string }> = ({ icon: Icon, title, subtitle, recommended, selected, onClick, value }) => {
    const { theme } = useTheme();
    return (
        <div onClick={onClick} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${selected ? 'border-purple-600 bg-purple-500/10' : (theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white')}`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${selected ? 'bg-purple-100 text-purple-700' : (theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="ml-4 flex-grow">
                <div className="flex items-center">
                    <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</p>
                    {recommended && <span className="ml-2 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Recomendado</span>}
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{subtitle}</p>
            </div>
            {value && <span className={`font-semibold mr-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{value}</span>}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'bg-purple-600 border-purple-600' : (theme === 'dark' ? 'border-gray-600' : 'border-gray-300')}`}>
                {selected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
        </div>
    );
};

const PaymentMethods: React.FC<{ selectedMethod: PaymentMethod; onSelectMethod: (method: PaymentMethod) => void; walletBalance: number }> = ({ selectedMethod, onSelectMethod, walletBalance }) => {
    const { theme } = useTheme();
    return (
        <section className="space-y-4">
             <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Método de pagamento</h2>
             <div className="space-y-3">
                <PaymentMethodOption icon={WalletIcon} title="Saldo da Carteira" subtitle={`R$ ${walletBalance.toFixed(2).replace('.',',')} disponível`} selected={selectedMethod === 'wallet'} onClick={() => onSelectMethod('wallet')} />
                <PaymentMethodOption icon={QrCodeIcon} title="PIX" subtitle="Pagamento instantâneo" recommended selected={selectedMethod === 'pix'} onClick={() => onSelectMethod('pix')} />
                <PaymentMethodOption icon={CardIcon} title="Cartão de Crédito" subtitle="Débito automático mensal" selected={selectedMethod === 'credit-card'} onClick={() => onSelectMethod('credit-card')} />
             </div>
        </section>
    );
};

const CreditCardForm: React.FC = () => {
    const { theme } = useTheme();
    const inputClasses = `w-full p-3 rounded-lg focus:ring-purple-500 focus:border-purple-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`;
    const labelClasses = `text-sm font-medium block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;
    return (
        <section className={`p-4 rounded-2xl shadow-sm space-y-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Dados do cartão</h2>
            <div className="space-y-3">
                <div>
                    <label className={labelClasses}>Número do cartão</label>
                    <input type="text" placeholder="1234 5678 9012 3456" className={inputClasses} />
                </div>
                <div className="flex space-x-3">
                    <div className="w-1/2">
                        <label className={labelClasses}>Validade</label>
                        <input type="text" placeholder="MM/AA" className={inputClasses} />
                    </div>
                    <div className="w-1/2">
                        <label className={labelClasses}>CVV</label>
                        <input type="text" placeholder="123" className={inputClasses} />
                    </div>
                </div>
                <div>
                    <label className={labelClasses}>Nome no cartão</label>
                    <input type="text" placeholder="Nome como está no cartão" className={inputClasses} />
                </div>
            </div>
        </section>
    );
};

const WalletDetails: React.FC<{ group: Group, balance: number }> = ({ group, balance }) => {
    const { theme } = useTheme();
    return (
        <section className={`p-4 rounded-2xl shadow-sm space-y-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Saldo da carteira</h2>
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-purple-900/40' : 'bg-purple-50'}`}>
                <div className="flex justify-between items-center">
                    <div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Saldo disponível</p>
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-200' : 'text-purple-900'}`}>R$ {balance.toFixed(2).replace('.',',')}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-purple-900/60' : 'bg-purple-200'}`}>
                        <WalletIcon className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`} />
                    </div>
                </div>
            </div>
             <div className={`flex justify-between text-sm pt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Valor a ser debitado</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>- R$ {group.price.toFixed(2).replace('.', ',')}</span>
            </div>
             <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} pt-3 flex justify-between font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <span>Saldo restante</span>
                <span>R$ {(balance - group.price).toFixed(2).replace('.', ',')}</span>
            </div>
        </section>
    );
};

const PixDetails: React.FC<{ pixData: { pixKey: string, qrCodeBase64: string } }> = ({ pixData }) => {
    const { theme } = useTheme();
    const [copySuccess, setCopySuccess] = useState('');

    const handleCopy = () => {
        if (!pixData || copySuccess) return;
        navigator.clipboard.writeText(pixData.pixKey).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Falhou!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <section className={`p-4 rounded-2xl shadow-sm space-y-4 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Pagamento via PIX</h2>
            <div className="flex justify-center p-2 bg-white rounded-lg">
                <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="rounded-lg" />
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Escaneie o QR Code com seu app do banco</p>
            
            <div className={`p-3 rounded-lg text-left ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-center mb-2">
                    <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Código PIX</p>
                    <button onClick={handleCopy} className="flex items-center space-x-1 text-sm font-semibold text-purple-500">
                        <DocumentDuplicateIcon className="w-4 h-4" />
                        <span>{copySuccess || 'Copiar'}</span>
                    </button>
                </div>
                <p className={`text-xs break-all ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{pixData.pixKey}</p>
            </div>
        </section>
    );
};

const PaymentFooter: React.FC<{ buttonText: string; onConfirm: () => void; }> = ({ buttonText, onConfirm }) => {
    const { theme } = useTheme();
    return (
        <footer className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] ${theme === 'dark' ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
            <button
                onClick={onConfirm}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:opacity-90 transition-opacity"
            >
                {buttonText}
            </button>
            <p className={`text-xs text-center mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Ao confirmar, você aceita nossos termos de uso e política de privacidade.</p>
        </footer>
    );
};

interface PaymentScreenProps {
    group: Group;
    onBack: () => void;
    onConfirm: () => void;
    profile: Profile | null;
    email?: string;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ group, onBack, onConfirm, profile, email }) => {
    const { theme } = useTheme();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wallet');
    const [step, setStep] = useState<'selection' | 'pix-confirm'>('selection');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [pixData, setPixData] = useState<{ pixKey: string, qrCodeBase64: string } | null>(null);

    const handleConfirmPayment = async () => {
        setIsLoading(true);
        setApiError(null);
        
        try {
            if (selectedMethod === 'wallet') {
                if (profile && profile.balance >= group.price) {
                    onConfirm();
                } else {
                    throw new Error("Saldo insuficiente na carteira.");
                }
            } else if (selectedMethod === 'pix') {
                if (!email) {
                    throw new Error("E-mail do usuário não encontrado para gerar o PIX.");
                }
                const response = await fetch('/api/create-pix', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        price: group.price,
                        email: email,
                        description: `Pagamento para grupo ${group.name}`
                    })
                });

                const text = await response.text();
                const data = text ? JSON.parse(text) : {};

                if (!response.ok || data.error) {
                    throw new Error(data.error || 'Falha na API de pagamento.');
                }
                
                setPixData(data);
                setStep('pix-confirm');

            } else if (selectedMethod === 'credit-card') {
                // Supondo que exista uma rota para isso, mantendo a lógica original
                const response = await fetch('/api/create-preference', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        price: group.price,
                        description: `Pagamento para grupo ${group.name}`
                    })
                });

                const text = await response.text();
                const data = text ? JSON.parse(text) : {};

                if (!response.ok || data.error) {
                    throw new Error(data.error || 'Falha ao criar preferência de pagamento.');
                }
                
                if(data.init_point) {
                    window.location.href = data.init_point;
                    return; // Evita que o setIsLoading(false) seja chamado
                } else {
                    throw new Error('URL de pagamento não recebida.');
                }
            }
        } catch (error: any) {
            setApiError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'pix-confirm' && pixData) {
        return (
             <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} min-h-screen`}>
                <PaymentHeader onBack={() => setStep('selection')} />
                <main className="p-4 pt-8">
                    <PixDetails pixData={pixData} />
                    <p className={`text-center text-sm mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Após o pagamento, clique no botão abaixo para confirmar sua entrada no grupo.</p>
                </main>
                <PaymentFooter buttonText="Já paguei, entrar no grupo" onConfirm={onConfirm} />
            </div>
        );
    }

    const buttonText = selectedMethod === 'pix' ? 'Gerar código PIX' : 'Confirmar pagamento';

    return (
        <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
            <div className="pb-32">
                <PaymentHeader onBack={onBack} />
                <main className="p-4 space-y-6">
                    <OrderSummary group={group} />
                    {apiError && (
                         <div className="p-3 bg-red-50 text-red-700 rounded-xl text-center text-sm font-semibold">
                            {apiError}
                        </div>
                    )}
                    <EscrowInfo />
                    <PaymentMethods selectedMethod={selectedMethod} onSelectMethod={setSelectedMethod} walletBalance={profile?.balance ?? 0} />
                    {selectedMethod === 'wallet' && <WalletDetails group={group} balance={profile?.balance ?? 0} />}
                    {selectedMethod === 'credit-card' && <CreditCardForm />}
                </main>
            </div>
            <PaymentFooter buttonText={isLoading ? 'Processando...' : buttonText} onConfirm={isLoading ? () => {} : handleConfirmPayment} />
        </div>
    );
};

export default PaymentScreen;