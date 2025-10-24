import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeftIcon, ShieldCheckIcon, QrCodeIcon } from './Icons';
import type { Factor } from '@supabase/gotrue-js';

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

const TwoFactorAuthScreen: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [factors, setFactors] = useState<Factor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [enrollData, setEnrollData] = useState<{ qr_code: string; secret: string; factorId: string } | null>(null);
    const [verifyCode, setVerifyCode] = useState('');

    const listFactors = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.mfa.listFactors();
        if (error) {
            setError('Erro ao buscar fatores de autenticação: ' + error.message);
        } else {
            setFactors(data.totp);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        listFactors();
    }, []);

    const handleEnroll = async () => {
        setError('');
        setIsLoading(true);
        const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
        if (error) {
            setError('Erro ao iniciar a habilitação do 2FA: ' + error.message);
        } else if (data) {
            setEnrollData({
                qr_code: data.totp.qr_code,
                secret: data.totp.secret,
                factorId: data.id,
            });
        }
        setIsLoading(false);
    };
    
    const handleVerify = async () => {
        if (!enrollData) return;
        setError('');
        setIsLoading(true);

        const { error } = await supabase.auth.mfa.challengeAndVerify({
            factorId: enrollData.factorId,
            code: verifyCode,
        });

        if (error) {
            setError('Código de verificação incorreto ou expirado. Tente novamente.');
        } else {
            alert('2FA habilitado com sucesso!');
            setEnrollData(null);
            setVerifyCode('');
            listFactors();
        }
        setIsLoading(false);
    };
    
    const handleUnenroll = async (factorId: string) => {
        if (!window.confirm("Você tem certeza que deseja desabilitar a autenticação de dois fatores?")) return;
        
        setError('');
        setIsLoading(true);
        const { error } = await supabase.auth.mfa.unenroll({ factorId });
        if (error) {
            setError('Erro ao desabilitar 2FA: ' + error.message);
        } else {
            alert('2FA desabilitado com sucesso.');
            listFactors();
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="bg-gray-100 min-h-screen">
                <Header onBack={onBack} />
                <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-purple-500"></div></div>
            </div>
        );
    }
    
    if (enrollData) {
        return (
            <div className="bg-gray-100 min-h-screen">
                <Header onBack={() => setEnrollData(null)} />
                <main className="p-4 pt-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-4 text-center">
                        <h2 className="text-lg font-bold text-gray-800">Configure seu App de Autenticação</h2>
                        <p className="text-sm text-gray-600">1. Escaneie o QR Code abaixo com seu aplicativo (Google Authenticator, Authy, etc).</p>
                        <div className="flex justify-center p-2 bg-white rounded-lg border" dangerouslySetInnerHTML={{ __html: enrollData.qr_code }}></div>
                        <p className="text-sm text-gray-600">2. Insira o código de 6 dígitos gerado pelo seu aplicativo.</p>
                         <input 
                            type="text"
                            value={verifyCode}
                            onChange={(e) => setVerifyCode(e.target.value)}
                            placeholder="123456"
                            maxLength={6}
                            className="w-40 mx-auto bg-gray-100 border-gray-200 rounded-lg p-3 text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-purple-500"
                         />
                         {error && <p className="text-sm text-red-500">{error}</p>}
                         <button onClick={handleVerify} disabled={isLoading || verifyCode.length < 6} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 disabled:bg-gray-400">
                            {isLoading ? 'Verificando...' : 'Ativar 2FA'}
                        </button>
                    </div>
                </main>
            </div>
        );
    }


    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                    <div className="flex items-center space-x-4">
                        <ShieldCheckIcon className="w-8 h-8 text-purple-600 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-800">Status da Autenticação 2 Fatores</p>
                            <p className={`text-sm font-bold ${factors.length > 0 ? 'text-green-600' : 'text-red-600'}`}>{factors.length > 0 ? 'Ativada' : 'Desativada'}</p>
                        </div>
                    </div>
                     <p className="text-xs text-gray-500">A autenticação em dois fatores protege sua conta exigindo um código de verificação sempre que você fizer login em um novo dispositivo.</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                    <h3 className="font-bold text-lg text-gray-800">Métodos Configurados</h3>
                    {factors.length > 0 ? (
                        factors.map(factor => (
                             <div key={factor.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                <div className="flex items-center space-x-3">
                                <QrCodeIcon className="w-6 h-6 text-gray-500"/>
                                <p className="font-medium text-gray-700">App de autenticação</p>
                                </div>
                                <button onClick={() => handleUnenroll(factor.id)} className="text-sm font-semibold text-red-600">Remover</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">Nenhum método de 2FA configurado.</p>
                    )}
                </div>
                
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                {factors.length === 0 && (
                    <button onClick={handleEnroll} disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-base shadow-lg hover:bg-purple-700 disabled:bg-gray-400">
                        {isLoading ? 'Carregando...' : 'Habilitar 2FA'}
                    </button>
                )}
            </main>
        </div>
    );
};

export default TwoFactorAuthScreen;