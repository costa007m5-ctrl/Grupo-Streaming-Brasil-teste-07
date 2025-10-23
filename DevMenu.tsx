

import React from 'react';
import { XMarkIcon, CodeBracketIcon, BanknotesIcon } from './Icons';
import type { DevScreen } from '../App';

interface DevMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (screen: DevScreen) => void;
    onAddBalance: () => void;
}

const DevMenuItem: React.FC<{ icon: React.ComponentType<{className?: string}>, label: string, description: string, onClick: () => void }> = ({ icon: Icon, label, description, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center p-4 space-x-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
        <div className="p-3 bg-gray-200 rounded-lg">
            <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <div>
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </button>
);

const DevMenu: React.FC<DevMenuProps> = ({ isOpen, onClose, onNavigate, onAddBalance }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            role="dialog"
            aria-modal="true"
        >
            <div className="absolute inset-0" onClick={onClose} aria-hidden="true"></div>

            <div className="relative w-full max-w-md bg-white rounded-t-2xl p-6 pt-5 shadow-xl transition-transform transform-gpu animate-[slide-up_0.3s_ease-out]">
                 <div className="flex justify-between items-center mb-6">
                    <h2 id="modal-title" className="text-xl font-bold text-gray-900">Menu de Desenvolvimento</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        aria-label="Fechar"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-3">
                    <DevMenuItem 
                        icon={CodeBracketIcon}
                        label="Configuração do Banco (SQL)"
                        description="Copiar scripts SQL para setup inicial ou atualização."
                        onClick={() => onNavigate('sql')}
                    />
                     <DevMenuItem 
                        icon={BanknotesIcon}
                        label="Configurar Pagamentos (API)"
                        description="Configurar APIs do Mercado Pago e Webhooks."
                        onClick={() => onNavigate('payment')}
                    />
                    <DevMenuItem
                        icon={BanknotesIcon}
                        label="Adicionar Saldo (Debug)"
                        description="Adicionar R$ 200,00 ao saldo do usuário atual."
                        onClick={onAddBalance}
                    />
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

export default DevMenu;