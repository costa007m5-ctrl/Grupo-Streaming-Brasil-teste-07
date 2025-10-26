import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Profile, SupportTicket, SupportMessage } from '../types';
import { 
    ArrowLeftIcon, 
    PaperAirplaneIcon,
    PlusIcon,
    SearchIcon,
    LifebuoyIcon,
    ChevronDownIcon,
    XMarkIcon,
    LightBulbIcon,
    ShieldExclamationIcon,
    CurrencyDollarIcon,
    QuestionMarkCircleIcon,
    WhatsAppIcon,
    TelegramIcon,
    FacebookIcon,
    InstagramIcon
} from './Icons';
import { FAQ_DATA } from '../constants';
import { useTheme } from '../contexts/ThemeContext';


const Header: React.FC<{ onBack: () => void; title?: string }> = ({ onBack, title = "Central de Ajuda" }) => {
    const { theme } = useTheme();
    const headerBg = theme === 'dark' ? 'bg-[#10081C]/90' : 'bg-white/90';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-100';

    return (
        <header className={`sticky top-0 ${headerBg} backdrop-blur-sm z-20 p-4 border-b ${borderColor}`}>
            <div className="relative flex justify-center items-center w-full h-8">
                <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                    <ArrowLeftIcon className={`w-6 h-6 ${textColor}`} />
                </button>
                <h1 className={`text-xl font-bold ${textColor}`}>{title}</h1>
            </div>
        </header>
    );
};


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

const FaqItem: React.FC<{ faq: { id: number; question: string; answer: string }; isExpanded: boolean; onClick: () => void; }> = ({ faq, isExpanded, onClick }) => {
    const { theme } = useTheme();
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const hoverColor = theme === 'dark' ? 'hover:text-purple-400' : 'hover:text-purple-600';
    const answerColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

    return (
        <div className={`${theme === 'dark' ? 'border-b border-gray-700 last:border-b-0' : 'border-b border-gray-100 last:border-b-0'}`}>
            <button onClick={onClick} className="w-full text-left p-4 flex justify-between items-center group">
                <span className={`font-semibold ${textColor} ${hoverColor}`}>{faq.question}</span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'transform rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                <div className={`px-4 pb-4 pt-0 ${answerColor}`}>
                    <p>{faq.answer}</p>
                </div>
            </div>
        </div>
    );
};


const SupportScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { theme } = useTheme();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'list' | 'form' | 'chat'>('list');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [user, setUser] = useState<any>(null);
    const [showAllTopics, setShowAllTopics] = useState(false);
    const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

    const mainBg = theme === 'dark' ? 'bg-[#10081C]' : 'bg-gray-100';
    const cardBg = theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';

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

    const popularTopics = FAQ_DATA.filter(item => item.popular);
    const otherTopics = FAQ_DATA.filter(item => !item.popular);
    const groupedTopics = otherTopics.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {} as Record<string, typeof otherTopics>);

    const handleFaqToggle = (id: number) => {
        setExpandedFaqId(expandedFaqId === id ? null : id);
    };

    const popularTopicCards = [
      { title: "Começando", icon: LightBulbIcon },
      { title: "Problemas com Grupo", icon: ShieldExclamationIcon },
      { title: "Pagamentos", icon: CurrencyDollarIcon },
      { title: "Dúvidas sobre o App", icon: QuestionMarkCircleIcon }
    ];

    if (view === 'chat' && selectedTicket) {
        return <UserSupportChatView ticket={selectedTicket} onBack={() => setView('list')} onSendMessage={handleSendMessage} />;
    }
    
    if (view === 'form') {
         return (
            <div className={`fixed inset-0 ${mainBg} z-30 flex flex-col`}>
                <Header onBack={() => setView('list')} title="Abrir Novo Chamado" />
                <main className="p-4 space-y-4 flex-grow">
                    <div className={`${cardBg} p-4 rounded-xl shadow-sm space-y-4`}>
                        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Assunto do problema" className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3 focus:ring-2 focus:ring-purple-500`} />
                        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Descreva seu problema em detalhes..." className={`w-full h-40 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3 focus:ring-2 focus:ring-purple-500`}></textarea>
                    </div>
                </main>
                <footer className="p-4">
                    <button onClick={handleSubmitTicket} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg">Enviar Chamado</button>
                </footer>
            </div>
        );
    }

    return (
        <div className={`${mainBg} min-h-screen`}>
            <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
            <Header onBack={onBack} />
            <main className="p-4 space-y-6">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    <input type="text" placeholder="Buscar na Central de Ajuda..." className={`w-full ${inputBg} rounded-full py-3 pl-11 pr-4 shadow-sm`} />
                </div>

                <div>
                    <h2 className={`text-lg font-bold ${textColor} mb-2`}>Tópicos Populares</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {popularTopicCards.map(cat => (
                            <button key={cat.title} className={`${cardBg} p-4 rounded-xl shadow-sm text-center space-y-2 hover:bg-gray-50 dark:hover:bg-gray-800`}>
                                <cat.icon className="w-8 h-8 mx-auto text-purple-600"/>
                                <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{cat.title}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className={`text-lg font-bold ${textColor} mb-2`}>Perguntas Frequentes</h2>
                    <div className={`${cardBg} rounded-xl shadow-sm overflow-hidden`}>
                        {popularTopics.map(faq => (
                            <FaqItem 
                                key={faq.id}
                                faq={faq}
                                isExpanded={expandedFaqId === faq.id}
                                onClick={() => handleFaqToggle(faq.id)}
                            />
                        ))}
                    </div>
                </div>

                {showAllTopics ? (
                    <div className="space-y-6 animate-fade-in">
                        {Object.entries(groupedTopics).map(([category, faqs]) => (
                            <div key={category}>
                                <h2 className={`text-lg font-bold ${textColor} mb-2`}>{category}</h2>
                                <div className={`${cardBg} rounded-xl shadow-sm overflow-hidden`}>
                                    {(faqs as typeof otherTopics).map(faq => (
                                        <FaqItem 
                                            key={faq.id}
                                            faq={faq}
                                            isExpanded={expandedFaqId === faq.id}
                                            onClick={() => handleFaqToggle(faq.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                        <button onClick={() => setShowAllTopics(true)} className="font-semibold text-purple-500 hover:underline">
                            Ver todos os tópicos
                        </button>
                    </div>
                )}
                
                <div className="space-y-4">
                    <div className="text-center">
                        <h2 className={`text-lg font-bold ${textColor}`}>Ainda precisa de ajuda?</h2>
                        <p className={subTextColor}>Fale conosco</p>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <a href="#" className={`${cardBg} w-14 h-14 rounded-full flex items-center justify-center shadow-sm`}><WhatsAppIcon className="w-7 h-7 text-green-500"/></a>
                        <a href="#" className={`${cardBg} w-14 h-14 rounded-full flex items-center justify-center shadow-sm`}><TelegramIcon className="w-7 h-7 text-blue-500"/></a>
                        <a href="#" className={`${cardBg} w-14 h-14 rounded-full flex items-center justify-center shadow-sm`}><FacebookIcon className="w-7 h-7 text-blue-600"/></a>
                        <a href="#" className={`${cardBg} w-14 h-14 rounded-full flex items-center justify-center shadow-sm`}><InstagramIcon className="w-7 h-7 text-pink-500"/></a>
                    </div>
                    <button onClick={() => setView('form')} className={`w-full font-semibold py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        Abrir um chamado
                    </button>
                </div>
            </main>
        </div>
    );
};

export default SupportScreen;
