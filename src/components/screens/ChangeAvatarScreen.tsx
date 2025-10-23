import React, { useState, useRef } from 'react';
import type { Profile } from '../../types';
import { ArrowLeftIcon, ArrowUpOnSquareIcon } from '../ui/Icons';
import { supabase } from '../../lib/supabaseClient';

interface ChangeAvatarScreenProps {
    onBack: () => void;
    profile: Profile | null;
    onSave: (newUrl: string) => Promise<void>;
}

type Tab = 'static' | 'animated' | 'generate' | 'upload';
type Selection = { type: 'url', value: string } | { type: 'file', value: File } | { type: 'base64', value: string };

const randomPrompts = [
    'um gato astronauta no estilo cartoon',
    'um logo de raposa feito de neon',
    'um robô amigável com um chapéu de mago',
    'um dragão minimalista em aquarela',
    'um cavaleiro pixel art com armadura brilhante'
];

function base64ToBlob(base64: string, contentType = 'image/png', sliceSize = 512) {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
}

const AvatarGrid: React.FC<{ options: string[]; selection: Selection | null; onSelect: (url: string) => void; }> = ({ options, selection, onSelect }) => (
    <>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {options.map((url, index) => (
                <button key={index} onClick={() => onSelect(url)} className={`rounded-full transition-all duration-200 ${selection?.type === 'url' && selection.value === url ? 'ring-4 ring-purple-500' : 'ring-2 ring-transparent hover:ring-purple-300'}`}>
                    <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover rounded-full" />
                </button>
            ))}
        </div>
        <div className="text-center text-xs text-gray-500 mt-4">
            Avatares temáticos
        </div>
    </>
);

const STATIC_AVATARS = [
    'https://img.icons8.com/color/96/darth-vader.png',
    'https://img.icons8.com/color/96/yoda.png',
    'https://img.icons8.com/color/96/stormtrooper.png',
    'https://img.icons8.com/color/96/harry-potter.png',
    'https://img.icons8.com/color/96/dobby.png',
    'https://img.icons8.com/color/96/iron-man.png',
    'https://img.icons8.com/color/96/captain-america.png',
    'https://img.icons8.com/color/96/spider-man-new.png',
    'https://img.icons8.com/color/96/hulk.png',
    'https://img.icons8.com/color/96/thor.png',
    'https://img.icons8.com/color/96/batman.png',
    'https://img.icons8.com/color/96/wonder-woman.png',
    'https://img.icons8.com/color/96/superman.png',
    'https://img.icons8.com/color/96/walter-white.png',
    'https://img.icons8.com/color/96/jesse-pinkman.png',
    'https://img.icons8.com/color/96/aragorn.png',
    'https://img.icons8.com/color/96/gandalf.png',
    'https://img.icons8.com/color/96/jon-snow.png',
    'https://img.icons8.com/color/96/daenerys-targaryen.png',
    'https://img.icons8.com/color/96/rick-sanchez.png',
    'https://img.icons8.com/color/96/morty-smith.png',
    'https://img.icons8.com/color/96/homer-simpson.png',
    'https://img.icons8.com/color/96/bart-simpson.png',
    'https://img.icons8.com/color/96/lisa-simpson.png',
    'https://img.icons8.com/color/96/jake.png',
    'https://img.icons8.com/color/96/finn.png',
    'https://img.icons8.com/color/96/sonic-the-hedgehog.png',
    'https://img.icons8.com/color/96/super-mario.png',
    'https://img.icons8.com/color/96/saitama.png',
    'https://img.icons8.com/color/96/deadpool.png',
];

const ANIMATED_AVATARS = [
    'https://i.giphy.com/WpS5136wALd3W.gif',
    'https://i.giphy.com/ZyaS1y0lYgT0Q.gif',
    'https://i.giphy.com/l0HlFvvl3i5n3u0ak.gif',
    'https://i.giphy.com/13sL05U54IPE9q.gif',
    'https://i.giphy.com/fUOBCB3f52qA4aefc5.gif',
    'https://i.giphy.com/xT9IgA1rI4wWUTaV3i.gif',
    'https://i.giphy.com/s6EYTqTRqujIY.gif',
    'https://i.giphy.com/10uVmYI5f1i2gU.gif',
    'https://i.giphy.com/oDq2jEKvnuUvrs.gif',
    'https://media1.giphy.com/media/3o7528iru3IAxAYSsw/giphy.gif',
    'https://media3.giphy.com/media/xsF1FSDbjguis/giphy.gif',
    'https://media4.giphy.com/media/4pMX5rJ4PYAEM/giphy.gif',
    'https://media0.giphy.com/media/NUBp5KcV0PJBe/giphy.gif',
    'https://media1.giphy.com/media/8vUEXZA2me7vnuUvrs/giphy.gif',
    'https://i.giphy.com/3o7aTskHEUdgCQAXde.gif',
];


