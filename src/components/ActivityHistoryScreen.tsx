import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Profile, WalletTransaction, WalletTransactionLogo } from '../types';
import { ArrowLeftIcon, BanknotesIcon, TagIcon, ArrowDownLeftIcon, ArrowUpRightIcon } from './Icons';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Histórico de Atividades</h1>
        </div>
    </header>
);

const mapTransactionToLogo = (t: any): WalletTransactionLogo => {
    const description = t.description?.toLowerCase() || '';
    switch (t.type) {
        case 'deposit': return 'pix';
        case 'withdrawal': return 'withdraw';
        case 'cashback': return 'cashback';
        case 'transfer_in': return 'transfer_in';
        case 'transfer_out': return 'transfer_out';
        case 'payment':
            if (description.includes('netflix')) return 'netflix';
            if (description.includes('spotify')) return 'spotify';
            if (description.includes('disney')) return 'disney';
            if (description.includes('amazon')) return 'amazon';
            return 'transfer_out';
        default: return 'pix';
    }
};

const ActivityItem: React.FC<{ transaction: WalletTransaction }> = ({ transaction }) => {
    const { logo, name, date, amount } = transaction;

     const renderLogo = () => {
        switch (logo) {
            case 'netflix':
                return <img src="https://img.icons8.com/color/96/netflix.png" alt={name} className="object-contain w-full h-full p-1" />;
            case 'spotify':
                return <img src="https://img.icons8.com/color/96/spotify.png" alt={name} className="object-contain w-full h-full p-1" />;
            case 'disney':
                return <img src="https://img.icons8.com/fluency/96/disney-plus.png" alt={name} className="object-contain w-full h-full p-1" />;
            case 'amazon':
                return <img src="https://img.icons8.com/color/96/amazon-prime-video.png" alt={name} className="object-contain w-full h-full p-1" />;
            case 'cashback':
                return <TagIcon className="w-6 h-6 text-green-600" />;
            case 'pix':
                 return <ArrowDownLeftIcon className="w-6 h-6 text-green-700" />;
            case 'transfer_in':
                return <ArrowDownLeftIcon className="w-6 h-6 text-green-700" />;
            case 'transfer_out':
                return <ArrowUpRightIcon className="w-6 h-6 text-red-600" />;
            case 'withdraw':
                 return <BanknotesIcon className="w-6 h-6 text-gray-600" />;
            default:
                return null;
        }
    };
    
    const isPositive = amount > 0;

    return (
        <div className="flex items-center p-4 space-x-4">
             <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${isPositive ? 'bg-green-100' : 'bg-gray-100'}`}>
                {renderLogo()}
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-gray-800">{name}</p>
                <p className="text-sm text-gray-500">{date}</p>
            </div>
             <p className={`font-bold text-base ${isPositive ? 'text-green-600' : 'text-gray-900'}`}>
                 {`${isPositive ? '+' : '-'}R$ ${Math.abs(amount).toFixed(2).replace('.', ',')}`}
            </p>
        </div>
    );
};

interface ActivityHistoryScreenProps {
    onBack: () => void;
    profile: Profile | null;
}

const ActivityHistoryScreen: React.FC<ActivityHistoryScreenProps> = ({ onBack, profile }) => {
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        if (!profile) {
            setLoading(false);
            return;
        }

        const fetchTransactions = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching transactions:", error);
            } else if (data) {
                const formattedTransactions: WalletTransaction[] = data.map(t => ({
                    id: t.id,
                    name: t.description,
                    date: new Date(t.created_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    status: t.status === 'completed' ? 'Concluído' : 'Pendente',
                    amount: Number(t.amount),
                    logo: mapTransactionToLogo(t),
                    type: t.type,
                    metadata: t.metadata,
                }));
                setTransactions(formattedTransactions);
            }
            setLoading(false);
        };
        fetchTransactions();
    }, [profile]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                    {loading ? (
                         <p className="text-center py-10 text-gray-500">Carregando histórico...</p>
                    ) : transactions.length > 0 ? (
                        transactions.map(tx => <ActivityItem key={tx.id} transaction={tx} />)
                    ) : (
                         <p className="text-center py-10 text-gray-500">Nenhuma atividade registrada.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ActivityHistoryScreen;