import React from 'react';
import { ArrowLeftIcon } from '../ui/Icons';

interface TermsOfUseScreenProps {
    onBack: () => void;
}

const TermsOfUseScreen: React.FC<TermsOfUseScreenProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-[#10081C] text-white flex flex-col">
            <header className="sticky top-0 z-20 p-6 bg-[#10081C]/80 backdrop-blur-sm">
                <div className="relative flex items-center justify-center">
                    <button onClick={onBack} className="absolute left-0 p-2 -ml-2 text-gray-300 hover:text-white">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-white">Termos de Uso</h1>
                </div>
            </header>

            <main className="flex-grow p-6 overflow-y-auto text-gray-300 text-sm leading-relaxed space-y-4">
                <section>
                    <h2 className="text-lg font-semibold text-white mb-2">1. Aceitação dos Termos</h2>
                    <p>Ao criar uma conta e usar a plataforma Grupo Streaming Brasil ("Serviço"), você concorda em cumprir estes Termos de Uso. Se você não concordar com estes termos, não use o Serviço.</p>
                </section>
                
                <section>
                    <h2 className="text-lg font-semibold text-white mb-2">2. Descrição do Serviço</h2>
                    <p>O Serviço é uma plataforma que facilita o compartilhamento de assinaturas de serviços de streaming de terceiros entre usuários. Atuamos como intermediários, gerenciando os pagamentos e o acesso aos grupos.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-white mb-2">3. Responsabilidades do Usuário</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Você é responsável por manter a confidencialidade da sua senha.</li>
                        <li>Você concorda em não compartilhar as credenciais de acesso de um grupo com pessoas de fora dele.</li>
                        <li>Você concorda em se comportar de maneira respeitosa no chat do grupo.</li>
                        <li>Anfitriões são responsáveis por manter a assinatura do serviço de streaming ativa durante todo o período.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-white mb-2">4. Pagamentos e Custódia</h2>
                    <p>Os pagamentos são processados através de nossa plataforma e mantidos em custódia. O valor só é liberado para o anfitrião após o período de confirmação, garantindo que você tenha recebido o acesso. Em caso de problemas comprovados (ex: credenciais inválidas sem resolução), o valor será reembolsado para sua carteira no aplicativo.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-white mb-2">5. Proibições</h2>
                    <p>É estritamente proibido usar o Serviço para atividades ilegais, fraude, spam, ou para compartilhar conteúdo ofensivo. A violação destes termos pode resultar na suspensão ou encerramento da sua conta.</p>
                </section>
                
                <section>
                    <h2 className="text-lg font-semibold text-white mb-2">6. Limitação de Responsabilidade</h2>
                    <p>O Grupo Streaming Brasil não é afiliado a nenhum dos serviços de streaming listados (Netflix, Spotify, etc.). Não nos responsabilizamos pela qualidade ou disponibilidade do conteúdo fornecido por esses serviços de terceiros. Nossa responsabilidade se limita à intermediação do grupo e à gestão dos pagamentos.</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-white mb-2">7. Modificações dos Termos</h2>
                    <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos sobre alterações significativas. O uso contínuo do Serviço após tais alterações constitui sua aceitação dos novos Termos.</p>
                </section>

                <p className="pt-4 text-center text-gray-400">Última atualização: 15 de Julho de 2024.</p>
            </main>

             <footer className="sticky bottom-0 z-20 p-6 bg-gradient-to-t from-[#10081C] to-transparent">
                <button 
                    onClick={onBack}
                    className="w-full bg-white/10 backdrop-blur-sm text-white font-bold py-3 rounded-xl text-lg shadow-sm border border-white/20 hover:bg-white/20 transition-colors"
                >
                    Voltar
                </button>
            </footer>
        </div>
    );
};

export default TermsOfUseScreen;
