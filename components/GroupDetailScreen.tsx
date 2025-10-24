import React, { useState } from 'react';
import type { Group, GroupMember, GroupRule } from '../types';
import { 
    ArrowLeftIcon, 
    HeartIcon, 
    ShareIcon, 
    StarIcon, 
    CheckCircleIcon,
    CheckBadgeIcon,
    UserCircleIcon,
    PlusIcon,
    FlagIcon
} from './Icons';
import ConfirmationModal from './ConfirmationModal';
import ReportGroupModal from './ReportGroupModal';
import { useTheme } from '../contexts/ThemeContext';

const GroupDetailHeader: React.FC<{ onBack: () => void; group: Group; onReport: () => void; }> = ({ onBack, group, onReport }) => {
    const { theme } = useTheme();
    return (
        <header className={`sticky top-0 ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm z-10 p-4 flex items-center justify-between border-b`}>
            <div className="flex items-center space-x-3">
                <button onClick={onBack} className="p-2 -ml-2">
                    <ArrowLeftIcon className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                </button>
                 <div className={`w-12 h-12 rounded-lg flex items-center justify-center p-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <img src={group.logo} alt={`${group.name} logo`} className="w-full h-full object-contain" />
                </div>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{group.name}</h1>
            </div>
            <button onClick={onReport} className={`p-2 -mr-2 ${theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}`}>
                <FlagIcon className="w-6 h-6" />
            </button>
        </header>
    );
};


const GroupInfo: React.FC<{ group: Group }> = ({ group }) => {
    const { theme } = useTheme();
    return (
        <div className={`space-y-4 p-4 rounded-xl shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center">
                <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{group.name}</h1>
                <div className="text-right">
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>R$ {group.price.toFixed(2).replace('.', ',')}<span className={`text-base font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>/mês</span></p>
                </div>
            </div>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>Grupo para dividir a assinatura de {group.name}. Anfitrião: {group.host_name}.</p>
        </div>
    );
};


const GroupHost: React.FC<{ group: Group }> = ({ group }) => {
    const { theme } = useTheme();
    return (
        <div className={`space-y-3 p-4 rounded-xl shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Anfitrião</h2>
            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <img src={group.members_list[0]?.avatarUrl} alt={group.host_name} className="w-12 h-12 rounded-full" />
                        <div>
                            <div className="flex items-center space-x-1">
                                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{group.host_name}</p>
                            </div>
                             <p className="text-xs text-gray-400">Membro desde Março 2023</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MemberItem: React.FC<{ member: GroupMember }> = ({ member }) => {
    const { theme } = useTheme();
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
                {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full" />
                ) : (
                    <UserCircleIcon className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                )}
                <div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{member.name}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{member.role}</p>
                </div>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{member.joinDate}</p>
        </div>
    );
};


const GroupMembers: React.FC<{ group: Group }> = ({ group }) => {
    const { theme } = useTheme();
    const emptySlotsCount = group.max_members - group.members_list.length;
    const emptySlots = Array.from({ length: emptySlotsCount > 0 ? emptySlotsCount : 0 });

    return (
        <div className={`space-y-3 p-4 rounded-xl shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Membros atuais</h2>
                <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{group.members_list.length}/{group.max_members}</span>
            </div>
            <div className="space-y-4">
                {group.members_list.map((member, index) => <MemberItem key={index} member={member} />)}
                {emptySlots.map((_, index) => (
                    <div key={`empty-${index}`} className={`border-2 border-dashed rounded-xl p-3 flex items-center space-x-3 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <PlusIcon className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Vaga disponível</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GroupRules: React.FC<{ rules: GroupRule[] }> = ({ rules }) => {
    const { theme } = useTheme();
    return (
        <div className={`space-y-3 p-4 rounded-xl shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Regras do grupo</h2>
            <div className="space-y-2">
                {rules.map((rule, index) => (
                    <div key={rule.id} className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-6 h-6 mt-0.5 font-bold text-sm flex items-center justify-center rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{index + 1}</div>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{rule.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GroupDetailFooter: React.FC<{ group: Group; onParticipate: () => void; }> = ({ group, onParticipate }) => {
    const { theme } = useTheme();
    return (
        <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] ${theme === 'dark' ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
            <div className="flex justify-between items-center mb-3">
                <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Próximo pagamento</p>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{group.next_payment_date}</p>
                </div>
                <div>
                    <p className={`text-sm text-right ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Valor mensal</p>
                    <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>R$ {group.price.toFixed(2).replace('.', ',')}</p>
                </div>
            </div>
            <button 
                onClick={onParticipate}
                className="w-full bg-gradient-to-r from-purple-600 to-red-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:opacity-90 transition-opacity">
                Participar do Grupo
            </button>
        </div>
    );
};


const GroupDetailScreen: React.FC<{ group: Group; onBack: () => void; onProceedToPayment: () => void; }> = ({ group, onBack, onProceedToPayment }) => {
    const { theme } = useTheme();
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const handleConfirm = () => {
        setIsConfirmationModalOpen(false);
        onProceedToPayment();
    }

    return (
        <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
            <GroupDetailHeader onBack={onBack} group={group} onReport={() => setIsReportModalOpen(true)} />
            <main className="pb-32 p-4 space-y-4">
                <GroupInfo group={group} />
                <GroupHost group={group} />
                <GroupMembers group={group} />
                <GroupRules rules={group.rules} />
            </main>
            <GroupDetailFooter group={group} onParticipate={() => setIsConfirmationModalOpen(true)} />
            {isConfirmationModalOpen && (
                <ConfirmationModal 
                    isOpen={isConfirmationModalOpen}
                    onClose={() => setIsConfirmationModalOpen(false)}
                    group={group}
                    onConfirm={handleConfirm}
                />
            )}
            <ReportGroupModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                group={group}
            />
        </div>
    );
};

export default GroupDetailScreen;