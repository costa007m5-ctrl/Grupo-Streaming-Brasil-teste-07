import React, { useState } from 'react';
import { ArrowLeftIcon, InformationCircleIcon } from '../ui/Icons';
import { supabase } from '../../lib/supabaseClient';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Verificar Celular</h1>
        </div>
    </header>
);

interface EnterPhoneNumberScreenProps {
    onBack: () => void;
    onCodeSent: (phoneNumber: string) => void;
}

const EnterPhoneNumberScreen: React.FC<EnterPhoneNumberScreenProps> = ({ onBack, onCodeSent }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatPhoneNumber = (num: string) => {
      let digits = num.replace(/\D/g, '');
      // If it starts with 55 and has the length of a full BR number (12 or 13 digits), assume it includes country code
      if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
         return `+${digits}`;
      }
      // Otherwise, assume it's a local number (DDD + number)
      return `+55${digits}`;
    };

    const handleSendCode = async () => {
        setError(null);
        setIsLoading(true);

        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        
        if (formattedPhoneNumber.length < 13) {
            setError("Número de telefone inválido. Inclua o DDD e o número completo.");
            setIsLoading(false);
            return;
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                phone: formattedPhoneNumber,
            });

            if (updateError) {
                throw updateError;
            }
            
            onCodeSent(formattedPhoneNumber);
        } catch (error: any) {
            console.error("Erro ao enviar SMS:", error);
            setError(error.message || "Ocorreu um erro inesperado ao enviar o código. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-900 p-4 rounded-xl flex items-start space-x-3">
                        <InformationCircleIcon className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold">Erro ao Enviar Código</h3>
                            <p className="text-sm opacity-90">{error}</p>
                        </div>
                    </div>
                )}
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <h3 className="font-bold text-lg text-gray-800 text-center">Qual é o seu número de celular?</h3>
                    <p className="text-sm text-gray-600 text-center">
                        Enviaremos um código via SMS para confirmar seu número.
                    </p>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Celular com DDD</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">+55</span>
                            <input
                                type="tel"
                                id="phone"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="(11) 99999-9999"
                                className="w-full bg-gray-100 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-12"
                            />
                        </div>
                    </div>
                </div>

                 <div className="bg-blue-50 text-blue-900 p-4 rounded-xl flex items-start space-x-3">
                    <InformationCircleIcon className="w-10 h-10 text-blue-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold">Não está recebendo o SMS?</h3>
                        <p className="text-sm opacity-90 mt-1">
                            Para que o envio de SMS funcione, você <strong>precisa</strong> configurar um provedor de telefonia (como Twilio) nas configurações de autenticação do seu projeto Supabase.
                        </p>
                        <p className="text-sm opacity-90 mt-2">
                            Vá em <strong>Authentication</strong> {'>'} <strong>Providers</strong> {'>'} <strong>Phone</strong> e adicione suas credenciais.
                        </p>
                        <p className="text-sm opacity-90 mt-2">
                            <strong>Causa Comum:</strong> Se você está usando uma conta de teste (trial) do Twilio, ela <strong>só pode enviar SMS para números que você verificou na sua conta Twilio</strong>. Este é o motivo mais comum para o SMS funcionar para um número (o seu) mas não para outros. Para resolver, faça upgrade da sua conta Twilio ou adicione outros números de teste na sua lista de "Verified Caller IDs".
                        </p>
                    </div>
                </div>

                <button 
                    onClick={handleSendCode}
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        'Enviar Código'
                    )}
                </button>
            </main>
        </div>
    );
};

export default EnterPhoneNumberScreen;