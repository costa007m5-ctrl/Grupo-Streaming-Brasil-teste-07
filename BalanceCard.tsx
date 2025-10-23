
import React from 'react';
import { CardIcon } from './Icons';
import type { Profile } from '../types';

interface BalanceCardProps {
    profile: Profile | null;
    onAddMoney: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ profile, onAddMoney }) => {
  const balance = profile ? profile.balance : 0.00;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-700 via-red-500 to-pink-600 text-white shadow-2xl space-y-6 relative overflow-hidden group transition-all duration-300 hover:shadow-purple-500/30">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-30 transform-gpu group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
            <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80 font-medium">Saldo disponível</p>
                  <h2 className="text-4xl font-bold tracking-tight">R$ {balance.toFixed(2).replace('.', ',')}</h2>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <CardIcon className="w-7 h-7" />
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
                <div className="text-center">
                    <p className="text-lg font-bold">3</p>
                    <p className="text-xs opacity-80">Grupos Ativos</p>
                </div>
                 <div className="text-center">
                    <p className="text-lg font-bold">R$ 45,70</p>
                    <p className="text-xs opacity-80">Economia /mês</p>
                </div>
                <button onClick={onAddMoney} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-5 rounded-xl text-sm transition-colors border border-white/30">
                  Adicionar
                </button>
            </div>
        </div>
    </div>
  );
};

export default BalanceCard;
