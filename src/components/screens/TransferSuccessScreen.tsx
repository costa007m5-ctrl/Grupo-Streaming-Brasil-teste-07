import React, { useRef, useState } from 'react';
import type { CompletedTransaction } from '../../types';
import { CheckBadgeIcon, ArrowLeftIcon, ShareIcon, ArrowDownTrayIcon } from '../ui/Icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TransferSuccessScreenProps {
    onDone: () => void;
    transaction: CompletedTransaction;
}

const maskCpf = (cpf: string | undefined | null): string => {
    if (!cpf) return '***.***.***-**';
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return '***.***.***-**';
    return `***.${cleanCpf.substring(3, 6)}.***-**`;
};

const TransferSuccessScreen: React.FC<TransferSuccessScreenProps> = ({ onDone, transaction }) => {
    const receiptRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);

    const generateImage = async (): Promise<File | null> => {
        if (!receiptRef.current) return null;
        const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff' });
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!blob) return null;
        return new File([blob], `comprovante-${transaction.id}.png`, { type: 'image/png' });
    };

    const generatePdf = async (): Promise<File | null> => {
        if (!receiptRef.current) return null;
        const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const pdfBlob = pdf.output('blob');
        return new File([pdfBlob], `comprovante-${transaction.id}.pdf`, { type: 'application/pdf' });
    };
    
    const handleDownloadPdf = async () => {
        const file = await generatePdf();
        if (file) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleShare = async (format: 'image' | 'pdf') => {
        if (!navigator.share) {
            alert('A função de compartilhamento não é suportada neste navegador.');
            return;
        }

        setIsSharing(true);
        let file: File | null = null;
        try {
            if (format === 'image') {
                file = await generateImage();
            } else {
                file = await generatePdf();
            }

            if (file) {
                await navigator.share({
                    title: 'Comprovante de Transferência',
                    text: `Comprovante de transferência de R$ ${transaction.amount.toFixed(2)}`,
                    files: [file],
                });
            }
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
        } finally {
            setIsSharing(false);
        }
    };


    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
                <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
                    <button onClick={onDone} className="absolute left-0 p-2 -ml-2">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Transferência Concluída</h1>
                </div>
            </header>
            
            <main className="p-4 pt-2 space-y-4">
                <div className="text-center py-4">
                    <CheckBadgeIcon className="w-16 h-16 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-gray-800 mt-2">Transferência realizada!</h2>
                    <p className="text-gray-600">O valor foi enviado com sucesso.</p>
                </div>

                {/* Receipt Component */}
                <div ref={receiptRef} className="bg-white p-5 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-center font-bold text-lg text-purple-800 border-b-2 border-dashed border-gray-200 pb-3">Comprovante de Transferência</h3>
                    <div className="text-center py-2">
                        <p className="text-sm text-gray-500">Valor transferido</p>
                        <p className="text-4xl font-extrabold text-gray-800">R$ {transaction.amount.toFixed(2).replace('.', ',')}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Realizada em {new Date(transaction.timestamp).toLocaleDateString('pt-BR')} às {new Date(transaction.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>

                    <div className="space-y-3">
                         {/* Sender */}
                         <div>
                            <p className="font-bold text-gray-500 text-sm mb-1">DE</p>
                            <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                                <p className="text-gray-800"><span className="font-semibold text-gray-600">Nome:</span> {transaction.sender.full_name}</p>
                                <p className="text-gray-800"><span className="font-semibold text-gray-600">CPF:</span> {maskCpf(transaction.sender.cpf)}</p>
                                <p className="text-gray-800"><span className="font-semibold text-gray-600">Conta:</span> {transaction.sender.wallet_id}</p>
                            </div>
                        </div>

                        {/* Recipient */}
                        <div>
                            <p className="font-bold text-gray-500 text-sm mb-1">PARA</p>
                            <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                                <p className="text-gray-800"><span className="font-semibold text-gray-600">Nome:</span> {transaction.recipient.full_name}</p>
                                <p className="text-gray-800"><span className="font-semibold text-gray-600">CPF:</span> {maskCpf(transaction.recipient.cpf)}</p>
                                <p className="text-gray-800"><span className="font-semibold text-gray-600">Conta:</span> {transaction.recipient.wallet_id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-gray-200 pt-3 text-center">
                        <p className="text-xs text-gray-400">ID da Transação</p>
                        <p className="text-sm font-mono text-gray-600">{transaction.id}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
                    <button onClick={() => handleShare('image')} disabled={isSharing} className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-800 font-bold py-3 rounded-xl text-base hover:bg-gray-200 transition-colors disabled:opacity-50">
                        <ShareIcon className="w-5 h-5" />
                        <span>Compartilhar Imagem</span>
                    </button>
                    <button onClick={() => handleShare('pdf')} disabled={isSharing} className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-800 font-bold py-3 rounded-xl text-base hover:bg-gray-200 transition-colors disabled:opacity-50">
                        <ShareIcon className="w-5 h-5" />
                        <span>Compartilhar PDF</span>
                    </button>
                     <button onClick={handleDownloadPdf} className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-800 font-bold py-3 rounded-xl text-base hover:bg-gray-200 transition-colors">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        <span>Baixar PDF</span>
                    </button>
                </div>
                
                <button onClick={onDone} className="w-full text-purple-600 font-bold py-3 rounded-xl text-base">
                    Voltar ao Início
                </button>
            </main>
        </div>
    );
};

export default TransferSuccessScreen;