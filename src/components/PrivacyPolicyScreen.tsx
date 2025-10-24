import React from 'react';
import { ArrowLeftIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';

interface PrivacyPolicyScreenProps {
    onBack: () => void;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onBack }) => {
    const { theme } = useTheme();
    const mainBg = theme === 'dark' ? 'bg-[#10081C]' : 'bg-gray-100';
    const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
    const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const headerBg = theme === 'dark' ? 'bg-[#10081C]/80' : 'bg-white/80';
    
    return (
        <div className={`${mainBg} min-h-screen text-white flex flex-col`}>
            <header className={`sticky top-0 z-20 p-6 ${headerBg} backdrop-blur-sm`}>
                <div className="relative flex items-center justify-center">
                    <button onClick={onBack} className={`absolute left-0 p-2 -ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-white`}>
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className={`text-xl font-bold ${headingColor}`}>Política de Privacidade</h1>
                </div>
            </header>

            <main className={`flex-grow p-6 overflow-y-auto ${textColor} text-sm leading-relaxed space-y-4`}>
                <p className="text-xs text-gray-500">Última atualização: 15 de Julho de 2024.</p>
                <section>
                    <h2 className={`text-lg font-semibold ${headingColor} mb-2`}>1. Coleta de Informações</h2>
                    <p>Coletamos informações que você nos fornece diretamente, como nome, e-mail e dados de pagamento. Também coletamos dados de uso para melhorar nosso serviço.</p>
                </section>
                
                <section>
                    <h2 className={`text-lg font-semibold ${headingColor} mb-2`}>2. Uso das Informações</h2>
                    <p>Utilizamos suas informações para operar e manter o Serviço, processar transações, nos comunicar com você e personalizar sua experiência. Não compartilhamos seus dados pessoais com terceiros para fins de marketing.</p>
                </section>

                <section>
                    <h2 className={`text-lg font-semibold ${headingColor} mb-2`}>3. Segurança dos Dados</h2>
                    <p>Empregamos medidas de segurança para proteger suas informações. As credenciais de serviços de streaming compartilhadas nos grupos são armazenadas de forma segura e acessíveis apenas aos membros do grupo.</p>
                </section>

                <section>
                    <h2 className={`text-lg font-semibold ${headingColor} mb-2`}>4. Seus Direitos</h2>
                    <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Na seção "Dados Pessoais" do seu perfil, você pode solicitar o download de seus dados ou iniciar o processo de exclusão da conta.</p>
                </section>
            </main>
        </div>
    );
};

export default PrivacyPolicyScreen;
