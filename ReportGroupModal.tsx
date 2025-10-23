import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Group, SupportMessage } from '../types';
import { XMarkIcon, FlagIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';

interface ReportGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: Group;
}

const REPORT_REASONS = [
    'Credenciais incorretas ou inválidas',
    'Anfitrião não responde',
    'Conteúdo impróprio ou ofensivo no chat',
    'Spam ou tentativa de fraude',
    'O grupo não corresponde à descrição',
    'Outro (descreva abaixo)',
];

const ReportGroupModal: React.FC<ReportGroupModalProps> = ({ isOpen, onClose, group }) => {
    const { theme } = useTheme();
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!reason) {
            setError('Por favor, selecione um motivo.');
            return;
        }
        if (reason === 'Outro (descreva abaixo)' && !details.trim()) {
            setError('Por favor, descreva o motivo da sua denúncia.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error("Você precisa estar logado para fazer uma denúncia.");
            }
            
            const subject = `[DENÚNCIA] Grupo: ${group.name} (#${group.id})`;
            const messageText = `Motivo: ${reason}\n\nDetalhes: ${details || 'Nenhum detalhe adicional fornecido.'}\n\n---\nID do Grupo: ${group.id}\nNome do Anfitrião: ${group.host_name}\nID do Anfitrião: ${group.host_id}`;
            
            const initialMessage: SupportMessage = {
                sender_id: user.id,
                sender_name: 'user',
                text: messageText,
                timestamp: new Date().toISOString()
            };

            const { error: insertError } = await supabase
                .from('support_tickets')
                .insert({ 
                    user_id: user.id, 
                    subject, 
                    messages: [initialMessage], 
                    status: 'aberto' 
                });
            
            if (insertError) {
                throw insertError;
            }

            alert("Sua denúncia foi enviada com sucesso. Nossa equipe de moderação irá analisá-la em breve.");
            onClose();

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro ao enviar sua denúncia. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div 
                className={`rounded-2xl p-6 shadow-xl w-full max-w-md relative animate-fade-in-up ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className={`absolute top-4 right-4 p-1 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}
                    aria-label="Fechar"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                
                <div className="flex items-center space-x-3 mb-4">
                    <FlagIcon className="w-6 h-6 text-red-500" />
                    <h2 id="modal-title" className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Denunciar Grupo</h2>
                </div>

                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    Selecione o motivo da sua denúncia para o grupo "{group.name}". Todas as denúncias são confidenciais.
                </p>

                <div className="space-y-2">
                    {REPORT_REASONS.map(r => (
                        <label key={r} className={`flex items-center space-x-3 p-3 rounded-lg has-[:checked]:bg-purple-500/10 has-[:checked]:ring-2 has-[:checked]:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <input 
                                type="radio" 
                                name="report-reason"
                                value={r}
                                checked={reason === r}
                                onChange={() => setReason(r)}
                                className="h-4 w-4 text-purple-600 border-gray-500 focus:ring-purple-500 bg-transparent"
                            />
                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{r}</span>
                        </label>
                    ))}
                </div>

                <textarea 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Forneça mais detalhes aqui (opcional, mas recomendado)..."
                    className={`w-full h-24 rounded-lg p-3 mt-4 text-sm focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'}`}
                />

                {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
                
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className={`font-bold py-2 px-4 rounded-lg ${theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-red-400 flex items-center"
                    >
                         {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                        {isSubmitting ? 'Enviando...' : 'Enviar Denúncia'}
                    </button>
                </div>

                 <style>{`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 0.3s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ReportGroupModal;