import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, QrCodeIcon, TicketIcon, CardIcon, DocumentDuplicateIcon } from '../ui/Icons';
import type { Profile } from '../../types';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Forma de Pagamento</h1>
        </div>
    </header>
);

type AddMoneyMethod = 'pix' | 'boleto' | 'card';

const MethodButton: React.FC<{ icon: React.ComponentType<{className?: string}>, label: string, selected: boolean, onClick: () => void, disabled?: boolean }> = ({ icon: Icon, label, selected, onClick, disabled }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl transition-colors ${selected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <Icon className="w-7 h-7 mb-1" />
        <span className="text-sm font-semibold">{label}</span>
    </button>
);

interface PixDetailsProps {
    pixData: {
        pixKey: string;
        qrCodeBase64: string;
    } | null;
    isLoading: boolean;
    error: string | null;
}

const PixDetails: React.FC<PixDetailsProps> = ({ pixData, isLoading, error }) => {
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
    
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                <p className="mt-4 font-semibold text-gray-600">Gerando PIX...</p>
            </div>
        );
    }

    if (error) {
         return (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl shadow-sm text-center">
                <p className="font-bold">Erro ao gerar PIX</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (!pixData) return null;

    return (
        <section className="bg-white p-4 rounded-xl shadow-sm space-y-4 text-center">
            <h2 className="text-lg font-bold text-gray-800">Pague com PIX para adicionar saldo</h2>
            <div className="flex justify-center">
                <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="rounded-lg border-4 border-gray-200" />
            </div>
            <p className="text-sm text-gray-600">Escaneie o QR Code com seu app do banco</p>
            
            <div className="bg-gray-100 p-3 rounded-lg text-left">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-sm text-gray-800">PIX Copia e Cola</p>
                    <button onClick={handleCopy} className="flex items-center space-x-1 text-sm font-semibold text-purple-700">
                        <DocumentDuplicateIcon className="w-4 h-4" />
                        <span>{copySuccess || 'Copiar'}</span>
                    </button>
                </div>
                <p className="text-xs text-gray-600 break-all">{pixData.pixKey}</p>
            </div>
        </section>
    );
};

interface BoletoDetailsProps {
    boletoData: {
        boletoUrl: string;
        barcode: string;
    } | null;
    isLoading: boolean;
    error: string | null;
}

const BoletoDetails: React.FC<BoletoDetailsProps> = ({ boletoData, isLoading, error }) => {
    const [copySuccess, setCopySuccess] = useState('');

    const handleCopy = () => {
        if (!boletoData || copySuccess) return;
        navigator.clipboard.writeText(boletoData.barcode).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Falhou!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };
    
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm">
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                <p className="mt-4 font-semibold text-gray-600">Gerando Boleto...</p>
            </div>
        );
    }

    if (error) {
         return (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl shadow-sm text-center">
                <p className="font-bold">Erro ao gerar Boleto</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (!boletoData) return null;

    return (
        <section className="bg-white p-4 rounded-xl shadow-sm space-y-4 text-center">
            <h2 className="text-lg font-bold text-gray-800">Pague com Boleto para adicionar saldo</h2>
            <p className="text-sm text-gray-600">O saldo será creditado em até 2 dias úteis após o pagamento.</p>
            
            <div className="bg-gray-100 p-3 rounded-lg text-left">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-sm text-gray-800">Linha Digitável</p>
                    <button onClick={handleCopy} className="flex items-center space-x-1 text-sm font-semibold text-purple-700">
                        <DocumentDuplicateIcon className="w-4 h-4" />
                        <span>{copySuccess || 'Copiar'}</span>
                    </button>
                </div>
                <p className="text-xs text-gray-600 break-all">{boletoData.barcode}</p>
            </div>
             <a 
                href={boletoData.boletoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full block bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors"
            >
                Ver e Imprimir Boleto
            </a>
        </section>
    );
};

interface AddMoneyScreenProps {
    onBack: () => void;
    amount: number;
    profile: Profile | null;
    email?: string;
}

const AddMoneyScreen: React.FC<AddMoneyScreenProps> = ({ onBack, amount, profile, email }) => {
    const [method, setMethod] = useState<AddMoneyMethod>('pix');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [pixData, setPixData] = useState<{ pixKey: string, qrCodeBase64: string } | null>(null);
    const [boletoData, setBoletoData] = useState<{ boletoUrl: string, barcode: string } | null>(null);

    // Check if personal and address info is complete to enable Boleto
    const isBoletoEnabled = !!(profile?.cpf && profile?.birth_date && profile?.cep && profile?.street && profile?.city && profile?.state);

    const createPixPayment = async () => {
        if (!email) {
            setApiError("E-mail do usuário não encontrado para gerar o PIX.");
            return;
        }
        setIsLoading(true);
        setApiError(null);
        try {
            const response = await fetch('/api/create-pix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price: amount,
                    email: email,
                    description: `Adicionar saldo R$${amount.toFixed(2)}`
                })
            });

            const text = await response.text();
            const data = text ? JSON.parse(text) : {};

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Falha ao se comunicar com a API de pagamento.');
            }
            
            setPixData(data);
        } catch (error: any) {
             if (error instanceof SyntaxError) {
                setApiError('Resposta inválida do servidor. Verifique a URL e a API.');
            } else {
                setApiError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const createCardPreference = async () => {
        setIsLoading(true);
        setApiError(null);
         try {
            const response = await fetch('/api/create-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price: amount,
                    description: `Adicionar saldo R$${amount.toFixed(2)}`
                })
            });
            
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Falha ao criar preferência de pagamento.');
            }

            if(data.init_point) {
                window.location.href = data.init_point;
            } else {
                 throw new Error('URL de pagamento não recebida.');
            }

        } catch (error: any) {
            setApiError(error.message);
            setIsLoading(false);
        }
    };

    const createBoletoPayment = async () => {
        if (!profile || !profile.cpf || !profile.cep || !profile.street || !profile.number || !profile.city || !profile.state) {
            setApiError("Para gerar um boleto, por favor, complete seu cadastro com Nome, CPF e Endereço na tela de Verificação de Conta.");
            return;
        }
        setIsLoading(true);
        setApiError(null);
        try {
            const payerInfo = {
                email: email,
                fullName: profile.full_name,
                cpf: profile.cpf,
                address: {
                    cep: profile.cep,
                    street: profile.street,
                    number: profile.number,
                    neighborhood: profile.neighborhood,
                    city: profile.city,
                    state: profile.state,
                }
            };

            const response = await fetch('/api/create-boleto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price: amount,
                    description: `Adicionar saldo R$${amount.toFixed(2)}`,
                    payerInfo: payerInfo
                })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Falha ao gerar o boleto.');
            }
            
            setBoletoData(data);
        } catch (error: any) {
            setApiError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMethodChange = (newMethod: AddMoneyMethod) => {
        if (newMethod === 'boleto' && !isBoletoEnabled) {
            alert('Para habilitar o boleto, complete seus Dados Pessoais e Endereço na tela de "Verificação de Conta" em seu perfil.');
            return;
        }
        setMethod(newMethod);
        setPixData(null);
        setBoletoData(null);
        setApiError(null);
        setIsLoading(false);

        if (newMethod === 'pix') {
            createPixPayment();
        } else if (newMethod === 'card') {
            createCardPreference();
        } else if (newMethod === 'boleto') {
            createBoletoPayment();
        }
    };
    
    useEffect(() => {
        if (method === 'pix') {
            createPixPayment();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount, profile, email]);


    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Valor a ser adicionado</span>
                        <span className="font-bold text-gray-900 text-xl">
                            R$ {amount.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                </div>

                <div>
                    <div className="flex space-x-2">
                        <MethodButton icon={QrCodeIcon} label="PIX" selected={method === 'pix'} onClick={() => handleMethodChange('pix')} />
                        <MethodButton 
                            icon={TicketIcon} 
                            label="Boleto" 
                            selected={method === 'boleto'} 
                            onClick={() => handleMethodChange('boleto')} 
                            disabled={!isBoletoEnabled}
                        />
                        <MethodButton icon={CardIcon} label="Cartão" selected={method === 'card'} onClick={() => handleMethodChange('card')} />
                    </div>
                    {!isBoletoEnabled && (
                        <p className="text-center text-xs text-gray-500 mt-2 px-2">
                            Boleto desabilitado. Complete seus <strong>Dados Pessoais</strong> e <strong>Endereço</strong> na Verificação de Conta para usar esta opção.
                        </p>
                    )}
                </div>

                {method === 'pix' && <PixDetails isLoading={isLoading} error={apiError} pixData={pixData} />}
                {method === 'boleto' && <BoletoDetails isLoading={isLoading} error={apiError} boletoData={boletoData} />}
                {method === 'card' && (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                        {isLoading && <div className="w-8 h-8 mx-auto border-4 border-dashed rounded-full animate-spin border-purple-500 mb-3"></div>}
                        <p className={`font-semibold ${apiError ? 'text-red-600' : 'text-gray-600'}`}>
                           {isLoading ? 'Redirecionando para o pagamento...' : apiError ? apiError : 'Clique em "Cartão" novamente para ser redirecionado.'}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AddMoneyScreen;