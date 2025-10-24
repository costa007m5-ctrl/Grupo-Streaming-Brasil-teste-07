import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, InformationCircleIcon } from './Icons';
import type { Profile } from '../types';
import { supabase } from '../lib/supabaseClient';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Transferir Dinheiro</h1>
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

interface RecentRecipient {
    id: string;
    full_name: string;
    wallet_id: string;
    avatar_url: string;
}

const RecentTransfers: React.FC<{ recipients: RecentRecipient[], onSelect: (walletId: string) => void }> = ({ recipients, onSelect }) => (
    <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Transferir novamente</h3>
        <div className="flex space-x-4 overflow-x-auto pb-2">
            {recipients.map(recipient => (
                <button key={recipient.id} onClick={() => onSelect(recipient.wallet_id)} className="flex flex-col items-center flex-shrink-0 w-20 text-center">
                    <img src={recipient.avatar_url} alt={recipient.full_name} className="w-14 h-14 rounded-full object-cover bg-gray-200 mb-1" />
                    <p className="text-xs font-medium text-gray-700 truncate w-full">{recipient.full_name.split(' ')[0]}</p>
                </button>
            ))}
             {recipients.length === 0 && (
                <p className="text-sm text-gray-500">Suas transferências recentes aparecerão aqui.</p>
            )}
        </div>
    </div>
);


interface TransferScreenProps {
    onBack: () => void;
    onProceed: (amount: number, recipientWalletId: string) => void;
    profile: Profile | null;
    onNavigateToVerification: () => void;
}

const TransferScreen: React.FC<TransferScreenProps> = ({ onBack, onProceed, profile, onNavigateToVerification }) => {
    const [recipientId, setRecipientId] = useState('');
    const [amount, setAmount] = useState('');
    const [recentRecipients, setRecentRecipients] = useState<RecentRecipient[]>([]);

    useEffect(() => {
        const fetchRecentRecipients = async () => {
            if (!profile) return;

            // 1. Get recent transactions with recipient IDs
            const { data: transactions, error: txError } = await supabase
                .from('transactions')
                .select('metadata')
                .eq('user_id', profile.id)
                .eq('type', 'transfer_out')
                .order('created_at', { ascending: false })
                .limit(10); // Fetch a bit more to account for duplicates

            if (txError || !transactions) {
                console.error("Error fetching recent transactions:", txError);
                return;
            }

            // 2. Extract unique recipient IDs
            const recipientIds = transactions
                .map(tx => tx.metadata?.recipient_id)
                .filter(id => id);
            
            const uniqueRecipientIds = [...new Set(recipientIds)].slice(0, 5); // Get top 5 unique

            if (uniqueRecipientIds.length === 0) return;

            // 3. Fetch profiles for these IDs
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('id, full_name, wallet_id, avatar_url')
                .in('id', uniqueRecipientIds);
            
            if (profileError || !profiles) {
                 console.error("Error fetching recipient profiles:", profileError);
                return;
            }

            // 4. Order profiles based on the transaction recency
            const orderedProfiles = uniqueRecipientIds.map(id => profiles.find(p => p.id === id)).filter(Boolean) as RecentRecipient[];
            
            setRecentRecipients(orderedProfiles);
        };

        fetchRecentRecipients();
    }, [profile]);


    const isTransferEnabled = !!(profile?.full_name && profile?.cpf && profile?.birth_date && profile?.cep && profile?.street && profile?.number && profile?.city && profile?.state);

    const handleContinue = () => {
        const numericAmount = parseFloat(amount);
        if (!recipientId || !numericAmount || numericAmount <= 0) {
            alert("Por favor, preencha o ID do destinatário e um valor válido.");
            return;
        }
        if (profile && recipientId === profile.wallet_id) {
            alert("Você não pode transferir para si mesmo.");
            return;
        }
        onProceed(numericAmount, recipientId);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                {!isTransferEnabled && (
                     <div className="bg-yellow-50 text-yellow-900 p-4 rounded-xl flex items-start space-x-3">
                        <InformationCircleIcon className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold">Verificação Pendente</h3>
                            <p className="text-sm opacity-80">Você precisa preencher seus Dados Pessoais e Endereço para poder realizar transferências.</p>
                            <button onClick={onNavigateToVerification} className="font-bold text-sm mt-2 text-yellow-900 border-b-2 border-yellow-900/50">Verificar conta agora</button>
                        </div>
                    </div>
                )}
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                   <RecentTransfers recipients={recentRecipients} onSelect={setRecipientId} />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <FormInput
                        label="ID da conta do destinatário"
                        id="recipientId"
                        value={recipientId}
                        onChange={(e) => setRecipientId(e.target.value)}
                        placeholder="@usuario ou número"
                    />
                    <FormInput
                        label="Valor a transferir"
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0,00"
                        prefix="R$"
                    />
                </div>
                 <button 
                    onClick={handleContinue}
                    disabled={!isTransferEnabled}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Continuar
                </button>
            </main>
        </div>
    );
};

export default TransferScreen;