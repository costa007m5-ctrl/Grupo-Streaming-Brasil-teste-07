import React, { useState, useEffect } from 'react';
import type { WalletTransaction, WalletTransactionLogo, Profile } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import {
    ArrowLeftIcon,
    BanknotesIcon,
    TagIcon,
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
} from '../ui/Icons';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Extrato</h1>
        </div>
    </header>
);

type StatementFilter = 'all' | 'incoming' | 'outgoing';

const FilterTabs: React.FC<{ activeTab: StatementFilter, setActiveTab: (tab: StatementFilter) => void }> = ({ activeTab, setActiveTab }) => {
    const tabs: { id: StatementFilter, label: string }[] = [
        { id: 'all', label: 'Todos' },
        { id: 'incoming', label: 'Entradas' },
        { id: 'outgoing', label: 'Saídas' },
    ];
    
    return (
        <div className="bg-white px-4 pt-2">
            <div className="flex justify-center items-center bg-gray-100 rounded-lg p-1">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 px-1 text-center font-semibold w-full transition-all rounded-md text-sm ${activeTab === tab.id ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

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

const TransactionItem: React.FC<{ transaction: WalletTransaction; onClick: () => void; }> = ({ transaction, onClick }) => {
    const { logo, name, date, status, amount, type } = transaction;
    const isClickable = type === 'transfer_in' || type === 'transfer_out';

    const renderLogo = () => {
        switch (logo) {
            case 'netflix':
                return <img src="https://img.icons8.com/color/96/netflix.png" alt={name} className="object-contain w-full h-full p-1.5" />;
            case 'spotify':
                return <img src="https://img.icons8.com/color/96/spotify.png" alt={name} className="object-contain w-full h-full p-1.5" />;
            case 'disney':
                return <img src="https://img.icons8.com/fluency/96/disney-plus.png" alt={name} className="object-contain w-full h-full p-1.5" />;
            case 'amazon':
                return <img src="https://img.icons8.com/color/96/amazon-prime-video.png" alt={name} className="object-contain w-full h-full p-1.5" />;
            case 'cashback':
                return <div className="w-full h-full flex items-center justify-center rounded-xl bg-green-100 p-2"><TagIcon className="w-full h-full text-green-600" /></div>;
            case 'pix':
                 return <div className="w-full h-full flex items-center justify-center rounded-xl bg-green-100 p-2"><ArrowDownLeftIcon className="w-full h-full text-green-700" /></div>;
            case 'transfer_in':
                return <div className="w-full h-full flex items-center justify-center rounded-xl bg-green-100 p-2"><ArrowDownLeftIcon className="w-full h-full text-green-700" /></div>;
            case 'transfer_out':
                return <div className="w-full h-full flex items-center justify-center rounded-xl bg-red-100 p-2"><ArrowUpRightIcon className="w-full h-full text-red-600" /></div>;
            case 'withdraw':
                 return <div className="w-full h-full flex items-center justify-center rounded-xl bg-gray-200 p-2"><BanknotesIcon className="w-full h-full text-gray-600" /></div>;
            default:
                return null;
        }
    };
    
    const isImageLogo = ['netflix', 'spotify', 'disney', 'amazon'].includes(logo);

    const isPositive = amount > 0;
    const formattedAmount = `${isPositive ? '+' : ''}R$ ${Math.abs(amount).toFixed(2).replace('.', ',')}`;

    return (
        <button 
            onClick={onClick} 
            disabled={!isClickable} 
            className="w-full text-left flex items-center justify-between p-4 bg-white transition-colors hover:bg-gray-50 disabled:hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
        >
            <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden ${isImageLogo ? 'bg-gray-100' : ''}`}>
                    {renderLogo()}
                </div>
                <div>
                    <p className="font-semibold text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">
                        {date} <span className="text-green-600 font-medium ml-1">• {status}</span>
                    </p>
                </div>
            </div>
            <p className={`font-bold text-base ${isPositive ? 'text-green-600' : 'text-gray-900'}`}>
                 {formattedAmount}
            </p>
        </button>
    );
};

interface StatementScreenProps {
    onBack: () => void;
    profile: Profile | null;
    onViewTransactionDetail: (transaction: any) => void;
}

const StatementScreen: React.FC<StatementScreenProps> = ({ onBack, profile, onViewTransactionDetail }) => {
    const [filter, setFilter] = useState<StatementFilter>('all');
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
                    date: new Date(t.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
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

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'incoming') return t.amount > 0;
        if (filter === 'outgoing') return t.amount < 0;
        return true;
    });

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <FilterTabs activeTab={filter} setActiveTab={setFilter} />
            <main className="pt-2">
                <div className="divide-y divide-gray-100">
                    {loading ? (
                         <p className="text-center py-10 text-gray-500">Carregando transações...</p>
                    ) : filteredTransactions.length > 0 ? (
                        filteredTransactions.map(transaction => (
                            <TransactionItem 
                                key={transaction.id} 
                                transaction={transaction} 
                                onClick={() => onViewTransactionDetail(transaction)} 
                            />
                        ))
                    ) : (
                         <p className="text-center py-10 text-gray-500">Nenhuma transação encontrada.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StatementScreen;