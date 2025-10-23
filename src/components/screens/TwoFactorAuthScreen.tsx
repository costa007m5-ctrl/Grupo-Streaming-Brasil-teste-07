import React, { useState } from 'react';
import { ArrowLeftIcon, ShieldCheckIcon, QrCodeIcon, ChatBubbleLeftIcon } from '../ui/Icons';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Autenticação 2 Fatores</h1>
        </div>
    </header>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ enabled, onChange }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${ enabled ? 'bg-purple-600' : 'bg-gray-300'}`}
    >
        <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${ enabled ? 'translate-x-5' : 'translate-x-0'}`}
        />
    </button>
);

const TwoFactorAuthScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [enabled, setEnabled] = useState(true);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4">
                    <ShieldCheckIcon className="w-8 h-8 text-purple-600 flex-shrink-0" />
                    <div className="flex-grow">
                        <p className="font-semibold text-gray-800">Autenticação em 2 fatores</p>
                        <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                    </div>
                    <ToggleSwitch enabled={enabled} onChange={setEnabled} />
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Métodos de verificação</h3>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                           <QrCodeIcon className="w-6 h-6 text-gray-500"/>
                           <p className="font-medium text-gray-700">App de autenticação</p>
                        </div>
                        <span className="text-sm font-semibold text-green-600">Configurado</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                           <ChatBubbleLeftIcon className="w-6 h-6 text-gray-500"/>
                           <p className="font-medium text-gray-700">Mensagem de texto (SMS)</p>
                        </div>
                         <button className="text-sm font-semibold text-purple-600">Configurar</button>
                    </div>
                </div>

                <p className="text-xs text-gray-500 text-center px-4">A autenticação em dois fatores protege sua conta exigindo um código de verificação sempre que você fizer login em um novo dispositivo.</p>
            </main>
        </div>
    );
};

export default TwoFactorAuthScreen;
