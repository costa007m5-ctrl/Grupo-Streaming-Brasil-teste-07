import React, { useState, useEffect, useRef } from 'react';
import type { Group, ChatMessage, Profile } from '../../types';
import { ArrowLeftIcon, PaperAirplaneIcon } from '../ui/Icons';

const ChatHeader: React.FC<{ group: Group; onBack: () => void }> = ({ group, onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                <img src={group.logo} alt={group.name} className="object-contain w-full h-full p-1" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">{group.name} - Chat</h1>
        </div>
    </header>
);

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const { text, timestamp, senderName, avatarUrl, isYou } = message;

    if (isYou) {
        return (
            <div className="flex justify-end items-end space-x-2">
                <div className="flex flex-col items-end">
                    <div className="bg-purple-600 text-white p-3 rounded-xl rounded-br-none max-w-xs sm:max-w-md">
                        <p>{text}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{timestamp}</span>
                </div>
                <img src={avatarUrl} alt={senderName} className="w-8 h-8 rounded-full" />
            </div>
        );
    }

    return (
        <div className="flex justify-start items-end space-x-2">
            <img src={avatarUrl} alt={senderName} className="w-8 h-8 rounded-full" />
            <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500 ml-3 mb-0.5">{senderName}</span>
                <div className="bg-white text-gray-800 p-3 rounded-xl rounded-bl-none max-w-xs sm:max-w-md shadow-sm">
                    <p>{text}</p>
                </div>
                 <span className="text-xs text-gray-400 mt-1">{timestamp}</span>
            </div>
        </div>
    );
};

const ChatInput: React.FC<{ value: string; onChange: (v: string) => void; onSend: () => void; }> = ({ value, onChange, onSend }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSend();
    };
    return (
        <footer className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-gray-100 border-none rounded-full py-3 px-5 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                />
                <button type="submit" className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <PaperAirplaneIcon className="w-6 h-6" />
                </button>
            </form>
        </footer>
    );
};

interface GroupChatScreenProps {
    group: Group;
    onBack: () => void;
    profile: Profile | null;
    onSendMessage: (groupId: number, message: ChatMessage) => void;
}

const GroupChatScreen: React.FC<GroupChatScreenProps> = ({ group, onBack, profile, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [group.chat_history]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '' || !profile) return;
        
        const message: ChatMessage = {
            id: Date.now(),
            senderName: profile.full_name,
            avatarUrl: profile.avatar_url,
            text: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            isYou: true,
        };
        
        onSendMessage(group.id, message);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col bg-gray-100" style={{ height: '100vh' }}>
            <ChatHeader group={group} onBack={onBack} />
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {(group.chat_history || []).map(msg => <MessageBubble key={msg.id} message={{...msg, isYou: msg.senderName === profile?.full_name}} />)}
                <div ref={messagesEndRef} />
            </main>
            <ChatInput value={newMessage} onChange={setNewMessage} onSend={handleSendMessage} />
        </div>
    );
};

export default GroupChatScreen;
