import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Profile, Group, SupportTicket, SupportMessage } from '../types';
import { ArrowLeftIcon, UsersIcon, RectangleStackIcon, BanknotesIcon, ChartBarIcon, ChatBubbleLeftEllipsisIcon, PaperAirplaneIcon, ArrowTrendingUpIcon, SparklesIcon, BellIcon, ArrowDownTrayIcon } from './Icons';
import AdvertisingView from './AdvertisingView';

interface Transaction {
    id: number;
    created_at: string;
    user_id: string;
    amount: number;
    type: string;
    description: string;
    // Added for display purposes
    user_full_name?: string;
}

interface AdminScreenProps {
    onBack: () => void;
    onInstallApp: () => void;
    showInstallButton: boolean;
    onTestNotification: () => void;
}

const Header: React.FC<{ onBack: () => void; title: string }> = ({ onBack, title }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-20 p-4 border-b">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">{title}</h1>
        </div>
    </header>
);

type AdminView = 'stats' | 'users' | 'groups' | 'transactions' | 'support' | 'publicidade';

const AdminBottomNav: React.FC<{ activeView: AdminView; setActiveView: (view: AdminView) => void; badgeCount: number }> = ({ activeView, setActiveView, badgeCount }) => {
    const navItems: { id: AdminView; label: string; icon: React.ComponentType<{ className?: string, solid?: boolean }>; }[] = [
        { id: 'stats', label: 'Visão Geral', icon: ChartBarIcon },
        { id: 'users', label: 'Usuários', icon: UsersIcon },
        { id: 'groups', label: 'Grupos', icon: RectangleStackIcon },
        { id: 'transactions', label: 'Transações', icon: BanknotesIcon },
        { id: 'support', label: 'Suporte', icon: ChatBubbleLeftEllipsisIcon },
        { id: 'publicidade', label: 'Publicidade', icon: SparklesIcon },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
           <div className="flex justify-around items-center h-20">
            {navItems.map((item) => {
                const isActive = activeView === item.id;
                const activeClasses = 'text-purple-700';
                const inactiveClasses = 'text-gray-400';
                return (
                    <button key={item.id} onClick={() => setActiveView(item.id)} className="relative flex flex-col items-center justify-center space-y-1 flex-1 transition-colors hover:text-purple-700 h-full focus:outline-none">
                        <item.icon className={`w-7 h-7 ${isActive ? activeClasses : inactiveClasses}`} solid={isActive} />
                        <span className={`text-xs font-semibold ${isActive ? activeClasses : inactiveClasses}`}>{item.label}</span>
                        {item.id === 'support' && badgeCount > 0 && (
                            <span className="absolute top-2 right-1/2 translate-x-4 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">{badgeCount}</span>
                        )}
                    </button>
                );
            })}
          </div>
        </nav>
    );
};

const StatCard: React.FC<{ icon: React.ComponentType<{className?: string}>, label: string, value: string | number, gradient: string }> = ({ icon: Icon, label, value, gradient }) => (
    <div className={`p-4 rounded-2xl shadow-lg text-white ${gradient} flex flex-col justify-between h-full`}>
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
          <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm opacity-80">{label}</p>
        </div>
    </div>
);

const AdminActionCard: React.FC<{ icon: React.ComponentType<{className?: string}>, title: string, description: string, onClick: () => void }> = ({ icon: Icon, title, description, onClick }) => (
    <button onClick={onClick} className="w-full text-left bg-white rounded-xl shadow-sm p-4 flex items-start space-x-4 transition-colors hover:bg-gray-50">
        <div className="p-3 bg-gray-100 rounded-lg">
            <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <div>
            <h3 className="font-bold text-lg text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </button>
);


