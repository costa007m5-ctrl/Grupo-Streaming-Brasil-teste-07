import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Profile, SupportTicket, SupportMessage } from '../../types';
import { 
    ArrowLeftIcon, 
    PaperAirplaneIcon,
    PlusIcon,
    SearchIcon,
    LifebuoyIcon,
    CurrencyDollarIcon,
    ShieldExclamationIcon,
    QuestionMarkCircleIcon,
    XMarkIcon,
} from '../ui/Icons';

const Header: React.FC<{ onBack: () => void; title?: string }> = ({ onBack, title = "Central de Ajuda" }) => (
    <header className="sticky top-0 bg-white/90 backdrop-blur-sm z-20 p-4 border-b border-gray-100">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">{title}</h1>
        </div>
    </header>
);

const UserSupportChatView: React.FC<{ ticket: SupportTicket; onBack: () => void; onSendMessage: (ticketId: number, text: string) => void; }> = ({ ticket, onBack, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket.messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        onSendMessage(ticket.id, newMessage.trim());
        setNewMessage('');
    };

    return (
        <div className="fixed inset-0 bg-gray-100 flex flex-col z-30">
            <Header onBack={onBack} title="Atendimento" />
            <div className="p-4 bg-white border-b">
                <p className="text-sm text-gray-500">Assunto: <span className="font-semibold text-gray-700">{ticket.subject}</span></p>
                <p className="text-sm text-gray-500">Status: <span className="font-semibold text-gray-700 capitalize">{ticket.status}</span></p>
            </div>
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {(ticket.messages || []).map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender_id !== 'admin' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender_id === 'admin' && 
                            <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm font-bold text-purple-700 self-start">
                                <LifebuoyIcon className="w-5 h-5"/>
                            </div>
                        }
                        <div className={`p-3 rounded-2xl max-w-[80%] ${msg.sender_id !== 'admin' ? 'bg-purple-600 text-white rounded-br-lg' : 'bg-white shadow-sm rounded-bl-lg'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender_id !== 'admin' ? 'text-purple-200' : 'text-gray-400'} text-right`}>{new Date(msg.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>
            {ticket.status !== 'fechado' && (
                 <footer className="p-4 bg-white border-t">
                    <div className="flex items-center space-x-2">
                        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} type="text" placeholder="Digite sua mensagem..." className="flex-1 bg-gray-100 border-none rounded-full py-3 px-4 focus:ring-2 focus:ring-purple-500" onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                        <button onClick={handleSendMessage} className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0"><PaperAirplaneIcon className="w-6 h-6" /></button>
                    </div>
                </footer>
            )}
        </div>
    );
};

const FAQ_CATEGORIES = [
    { title: "Pagamentos", icon: CurrencyDollarIcon, question: "Como funciona o pagamento seguro?", answer: "Seu dinheiro fica protegido em nossa plataforma (custódia) e só é liberado para o anfitrião após você confirmar que recebeu o acesso ao serviço. Se houver qualquer problema, garantimos o reembolso." },
    { title: "Problemas com Grupo", icon: ShieldExclamationIcon, question: "O que fazer se as credenciais não funcionarem?", answer: "Primeiro, tente contato com o anfitrião pelo chat do grupo. Se não houver resposta em 24h, abra um chamado de suporte e nossa equipe irá intermediar. Se o problema não for resolvido, seu dinheiro será devolvido." },
    { title: "Dúvidas sobre o App", icon: QuestionMarkCircleIcon, question: "Como criar meu próprio grupo?", answer: "Na tela 'Explorar', clique no botão de '+' no canto inferior direito. Escolha o serviço, defina o número de vagas, o preço e as regras. É simples e rápido!" },
    { title: "Segurança", icon: ShieldExclamationIcon, question: "É seguro compartilhar minha senha?", answer: "Você só compartilha a senha do serviço de streaming (ex: Netflix), e nunca a senha do nosso aplicativo. Recomendamos criar senhas específicas para cada serviço e usar a autenticação de 2 fatores sempre que possível." },
];

const SupportScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'list' | 'form' | 'chat'>('list');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [user, setUser] = useState<any>(null);

    const fetchTickets = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsLoading(false);
            return;
        }
        setUser(user);

        setIsLoading(true);
        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
        
        if (error) {
            console.error("Error fetching tickets:", error);
        } else {
            setTickets(data as SupportTicket[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (view === 'list') {
            fetchTickets();
        }
    }, [view]);

    const handleSubmitTicket = async () => {
        if (!subject.trim() || !message.trim() || !user) return;
        
        const initialMessage: SupportMessage = {
            sender_id: user.id,
            sender_name: 'user', 
            text: message,
            timestamp: new Date().toISOString()
        };

        const { error } = await supabase
            .from('support_tickets')
            .insert({ user_id: user.id, subject, messages: [initialMessage], status: 'aberto' });
        
        if (error) {
            alert("Erro ao criar chamado: " + error.message);
        } else {
            alert("Chamado aberto com sucesso!");
            setSubject('');
            setMessage('');
            setView('list');
        }
    };

    const handleSendMessage = async (ticketId: number, text: string) => {
        if (!user || !selectedTicket) return;
        const newMessage: SupportMessage = {
            sender_id: user.id,
            sender_name: 'user',
            text,
            timestamp: new Date().toISOString()
        };
        const updatedMessages = [...(selectedTicket.messages || []), newMessage];
        const { error } = await supabase.from('support_tickets').update({ messages: updatedMessages, updated_at: new Date().toISOString() }).eq('id', ticketId);

        if (error) {
            alert("Falha ao enviar mensagem: " + error.message);
        } else {
            const updatedTicket = { ...selectedTicket, messages: updatedMessages };
            setSelectedTicket(updatedTicket);
            setTickets(tickets.map(t => t.id === ticketId ? updatedTicket : t));
        }
    };

    const handleSelectTicket = (ticket: SupportTicket) => {
        setSelectedTicket(ticket);
        setView('chat');
    };

    const getStatusBadge = (status: SupportTicket['status']) => {
        switch (status) {
            case 'aberto': return 'bg-yellow-100 text-yellow-800';
            case 'em andamento': return 'bg-blue-100 text-blue-800';
            case 'fechado': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (view === 'chat' && selectedTicket) {
        return <UserSupportChatView ticket={selectedTicket} onBack={() => setView('list')} onSendMessage={handleSendMessage} />;
    }
    
    if (view === 'form') {
         return (
            <div className="fixed inset-0 bg-gray-100 z-30 flex flex-col">
                <Header onBack={() => setView('list')} title="Abrir Novo Chamado" />
                <main className="p-4 space-y-4 flex-grow">
                    <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Assunto do problema" className="w-full bg-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-purple-500" />
                        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Descreva seu problema em detalhes..." className="w-full h-40 bg-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"></textarea>
                    </div>
                </main>
                <footer className="p-4">
                    <button onClick={handleSubmitTicket} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg">Enviar Chamado</button>
                </footer>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 space-y-6">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    <input type="text" placeholder="Buscar na Central de Ajuda..." className="w-full bg-white rounded-full py-3 pl-11 pr-4 shadow-sm" />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Tópicos Populares</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {FAQ_CATEGORIES.map(cat => (
                            <button key={cat.title} onClick={() => alert(`${cat.question}\n\n${cat.answer}`)} className="bg-white p-4 rounded-xl shadow-sm text-center space-y-2 hover:bg-gray-50">
                                <cat.icon className="w-8 h-8 mx-auto text-purple-600"/>
                                <p className="font-semibold text-sm text-gray-700">{cat.title}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-bold text-gray-800">Meus Chamados</h2>
                        <button onClick={() => setView('form')} className="flex items-center space-x-1 text-sm font-semibold text-purple-600">
                             <PlusIcon className="w-4 h-4" />
                            <span>Novo</span>
                        </button>
                    </div>
                    {isLoading ? (
                        <p className="text-center text-gray-500 py-4">Carregando...</p>
                    ) : tickets.length > 0 ? (
                        <div className="space-y-3">
                        {tickets.map(ticket => (
                            <button key={ticket.id} onClick={() => handleSelectTicket(ticket)} className="w-full text-left bg-white p-4 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                                 <div className="flex justify-between items-center">
                                    <p className="font-bold text-gray-800 truncate pr-4">{ticket.subject}</p>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusBadge(ticket.status)} capitalize`}>{ticket.status}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Última atualização: {new Date(ticket.updated_at).toLocaleString('pt-BR')}</p>
                            </button>
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                            <LifebuoyIcon className="w-10 h-10 mx-auto text-gray-300"/>
                            <p className="mt-2 font-semibold text-gray-600">Nenhum chamado aberto</p>
                            <p className="text-sm text-gray-400">Clique em "Novo" para falar conosco.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SupportScreen;
