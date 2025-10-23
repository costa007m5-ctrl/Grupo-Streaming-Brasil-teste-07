import React, { useState } from 'react';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from './Icons';
import { AVAILABLE_SERVICES_DATA } from '../constants';

interface SignUpScreenProps {
    onSignUp: (email: string, password: string, name: string) => void;
    onNavigateToLogin: () => void;
    onNavigateToTerms: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onNavigateToLogin, onNavigateToTerms }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const logos = AVAILABLE_SERVICES_DATA.map(s => s.logoUrl).sort(() => 0.5 - Math.random());

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        if (password.length < 6) {
            setError("A senha deve ter no mínimo 6 caracteres.");
            return;
        }
        setIsLoading(true);
        try {
            await onSignUp(email, password, name);
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao criar a conta.");
        } finally {
            setIsLoading(false);
        }
    }


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
                    <button onClick={onNavigateToLogin} className="p-2 -ml-2 text-gray-300 hover:text-white">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-grow flex flex-col justify-center py-8">
                    <div className="text-left mb-8">
                        <h1 className="text-3xl font-extrabold text-white">Crie sua conta</h1>
                        <p className="mt-2 text-gray-400">Comece a economizar hoje mesmo. É rápido e fácil!</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSignUp}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome completo</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu nome completo"
                                className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="email-signup" className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                            <input
                                type="email"
                                id="email-signup"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seuemail@exemplo.com"
                                className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-signup" className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password-signup"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">Confirmar Senha</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                                    {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="h-4 w-4 text-purple-600 border-gray-500 rounded focus:ring-purple-500 bg-white/10 mt-0.5"
                            />
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="text-gray-400">
                                    Eu li e concordo com os{' '}
                                    <button type="button" onClick={onNavigateToTerms} className="font-medium text-purple-400 hover:text-purple-300 underline">
                                        Termos de Uso
                                    </button>.
                                </label>
                            </div>
                        </div>
                         {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        <button 
                            type="submit"
                            disabled={!agreed || isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-red-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70"
                        >
                            {isLoading ? 'Criando conta...' : 'Criar conta'}
                        </button>
                    </form>
                </main>

                <footer className="mt-8">
                    <p className="text-center text-sm text-gray-400">
                        Já tem uma conta?{' '}
                        <button onClick={onNavigateToLogin} className="font-semibold text-purple-400 hover:text-purple-300">
                            Faça login
                        </button>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default SignUpScreen;