const ChangeAvatarScreen: React.FC<ChangeAvatarScreenProps> = ({ onBack, profile, onSave }) => {
    const [activeTab, setActiveTab] = useState<Tab>('static');
    const [selection, setSelection] = useState<Selection | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null); // base64
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRateLimited, setIsRateLimited] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelection({ type: 'file', value: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelect = (url: string) => {
        setSelection({ type: 'url', value: url });
    };

    const handleGenerateAvatar = async (currentPrompt: string) => {
        if (!currentPrompt || isRateLimited) return;
        setIsGenerating(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const apiResponse = await fetch('/api/ai-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: currentPrompt,
                    requestType: 'image'
                })
            });

            const data = await apiResponse.json();
            
            if (!apiResponse.ok || data.error) {
                const errorMessage = data.error || "A IA não conseguiu gerar a imagem.";
                if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('excedeu sua cota') || errorMessage.toLowerCase().includes('rate limit')) {
                    throw new Error('RATE_LIMIT');
                }
                throw new Error(errorMessage);
            }

            if (data.image) {
                setGeneratedImage(data.image);
                setSelection({ type: 'base64', value: data.image });
            } else {
                 throw new Error("A IA não retornou uma imagem. Tente um prompt diferente.");
            }
        } catch (err: any) {
            if (err.message === 'RATE_LIMIT') {
                setError("Você atingiu o limite de gerações por minuto. Por favor, aguarde um pouco antes de tentar novamente.");
                setIsRateLimited(true);
                setTimeout(() => {
                    setIsRateLimited(false);
                    setError(prevError => 
                        prevError?.includes("limite de gerações") ? null : prevError
                    );
                }, 60000); // Cooldown of 60 seconds
            } else {
                setError(err.message || 'Falha ao gerar imagem. Tente novamente.');
            }
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleGenerateRandom = () => {
        const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
        setPrompt(randomPrompt);
        handleGenerateAvatar(randomPrompt);
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError(null);

        if (!selection) {
            onBack();
            setIsLoading(false);
            return;
        }

        try {
            if (selection.type === 'url') {
                await onSave(selection.value);
            } else if (profile) {
                let fileToUpload: File | Blob;
                let fileExt: string | undefined;

                if (selection.type === 'file') {
                    const file = selection.value;
                    fileToUpload = file;
                    fileExt = file.name.split('.').pop();
                } else { // 'base64'
                    fileToUpload = base64ToBlob(selection.value, 'image/png');
                    fileExt = 'png';
                }
                
                const filePath = `${profile.id}/${Date.now()}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, fileToUpload);
                
                if (uploadError) throw uploadError;
                
                const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
                
                if (!publicUrl) throw new Error("Não foi possível obter a URL pública da imagem.");

                await onSave(publicUrl);
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar a imagem.');
            setIsLoading(false); // Manter na tela para mostrar o erro
        }
    };
    
    const isSaveDisabled = !selection || isLoading || isGenerating;

    const tabs: { id: Tab, label: string }[] = [
        { id: 'static', label: 'Estáticos' },
        { id: 'animated', label: 'Animados' },
        { id: 'generate', label: 'Gerar (IA)' },
        { id: 'upload', label: 'Enviar Foto' },
    ];

    const renderTabContent = () => {
        switch(activeTab) {
            case 'static':
                return <AvatarGrid options={STATIC_AVATARS} selection={selection} onSelect={handleSelect} />;
            case 'animated':
                 return <AvatarGrid options={ANIMATED_AVATARS} selection={selection} onSelect={handleSelect} />;
            case 'upload':
                return (
                    <div className="flex flex-col items-center justify-center h-full py-8">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" className="hidden"/>
                        {previewUrl ? (
                            <div className="text-center">
                                <img src={previewUrl} alt="Prévia" className="w-32 h-32 rounded-full object-cover mb-4 mx-auto ring-4 ring-purple-500"/>
                                <button onClick={() => fileInputRef.current?.click()} className="font-semibold text-purple-600 text-sm">Trocar foto</button>
                            </div>
                        ) : (
                            <button onClick={() => fileInputRef.current?.click()} className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:bg-gray-50">
                                <ArrowUpOnSquareIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                <p className="font-semibold text-gray-700">Clique para enviar</p>
                                <p className="text-xs text-gray-500">PNG, JPG ou GIF (max 5MB)</p>
                            </button>
                        )}
                    </div>
                );
            case 'generate':
                return (
                    <div className="flex flex-col space-y-4 h-full">
                        <div className="flex space-x-2">
                            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ex: um mago com óculos redondos" className="flex-grow bg-gray-100 border-gray-200 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-purple-500" />
                            <button onClick={() => handleGenerateAvatar(prompt)} disabled={isGenerating || !prompt || isRateLimited} className="bg-purple-600 text-white font-semibold px-4 rounded-lg disabled:bg-gray-400">
                                {isRateLimited ? "Aguarde..." : "Gerar"}
                            </button>
                        </div>
                        <button onClick={handleGenerateRandom} disabled={isGenerating || isRateLimited} className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg text-sm disabled:bg-gray-400">
                            {isRateLimited ? "Aguarde..." : "Gerar Aleatório"}
                        </button>
                        <p className="text-center text-xs text-gray-500 -mt-2 px-4">A IA gera imagens estáticas.</p>
                        <div className="flex-grow flex items-center justify-center bg-gray-100 rounded-lg min-h-[180px]">
                            {isGenerating ? (
                                <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                            ) : generatedImage ? (
                                <img src={`data:image/png;base64,${generatedImage}`} alt="Avatar Gerado" className="w-40 h-40 rounded-full object-cover ring-4 ring-purple-500" />
                            ) : (
                                <p className="text-gray-500 text-sm text-center p-4">A imagem gerada por inteligência artificial aparecerá aqui.</p>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
                <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
                    <button onClick={onBack} disabled={isLoading} className="absolute left-0 p-2 -ml-2 disabled:opacity-50">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Alterar Foto de Perfil</h1>
                    <button onClick={handleSave} disabled={isSaveDisabled} className="absolute right-0 p-2 -mr-2 text-purple-600 font-semibold disabled:text-gray-400">
                        Salvar
                    </button>
                </div>
            </header>
            <main className="p-4 pt-2 flex-grow flex flex-col">
                <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                     <div className="flex justify-center items-center bg-gray-100 rounded-lg p-1 text-sm">
                        {tabs.map(tab => (
                             <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-2 px-1 text-center font-semibold w-full rounded-md transition-colors ${activeTab === tab.id ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm flex-grow overflow-y-auto">
                    {renderTabContent()}
                 </div>
                 {error && <p className="text-sm text-red-600 text-center px-4 mt-2">{error}</p>}
                 {isLoading && (
                    <div className="fixed inset-0 bg-white/70 flex flex-col items-center justify-center z-50">
                        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                        <p className="mt-4 font-semibold text-gray-700">Salvando...</p>
                    </div>
                 )}
            </main>
        </div>
    );
};

export default ChangeAvatarScreen;