import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, InformationCircleIcon } from './Icons';
import { supabase } from '../lib/supabaseClient';

const HEADER_TEXT = "Verificar Celular";

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">{HEADER_TEXT}</h1>
        </div>
    </header>
);

interface PhoneVerificationScreenProps {
    onBack: () => void;
    onVerified: (phoneNumber: string) => void;
    phoneNumber: string;
}

const PhoneVerificationScreen: React.FC<PhoneVerificationScreenProps> = ({ onBack, onVerified, phoneNumber }) => {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const isVerifying = useRef(false);
    const [resendCooldown, setResendCooldown] = useState(30);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/[^0-9]/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };
    
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').trim();
        if (/^[0-9]{6}$/.test(pasteData)) {
            const newOtp = pasteData.split('');
            setOtp(newOtp);
            inputsRef.current[5]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        if (isVerifying.current) return;

        setError(null);
        const code = otp.join('');
        if (code.length !== 6) {
            setError('O código deve ter 6 dígitos.');
            return;
        }

        setIsLoading(true);
        isVerifying.current = true;
        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                phone: phoneNumber,
                token: code,
                type: 'phone_change'
            });

            if (verifyError) {
                throw verifyError;
            }
            
            onVerified(phoneNumber);
        } catch (error: any) {
            console.error("Erro ao verificar código:", error);
            if (error.message.toLowerCase().includes('expired')) {
                 setError('Código expirado. Por favor, solicite um novo.');
            } else if (error.message.toLowerCase().includes('invalid')) {
                 setError('Código de verificação incorreto. Tente novamente.');
            }
            else {
                setError(error.message || 'Ocorreu um erro. Tente novamente mais tarde.');
            }
            setOtp(Array(6).fill(''));
            inputsRef.current[0]?.focus();
        } finally {
            setIsLoading(false);
            isVerifying.current = false;
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0 || isResending) return;

        setIsResending(true);
        setError(null);
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                phone: phoneNumber,
            });
            if (updateError) throw updateError;
            setResendCooldown(30); // Reset cooldown
        } catch (error: any) {
            setError(error.message || "Falha ao reenviar o código.");
        } finally {
            setIsResending(false);
        }
    };
    
    useEffect(() => {
        const code = otp.join('');
        if (code.length === 6 && !isLoading) {
            handleVerify();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp]);


    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4 text-center">
                    <h3 className="font-bold text-lg text-gray-800">Insira o código de 6 dígitos</h3>
                    <p className="text-sm text-gray-600">
                        Enviamos um código de verificação para o número <span className="font-semibold">{phoneNumber}</span>.
                    </p>
                    <div className="flex justify-center space-x-2 pt-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => { inputsRef.current[index] = el; }}
                                type="tel"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className={`w-12 h-14 bg-gray-100 border-2 rounded-lg text-center text-2xl font-bold text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-200'}`}
                            />
                        ))}
                    </div>
                    {error && <p className="text-sm text-red-600 pt-2">{error}</p>}
                     <button 
                        onClick={handleResendCode}
                        disabled={resendCooldown > 0 || isResending}
                        className="text-sm font-semibold text-purple-600 pt-2 disabled:text-gray-400"
                    >
                        {isResending ? 'Reenviando...' : resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Não recebeu? Reenviar código'}
                    </button>
                </div>

                <div className="bg-blue-50 text-blue-900 p-4 rounded-xl flex items-start space-x-3">
                    <InformationCircleIcon className="w-10 h-10 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold">Não recebeu o código SMS?</h3>
                        <p className="text-sm opacity-90 mt-1">
                            Primeiro, verifique se o número <strong>{phoneNumber}</strong> está correto e com bom sinal.
                        </p>
                        <p className="text-sm opacity-90 mt-2">
                            <strong>Lembrete Importante:</strong> A causa mais comum para este problema é a falta de configuração no Supabase ou limitações da sua conta de envio.
                        </p>
                         <ul className="list-disc list-inside text-sm opacity-90 mt-2 space-y-1">
                            <li>Verifique se você configurou um provedor de telefonia (como Twilio) nas configurações de autenticação do seu projeto Supabase.</li>
                            <li>Se estiver usando uma conta de teste (trial) do Twilio, ela <strong>só pode enviar SMS para números verificados</strong> na sua conta Twilio. Esta é uma causa muito comum do problema.</li>
                        </ul>
                    </div>
                </div>

                 <button 
                    onClick={handleVerify}
                    disabled={isLoading || otp.join('').length < 6}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        'Verificar'
                    )}
                </button>
            </main>
        </div>
    );
};

export default PhoneVerificationScreen;