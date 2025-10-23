import React from 'react';
import type { Group } from '../../types';
import { XMarkIcon, ShieldIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    group: Group;
}

const InfoRow: React.FC<{ label: string, value: string }> = ({ label, value }) => {
    const { theme } = useTheme();
    return (
        <div className={`flex justify-between items-center p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100/70'}`}>
            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{label}</span>
            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</span>
        </div>
    );
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, group }) => {
    const { theme } = useTheme();
    if (!isOpen) {
        return null;
    }

    const formattedPrice = `R$ ${group.price.toFixed(2).replace('.', ',')}`;

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={onClose} aria-hidden="true"></div>

            {/* Modal Panel */}
            <div className={`relative w-full max-w-md rounded-t-2xl p-6 pt-5 shadow-xl transition-transform transform-gpu animate-[slide-up_0.3s_ease-out] ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 id="modal-title" className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Confirmar participação</h2>
                    <button 
                        onClick={onClose} 
                        className={`p-1 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'} transition-colors`}
                        aria-label="Fechar"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-3">
                    <InfoRow label="Serviço" value={group.name} />
                    <InfoRow label="Valor mensal" value={formattedPrice} />
                    <InfoRow label="Primeiro pagamento" value={formattedPrice} />
                </div>

                <div className={`mt-6 p-4 rounded-xl flex items-start space-x-3 ${theme === 'dark' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-50 text-purple-900'}`}>
                    <ShieldIcon className="w-8 h-8 text-purple-500 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold">Pagamento seguro com custódia</h3>
                        <p className="text-sm opacity-80">Seu dinheiro fica protegido até a confirmação do acesso ao serviço.</p>
                    </div>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={onConfirm}
                        className="w-full bg-gradient-to-r from-purple-600 to-red-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:opacity-90 transition-opacity">
                        Prosseguir para pagamento
                    </button>
                </div>
                <style>{`
                    @keyframes slide-up {
                        from { transform: translateY(100%); }
                        to { transform: translateY(0); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ConfirmationModal;