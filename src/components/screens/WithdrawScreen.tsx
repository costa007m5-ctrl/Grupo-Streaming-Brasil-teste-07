

import React, { useState } from 'react';
import { ArrowLeftIcon, InformationCircleIcon, PixIcon } from '../ui/Icons';
import type { Profile } from '../../types';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Sacar Dinheiro</h1>
        </div>
    </header>
);

const FormInput: React.FC<{ label: string; id: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; prefix?: string; }> = ({ label, id, type = "text", value, onChange, placeholder, prefix }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">{prefix}</span>}
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-gray-100 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${prefix ? 'pl-7' : ''}`}
            />
        </div>
    </div>
);

// FIX: Add profile to props to use real user data
interface WithdrawScreenProps {
    onBack: () => void;
    onNavigateToVerification: () => void;
    profile: Profile | null;
}

const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ onBack, onNavigateToVerification, profile }) => {
    const [amount, setAmount] = useState('');
    const [pixKey, setPixKey] = useState('');
    
    const isWithdrawEnabled = !!(profile?.full_name && profile?.cpf && profile?.birth_date && profile?.cep && profile?.street && profile?.number && profile?.city && profile?.state);


    const handleWithdraw = () => {
        alert("Solicitação de saque enviada com sucesso!");
        onBack();
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                 {!isWithdrawEnabled && (
                     <div className="bg-yellow-50 text-yellow-900 p-4 rounded-xl flex items-start space-x-3">
                        <InformationCircleIcon className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold">Verificação Pendente</h3>
                            <p className="text-sm opacity-80">Você precisa preencher seus Dados Pessoais e Endereço para poder realizar saques.</p>
                            <button onClick={onNavigateToVerification} className="font-bold text-sm mt-2 text-yellow-900 border-b-2 border-yellow-900/50">Verificar conta agora</button>
                        </div>
                    </div>
                )}
                 <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <FormInput
                        label="Valor a sacar"
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0,00"
                        prefix="R$"
                    />
                     <div className="text-right text-sm text-gray-500">
                        Saldo disponível: R$ {(profile?.balance ?? 0).toFixed(2).replace('.', ',')}
                    </div>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center space-x-2">
                        <PixIcon className="w-6 h-6 text-gray-600" />
                        <h3 className="font-bold text-lg text-gray-800">Chave PIX</h3>
                    </div>
                     <FormInput
                        label="Insira sua chave PIX"
                        id="pixKey"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        placeholder="CPF, e-mail, celular ou chave aleatória"
                    />
                 </div>
                <button 
                    onClick={handleWithdraw}
                    disabled={!isWithdrawEnabled}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Confirmar Saque
                </button>
            </main>
        </div>
    );
};

export default WithdrawScreen;