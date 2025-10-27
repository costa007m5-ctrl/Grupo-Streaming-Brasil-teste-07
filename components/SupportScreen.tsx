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
} from './Icons';
import { FAQ_DATA } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC<{ onBack: () => void; title?: string }> = ({ onBack, title = "Central de Ajuda" }) => {
    const { theme } = useTheme();
    const headerBg = theme === 'dark' ? 'bg-[#10081C]/90' : 'bg-white/90';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-100';
    return (
        <header className={`sticky top-0 ${headerBg} backdrop-blur-sm z-20 p-4 border-b ${borderColor}`}>
            <div className="relative flex justify-center items-center h-8">
                <button onClick={onBack} className={`absolute left-0 p-2 -ml-2 ${textColor}`}>
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className={`text-xl font-bold ${textColor}`}>{title}</h1>
            </div>
        </header>
    );
};

const AiChatView: React.FC<{
    onBack: () => void;
    onEscalate: (history: { subject: string, message: string }) => void;
}> = ({ onBack, onEscalate }) => {
    const { theme } = useTheme();
    const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
        { sender: 'ai', text: 'Olá! Sou o GSBot, seu assistente virtual. Como posso ajudar você hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEscalate, setShowEscalate] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { sender: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const conversationHistory = [...messages, userMessage]
            .map(m => `${m.sender === 'ai' ? 'GSBot' : 'Usuário'}: ${m.text}`)
            .join('\n');

        const prompt = `
            Contexto de Conhecimento (Use APENAS esta informação):
            \`\`\`json
            ${JSON.stringify(FAQ_DATA)}
            \`\`\`

            Histórico da Conversa:
            ${conversationHistory}

            Nova Mensagem do Usuário: "${input}"

            Por favor, responda à nova mensagem do usuário.
        `;
        
        const systemInstruction = `Você é um assistente de IA amigável chamado GSBot, para o aplicativo "Grupo Streaming Brasil". Sua única fonte de conhecimento é o JSON de Perguntas Frequentes (FAQ) fornecido no contexto. É PROIBIDO usar qualquer conhecimento externo ou inventar informações.
        1. Responda às perguntas do usuário estritamente com base nas informações do JSON.
        2. Se a pergunta não pode ser respondida com o JSON, ou se o usuário expressar frustração, ou pedir explicitamente para falar com um humano, você deve informar que não pode ajudar e que vai transferi-lo para um atendente.
        3. Quando você decidir que precisa transferir para um atendente humano, sua resposta DEVE terminar com a tag especial e exata: [ESCALATE]. Não adicione nenhum texto após esta tag.
        4. Mantenha as respostas concisas e diretas. Seja amigável e profissional.`;

        try {
            const response = await fetch('/api/ai-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestType: 'text',
                    prompt,
                    systemInstruction,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Falha na comunicação com a IA.");
            }

            const data = await response.json();
            let aiText = data.text;

            if (aiText.includes('[ESCALATE]')) {
                setShowEscalate(true);
                aiText = aiText.replace('[ESCALATE]', '').trim();
            }

            setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);

        } catch (error: any) {
            setMessages(prev => [...prev, { sender: 'ai', text: 'Desculpe, estou com problemas para me conectar. Para garantir que você seja ajudado, por favor, clique no botão abaixo para falar com um de nossos atendentes.' }]);
            setShowEscalate(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEscalateClick = () => {
        const subject = messages.length > 1 ? messages[1].text.substring(0, 50) + '...' : 'Ajuda do GSBot';
        const message = messages.map(m => `${m.sender === 'ai' ? 'GSBot' : 'Você'}: ${m.text}`).join('\n\n');
        onEscalate({ subject, message });
    };

    const mainBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';

    return (
        <div className={`fixed inset-0 ${mainBg} flex flex-col z-30`}>
            <Header onBack={onBack} title="Assistente Virtual" />
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && 
                            <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm font-bold text-purple-700 self-start">
                                <LifebuoyIcon className="w-5 h-5"/>
                            </div>
                        }
                        <div className={`p-3 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-purple-600 text-white rounded-br-lg' : `${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white shadow-sm'} rounded-bl-lg`}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm font-bold text-purple-700 self-start animate-pulse">
                            <LifebuoyIcon className="w-5 h-5"/>
                        </div>
                        <div className={`p-3 rounded-2xl rounded-bl-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white shadow-sm'}`}>
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            </div>
                        </div>
                    </div>
                )}
                 {showEscalate && (
                    <div className="flex justify-center">
                        <button onClick={handleEscalateClick} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors">
                            Falar com um atendente
                        </button>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>
            <footer className={`p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-t'}`}>
                <div className="flex items-center space-x-2">
                    <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Digite sua mensagem..." className={`flex-1 border-none rounded-full py-3 px-4 focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                    <button onClick={handleSendMessage} disabled={isLoading} className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0 disabled:bg-gray-400"><PaperAirplaneIcon className="w-6 h-6" /></button>
                </div>
            </footer>
        </div>
    );
};


const UserSupportChatView: React.FC<{ ticket: SupportTicket; onBack: () => void; onSendMessage: (ticketId: number, text: string) => void; }> = ({ ticket, onBack, onSendMessage }) => {
    const { theme } = useTheme();
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
        <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} flex flex-col z-30`}>
            <Header onBack={onBack} title="Atendimento" />
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-b' } p-4`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Assunto: <span className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{ticket.subject}</span></p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Status: <span className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} capitalize`}>{ticket.status}</span></p>
            </div>
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {(ticket.messages || []).map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender_id !== 'admin' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender_id === 'admin' && 
                            <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm font-bold text-purple-700 self-start">
                                <LifebuoyIcon className="w-5 h-5"/>
                            </div>
                        }
                        <div className={`p-3 rounded-2xl max-w-[80%] ${msg.sender_id !== 'admin' ? 'bg-purple-600 text-white rounded-br-lg' : `${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white shadow-sm'} rounded-bl-lg`}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender_id !== 'admin' ? 'text-purple-200' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} text-right`}>{new Date(msg.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>
            {ticket.status !== 'fechado' && (
                 <footer className={`p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-t'}`}>
                    <div className="flex items-center space-x-2">
                        <input value={newMessage} onChange={e => setNewMessage(e.target.value)} type="text" placeholder="Digite sua mensagem..." className={`flex-1 border-none rounded-full py-3 px-4 focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'}`} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                        <button onClick={handleSendMessage} className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0"><PaperAirplaneIcon className="w-6 h-6" /></button>
                    </div>
                </footer>
            )}
        </div>
    );
};