const StatsView: React.FC<{ 
    stats: any; 
    recentUsers: Profile[]; 
    recentGroups: Group[];
    onInstallApp: () => void;
    showInstallButton: boolean;
    onTestNotification: () => void;
}> = ({ stats, recentUsers, recentGroups, onInstallApp, showInstallButton, onTestNotification }) => (
    <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <StatCard icon={BanknotesIcon} label="Receita (Hoje)" value={`R$ ${stats.dailyVolume.toFixed(2).replace('.',',')}`} gradient="bg-gradient-to-br from-green-500 to-emerald-600" />
            <StatCard icon={UsersIcon} label="Novos Usuários (Hoje)" value={stats.newUsersToday} gradient="bg-gradient-to-br from-blue-500 to-sky-600" />
            <StatCard icon={RectangleStackIcon} label="Grupos Ativos" value={stats.activeGroups} gradient="bg-gradient-to-br from-purple-500 to-indigo-600" />
            <StatCard icon={ChatBubbleLeftEllipsisIcon} label="Tickets Abertos" value={stats.openTickets} gradient="bg-gradient-to-br from-yellow-500 to-amber-600" />
        </div>
        
        <div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Atividade Recente</h3>
            <div className="bg-white rounded-xl shadow-sm p-2 space-y-2">
                {recentUsers.slice(0, 2).map(user => (
                    <div key={user.id} className="flex items-center space-x-3 p-2">
                        <UsersIcon className="w-5 h-5 text-blue-500"/>
                        <p className="text-sm text-gray-600">Novo usuário: <span className="font-semibold text-gray-800">{user.full_name}</span></p>
                    </div>
                ))}
                 {recentGroups.slice(0, 2).map(group => (
                    <div key={group.id} className="flex items-center space-x-3 p-2">
                        <RectangleStackIcon className="w-5 h-5 text-purple-500"/>
                        <p className="text-sm text-gray-600">Novo grupo: <span className="font-semibold text-gray-800">{group.name}</span></p>
                    </div>
                ))}
            </div>
        </div>
        
        <div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Ações Rápidas</h3>
            <div className="space-y-3">
                {showInstallButton && (
                    <AdminActionCard
                        icon={ArrowDownTrayIcon}
                        title="Instalar Aplicativo (PWA)"
                        description="Adicione o app à tela inicial do seu dispositivo para acesso rápido."
                        onClick={onInstallApp}
                    />
                )}
                <AdminActionCard
                    icon={BellIcon}
                    title="Testar Notificação Local"
                    description="Envie uma notificação de teste para este dispositivo."
                    onClick={onTestNotification}
                />
            </div>
        </div>
    </div>
);


const UserCard: React.FC<{user: Profile}> = ({ user }) => (
    <li className="p-4 flex items-center space-x-4">
        <img src={user.avatar_url} alt={user.full_name} className="w-12 h-12 rounded-full"/>
        <div className="flex-grow">
            <p className="font-semibold text-gray-800">{user.full_name}</p>
            <p className="text-sm text-gray-500">{user.wallet_id}</p>
        </div>
        <div className="text-right">
            <p className="font-bold text-gray-800">R$ {user.balance.toFixed(2).replace('.',',')}</p>
            <p className="text-xs text-gray-500">Saldo</p>
        </div>
    </li>
);

const GroupCard: React.FC<{group: Group}> = ({ group }) => (
    <li className="p-4 flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center p-1">
          <img src={group.logo} alt={group.name} className="max-w-full max-h-full object-contain"/>
        </div>
        <div className="flex-grow">
            <p className="font-semibold text-gray-800">{group.name}</p>
            <p className="text-sm text-gray-500">Anfitrião: {group.host_name}</p>
        </div>
        <div className="text-center bg-gray-100 px-3 py-1 rounded-lg">
             <p className="font-bold text-gray-800">{group.members}/{group.max_members}</p>
            <p className="text-xs text-gray-500">Membros</p>
        </div>
    </li>
);

const TransactionItem: React.FC<{tx: Transaction}> = ({ tx }) => {
    const isPositive = tx.amount > 0;
    return (
        <li className="p-4 flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <ArrowTrendingUpIcon className={`w-6 h-6 ${isPositive ? '' : 'rotate-180'}`} />
            </div>
            <div className="flex-grow">
                <p className="font-medium text-gray-800">{tx.description}</p>
                <p className="text-sm text-gray-500">{tx.user_full_name} • {new Date(tx.created_at).toLocaleDateString()}</p>
            </div>
            <p className={`font-bold text-lg ${isPositive ? 'text-green-600' : 'text-gray-800'}`}>
                {isPositive ? '+' : '-'} R$ {Math.abs(tx.amount).toFixed(2).replace('.',',')}
            </p>
        </li>
    );
}

