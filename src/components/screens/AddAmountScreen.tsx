
import React, { useState } from 'react';
import { ArrowLeftIcon } from '../ui/Icons';
import type { Profile } from '../../types';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Adicionar Saldo na Carteira</h1>
        </div>
    </header>
);

const AmountSuggestion: React.FC<{ amount: number; onClick: (amount: number) => void }> = ({ amount, onClick }) => (
    <button onClick={() => onClick(amount)} className="bg-gray-100 text-purple-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
        R$ {amount.toFixed(2).replace('.', ',')}
    </button>
);

// FIX: Add profile to props to use real user data
interface AddAmountScreenProps {
    onBack: () => void;
    onProceed: (amount: number) => void;
    profile: Profile | null;
}

const AddAmountScreen: React.FC<AddAmountScreenProps> = ({ onBack, onProceed, profile }) => {
    const [amount, setAmount] = useState('');

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Permite apenas números e uma vírgula
        value = value.replace(/[^0-9,]/g, '');
        // Garante apenas uma vírgula
        const commaCount = (value.match(/,/g) || []).length;
        if (commaCount > 1) {
            value = value.substring(0, value.lastIndexOf(','));
        }
        // Limita a duas casas decimais
        if (value.includes(',')) {
            const parts = value.split(',');
            if (parts[1] && parts[1].length > 2) {
                parts[1] = parts[1].substring(0, 2);
                value = parts.join(',');
            }
        }
        setAmount(value);
    };

    const handleSuggestionClick = (value: number) => {
        setAmount(value.toFixed(2).replace('.', ','));
    };
    
    const handleContinue = () => {
        const numericValue = parseFloat(amount.replace(',', '.'));
        if (!isNaN(numericValue) && numericValue > 0) {
            onProceed(numericValue);
        } else {
            alert('Por favor, insira um valor válido.');
        }
    };

    const numericAmount = parseFloat(amount.replace(',', '.')) || 0;

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Saldo atual</span>
                        <span className="font-bold text-gray-900 text-lg">
                            R$ {(profile?.balance ?? 0).toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm text-center space-y-4">
                    <label htmlFor="amount-input" className="block text-sm font-medium text-gray-600">Qual valor você quer adicionar?</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-400">R$</span>
                        <input
                            id="amount-input"
                            type="text"
                            inputMode="decimal"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="0,00"
                            className="w-full bg-transparent border-none text-center text-5xl font-bold text-gray-800 focus:ring-0 pl-12"
                        />
                    </div>
                     <div className="flex justify-center flex-wrap gap-2 pt-2">
                        <AmountSuggestion amount={20} onClick={handleSuggestionClick} />
                        <AmountSuggestion amount={50} onClick={handleSuggestionClick} />
                        <AmountSuggestion amount={100} onClick={handleSuggestionClick} />
                        <AmountSuggestion amount={200} onClick={handleSuggestionClick} />
                    </div>
                </div>

                <button 
                    onClick={handleContinue}
                    disabled={numericAmount <= 0}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Continuar
                </button>
            </main>
        </div>
    );
};

export default AddAmountScreen;
