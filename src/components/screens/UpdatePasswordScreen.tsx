import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { EyeIcon, EyeSlashIcon } from '../ui/Icons';
import type { Session } from '@supabase/gotrue-js';

interface UpdatePasswordScreenProps {
    session: Session;
    onPasswordUpdated: () => void;
}

const UpdatePasswordScreen: React.FC<UpdatePasswordScreenProps> = ({ session, onPasswordUpdated }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError("A senha deve ter no mínimo 6 caracteres.");
            return;
        }
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        
        setIsLoading(true);

        const { error: updateError } = await supabase.auth.updateUser({ password });

        if (updateError) {
            setError(updateError.message);
        } else {
            onPasswordUpdated();
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#10081C] text-white flex flex-col p-6 relative">
             <div className="absolute inset-0 bg-gradient-to-b from-[#10081C] via-[#10081C]/90 to-[#10081C] z-10"></div>

             <div className="relative z-20 flex flex-col min-h-full">
                <main className="flex-grow flex flex-col justify-center">
                    <div className="text-left mb-8">
                        <h1 className="text-3xl font-extrabold text-white">Crie uma Nova Senha</h1>
                        <p className="mt-2 text-gray-400">Sua nova senha deve ser diferente da anterior.</p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleUpdatePassword}>
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">Nova Senha</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-300 mb-1">Confirmar Nova Senha</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm-new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                                    {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        
                        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-red-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70">
                            {isLoading ? 'Salvando...' : 'Salvar Nova Senha'}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default UpdatePasswordScreen;
