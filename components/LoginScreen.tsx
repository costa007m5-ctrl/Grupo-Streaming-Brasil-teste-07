import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from './Icons';
import { AVAILABLE_SERVICES_DATA } from '../constants';

interface LoginScreenProps {
    onEmailLogin: (email: string, password: string) => void;
    onPhonePasswordLogin: (phone: string, password: string) => Promise<void>;
    onPhoneOtpRequest: (phone: string) => Promise<any>;
    onPhoneOtpVerify: (phone: string, token: string) => Promise<void>;
    onNavigateToSignUp: () => void;
    onNavigateToForgotPassword: () => void;
    onBack: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onEmailLogin, onPhonePasswordLogin, onPhoneOtpRequest, onPhoneOtpVerify, onNavigateToSignUp, onNavigateToForgotPassword, onBack }) => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const logos = AVAILABLE_SERVICES_DATA.map(s => s.logoUrl).sort(() => 0.5 - Math.random());

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await onEmailLogin(email, password);
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao fazer login.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#10081C] text-white flex flex-col p-6 relative overflow-hidden">
             <div className="absolute inset-0 z-0 grid grid-cols-4 gap-4 opacity-10 blur-sm scale-110">
                {logos.slice(0, 16).map((logo, index) => (
                    <div key={index} className="aspect-square flex items-center justify-center p-2">
                         <img src={logo} alt="" className="w-full h-full object-contain" />
                    </div>
                ))}
             </div>
             <div className="absolute inset-0 bg-gradient-to-b from-[#10081C] via-[#10081C]/90 to-[#10081C] z-10"></div>


             <div className="relative z-20 flex flex-col min-h-full">
                <header className="flex items-center">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-300 hover:text-white">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-grow flex flex-col justify-center">
                    <div className="text-left mb-8">
                        <h1 className="text-3xl font-extrabold text-white">Bem-vindo de volta!</h1>
                        <p className="mt-2 text-gray-400">Faça login para continuar sua jornada de economia.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="seuemail@exemplo.com" 
                                className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                            />
                        </div>
                        <div>
                            <label htmlFor="password-email" className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    id="password-email" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="••••••••" 
                                    className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="text-right">
                            <button type="button" onClick={onNavigateToForgotPassword} className="text-sm font-medium text-purple-400 hover:text-purple-300">
                                Esqueceu a senha?
                            </button>
                        </div>
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-red-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70">
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </main>

                <footer className="space-y-4 mt-8">
                    <p className="text-center text-sm text-gray-400">
                        Não tem uma conta?{' '}
                        <button onClick={onNavigateToSignUp} className="font-semibold text-purple-400 hover:text-purple-300">
                            Crie uma agora
                        </button>
                    </p>
                </footer>
             </div>
        </div>
    );
};

export default LoginScreen;
