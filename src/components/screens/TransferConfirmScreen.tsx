import React, { useState } from 'react';
import { ArrowLeftIcon, ShieldIcon, UserCircleIcon } from '../ui/Icons';
import type { Profile } from '../../types';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Confirmar Transferência</h1>
        </div>
    </header>
);

const InfoRow: React.FC<{ label: string, value: string | React.ReactNode, isLarge?: boolean }> = ({ label, value, isLarge }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-600">{label}</span>
        <span className={`font-bold text-gray-900 ${isLarge ? 'text-2xl' : 'text-base'}`}>{value}</span>
    </div>
);

const maskCpf = (cpf: string | undefined | null): string => {
    if (!cpf) return 'Não informado';
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return '***.***.***-**';
    return `***.${cleanCpf.substring(3, 6)}.***-**`;
};

interface TransferConfirmScreenProps {
    onBack: () => void;
    onConfirm: () => Promise<void>;
    details: {
        amount: number;
        recipient: Profile;
    }
}

const TransferConfirmScreen: React.FC<TransferConfirmScreenProps> = ({ onBack, onConfirm, details }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
        } catch (error: any) {
            alert(error.message); // Show error from App.tsx
            setIsLoading(false); // Re-enable button on failure
        }
    }
    
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">Você está enviando para:</h3>
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        {details.recipient.avatar_url ? (
                            <img src={details.recipient.avatar_url} alt={details.recipient.full_name} className="w-10 h-10 rounded-full" />
                        ) : (
                            <UserCircleIcon className="w-10 h-10 text-gray-400" />
                        )}
                        <div>
                            <p className="font-semibold text-gray-800">{details.recipient.full_name}</p>
                            <p className="text-sm text-gray-500">CPF: {maskCpf(details.recipient.cpf)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <InfoRow 
                        label="Valor da transferência" 
                        value={`R$ ${details.amount.toFixed(2).replace('.', ',')}`}
                        isLarge 
                    />
                    <div className="border-t border-gray-100 pt-4 space-y-2">
                        <InfoRow label="Taxa" value="R$ 0,00" />
                        <InfoRow label="Método" value="Saldo da Carteira" />
                    </div>
                </div>
                
                 <div className="bg-purple-50 text-purple-900 p-4 rounded-xl flex items-start space-x-3">
                    <ShieldIcon className="w-8 h-8 text-purple-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold">Transação segura</h3>
                        <p className="text-sm opacity-80">Verifique os dados com atenção. Transferências entre contas são instantâneas e não podem ser desfeitas.</p>
                    </div>
                </div>

                 <button 
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex justify-center items-center"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        'Confirmar e Transferir'
                    )}
                </button>
            </main>
        </div>
    );
};

export default TransferConfirmScreen;