const SupportChatView: React.FC<{ ticket: SupportTicket; onBack: () => void; onUpdateTicket: (ticketId: number, updates: Partial<SupportTicket>) => void; }> = ({ ticket, onBack, onUpdateTicket }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket.messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const message: SupportMessage = {
            sender_id: 'admin',
            sender_name: 'Suporte',
            text: newMessage.trim(),
            timestamp: new Date().toISOString()
        };
        const updatedMessages = [...(ticket.messages || []), message];
        onUpdateTicket(ticket.id, { messages: updatedMessages, updated_at: new Date().toISOString() });
        setNewMessage('');
    };

    return (
        <div className="fixed inset-0 bg-gray-100 flex flex-col z-30">
            <Header onBack={onBack} title="Atendimento" />
            <div className="p-4 bg-white border-b">
                <p className="text-sm text-gray-500">Assunto: <span className="font-semibold text-gray-700">{ticket.subject}</span></p>
                <p className="text-sm text-gray-500">Usuário: <span className="font-semibold text-gray-700">{ticket.user_full_name}</span></p>
                <div className="flex items-center space-x-2 mt-1">
                    <label className="text-sm text-gray-500">Status:</label>
                    <select value={ticket.status} onChange={e => onUpdateTicket(ticket.id, { status: e.target.value as SupportTicket['status'] })} className="bg-gray-100 rounded-md p-1 text-sm font-semibold">
                        <option value="aberto">Aberto</option>
                        <option value="em andamento">Em Andamento</option>
                        <option value="fechado">Fechado</option>
                    </select>
                </div>
            </div>
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {(ticket.messages || []).map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender_id === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender_id !== 'admin' && 
                            <img src={ticket.user_avatar_url} alt="user" className="w-8 h-8 rounded-full self-start"/>
                        }
                        <div className={`p-3 rounded-2xl max-w-[80%] ${msg.sender_id === 'admin' ? 'bg-purple-600 text-white rounded-br-lg' : 'bg-white shadow-sm rounded-bl-lg'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender_id === 'admin' ? 'text-purple-200' : 'text-gray-400'} text-right`}>{new Date(msg.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>
            {ticket.status !== 'fechado' && (
                 <footer className="p-4 bg-white border-t">
                    <div className="flex items-center space-x-2">
                        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} type="text" placeholder="Digite sua resposta..." className="flex-1 bg-gray-100 border-none rounded-full py-3 px-4 focus:ring-2 focus:ring-purple-500" onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                        <button onClick={handleSendMessage} className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0"><PaperAirplaneIcon className="w-6 h-6" /></button>
                    </div>
                </footer>
            )}
        </div>
    );
};

const ListView: React.FC<{ items: any[], CardComponent: React.ComponentType<any>, title: string }> = ({ items, CardComponent, title }) => (
    <div className="p-4 space-y-3">
        <h2 className="font-bold text-lg text-gray-800">{title} ({items.length})</h2>
        <ul className="bg-white rounded-xl shadow-sm divide-y">
            {items.map(item => <CardComponent key={item.id} {...{[title.toLowerCase().slice(0, -1)]: item}} />)}
        </ul>
    </div>
);

