import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeftIcon, StarIcon } from './Icons';
import type { Group, Profile, Review } from '../types';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Minhas Avaliações</h1>
        </div>
    </header>
);

const StarRating: React.FC<{ rating: number, setRating: (rating: number) => void }> = ({ rating, setRating }) => (
    <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
                <button key={i} onClick={() => setRating(ratingValue)}>
                    <StarIcon className={`w-7 h-7 transition-colors ${ratingValue <= rating ? 'text-yellow-400' : 'text-gray-300'}`} solid />
                </button>
            );
        })}
    </div>
);

interface ReviewFormProps {
    group: Group;
    profile: Profile;
    onSubmit: (groupId: number, rating: number, comment: string) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ group, profile, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Por favor, selecione uma nota de 1 a 5 estrelas.");
            return;
        }
        setError('');
        setIsSubmitting(true);
        await onSubmit(group.id, rating, comment);
        setIsSubmitting(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
            <div className="flex items-center space-x-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-100 overflow-hidden">
                    <img src={group.logo} alt={group.name} className="object-contain w-full h-full p-1.5" />
                </div>
                <div>
                    <p className="font-bold text-gray-800">{group.name}</p>
                    <p className="text-sm text-gray-500">Anfitrião: {group.host_name}</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex justify-center py-2">
                    <StarRating rating={rating} setRating={setRating} />
                </div>
                <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Deixe um comentário sobre sua experiência com o anfitrião..."
                    className="w-full h-24 bg-gray-100 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500"
                />
                {error && <p className="text-xs text-red-500 text-center">{error}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-purple-700 disabled:bg-gray-400">
                    {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
            </form>
        </div>
    );
};

const SubmittedReviewCard: React.FC<{ review: Review & { groupName: string; groupLogo: string } }> = ({ review }) => (
    <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-3">
             <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-100 overflow-hidden">
                <img src={review.groupLogo} alt={review.groupName} className="object-contain w-full h-full p-1.5" />
            </div>
            <div>
                 <p className="font-bold text-gray-800">{review.groupName}</p>
                 <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
        </div>
        <div className="flex items-center space-x-1 my-3">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} solid />
            ))}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
    </div>
);

interface MyReviewsScreenProps {
    onBack: () => void;
    allGroups: Group[];
    profile: Profile | null;
    onSubmitReview: (groupId: number, rating: number, comment: string) => Promise<void>;
}

const MyReviewsScreen: React.FC<MyReviewsScreenProps> = ({ onBack, allGroups, profile, onSubmitReview }) => {
    const [historicalGroupIds, setHistoricalGroupIds] = useState<number[] | null>(null);

    useEffect(() => {
        const fetchHistoricalGroups = async () => {
            if (!profile) return;
            // Fetch all groups the user has ever paid for
            const { data, error } = await supabase
                .from('transactions')
                .select('metadata')
                .eq('user_id', profile.id)
                .eq('type', 'payment');
            
            if (error) {
                console.error("Error fetching transaction history for reviews:", error);
                setHistoricalGroupIds([]);
            } else if (data) {
                // FIX: Added a type guard to ensure that 'id' is a number before it's used, resolving the 'unknown[]' type error.
                const groupIds: number[] = data.map(tx => tx.metadata?.group_id).filter((id): id is number => id != null && typeof id === 'number');
                const uniqueGroupIds = [...new Set(groupIds)];
                setHistoricalGroupIds(uniqueGroupIds);
            }
        };
        fetchHistoricalGroups();
    }, [profile]);
    
    const { groupsToReview, submittedReviews } = useMemo(() => {
        if (!profile || !allGroups || historicalGroupIds === null) {
            return { groupsToReview: [], submittedReviews: [] };
        }
        
        // Filter allGroups to only include those the user has been a member of
        const historicalGroups = allGroups.filter(g => historicalGroupIds.includes(g.id));

        const groupsToReview = historicalGroups.filter(group => 
            group.host_id !== profile.id && 
            !group.reviews?.some(review => review.user_id === profile.id)
        );

        const submittedReviews = historicalGroups.flatMap(group => 
            (group.reviews || [])
            .filter(review => review.user_id === profile.id)
            .map(review => ({ ...review, groupName: group.name, groupLogo: group.logo }))
        );

        return { groupsToReview, submittedReviews };
    }, [allGroups, profile, historicalGroupIds]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header onBack={onBack} />
            <main className="p-4 pt-2 space-y-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2 px-2">Avaliações Pendentes</h2>
                    {historicalGroupIds === null ? (
                        <p className="text-center text-gray-500 py-6">Carregando seus grupos...</p>
                    ) : (
                        <div className="space-y-4">
                            {groupsToReview.length > 0 ? (
                                groupsToReview.map(group => <ReviewForm key={group.id} group={group} profile={profile!} onSubmit={onSubmitReview} />)
                            ) : (
                                <p className="text-center text-gray-500 py-6">Você não tem avaliações pendentes.</p>
                            )}
                        </div>
                    )}
                </div>
                 <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2 px-2">Suas Avaliações Feitas</h2>
                    {historicalGroupIds === null ? (
                        <p className="text-center text-gray-500 py-6">Carregando suas avaliações...</p>
                    ) : (
                        <div className="space-y-4">
                            {submittedReviews.length > 0 ? (
                                submittedReviews.map(review => <SubmittedReviewCard key={review.id} review={review} />)
                            ) : (
                                <p className="text-center text-gray-500 py-6">Você ainda não fez nenhuma avaliação.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyReviewsScreen;
