import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '../ui/Icons';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Alterar Senha</h1>
        </div>
    </header>
);

const FormInput: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; show: boolean; onToggle: () => void; }> = ({ label, id, value, onChange, placeholder, show, onToggle }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-gray-100 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button type="button" onClick={onToggle} className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                {show ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
        </div>
    </div>
);

const ChangePasswordScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [passwords, setPasswords] = useState({ newPass: '', confirmNew: '' });
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.id]: e.target.value });
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');

        if (passwords.newPass.length < 6) {
            setError("A nova senha deve ter no mínimo 6 caracteres.");
            return;
        }
        if (passwords.newPass !== passwords.confirmNew) {
            setError("As novas senhas não coincidem.");
            return;
        }

        setIsLoading(true);
        const { error: updateError } = await supabase.auth.updateUser({
            password: passwords.newPass
        });

        if (updateError) {
            if (updateError.message.includes('requires recent authentication')) {
                setError("Por segurança, faça login novamente antes de alterar sua senha.");
            } else {
                setError(updateError.message);
            }
        } else {
            setSuccess('Senha alterada com sucesso!');
            setPasswords({ newPass: '', confirmNew: '' });
            setTimeout(onBack, 2000);
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                 <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <FormInput label="Nova Senha" id="newPass" value={passwords.newPass} onChange={handleChange} placeholder="••••••••" show={showNew} onToggle={() => setShowNew(!showNew)} />
                    <FormInput label="Confirmar Nova Senha" id="confirmNew" value={passwords.confirmNew} onChange={handleChange} placeholder="••••••••" show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                 </div>

                 {error && <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg">{error}</p>}
                 {success && <p className="text-sm text-green-600 text-center bg-green-50 p-3 rounded-lg">{success}</p>}

                 <button onClick={handleSave} disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400">
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </main>
        </div>
    );
};

export default ChangePasswordScreen;