const SupportView: React.FC<{ tickets: SupportTicket[], onSelectTicket: (ticket: SupportTicket) => void, onUpdateTicket: (ticketId: number, updates: Partial<SupportTicket>) => void; }> = ({ tickets, onSelectTicket }) => {
    const getStatusBadge = (status: SupportTicket['status']) => {
        switch (status) {
            case 'aberto': return 'bg-yellow-100 text-yellow-800';
            case 'em andamento': return 'bg-blue-100 text-blue-800';
            case 'fechado': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    return (
        <div className="p-4 space-y-3">
            <h2 className="font-bold text-lg text-gray-800">Tickets de Suporte</h2>
            {tickets.map(ticket => (
                 <button key={ticket.id} onClick={() => onSelectTicket(ticket)} className="w-full text-left bg-white p-4 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                        <p className="font-bold text-gray-800 truncate pr-4">{ticket.subject}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusBadge(ticket.status)} capitalize`}>{ticket.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Usuário: <span className="font-medium">{ticket.user_full_name}</span></p>
                    <p className="text-xs text-gray-400 mt-1">Última atualização: {new Date(ticket.updated_at).toLocaleString('pt-BR')}</p>
                </button>
            ))}
        </div>
    );
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onBack, onInstallApp, showInstallButton, onTestNotification }) => {
    const [activeView, setActiveView] = useState<AdminView>('stats');
    const [isLoading, setIsLoading] = useState(true);
    const [allUsers, setAllUsers] = useState<Profile[]>([]);
    const [allGroups, setAllGroups] = useState<Group[]>([]);
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [allTickets, setAllTickets] = useState<SupportTicket[]>([]);
    const [stats, setStats] = useState({ dailyVolume: 0, newUsersToday: 0, activeGroups: 0, openTickets: 0 });
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        const today = new Date().toISOString().split('T')[0];

        try {
            const [usersRes, groupsRes, transactionsRes, ticketsRes] = await Promise.all([
                supabase.from('profiles').select('*').order('created_at', { ascending: false }),
                supabase.from('groups').select('*').order('created_at', { ascending: false }),
                supabase.from('transactions').select('*').order('created_at', { ascending: false }),
                supabase.from('support_tickets').select('*').order('updated_at', { ascending: false }),
            ]);

            if (usersRes.error) throw usersRes.error;
            if (groupsRes.error) throw groupsRes.error;
            if (transactionsRes.error) throw transactionsRes.error;
            if (ticketsRes.error) throw ticketsRes.error;

            const usersData = usersRes.data as Profile[];
            setAllUsers(usersData);
            setAllGroups(groupsRes.data as Group[]);

// FIX: Explicitly type the user map and data arrays to resolve 'unknown' type errors during data transformation.
            const usersMap = new Map(usersData.map(u => [u.id, u.full_name]));
            const transactionsWithName = (transactionsRes.data as Transaction[]).map(tx => ({...tx, user_full_name: usersMap.get(tx.user_id) || 'Usuário Deletado' }));
            setAllTransactions(transactionsWithName);

            const ticketsWithUsers = (ticketsRes.data as SupportTicket[]).map(t => ({...t, user_full_name: usersMap.get(t.user_id) || 'Usuário Deletado', user_avatar_url: usersData.find(u => u.id === t.user_id)?.avatar_url }));
            setAllTickets(ticketsWithUsers);
            
            // Calculate stats
            const dailyVolume = transactionsWithName.filter(tx => tx.created_at.startsWith(today) && tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
            const newUsersToday = usersData.filter(u => u.created_at?.startsWith(today)).length;
            
            setStats({
                dailyVolume,
                newUsersToday,
                activeGroups: groupsRes.data.length,
                openTickets: ticketsWithUsers.filter(t => t.status === 'aberto' || t.status === 'em andamento').length
            });

        } catch (error: any) {
            alert("Erro ao carregar dados do admin: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateTicket = async (ticketId: number, updates: Partial<SupportTicket>) => {
        const { error } = await supabase.from('support_tickets').update(updates).eq('id', ticketId);
        if (error) {
            alert("Erro ao atualizar ticket: " + error.message);
        } else {
            // Optimistic update
            const updatedTicket = { ...allTickets.find(t => t.id === ticketId)!, ...updates };
            setSelectedTicket(updatedTicket);
            setAllTickets(allTickets.map(t => t.id === ticketId ? updatedTicket : t));
        }
    };
    
    const renderCurrentView = () => {
        switch (activeView) {
            case 'stats':
                return <StatsView stats={stats} recentUsers={allUsers} recentGroups={allGroups} onInstallApp={onInstallApp} showInstallButton={showInstallButton} onTestNotification={onTestNotification} />;
            case 'users':
                return <ListView items={allUsers} CardComponent={UserCard} title="Usuários" />;
            case 'groups':
                return <ListView items={allGroups} CardComponent={GroupCard} title="Grupos" />;
            case 'transactions':
                return <ListView items={allTransactions} CardComponent={TransactionItem} title="Transações" />;
            case 'support':
                return <SupportView tickets={allTickets} onSelectTicket={setSelectedTicket} onUpdateTicket={handleUpdateTicket} />;
            case 'publicidade':
                return <AdvertisingView groups={allGroups} />;
            default:
                return <StatsView stats={stats} recentUsers={allUsers} recentGroups={allGroups} onInstallApp={onInstallApp} showInstallButton={showInstallButton} onTestNotification={onTestNotification} />;
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                <p className="mt-4 font-semibold text-gray-700">Carregando painel do mestre...</p>
            </div>
        );
    }
    
    if (selectedTicket) {
        return <SupportChatView ticket={selectedTicket} onBack={() => setSelectedTicket(null)} onUpdateTicket={handleUpdateTicket} />
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} title="Painel do Administrador" />
            <main className="pb-24">
                {renderCurrentView()}
            </main>
            <AdminBottomNav activeView={activeView} setActiveView={setActiveView} badgeCount={stats.openTickets} />
        </div>
    );
};

export default AdminScreen;