const AccordionItem: React.FC<{ question: string; answer: string; }> = ({ question, answer }) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    return (
        <div className={`border-b ${borderColor} last:border-b-0`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-4"
                aria-expanded={isOpen}
            >
                <h3 className={`font-semibold ${textColor}`}>{question}</h3>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 pt-0">
                    <p className={`text-sm leading-relaxed whitespace-pre-line ${subTextColor}`}>{answer}</p>
                </div>
            )}
        </div>
    );
};

interface SupportScreenProps {
    onBack: () => void;
    onNavigateToCategory: (categoryId: string) => void;
    onNavigateToAll: () => void;
}

const SupportScreen: React.FC<SupportScreenProps> = ({ onBack, onNavigateToCategory, onNavigateToAll }) => {
    const { theme } = useTheme();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'list' | 'form' | 'chat' | 'ai-chat'>('list');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'ajuda' | 'chamados'>('ajuda');

    const mainBg = theme === 'dark' ? 'bg-[#10081C]' : 'bg-gray-100';
    const cardBg = theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    
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
        if (view === 'list' && activeTab === 'chamados') {
            fetchTickets();
        }
    }, [view, activeTab]);

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

    if (view === 'ai-chat') {
        return <AiChatView 
            onBack={() => setView('list')} 
            onEscalate={({ subject: escalatedSubject, message: escalatedMessage }) => {
                setSubject(escalatedSubject);
                setMessage(escalatedMessage);
                setView('form');
            }}
        />
    }
    
    if (view === 'form') {
         return (
            <div className={`fixed inset-0 ${mainBg} z-30 flex flex-col`}>
                <Header onBack={() => setView('list')} title="Abrir Novo Chamado" />
                <main className="p-4 space-y-4 flex-grow">
                    <div className={`${cardBg} p-4 rounded-xl shadow-sm space-y-4`}>
                        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Assunto do problema" className={`w-full rounded-lg p-3 focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 border-gray-200'}`} />
                        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Descreva seu problema em detalhes..." className={`w-full h-40 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 border-gray-200'}`}></textarea>
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
            <Header onBack={onBack} />
            <div className={`sticky top-[65px] ${mainBg} z-10 px-4 pt-2`}>
                <div className={`flex justify-center items-center rounded-lg p-1 ${theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-gray-200'}`}>
                    <button 
                        onClick={() => setActiveTab('ajuda')}
                        className={`py-2 px-1 text-center font-semibold w-full transition-all rounded-md text-sm ${activeTab === 'ajuda' ? `${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-purple-600 shadow-sm'}` : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}`}
                    >
                        Central de Ajuda
                    </button>
                    <button 
                        onClick={() => setActiveTab('chamados')}
                        className={`py-2 px-1 text-center font-semibold w-full transition-all rounded-md text-sm ${activeTab === 'chamados' ? `${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-purple-600 shadow-sm'}` : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}`}
                    >
                        Meus Chamados
                    </button>
                </div>
            </div>
            <main className="p-4 space-y-6">
                {activeTab === 'ajuda' && (
                    <div className="space-y-6">
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input type="text" placeholder="Buscar na Central de Ajuda..." className={`w-full ${theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white'} rounded-full py-3 pl-11 pr-4 shadow-sm ${textColor}`} />
                        </div>
                        
                        <div className="space-y-4">
                            {Object.entries(FAQ_DATA).map(([key, category]) => (
                                <div key={key}>
                                    <h3 className={`text-lg font-bold ${textColor} mb-2 px-2 flex items-center space-x-2`}>
                                        <category.icon className="w-5 h-5 text-purple-500" />
                                        <span>{category.title}</span>
                                    </h3>
                                    <div className={`${cardBg} rounded-xl shadow-sm`}>
                                        {category.questions.slice(0, 2).map((q, index) => (
                                            <AccordionItem key={index} question={q.question} answer={q.answer} />
                                        ))}
                                    </div>
                                    <div className="text-center mt-2">
                                        <button onClick={() => onNavigateToCategory(key)} className={`text-sm font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>Ver mais</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <button onClick={onNavigateToAll} className="w-full bg-transparent border-2 border-purple-500 text-purple-500 font-bold py-3 rounded-xl shadow-sm hover:bg-purple-500 hover:text-white transition-colors">Ver todos os tópicos</button>
                    </div>
                )}
                {activeTab === 'chamados' && (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h2 className={`text-lg font-bold ${textColor}`}>Meus Chamados</h2>
                            <button onClick={() => setView('ai-chat')} className="flex items-center space-x-1 text-sm font-semibold text-purple-600">
                                <PlusIcon className="w-4 h-4" />
                                <span>Novo</span>
                            </button>
                        </div>
                        {isLoading ? (
                            <p className={`text-center ${subTextColor} py-4`}>Carregando...</p>
                        ) : tickets.length > 0 ? (
                            <div className="space-y-3">
                            {tickets.map(ticket => (
                                <button key={ticket.id} onClick={() => handleSelectTicket(ticket)} className={`w-full text-left ${cardBg} p-4 rounded-xl shadow-sm hover:bg-opacity-80 transition-colors`}>
                                    <div className="flex justify-between items-center">
                                        <p className={`font-bold ${textColor} truncate pr-4`}>{ticket.subject}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusBadge(ticket.status)} capitalize`}>{ticket.status}</span>
                                    </div>
                                    <p className={`text-sm ${subTextColor} mt-1`}>Última atualização: {new Date(ticket.updated_at).toLocaleString('pt-BR')}</p>
                                </button>
                            ))}
                            </div>
                        ) : (
                            <div className={`text-center py-10 ${cardBg} rounded-xl shadow-sm`}>
                                <LifebuoyIcon className="w-10 h-10 mx-auto text-gray-300"/>
                                <p className={`mt-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Nenhum chamado aberto</p>
                                <p className={`text-sm ${subTextColor}`}>Clique em "Novo" para falar conosco.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SupportScreen;