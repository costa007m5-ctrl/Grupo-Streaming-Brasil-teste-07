import React, { useState } from 'react';
import { ArrowLeftIcon, ChevronDownIcon } from './Icons';
import { FAQ_DATA } from '../constants';
import { useTheme } from '../contexts/ThemeContext';


const AccordionItem: React.FC<{ question: string; answer: string; }> = ({ question, answer }) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    return (
        <div className={`border-b ${borderColor} last:border-b-0`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-4"
                aria-expanded={isOpen}
            >
                <h3 className={`font-semibold ${textColor}`}>{question}</h3>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 pt-0">
                    <p className={`text-sm leading-relaxed whitespace-pre-line ${subTextColor}`}>{answer}</p>
                </div>
            )}
        </div>
    );
};

const Header: React.FC<{ onBack: () => void; title: string }> = ({ onBack, title }) => {
    const { theme } = useTheme();
    const headerBg = theme === 'dark' ? 'bg-[#10081C]/90' : 'bg-white/90';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-100';

    return (
        <header className={`sticky top-0 ${headerBg} backdrop-blur-sm z-10 p-4 border-b ${borderColor}`}>
            <div className="relative flex justify-center items-center h-8">
                <button onClick={onBack} className={`absolute left-0 p-2 -ml-2 ${textColor}`}>
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className={`text-xl font-bold ${textColor}`}>{title}</h1>
            </div>
        </header>
    );
};

interface FaqScreenProps {
    mode: 'all' | 'category';
    categoryId?: string;
    onBack: () => void;
}

const FaqScreen: React.FC<FaqScreenProps> = ({ mode, categoryId, onBack }) => {
    const { theme } = useTheme();
    const mainBg = theme === 'dark' ? 'bg-[#10081C]' : 'bg-gray-100';
    const cardBg = theme === 'dark' ? 'bg-[#1C1A27]' : 'bg-white';
    const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-800';

    const getTitle = () => {
        if (mode === 'all') return "Todos os Tópicos";
        if (categoryId && FAQ_DATA[categoryId]) {
            return FAQ_DATA[categoryId].title;
        }
        return "Central de Ajuda";
    };

    return (
        <div className={`${mainBg} min-h-screen`}>
            <Header onBack={onBack} title={getTitle()} />
            <main className="p-4 pt-2 space-y-6">
                {mode === 'all' ? (
                    Object.values(FAQ_DATA).map(category => (
                        <div key={category.title}>
                            <h2 className={`text-lg font-bold ${titleColor} mb-2 px-2`}>{category.title}</h2>
                            <div className={`${cardBg} rounded-xl shadow-sm`}>
                                {category.questions.map((q, index) => (
                                    <AccordionItem key={index} question={q.question} answer={q.answer} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : categoryId && FAQ_DATA[categoryId] ? (
                    <div className={`${cardBg} rounded-xl shadow-sm`}>
                        {FAQ_DATA[categoryId].questions.map((q, index) => (
                             <AccordionItem key={index} question={q.question} answer={q.answer} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Categoria não encontrada.</p>
                )}
            </main>
        </div>
    );
};

export default FaqScreen;