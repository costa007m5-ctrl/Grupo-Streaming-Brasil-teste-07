import React, { useState } from 'react';
import { ArrowLeftIcon, FingerPrintIcon } from '../ui/Icons';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Biometria</h1>
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

const BiometricsScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [enabled, setEnabled] = useState(false);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                 <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4">
                    <FingerPrintIcon className="w-8 h-8 text-purple-600 flex-shrink-0" />
                    <div className="flex-grow">
                        <p className="font-semibold text-gray-800">Login com biometria</p>
                        <p className="text-sm text-gray-500">Acesse sua conta com impressão digital</p>
                    </div>
                    <ToggleSwitch enabled={enabled} onChange={setEnabled} />
                </div>
                 <p className="text-xs text-gray-500 text-center px-4">
                    Ative o login com biometria para acessar sua conta de forma mais rápida e segura, sem precisar digitar sua senha.
                </p>
            </main>
        </div>
    );
};

export default BiometricsScreen;
