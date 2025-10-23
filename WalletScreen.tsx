
import React, { useState, useEffect } from 'react';
import type { WalletTransaction, WalletTransactionLogo } from '../types';
import { supabase } from '../lib/supabaseClient';
import type { Profile } from '../types';
import {
    ArrowLeftIcon,
    EllipsisHorizontalIcon,
    DocumentDuplicateIcon,
    PlusIcon,
    PaperAirplaneIcon,
    ClipboardDocumentListIcon,
    TagIcon,
    BanknotesIcon,
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
} from './Icons';
import type { WalletView } from '../App';
import { useTheme } from '../contexts/ThemeContext';

const WalletHeader: React.FC = () => {
    const { theme } = useTheme();
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    return (
        <header className="flex justify-between items-center">
            <button className="p-2 -ml-2">
                <ArrowLeftIcon className={`w-6 h-6 ${textColor}`} />
            </button>
            <h1 className={`text-xl font-bold ${textColor}`}>Carteira Digital</h1>
            <button className="p-2 -mr-2">
                <EllipsisHorizontalIcon className={`w-6 h-6 ${textColor}`} />
            </button>
        </header>
    );
};
const WalletBalanceCard: React.FC<{ profile: Profile | null }> = ({ profile }) => (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 text-white shadow-lg space-y-4">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm opacity-80">Saldo disponível</p>
                <h2 className="text-4xl font-bold tracking-tight">R$ {(profile?.balance ?? 0).toFixed(2).replace('.', ',')}</h2>
            </div>
            <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center">
                <DocumentDuplicateIcon className="w-7 h-7" />
            </div>
        </div>
    </div>
);

const ActionButton: React.FC<{ icon: React.ComponentType<{className?: string}>, label: string, onClick: () => void }> = ({ icon: Icon, label, onClick }) => {
    const { theme } = useTheme();
    const buttonBg = theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white';
    const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-800';
    
    return (
        <div className="flex flex-col items-center space-y-2">
            <button onClick={onClick} className={`w-16 h-16 ${buttonBg} rounded-2xl flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors`}>
                <Icon className="w-8 h-8 text-purple-600" />
            </button>
            <span className={`text-sm ${textColor} font-medium`}>{label}</span>
        </div>
    );
};

interface WalletQuickActionsProps {
    onNavigate: (view: WalletView) => void;
}

const WalletQuickActions: React.FC<WalletQuickActionsProps> = ({ onNavigate }) => (
    <section className="flex justify-around items-start text-center">
        <ActionButton icon={PlusIcon} label="Adicionar" onClick={() => onNavigate('addAmount')} />
        <ActionButton icon={PaperAirplaneIcon} label="Transferir" onClick={() => onNavigate('transfer')} />
        <ActionButton icon={BanknotesIcon} label="Sacar" onClick={() => onNavigate('withdraw')} />
        <ActionButton icon={ClipboardDocumentListIcon} label="Extrato" onClick={() => onNavigate('statement')} />
    </section>
);

const CashbackPromo: React.FC = () => (
    <section className="bg-green-50 p-4 rounded-2xl flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TagIcon className="w-7 h-7 text-green-600" />
            </div>
            <div>
                <p className="font-bold text-gray-800">Programa Cashback</p>
                <p className="text-sm text-gray-600">Ganhe 20% de volta em cada pagamento</p>
            </div>
        </div>
        <a href="#" className="text-sm font-bold text-green-600">Saiba mais</a>
    </section>
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

const TransactionItem: React.FC<{ transaction: WalletTransaction }> = ({ transaction }) => {
    const { theme } = useTheme();
    const { logo, name, date, status, amount } = transaction;

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
    
    const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden ${isImageLogo ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') : ''}`}>
                    {renderLogo()}
                </div>
                <div>
                    <p className={`font-semibold ${textColor}`}>{name}</p>
                    <p className={`text-sm ${subTextColor}`}>
                        {date} <span className="text-green-600 font-medium ml-1">• {status}</span>
                    </p>
                </div>
            </div>
            <p className={`font-bold text-base ${isPositive ? 'text-green-500' : textColor}`}>
                 {formattedAmount}
            </p>
        </div>
    );
};

const TransactionHistory: React.FC<{onNavigate: (view: WalletView) => void, profile: Profile | null}> = ({onNavigate, profile}) => {
    const { theme } = useTheme();
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
                .order('created_at', { ascending: false })
                .limit(4);

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

    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const cardBg = theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white';
    const divideColor = theme === 'dark' ? 'divide-gray-800' : 'divide-gray-100';


    return (
        <section>
            <div className="flex justify-between items-center mb-2">
                <h3 className={`text-xl font-bold ${textColor}`}>Histórico de transações</h3>
                <button onClick={() => onNavigate('statement')} className="text-sm font-semibold text-purple-500 hover:text-purple-400">
                    Ver todas
                </button>
            </div>
            <div className={`${cardBg} p-2 px-4 rounded-2xl divide-y ${divideColor} shadow-sm`}>
                {loading ? (
                    <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Carregando histórico...</p>
                ) : transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                    ))
                ) : (
                    <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Nenhuma transação encontrada.</p>
                )}
            </div>
        </section>
    );
};


const MonthlySummary: React.FC = () => {
    const { theme } = useTheme();
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    return (
    <section>
        <h3 className={`text-xl font-bold ${textColor} mb-4`}>Resumo do mês</h3>
        <div className="space-y-3">
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 p-4 rounded-2xl">
                    <p className="text-sm text-red-900/80">Gastos</p>
                    <p className="text-2xl font-bold text-red-900">R$ 30,90</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl">
                    <p className="text-sm text-green-900/80">Cashback</p>
                    <p className="text-2xl font-bold text-green-900">R$ 6,18</p>
                </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl">
                <p className="text-sm text-purple-900/80">Economia total</p>
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-purple-900">R$ 156,72</p>
                    <p className="text-xs text-purple-900/80 text-right">Comparado aos<br/>preços individuais</p>
                </div>
            </div>
        </div>
    </section>
    );
};

interface WalletScreenProps {
    onNavigate: (view: WalletView) => void;
    profile: Profile | null;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ onNavigate, profile }) => {
    const { theme } = useTheme();
    const mainBg = theme === 'dark' ? 'bg-[#10081C]' : 'bg-[#F8F9FA]';

    return (
        <div className={mainBg}>
            <div className="p-4 space-y-6">
                <WalletHeader />
                <WalletBalanceCard profile={profile} />
                <WalletQuickActions onNavigate={onNavigate} />
                <CashbackPromo />
                <TransactionHistory onNavigate={onNavigate} profile={profile} />
                <MonthlySummary />
            </div>
        </div>
    );
};

export default WalletScreen;
