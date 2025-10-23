import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeftIcon } from './Icons';

interface ForgotPasswordScreenProps {
    onBack: () => void;
    onSent: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBack, onSent }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });

        if (resetError) {
            setError(resetError.message);
        } else {
            setSuccess('Link de redefinição enviado! Verifique seu e-mail (incluindo a caixa de spam).');
            setTimeout(() => {
                onSent();
            }, 4000);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#10081C] text-white flex flex-col p-6 relative">
             <div className="absolute inset-0 bg-gradient-to-b from-[#10081C] via-[#10081C]/90 to-[#10081C] z-10"></div>

             <div className="relative z-20 flex flex-col min-h-full">
                <header className="flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-300 hover:text-white">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-grow flex flex-col justify-center">
                    <div className="text-left mb-8">
                        <h1 className="text-3xl font-extrabold text-white">Redefinir Senha</h1>
                        <p className="mt-2 text-gray-400">Insira seu e-mail e enviaremos um link para você criar uma nova senha.</p>
                    </div>
                    
                    {success ? (
                        <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg text-center">
                           <p>{success}</p>
                        </div>
                    ) : (
                         <form className="space-y-6" onSubmit={handlePasswordReset}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="seuemail@exemplo.com" 
                                    required
                                    className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                                />
                            </div>
                            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-red-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70">
                                {isLoading ? 'Enviando...' : 'Enviar Link'}
                            </button>
                        </form>
                    )}
                </main>

                <footer className="mt-8">
                    <p className="text-center text-sm text-gray-400">
                        Lembrou a senha?{' '}
                        <button onClick={onBack} className="font-semibold text-purple-400 hover:text-purple-300">
                            Fazer login
                        </button>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default ForgotPasswordScreen;
