import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import BottomNav from '../components/BottomNav';
import type { AvailableService, NewGroupDetails, Group, Profile, ChatMessage, GroupMember, CompletedTransaction, MovieInfo, TvShow, Brand } from './types';
import { GroupStatus } from './types';
import { supabase } from '../lib/supabaseClient';
import type { Session } from '@supabase/gotrue-js';
import DevMenu from '../components/DevMenu';
import { messaging, requestPermissionAndToken } from '../lib/firebase';
import { onMessage } from 'firebase/messaging';
import { SoundProvider } from '../contexts/SoundContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import ThemeSelectionModal from '../components/ThemeSelectionModal';
import LoadingScreen from '../components/LoadingScreen';
import Toast from '../components/Toast';
import NotificationPermissionPrompt from '../components/NotificationPermissionPrompt';
import PwaInstallPrompt from '../components/PwaInstallPrompt';


// Lazy load screen components for code splitting
const AllMyGroupsScreen = lazy(() => import('../components/AllMyGroupsScreen'));
const HomeScreen = lazy(() => import('../components/HomeScreen'));
const ProfileScreen = lazy(() => import('../components/ProfileScreen'));
const WalletScreen = lazy(() => import('../components/WalletScreen'));
const ExploreScreen = lazy(() => import('../components/ExploreScreen'));
const GroupDetailScreen = lazy(() => import('../components/GroupDetailScreen'));
const PaymentScreen = lazy(() => import('../components/PaymentScreen'));
const SettingsScreen = lazy(() => import('../components/SettingsScreen'));
const SupportScreen = lazy(() => import('../components/SupportScreen'));
const EditProfileScreen = lazy(() => import('../components/EditProfileScreen'));
const NotificationsScreen = lazy(() => import('../components/NotificationsScreen'));
const SecurityPrivacyScreen = lazy(() => import('../components/SecurityPrivacyScreen'));
const MyReviewsScreen = lazy(() => import('../components/MyReviewsScreen'));
const GroupHistoryScreen = lazy(() => import('../components/GroupHistoryScreen'));
const ChangePasswordScreen = lazy(() => import('../components/ChangePasswordScreen'));
const ConnectedDevicesScreen = lazy(() => import('../components/ConnectedDevicesScreen'));
const TwoFactorAuthScreen = lazy(() => import('../components/TwoFactorAuthScreen'));
const BiometricsScreen = lazy(() => import('../components/BiometricsScreen'));
const ProfilePrivacyScreen = lazy(() => import('../components/ProfilePrivacyScreen'));
const PersonalDataScreen = lazy(() => import('../components/PersonalDataScreen'));
const ActivityHistoryScreen = lazy(() => import('../components/ActivityHistoryScreen'));
const AccountVerificationScreen = lazy(() => import('../components/AccountVerificationScreen'));
const PersonalInfoScreen = lazy(() => import('../components/PersonalInfoScreen'));
const AddressScreen = lazy(() => import('../components/AddressScreen'));
const DocumentUploadScreen = lazy(() => import('../components/DocumentUploadScreen'));
const SelfieScreen = lazy(() => import('../components/SelfieScreen'));
const PhoneVerificationScreen = lazy(() => import('../components/PhoneVerificationScreen'));
const AddMoneyScreen = lazy(() => import('../components/AddMoneyScreen'));
const TransferScreen = lazy(() => import('../components/TransferScreen'));
const TransferConfirmScreen = lazy(() => import('../components/TransferConfirmScreen'));
const StatementScreen = lazy(() => import('../components/StatementScreen'));
const WithdrawScreen = lazy(() => import('../components/WithdrawScreen'));
const AddAmountScreen = lazy(() => import('../components/AddAmountScreen'));
const CreateGroupScreen = lazy(() => import('../components/CreateGroupScreen'));
const ConfigureGroupScreen = lazy(() => import('../components/ConfigureGroupScreen'));
const GroupCredentialsScreen = lazy(() => import('../components/GroupCredentialsScreen'));
const GroupChatScreen = lazy(() => import('../components/GroupChatScreen'));
const MyGroupDetailScreen = lazy(() => import('../components/MyGroupDetailScreen'));
const WelcomeScreen = lazy(() => import('../components/WelcomeScreen'));
const LoginScreen = lazy(() => import('../components/LoginScreen'));
const SignUpScreen = lazy(() => import('../components/SignUpScreen'));
const ForgotPasswordScreen = lazy(() => import('../components/ForgotPasswordScreen'));
const UpdatePasswordScreen = lazy(() => import('../components/UpdatePasswordScreen'));
const SqlSetupScreen = lazy(() => import('../components/SqlSetupScreen'));
const PaymentSetupScreen = lazy(() => import('../components/PaymentSetupScreen'));
const EnterPhoneNumberScreen = lazy(() => import('../components/EnterPhoneNumberScreen'));
const ChangeAvatarScreen = lazy(() => import('../components/ChangeAvatarScreen'));
const TransferSuccessScreen = lazy(() => import('../components/TransferSuccessScreen'));
const StatementDetailScreen = lazy(() => import('../components/StatementDetailScreen'));
const ServiceDetailScreen = lazy(() => import('../components/ServiceDetailScreen'));
const MovieDetailScreen = lazy(() => import('../components/MovieDetailScreen'));
const MoviesScreen = lazy(() => import('../components/MoviesScreen'));
const ProviderDetailScreen = lazy(() => import('../components/ProviderDetailScreen'));
const NetflixIntro = lazy(() => import('../components/NetflixIntro'));
const DisneyPlusIntro = lazy(() => import('../components/DisneyPlusIntro'));
const PrimeVideoIntro = lazy(() => import('../components/PrimeVideoIntro'));
const MaxIntro = lazy(() => import('../components/MaxIntro'));
const SoundSettingsScreen = lazy(() => import('../components/SoundSettingsScreen'));
const NetflixScreen = lazy(() => import('../components/NetflixScreen'));
const NetflixDetailScreen = lazy(() => import('../components/NetflixDetailScreen'));
const DisneyPlusScreen = lazy(() => import('../components/DisneyPlusScreen'));
const DisneyPlusDetailScreen = lazy(() => import('../components/DisneyPlusDetailScreen'));
const PrimeVideoScreen = lazy(() => import('../components/PrimeVideoScreen'));
const PrimeVideoDetailScreen = lazy(() => import('../components/PrimeVideoDetailScreen'));
const MaxScreen = lazy(() => import('../components/MaxScreen'));
const MaxDetailScreen = lazy(() => import('../components/MaxDetailScreen'));
const BrandDetailScreen = lazy(() => import('../components/BrandDetailScreen'));
const AdminScreen = lazy(() => import('../components/AdminScreen'));
const TermsOfUseScreen = lazy(() => import('../components/TermsOfUseScreen'));
const DesignSettingsScreen = lazy(() => import('../components/DesignSettingsScreen'));


interface TMDBMovie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path?: string;
    overview: string;
    release_date: string;
    vote_average: number;
}
type ContentItem = TMDBMovie | TvShow;


export type AppView = 'home' | 'explore' | 'movies' | 'wallet' | 'profile';
export type ProfileView = 
  'main' | 'settings' | 'support' | 'editProfile' | 'notifications' | 
  'security' | 'reviews' | 'history' | 
  'twoFactorAuth' | 'biometrics' | 'changePassword' | 'connectedDevices' | 
  'profilePrivacy' | 'personalData' | 'activityHistory' |
  'accountVerification' | 'personalInfo' | 'address' | 'documentUpload' | 'selfie' | 
  'enterPhoneNumber' | 'phoneVerification' | 'changeAvatar' | 'soundSettings' | 'designSettings';

export type WalletView = 'main' | 'addAmount' | 'addMoney' | 'transfer' | 'transferConfirm' | 'statement' | 'withdraw' | 'transferSuccess' | 'statementDetail';
export type ExploreView = 'main' | 'createGroup' | 'configureGroup' | 'groupCredentials';
export type AuthView = 'welcome' | 'login' | 'signup' | 'forgotPassword' | 'updatePassword' | 'terms';
export type DevScreen = 'sql' | 'payment';
export type ExploreDetailItem = { type: 'service' | 'category' | 'movie'; id: string };

interface ProfileUpdateData {
    name: string;
    phone: string;
    birthDate: string;
}

interface VerificationData {
    phoneNumber: string;
}

const ADMIN_USER_ID = '206cb0fc-ea8b-4823-9aea-bba231edbaf8'; // IMPORTANTE: Substitua pelo seu ID de usuário do Supabase para ter acesso de admin.

const AppContent: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState<AuthView>('welcome');

  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isInPaymentFlow, setIsInPaymentFlow] = useState<boolean>(false);
  const [profileView, setProfileView] = useState<ProfileView>('main');
  const [walletView, setWalletView] = useState<WalletView>('main');
  const [exploreView, setExploreView] = useState<ExploreView>('main');
  const [selectedExploreItem, setSelectedExploreItem] = useState<ExploreDetailItem | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieInfo | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<AvailableService | null>(null);
  const [transferDetails, setTransferDetails] = useState<{ amount: number; recipient: Profile } | null>(null);
  const [completedTransaction, setCompletedTransaction] = useState<CompletedTransaction | null>(null);
  const [addAmount, setAddAmount] = useState<number | null>(null);
  const [newGroupDetails, setNewGroupDetails] = useState<NewGroupDetails | null>(null);
  const [activeChatGroup, setActiveChatGroup] = useState<Group | null>(null);
  const [selectedMyGroup, setSelectedMyGroup] = useState<Group | null>(null);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [verificationSuccessMessage, setVerificationSuccessMessage] = useState<string | null>(null);
  
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [exploreGroups, setExploreGroups] = useState<Group[]>([]);
  const [viewingAllMyGroups, setViewingAllMyGroups] = useState(false);

  // Service clone states
  const [viewingNetflix, setViewingNetflix] = useState(false);
  const [selectedNetflixItem, setSelectedNetflixItem] = useState<ContentItem | null>(null);
  const [viewingDisneyPlus, setViewingDisneyPlus] = useState(false);
  const [selectedDisneyPlusItem, setSelectedDisneyPlusItem] = useState<ContentItem | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [viewingPrimeVideo, setViewingPrimeVideo] = useState(false);
  const [selectedPrimeVideoItem, setSelectedPrimeVideoItem] = useState<ContentItem | null>(null);
  const [viewingMax, setViewingMax] = useState(false);
  const [selectedMaxItem, setSelectedMaxItem] = useState<ContentItem | null>(null);

  // Notifications
  const [notification, setNotification] = useState<{title: string, body: string} | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  // PWA Install Prompt
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [pwaPromptDismissed, setPwaPromptDismissed] = useState(() => {
    return sessionStorage.getItem('pwa_prompt_dismissed') === 'true';
  });

  // Hook to manage "My List" in localStorage
  const useMyList = () => {
    const [myList, setMyList] = useState<number[]>(() => {
        try {
            const items = window.localStorage.getItem('netflixMyList');
            return items ? JSON.parse(items) : [];
        } catch (error) {
            return [];
        }
    });

    const updateLocalStorage = (list: number[]) => {
        window.localStorage.setItem('netflixMyList', JSON.stringify(list));
    };

    const addToMyList = (id: number) => {
        if (!myList.includes(id)) {
            const newList = [...myList, id];
            setMyList(newList);
            updateLocalStorage(newList);
        }
    };

    const removeFromMyList = (id: number) => {
        const newList = myList.filter(i => i !== id);
        setMyList(newList);
        updateLocalStorage(newList);
    };

    const isInMyList = (id: number) => myList.includes(id);

    return { myList, addToMyList, removeFromMyList, isInMyList };
  };
  const { myList, addToMyList, removeFromMyList, isInMyList } = useMyList();

  // Dev Menu State
  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false);
  const [activeDevScreen, setActiveDevScreen] = useState<DevScreen | null>(null);
  const [vercelUrl, setVercelUrl] = useState('');

  // Admin View State
  const [isAdminView, setIsAdminView] = useState(false);

  // Intro Animation State
  const [introState, setIntroState] = useState<{ service: string; onEnd: () => void } | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  
  // Theme state
  const { theme } = useTheme();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Splash screen state
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [showPostLoginSplash, setShowPostLoginSplash] = useState(false);


  const unlockAudio = () => {
    if (isAudioUnlocked) return;

    const getAudioContext = () => {
        if (!audioContextRef.current) {
            try {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContext) {
                    audioContextRef.current = new AudioContext();
                }
            } catch (e) {
                console.error("Web Audio API is not supported in this browser.");
                return null;
            }
        }
        return audioContextRef.current;
    };

    const context = getAudioContext();
    if (context && context.state === 'suspended') {
        context.resume().then(() => {
            console.log("AudioContext resumed successfully.");
            setIsAudioUnlocked(true);
        }).catch(e => console.error("Error resuming AudioContext:", e));
    } else {
        setIsAudioUnlocked(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplashScreen(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showPostLoginSplash) {
      const timer = setTimeout(() => {
        setShowPostLoginSplash(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showPostLoginSplash]);

  // PWA Install prompt listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
      if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          const { outcome } = await deferredInstallPrompt.userChoice;
          if (outcome === 'accepted') {
              console.log('User accepted the install prompt');
          } else {
              console.log('User dismissed the install prompt');
          }
          setDeferredInstallPrompt(null);
          setPwaPromptDismissed(true);
          sessionStorage.setItem('pwa_prompt_dismissed', 'true');
      }
  };

  const handleDismissPwaPrompt = () => {
      setPwaPromptDismissed(true);
      sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'PASSWORD_RECOVERY') {
        setAuthView('updatePassword');
      }
      setSession(session);
       if (_event === 'SIGNED_IN') {
            setShowPostLoginSplash(true);
            const hasChosenTheme = localStorage.getItem('hasChosenTheme');
            if (!hasChosenTheme) {
                setIsThemeModalOpen(true);
            }
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (profileError) throw profileError;

      if (!profileData) {
        const fullName = session.user.user_metadata.full_name || 'Novo Usuário';
        const avatarUrl = session.user.user_metadata.avatar_url || 'https://img.icons8.com/color/96/yoda.png';
        const walletId = '@' + fullName.toLowerCase().replace(/\s+/g, '.') + '-' + session.user.id.substring(0, 4);

        const { data: newProfileData, error: newProfileError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            full_name: fullName,
            avatar_url: avatarUrl,
            wallet_id: walletId,
          })
          .select()
          .single();
        
        if (newProfileError) throw newProfileError;
        profileData = newProfileData;
      }

      setProfile(profileData as Profile);

      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .order('id', { ascending: false });

      if (groupsError) throw groupsError;
      if (groupsData) {
        const allGroups = groupsData as Group[];
        setExploreGroups(allGroups);
        setMyGroups(allGroups);
      }
    } catch (error) {
      const typedError = error as { message: string };
      console.error("Error fetching user data:", typedError.message || error);
      alert(`Erro ao buscar dados do usuário: ${typedError.message}. Verifique a configuração do seu banco de dados e as políticas de RLS (Row Level Security) no Supabase. Consulte o Menu de Desenvolvedor > Configuração do Banco (SQL) para obter os scripts corretos.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserData();
    } else {
      setProfile(null);
      setMyGroups([]);
      setExploreGroups([]);
    }
  }, [session]);

  // Setup notifications
  useEffect(() => {
    if (!session) {
        return;
    }
    
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            // If permission is already granted, we can get the token.
            // requestPermissionAndToken will handle this without showing a prompt.
            requestPermissionAndToken();
        } else if (Notification.permission === 'default') {
             // If permission is not yet asked, we show our custom prompt.
             const hasDismissed = sessionStorage.getItem('notification_prompt_dismissed');
             if (!hasDismissed) {
                 setShowNotificationPrompt(true);
             }
        }
    }

    // Set up listener for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Mensagem recebida em primeiro plano. ', payload);
        if (payload.notification) {
            setNotification({
                title: payload.notification.title || 'Nova Notificação',
                body: payload.notification.body || ''
            });
            setNotifications(prev => [payload.notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        }
    });

    return () => {
        unsubscribe();
    };
  }, [session]);

  // Setup Periodic Background Sync
  useEffect(() => {
    const registerPeriodicSync = async () => {
        if ('serviceWorker' in navigator && window.isSecureContext) {
            // @ts-ignore
            if ('PeriodicSyncManager' in window) {
                const swRegistration = await navigator.serviceWorker.ready;
                // @ts-ignore
                if (swRegistration.periodicSync) {
                    try {
                        // @ts-ignore
                        const permissionStatus = await navigator.permissions.query({ name: 'periodic-background-sync' });
                        if (permissionStatus.state === 'granted') {
                            // @ts-ignore
                            await swRegistration.periodicSync.register('get-latest-content', {
                                minInterval: 12 * 60 * 60 * 1000, // 12 hours
                            });
                            console.log('✅ Periodic Sync registered');
                        } else {
                            console.log('ℹ️ Periodic Sync permission not granted. It can be enabled in site settings.');
                        }
                    } catch (error) {
                        console.error('❌ Periodic Sync registration failed:', error);
                    }
                }
            }
        }
    };

    if (session) { // Only register for logged-in users
        registerPeriodicSync();
    }
  }, [session]);

  const handleAllowNotifications = async () => {
      setShowNotificationPrompt(false);
      await requestPermissionAndToken();
  };

  const handleDismissNotificationPrompt = () => {
      setShowNotificationPrompt(false);
      sessionStorage.setItem('notification_prompt_dismissed', 'true');
  };
  
  const handleNotificationClick = () => {
    setActiveView('profile');
    handleNavigateProfile('notifications');
    setUnreadCount(0);
  };

  useEffect(() => {
    setProfileView('main');
    setWalletView('main');
    setExploreView('main');
    setSelectedGroup(null);
    setIsInPaymentFlow(false);
    setActiveChatGroup(null);
    setSelectedMyGroup(null);
    setSelectedExploreItem(null);
    setSelectedMovie(null);
    setSelectedProvider(null);
    setViewingAllMyGroups(false);
    setViewingNetflix(false);
    setSelectedNetflixItem(null);
    setViewingDisneyPlus(false);
    setSelectedDisneyPlusItem(null);
    setSelectedBrand(null);
    setViewingPrimeVideo(false);
    setSelectedPrimeVideoItem(null);
    setViewingMax(false);
    setSelectedMaxItem(null);
  }, [activeView]);

  const handleSelectGroup = (group: Group) => {
    const groupName = group.name.toLowerCase();
    let service: string | null = null;
    if (groupName.includes('netflix')) service = 'netflix';
    else if (groupName.includes('disney')) service = 'disneyplus';
    else if (groupName.includes('prime video')) service = 'primevideo';
    else if (groupName.includes('max') || groupName.includes('hbo')) service = 'max';

    const proceed = () => {
        setSelectedGroup(group);
        setIsInPaymentFlow(false);
    };

    if (service) {
        setIntroState({ 
            service, 
            onEnd: () => {
                proceed();
                setIntroState(null);
            }
        });
    } else {
        proceed();
    }
  };

  const handleBackFromDetail = () => {
    setSelectedGroup(null);
  };

  const handleProceedToPayment = () => {
    setIsInPaymentFlow(true);
  };

  const handleBackFromPayment = () => {
    setIsInPaymentFlow(false);
  };

  const handleNavigateProfile = (view: ProfileView) => {
    setProfileView(view);
  };
  const handleBackToProfileMain = () => setProfileView('main');
  const handleBackToSecurity = () => setProfileView('security');
  const handleBackToVerificationMain = () => setProfileView('accountVerification');
  
  const handleCodeSent = (phoneNumber: string) => {
    setVerificationData({ phoneNumber });
    handleNavigateProfile('phoneVerification');
  };

  const handlePhoneVerified = async (phoneNumber: string) => {
    if (!profile) return;
    const { data: updatedData, error } = await supabase
        .from('profiles')
        .update({ phone: phoneNumber, is_phone_verified: true })
        .eq('id', profile.id)
        .select()
        .single();
    if (error) {
        alert("Erro ao salvar número: " + error.message);
    } else {
        setProfile(updatedData as Profile);
        setVerificationSuccessMessage("Celular verificado com sucesso!");
        handleNavigateProfile('accountVerification');
    }
    setVerificationData(null);
  };

  const handleNavigateWallet = (view: WalletView) => {
    setWalletView(view);
  };
  const handleBackToWalletMain = () => {
    setWalletView('main');
    setTransferDetails(null);
    setAddAmount(null);
    setCompletedTransaction(null);
  };
   const handleProceedToTransferConfirm = async (amount: number, recipientWalletId: string) => {
    try {
        const { data: recipientProfile, error } = await supabase
            .rpc('get_public_profile_by_wallet_id', {
                p_wallet_id: recipientWalletId
            });

        if (error || !recipientProfile) {
            throw new Error("Destinatário não encontrado. Verifique o ID da conta.");
        }
        
        setTransferDetails({ amount, recipient: recipientProfile as Profile });
        setWalletView('transferConfirm');

    } catch (error: any) {
        alert(error.message);
    }
  };

  const handleConfirmTransfer = async () => {
    if (!transferDetails || !profile) {
        throw new Error("Dados da transferência ou do remetente incompletos.");
    }

    const { amount, recipient } = transferDetails;

    try {
        const { error } = await supabase.rpc('handle_transfer', {
            recipient_id: recipient.id,
            transfer_amount: amount,
        });

        if (error) {
            throw error;
        }
        
        const { data: latestTx, error: txError } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', profile.id)
            .eq('type', 'transfer_out')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (txError || !latestTx) {
            throw txError || new Error("Não foi possível encontrar a transação recém-criada.");
        }
        
        const txReceipt: CompletedTransaction = {
            id: latestTx.id,
            amount: amount,
            sender: profile,
            recipient: recipient,
            timestamp: latestTx.created_at,
        };

        setCompletedTransaction(txReceipt);
        fetchUserData();
        setWalletView('transferSuccess');
        setTransferDetails(null);

    } catch (error: any) {
        console.error("Erro na transferência:", error);
        throw new Error(error.message);
    }
  };
  
  const handleViewTransactionDetail = async (transaction: any) => {
    if (!profile) return;
    if (transaction.type !== 'transfer_in' && transaction.type !== 'transfer_out') {
        alert("Detalhes disponíveis apenas para transferências.");
        return;
    }

    try {
        let senderId: string;
        let recipientId: string;

        if (transaction.type === 'transfer_out') {
            senderId = profile.id;
            recipientId = transaction.metadata?.recipient_id;
        } else { // transfer_in
            recipientId = profile.id;
            senderId = transaction.metadata?.sender_id;
        }
        
        if (!senderId || !recipientId) {
            throw new Error("Não foi possível identificar o remetente ou destinatário.");
        }
        
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, wallet_id, cpf')
            .in('id', [senderId, recipientId]);
        
        if (error) throw error;
        if (!profiles || profiles.length < 1) throw new Error("Não foi possível encontrar os perfis da transação. Verifique as permissões de RLS.");

        const sender = profiles.find(p => p.id === senderId) || (senderId === profile.id ? profile : null);
        const recipient = profiles.find(p => p.id === recipientId) || (recipientId === profile.id ? profile : null);

        if (!sender || !recipient) throw new Error("Falha ao mapear perfis. Um dos perfis não pôde ser carregado.");

        const txReceipt: CompletedTransaction = {
            id: transaction.id,
            amount: Math.abs(transaction.amount),
            sender: sender as Profile,
            recipient: recipient as Profile,
            timestamp: transaction.created_at,
        };

        setCompletedTransaction(txReceipt);
        setWalletView('statementDetail');

    } catch (error: any) {
        alert(`Erro ao buscar detalhes da transação: ${error.message}`);
    }
  };

  const handleProceedToAddMoney = (amount: number) => {
    setAddAmount(amount);
    setWalletView('addMoney');
  };
  
  const handleNavigateExplore = (view: ExploreView) => {
    setExploreView(view);
  };
  const handleBackToExploreMain = () => {
      setExploreView('main');
      setNewGroupDetails(null);
  };
  const handleNavigateToConfigureGroup = (service: AvailableService) => {
    setNewGroupDetails({
        service,
        name: `${service.name} Família`,
        totalPrice: 0,
        slots: 4,
        paymentDay: 15,
        pricePerSlot: 0,
    });
    setExploreView('configureGroup');
  };
  const handleBackToCreateGroup = () => {
    setNewGroupDetails(null);
    setExploreView('createGroup');
  };
  const handleProceedToCredentials = (details: Omit<NewGroupDetails, 'service'>) => {
    if (newGroupDetails) {
        setNewGroupDetails({ ...newGroupDetails, ...details});
        setExploreView('groupCredentials');
    }
  };

   const handleFinishGroupCreation = async (data: { credentials: { email: string; password?: string }, rules: string[] }) => {
        if (!newGroupDetails || !profile) return;

        const newGroupData = {
            name: newGroupDetails.name,
            price: newGroupDetails.pricePerSlot,
            status: GroupStatus.Active,
            members: 1,
            max_members: newGroupDetails.slots,
            next_payment_date: `${newGroupDetails.paymentDay.toString().padStart(2, '0')}/${(new Date().getMonth() + 2).toString().padStart(2, '0')}/${new Date().getFullYear()}`,
            logo: newGroupDetails.service.logoUrl,
            host_name: profile.full_name,
            host_id: profile.id,
            members_list: [{
                id: profile.id,
                name: profile.full_name,
                role: 'Anfitrião',
                joinDate: new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', ''),
                avatarUrl: profile.avatar_url
            }],
            rules: data.rules.map((text, index) => ({ id: index + 1, text })),
            credentials: {
                email: data.credentials.email,
                password: data.credentials.password
            },
            chat_history: []
        };
        
        const { error } = await supabase.from('groups').insert([newGroupData]);

        if (error) {
          alert("Erro ao criar grupo: " + error.message);
        } else {
          alert("Grupo criado com sucesso!");
          fetchUserData();
          setExploreView('main');
          setNewGroupDetails(null);
        }
    };

    const handleJoinGroup = async (groupToJoin: Group) => {
        if (!profile) { alert("Você precisa estar logado para entrar em um grupo."); return; }
        if (profile.balance < groupToJoin.price) { alert("Saldo insuficiente."); return; }
        if (groupToJoin.members_list.some(m => m.id === profile.id)) { alert("Você já está neste grupo."); return; }
        if (groupToJoin.members >= groupToJoin.max_members) { alert("Grupo está lotado."); return; }

        const newMember: GroupMember = {
            id: profile.id,
            name: profile.full_name,
            role: 'Membro' as const,
            joinDate: new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', ''),
            avatarUrl: profile.avatar_url
        };
        
        const newMembersList = [...groupToJoin.members_list, newMember];
        const newMemberCount = groupToJoin.members + 1;
        const newBalance = profile.balance - groupToJoin.price;

        const { error: transactionInsertError } = await supabase
            .from('transactions')
            .insert({
                user_id: profile.id,
                amount: -groupToJoin.price,
                type: 'payment',
                description: `Pagamento grupo ${groupToJoin.name}`,
                metadata: { group_id: groupToJoin.id }
            });

        const { error: groupUpdateError } = await supabase.from('groups').update({
            members: newMemberCount,
            members_list: newMembersList
        }).eq('id', groupToJoin.id);

        const { error: profileUpdateError } = await supabase.from('profiles').update({
            balance: newBalance
        }).eq('id', profile.id);

        if (groupUpdateError || profileUpdateError || transactionInsertError) {
            alert("Erro ao entrar no grupo. Se o valor foi debitado, contate o suporte.");
        } else {
            alert("Você entrou no grupo com sucesso!");
            fetchUserData();
            setIsInPaymentFlow(false);
            setSelectedGroup(null);
        }
    };
    
    const handleSelectExploreItem = async (item: ExploreDetailItem) => {
        if (item.type === 'movie') {
            setLoading(true);
            setSelectedExploreItem(null);
            setSelectedMovie(null);
            try {
                const { TMDB_BASE_URL, TMDB_API_KEY, TMDB_IMAGE_BASE_URL, TMDB_PROVIDER_IDS, AVAILABLE_SERVICES_DATA } = await import('../constants');
                const response = await fetch(`${TMDB_BASE_URL}/movie/${item.id}?api_key=${TMDB_API_KEY}&language=pt-BR&append_to_response=watch/providers`);
                if (!response.ok) throw new Error("Filme não encontrado.");
                const data = await response.json();
                
                const brProviders = data['watch/providers']?.results?.BR?.flatrate || [];

                let service: { id: string; name: string; logoUrl: string; } | null = null;
                if (brProviders.length > 0) {
                    for (const provider of brProviders) {
                        const knownServiceId = Object.keys(TMDB_PROVIDER_IDS).find(
                            key => TMDB_PROVIDER_IDS[key] === provider.provider_id
                        );
                        if (knownServiceId) {
                            const knownService = AVAILABLE_SERVICES_DATA.find(s => s.id === knownServiceId);
                            if (knownService) {
                                service = knownService;
                                break;
                            }
                        }
                    }

                    if (!service) {
                        const firstProvider = brProviders[0];
                        service = {
                            id: firstProvider.provider_id.toString(),
                            name: firstProvider.provider_name,
                            logoUrl: `${TMDB_IMAGE_BASE_URL.replace('/original', '/w92')}${firstProvider.logo_path}`,
                        };
                    }
                }

                const movie: MovieInfo = {
                    id: data.id,
                    title: data.title,
                    description: data.overview,
                    backdropUrl: `${TMDB_IMAGE_BASE_URL}${data.backdrop_path}`,
                    posterUrl: `${TMDB_IMAGE_BASE_URL}${data.poster_path}`,
                    rating: data.vote_average,
                    genres: data.genres.map((g: any) => g.name),
                    releaseYear: new Date(data.release_date).getFullYear(),
                    serviceId: service?.id || 'unknown',
                    serviceName: service?.name || 'Verificar disponibilidade',
                    serviceLogoUrl: service?.logoUrl || '',
                };
                setSelectedMovie(movie);
            } catch(error) {
                console.error("Erro ao buscar detalhes do filme:", error);
                alert("Não foi possível carregar os detalhes do filme.");
                handleBackFromExploreDetail();
            } finally {
                setLoading(false);
            }
        } else {
            const proceed = () => {
                setSelectedExploreItem(item);
                setSelectedMovie(null);
                setSelectedProvider(null);
            };

            if (item.type === 'service') {
                const { AVAILABLE_SERVICES_DATA } = await import('../constants');
                const service = AVAILABLE_SERVICES_DATA.find(s => s.id === item.id);
                if (service) {
                    const serviceId = service.id.toLowerCase();
                    let introService: string | null = null;

                    if (serviceId.includes('netflix')) introService = 'netflix';
                    else if (serviceId.includes('disney')) introService = 'disneyplus';
                    else if (serviceId.includes('primevideo')) introService = 'primevideo';
                    else if (serviceId.includes('max') || serviceId.includes('hbo')) introService = 'max';

                    if (introService) {
                        setIntroState({
                            service: introService,
                            onEnd: () => {
                                proceed();
                                setIntroState(null);
                            }
                        });
                        return; 
                    }
                }
            }
            proceed();
        }
    };
    
    const handleSelectDisneyPlusContentItem = async (item: ExploreDetailItem) => {
        if (item.type !== 'movie') return;

        setLoading(true);
        try {
            const { TMDB_BASE_URL, TMDB_API_KEY } = await import('../constants');
            const response = await fetch(`${TMDB_BASE_URL}/movie/${item.id}?api_key=${TMDB_API_KEY}&language=pt-BR`);
            if (!response.ok) throw new Error("Filme não encontrado.");
            const data = await response.json();

            const contentItem: TMDBMovie = {
                id: data.id,
                title: data.title,
                poster_path: data.poster_path,
                backdrop_path: data.backdrop_path,
                overview: data.overview,
                release_date: data.release_date,
                vote_average: data.vote_average,
            };
            setSelectedDisneyPlusItem(contentItem);
            setSelectedBrand(null);
        } catch(error: any) {
            console.error("Erro ao buscar detalhes do item da Disney+:", error.message);
            alert("Não foi possível carregar os detalhes do item.");
        } finally {
            setLoading(false);
        }
    };


   const handleSelectProvider = (serviceToShow: AvailableService) => {
        const serviceId = serviceToShow.id.toLowerCase();
        let introService: string | null = null;
        let onEndCallback: () => void = () => {};

        if (serviceId.includes('netflix')) {
            introService = 'netflix';
            onEndCallback = () => setViewingNetflix(true);
        } else if (serviceId.includes('disney')) {
            introService = 'disneyplus';
            onEndCallback = () => setViewingDisneyPlus(true);
        } else if (serviceId.includes('primevideo')) {
            introService = 'primevideo';
            onEndCallback = () => setViewingPrimeVideo(true);
        } else if (serviceId.includes('max') || serviceId.includes('hbo')) {
            introService = 'max';
            onEndCallback = () => setViewingMax(true);
        }

        const proceed = () => {
            setSelectedProvider(serviceToShow);
            setSelectedExploreItem(null);
            setSelectedMovie(null);
        };

        if (introService) {
            setIntroState({
                service: introService,
                onEnd: () => {
                    onEndCallback();
                    setIntroState(null);
                }
            });
            setSelectedProvider(null);
            setSelectedExploreItem(null);
            setSelectedMovie(null);
        } else {
            proceed();
        }
    };
    
    const handleBackFromExploreDetail = () => {
        setSelectedExploreItem(null);
        setSelectedMovie(null);
        setSelectedProvider(null);
    };

    const handleViewAllNetflixGroups = () => {
        setSelectedNetflixItem(null);
        handleSelectExploreItem({ type: 'service', id: 'netflix' });
    };

  const handleViewGroupChat = (group: Group) => {
    setActiveChatGroup(group);
    setSelectedMyGroup(null);
  };

  const handleViewMyGroupDetails = (group: Group) => {
    setSelectedMyGroup(group);
  };

  const handleBackFromMyGroupDetails = () => {
    setSelectedMyGroup(null);
  };

  const handleSendMessage = async (groupId: number, newMessage: ChatMessage) => {
    const targetGroup = myGroups.find(g => g.id === groupId) || exploreGroups.find(g => g.id === groupId);
    if (!targetGroup) return;

    // Call the RPC function to send the message.
    // The backend will verify if the user is a member.
    const { error } = await supabase.rpc('send_group_message', {
        group_id_to_update: groupId,
        new_message: newMessage
    });

    if (error) {
        alert('Falha ao enviar mensagem: ' + error.message);
    } else {
        // Optimistically update the UI
        const updatedChatHistory = [...(targetGroup.chat_history || []), newMessage];
        const updateGroupState = (groups: Group[]) => groups.map(g => g.id === groupId ? { ...g, chat_history: updatedChatHistory } : g);
        setMyGroups(prev => updateGroupState(prev));
        setExploreGroups(prev => updateGroupState(prev));
        if (activeChatGroup?.id === groupId) {
            setActiveChatGroup(prev => prev ? { ...prev, chat_history: updatedChatHistory } : null);
        }
    }
  };

  const handleUpdateProfile = async (data: ProfileUpdateData) => {
    if (!profile) return;

    const updates = {
        full_name: data.name,
        phone: data.phone,
        birth_date: data.birthDate,
    };

    const { data: updatedData, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

    if (error) {
        alert('Erro ao atualizar perfil: ' + error.message);
    } else {
        setProfile(updatedData as Profile);
        alert('Perfil atualizado com sucesso!');
        setProfileView('main');
    }
  };

  const handleUpdateAvatar = async (newAvatarUrl: string) => {
    if (!profile) return;
    
    const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', profile.id)
        .select()
        .single();
        
    if (error) {
        alert('Erro ao atualizar avatar: ' + error.message);
        throw error;
    } else {
        setProfile(data as Profile);
        alert('Avatar atualizado com sucesso!');
        setProfileView('editProfile');
    }
  };

    const handleSavePersonalInfo = async (data: { fullName: string; cpf: string; birthDate: string; }) => {
        if (!profile) return;
        const { data: updatedData, error } = await supabase
            .from('profiles')
            .update({
                full_name: data.fullName,
                cpf: data.cpf,
                birth_date: data.birthDate
            })
            .eq('id', profile.id)
            .select()
            .single();

        if (error) {
            alert('Erro ao salvar dados: ' + error.message);
        } else {
            setProfile(updatedData as Profile);
            setVerificationSuccessMessage('Dados pessoais salvos com sucesso!');
            setProfileView('accountVerification');
        }
    };

    const handleSaveAddress = async (address: any) => {
        if (!profile) return;
        const { data: updatedData, error } = await supabase
            .from('profiles')
            .update(address)
            .eq('id', profile.id)
            .select()
            .single();

        if (error) {
            alert('Erro ao salvar endereço: ' + error.message);
        } else {
            setProfile(updatedData as Profile);
            setVerificationSuccessMessage('Endereço salvo com sucesso!');
            setProfileView('accountVerification');
        }
    };


  const handleEmailLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };
  
  const handlePhonePasswordLogin = async (phone, password) => {
    const { error } = await supabase.auth.signInWithPassword({ phone, password });
    if (error) alert(error.message);
  };
  
  const handlePhoneOtpRequest = async (phone) => {
    const { data, error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
        alert(error.message);
        throw error;
    }
    return data;
  };

  const handlePhoneOtpVerify = async (phone, token) => {
      const { data: { session }, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
      if (error) {
          alert(error.message);
          throw error;
      }
  };


  const handleSignUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                avatar_url: `https://api.dicebear.com/8.x/initials/svg?seed=${name}`
            }
        }
    });
    if (error) {
        alert(error.message);
    } else {
        alert('Conta criada! Verifique seu e-mail para confirmação.');
    }
  };
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  }

  const handleOpenDevMenu = () => setIsDevMenuOpen(true);
  const handleCloseDevMenu = () => setIsDevMenuOpen(false);
  const handleNavigateToDevScreen = (screen: DevScreen) => {
    setActiveDevScreen(screen);
    handleCloseDevMenu();
  };
  const handleBackFromDevScreen = () => setActiveDevScreen(null);

  const handleDebugAddBalance = async () => {
    if (!profile) {
        alert("Nenhum perfil carregado para adicionar saldo.");
        return;
    }

    const newBalance = (profile.balance || 0) + 200;
    
    const { data, error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', profile.id)
        .select()
        .single();
    
    if (error) {
        alert("Erro ao adicionar saldo de depuração: " + error.message);
    } else {
        setProfile(data as Profile);
        alert("R$ 200,00 adicionados com sucesso ao seu saldo!");
        handleCloseDevMenu();
    }
  };

  const handleEnterAdminMode = () => {
    if (profile?.id === ADMIN_USER_ID) {
        setIsAdminView(true);
    } else {
        alert('Acesso negado.');
    }
  };

  const renderAuthContent = () => {
    switch(authView) {
        case 'login':
            return <LoginScreen 
              onEmailLogin={handleEmailLogin} 
              onPhonePasswordLogin={handlePhonePasswordLogin}
              onPhoneOtpRequest={handlePhoneOtpRequest}
              onPhoneOtpVerify={handlePhoneOtpVerify}
              onNavigateToSignUp={() => setAuthView('signup')} 
              onNavigateToForgotPassword={() => setAuthView('forgotPassword')}
              onBack={() => setAuthView('welcome')} 
            />;
        case 'signup':
            return <SignUpScreen onSignUp={handleSignUp} onNavigateToLogin={() => setAuthView('login')} onNavigateToTerms={() => setAuthView('terms')} />;
        case 'forgotPassword':
            return <ForgotPasswordScreen onBack={() => setAuthView('login')} onSent={() => setAuthView('login')} />;
        case 'updatePassword':
            return session ? <UpdatePasswordScreen session={session} onPasswordUpdated={() => { setAuthView('login'); alert('Senha atualizada com sucesso!'); }} /> : <LoginScreen onEmailLogin={handleEmailLogin} onPhonePasswordLogin={handlePhonePasswordLogin} onPhoneOtpRequest={handlePhoneOtpRequest} onPhoneOtpVerify={handlePhoneOtpVerify} onNavigateToSignUp={() => setAuthView('signup')} onNavigateToForgotPassword={() => setAuthView('forgotPassword')} onBack={() => setAuthView('welcome')} />;
        case 'terms':
            return <TermsOfUseScreen onBack={() => setAuthView('signup')} />;
        case 'welcome':
        default:
            return <WelcomeScreen onNavigateToLogin={() => setAuthView('login')} onNavigateToSignUp={() => setAuthView('signup')} />;
    }
  }

  const renderContent = () => {
    if (loading || showSplashScreen || showPostLoginSplash) {
      return <LoadingScreen />;
    }
    
    if (isAdminView) {
        return <AdminScreen 
            onBack={() => setIsAdminView(false)} 
            onInstallApp={handleInstallClick}
            showInstallButton={!!deferredInstallPrompt}
        />;
    }
    
    if (activeDevScreen === 'sql') {
        return <SqlSetupScreen onBack={handleBackFromDevScreen} />;
    }
    if (activeDevScreen === 'payment') {
        return <PaymentSetupScreen onBack={handleBackFromDevScreen} onSaveVercelUrl={setVercelUrl} currentVercelUrl={vercelUrl} />;
    }

    if (!session) {
        return renderAuthContent();
    }
    
    if (activeChatGroup) {
      return <GroupChatScreen group={activeChatGroup} onBack={() => setActiveChatGroup(null)} profile={profile} onSendMessage={handleSendMessage} />;
    }

    if (selectedMyGroup) {
      return <MyGroupDetailScreen group={selectedMyGroup} onBack={handleBackFromMyGroupDetails} onGoToChat={handleViewGroupChat} />;
    }
    
    if (viewingAllMyGroups) {
      return <AllMyGroupsScreen
        groups={myGroups}
        onBack={() => setViewingAllMyGroups(false)}
        onViewGroupChat={handleViewGroupChat}
        onViewMyGroupDetails={handleViewMyGroupDetails}
      />;
    }

    if (selectedMovie) {
        return <MovieDetailScreen
          movie={selectedMovie}
          allGroups={exploreGroups}
          onBack={handleBackFromExploreDetail}
          onSelectGroup={handleSelectGroup}
          onSelectMovie={(movieId) => handleSelectExploreItem({ type: 'movie', id: movieId.toString() })}
          myList={myList}
          addToMyList={addToMyList}
          removeFromMyList={removeFromMyList}
          isInMyList={isInMyList}
        />
    }

    if (selectedProvider) {
        return <ProviderDetailScreen 
            service={selectedProvider} 
            onBack={() => {setSelectedProvider(null)}}
            onSelectMovie={(movieId) => handleSelectExploreItem({ type: 'movie', id: movieId.toString() })} 
            onSelectSeries={(seriesId) => alert(`Detalhes para a série ID ${seriesId} serão adicionados em breve!`)}
        />
    }
    
    if (isInPaymentFlow && selectedGroup) {
      return <PaymentScreen group={selectedGroup} onBack={handleBackFromPayment} onConfirm={() => handleJoinGroup(selectedGroup)} profile={profile} email={session?.user?.email} />;
    }

    if (selectedGroup) {
      return <GroupDetailScreen group={selectedGroup} onBack={handleBackFromDetail} onProceedToPayment={handleProceedToPayment} />;
    }
    
    switch (activeView) {
      case 'profile':
        switch (profileView) {
          case 'editProfile':
            return <EditProfileScreen onBack={handleBackToProfileMain} profile={profile} onSave={handleUpdateProfile} onNavigateToChangeAvatar={() => handleNavigateProfile('changeAvatar')} email={session?.user?.email} />;
          case 'changeAvatar':
            return <ChangeAvatarScreen onBack={() => setProfileView('editProfile')} profile={profile} onSave={handleUpdateAvatar} />;
          case 'support':
            return <SupportScreen onBack={handleBackToProfileMain} />;
          case 'settings':
            return <SettingsScreen onBack={handleBackToProfileMain} onNavigateToSupport={() => handleNavigateProfile('support')} />;
          case 'notifications':
            return <NotificationsScreen onBack={handleBackToProfileMain} />;
          case 'security':
            return <SecurityPrivacyScreen
              onBack={handleBackToProfileMain}
              onNavigateToTwoFactorAuth={() => handleNavigateProfile('twoFactorAuth')}
              onNavigateToBiometrics={() => handleNavigateProfile('biometrics')}
              onNavigateToChangePassword={() => handleNavigateProfile('changePassword')}
              onNavigateToConnectedDevices={() => handleNavigateProfile('connectedDevices')}
              onNavigateToProfilePrivacy={() => handleNavigateProfile('profilePrivacy')}
              onNavigateToPersonalData={() => handleNavigateProfile('personalData')}
              onNavigateToActivityHistory={() => handleNavigateProfile('activityHistory')}
            />;
          case 'reviews':
            return <MyReviewsScreen onBack={handleBackToProfileMain} />;
          case 'history':
            return <GroupHistoryScreen onBack={handleBackToProfileMain} groups={myGroups} />;
          case 'twoFactorAuth':
            return <TwoFactorAuthScreen onBack={handleBackToSecurity} />;
          case 'biometrics':
            return <BiometricsScreen onBack={handleBackToSecurity} />;
          case 'changePassword':
            return <ChangePasswordScreen onBack={handleBackToSecurity} />;
          case 'connectedDevices':
            return <ConnectedDevicesScreen onBack={handleBackToSecurity} />;
          case 'profilePrivacy':
            return <ProfilePrivacyScreen onBack={handleBackToSecurity} />;
          case 'personalData':
            return <PersonalDataScreen onBack={handleBackToSecurity} />;
          case 'activityHistory':
            return <ActivityHistoryScreen onBack={handleBackToSecurity} />;
          case 'soundSettings':
            return <SoundSettingsScreen onBack={handleBackToProfileMain} />;
          case 'designSettings':
            return <DesignSettingsScreen onBack={handleBackToProfileMain} />;
          case 'accountVerification':
            return <AccountVerificationScreen 
              profile={profile}
              onBack={handleBackToProfileMain}
              onNavigateToPersonalInfo={() => handleNavigateProfile('personalInfo')}
              onNavigateToAddress={() => handleNavigateProfile('address')}
              onNavigateToDocumentUpload={() => handleNavigateProfile('documentUpload')}
              onNavigateToSelfie={() => handleNavigateProfile('selfie')}
              onNavigateToPhoneVerification={() => handleNavigateProfile('enterPhoneNumber')}
              successMessage={verificationSuccessMessage}
              onSuccessDismiss={() => setVerificationSuccessMessage(null)}
            />;
          case 'personalInfo':
            return <PersonalInfoScreen onBack={handleBackToVerificationMain} profile={profile} onSave={handleSavePersonalInfo} />;
          case 'address':
            return <AddressScreen onBack={handleBackToVerificationMain} profile={profile} onSave={handleSaveAddress} />;
          case 'documentUpload':
            return <DocumentUploadScreen onBack={handleBackToVerificationMain} />;
          case 'selfie':
            return <SelfieScreen onBack={handleBackToVerificationMain} />;
          case 'enterPhoneNumber':
            return <EnterPhoneNumberScreen onBack={handleBackToVerificationMain} onCodeSent={handleCodeSent} />;
          case 'phoneVerification':
             return verificationData ? (
                <PhoneVerificationScreen 
                    onBack={() => {
                        setVerificationData(null);
                        handleNavigateProfile('enterPhoneNumber');
                    }}
                    onVerified={handlePhoneVerified}
                    phoneNumber={verificationData.phoneNumber}
                />
            ) : <EnterPhoneNumberScreen onBack={handleBackToVerificationMain} onCodeSent={handleCodeSent} />;
          case 'main':
          default:
            return <ProfileScreen 
              profile={profile}
              onLogout={handleLogout}
              onNavigateToSettings={() => handleNavigateProfile('settings')} 
              onNavigateToEditProfile={() => handleNavigateProfile('editProfile')} 
              onNavigateToSupport={() => handleNavigateProfile('support')}
              onNavigateToNotifications={() => handleNavigateProfile('notifications')}
              onNavigateToSecurity={() => handleNavigateProfile('security')}
              onNavigateToReviews={() => handleNavigateProfile('reviews')}
              onNavigateToGroupHistory={() => handleNavigateProfile('history')}
              onNavigateToAccountVerification={() => handleNavigateProfile('accountVerification')}
              onNavigateToSoundSettings={() => handleNavigateProfile('soundSettings')}
              onNavigateToDesignSettings={() => handleNavigateProfile('designSettings')}
            />;
        }
      case 'wallet':
        switch(walletView) {
          case 'addAmount':
            return <AddAmountScreen onBack={handleBackToWalletMain} onProceed={handleProceedToAddMoney} profile={profile} />;
          case 'addMoney':
            return addAmount ? <AddMoneyScreen onBack={() => setWalletView('addAmount')} amount={addAmount} profile={profile} email={session?.user?.email} /> : <WalletScreen onNavigate={handleNavigateWallet} profile={profile} />;
          case 'transfer':
            return <TransferScreen onBack={handleBackToWalletMain} onProceed={handleProceedToTransferConfirm} profile={profile} onNavigateToVerification={() => { setActiveView('profile'); setProfileView('accountVerification'); }} />;
           case 'transferConfirm':
            return transferDetails ? <TransferConfirmScreen onBack={() => setWalletView('transfer')} onConfirm={handleConfirmTransfer} details={transferDetails} /> : <WalletScreen onNavigate={handleNavigateWallet} profile={profile} />;
          case 'transferSuccess':
            return completedTransaction ? <TransferSuccessScreen onDone={handleBackToWalletMain} transaction={completedTransaction} /> : <WalletScreen onNavigate={handleNavigateWallet} profile={profile} />;
          case 'statement':
            return <StatementScreen onBack={handleBackToWalletMain} profile={profile} onViewTransactionDetail={handleViewTransactionDetail} />;
          case 'statementDetail':
            return completedTransaction ? <StatementDetailScreen onDone={() => setWalletView('statement')} transaction={completedTransaction} /> : <StatementScreen onBack={handleBackToWalletMain} profile={profile} onViewTransactionDetail={handleViewTransactionDetail} />;
          case 'withdraw':
            return <WithdrawScreen onBack={handleBackToWalletMain} onNavigateToVerification={() => { setActiveView('profile'); setProfileView('accountVerification')}} profile={profile} />;
          case 'main':
          default:
            return <WalletScreen onNavigate={handleNavigateWallet} profile={profile} />;
        }
      case 'explore':
        if (selectedExploreItem) {
            return <ServiceDetailScreen 
                        item={selectedExploreItem}
                        groups={exploreGroups}
                        onBack={handleBackFromExploreDetail}
                        onSelectGroup={handleSelectGroup}
                        onSelectExploreItem={handleSelectExploreItem}
                    />;
        }
        switch(exploreView) {
            case 'createGroup':
                return <CreateGroupScreen onBack={handleBackToExploreMain} onSelectService={handleNavigateToConfigureGroup} />;
            case 'configureGroup':
                if (newGroupDetails?.service) {
                    return <ConfigureGroupScreen onBack={handleBackToCreateGroup} service={newGroupDetails.service} onContinue={handleProceedToCredentials} />;
                }
                return <ExploreScreen groups={exploreGroups} onSelectGroup={handleSelectGroup} onNavigateToCreateGroup={() => handleNavigateExplore('createGroup')} profile={profile} myGroups={myGroups} onSelectExploreItem={handleSelectExploreItem} />;
            case 'groupCredentials':
                if (newGroupDetails) {
                    return <GroupCredentialsScreen onBack={() => setExploreView('configureGroup')} groupDetails={newGroupDetails} onFinish={handleFinishGroupCreation} />;
                }
                 return <ExploreScreen groups={exploreGroups} onSelectGroup={handleSelectGroup} onNavigateToCreateGroup={() => handleNavigateExplore('createGroup')} profile={profile} myGroups={myGroups} onSelectExploreItem={handleSelectExploreItem} />;
            case 'main':
            default:
                return <ExploreScreen groups={exploreGroups} onSelectGroup={handleSelectGroup} onNavigateToCreateGroup={() => handleNavigateExplore('createGroup')} profile={profile} myGroups={myGroups} onSelectExploreItem={handleSelectExploreItem} />;
        }
      case 'movies':
        if (viewingNetflix) {
            if (selectedNetflixItem) {
                return <NetflixDetailScreen 
                            item={selectedNetflixItem}
                            onBack={() => setSelectedNetflixItem(null)}
                            onSelectGroup={handleSelectGroup}
                            onSelectItem={(item) => setSelectedNetflixItem(item)}
                            myList={myList}
                            addToMyList={addToMyList}
                            removeFromMyList={removeFromMyList}
                            isInMyList={isInMyList}
                            onViewAllGroups={handleViewAllNetflixGroups}
                            myGroups={myGroups}
                            profile={profile}
                            onSendMessage={handleSendMessage}
                        />
            }
            return <NetflixScreen 
                        onBack={() => setViewingNetflix(false)}
                        onSelectItem={(item) => setSelectedNetflixItem(item)}
                        myList={myList}
                        onViewAllGroups={handleViewAllNetflixGroups}
                    />;
        }
         if (viewingDisneyPlus) {
            if (selectedBrand) {
                return <BrandDetailScreen
                    brand={selectedBrand}
                    onBack={() => setSelectedBrand(null)}
                    onSelectExploreItem={handleSelectDisneyPlusContentItem}
                />
            }
            if (selectedDisneyPlusItem) {
                return <DisneyPlusDetailScreen 
                            item={selectedDisneyPlusItem}
                            onBack={() => setSelectedDisneyPlusItem(null)}
                            onSelectGroup={handleSelectGroup}
                            onSelectItem={(item) => setSelectedDisneyPlusItem(item)}
                            myList={myList}
                            addToMyList={addToMyList}
                            removeFromMyList={removeFromMyList}
                            isInMyList={isInMyList}
                            onViewAllGroups={() => handleSelectExploreItem({ type: 'service', id: 'disneyplus' })}
                            myGroups={myGroups}
                            profile={profile}
                            onSendMessage={handleSendMessage}
                        />
            }
            return <DisneyPlusScreen 
                        onBack={() => setViewingDisneyPlus(false)}
                        onSelectItem={(item) => {
                            setSelectedDisneyPlusItem(item);
                        }}
                        onSelectBrand={(brand) => setSelectedBrand(brand)}
                    />;
        }
        if (viewingPrimeVideo) {
            if (selectedPrimeVideoItem) {
                return <PrimeVideoDetailScreen
                            item={selectedPrimeVideoItem}
                            onBack={() => setSelectedPrimeVideoItem(null)}
                            onSelectGroup={handleSelectGroup}
                            onSelectItem={(item) => setSelectedPrimeVideoItem(item)}
                            myList={myList}
                            addToMyList={addToMyList}
                            removeFromMyList={removeFromMyList}
                            isInMyList={isInMyList}
                            onViewAllGroups={() => handleSelectExploreItem({ type: 'service', id: 'primevideo' })}
                            myGroups={myGroups}
                            profile={profile}
                            onSendMessage={handleSendMessage}
                        />
            }
            return <PrimeVideoScreen 
                        onBack={() => setViewingPrimeVideo(false)}
                        onSelectItem={(item) => setSelectedPrimeVideoItem(item)}
                        myList={myList}
                    />;
        }
        if (viewingMax) {
            if (selectedMaxItem) {
                return <MaxDetailScreen
                            item={selectedMaxItem}
                            onBack={() => setSelectedMaxItem(null)}
                            onSelectGroup={handleSelectGroup}
                            onSelectItem={(item) => setSelectedMaxItem(item)}
                            myList={myList}
                            addToMyList={addToMyList}
                            removeFromMyList={removeFromMyList}
                            isInMyList={isInMyList}
                            onViewAllGroups={() => handleSelectExploreItem({ type: 'service', id: 'hbomax' })}
                            myGroups={myGroups}
                            profile={profile}
                            onSendMessage={handleSendMessage}
                        />
            }
            return <MaxScreen
                        onBack={() => setViewingMax(false)}
                        onSelectItem={(item) => setSelectedMaxItem(item)}
                        myList={myList}
                    />;
        }
        return <MoviesScreen 
            onSelectMovie={(movieId) => handleSelectExploreItem({ type: 'movie', id: movieId.toString() })} 
            onSelectSeries={(seriesId) => alert(`Detalhes para a série ID ${seriesId} serão adicionados em breve!`)}
            onSelectProvider={handleSelectProvider}
            allGroups={exploreGroups}
            onSelectGroup={handleSelectGroup}
        />;
      case 'home':
      default:
        return <HomeScreen
            profile={profile}
            onViewGroupChat={handleViewGroupChat}
            onViewMyGroupDetails={handleViewMyGroupDetails}
            groups={myGroups}
            onOpenDevMenu={handleOpenDevMenu}
            onNavigateToExplore={() => setActiveView('explore')}
            onNavigateToWallet={() => setActiveView('wallet')}
            onNavigateToProfile={() => setActiveView('profile')}
            onNavigateToSupport={() => { setActiveView('profile'); handleNavigateProfile('support'); }}
            onNavigateToAddMoney={() => { setActiveView('wallet'); handleNavigateWallet('addAmount'); }}
            onEnterAdminMode={handleEnterAdminMode}
            notificationCount={unreadCount}
            onNotificationClick={handleNotificationClick}
            onViewAllGroups={() => setViewingAllMyGroups(true)}
        />;
    }
  };
  
  const isIntroPlaying = !!introState;
  const isNavHidden = isThemeModalOpen || isAdminView || isIntroPlaying || !session || !!activeDevScreen || !!selectedGroup || isInPaymentFlow || profileView !== 'main' || walletView !== 'main' || exploreView !== 'main' || !!activeChatGroup || !!selectedMyGroup || !!selectedExploreItem || !!selectedMovie || !!selectedProvider || viewingNetflix || viewingDisneyPlus || viewingPrimeVideo || viewingMax || !!selectedBrand || viewingAllMyGroups;

  return (
    <div onClick={unlockAudio} className={`font-sans max-w-md mx-auto min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        {notification && (
            <Toast 
                title={notification.title}
                body={notification.body}
                onClose={() => setNotification(null)}
            />
        )}
       <ThemeSelectionModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
       <Suspense fallback={<LoadingScreen />}>
        {isIntroPlaying && introState && (
            <>
                {introState.service === 'netflix' && <NetflixIntro onEnd={introState.onEnd} />}
                {introState.service === 'disneyplus' && <DisneyPlusIntro onEnd={introState.onEnd} />}
                {introState.service === 'primevideo' && <PrimeVideoIntro onEnd={introState.onEnd} />}
                {introState.service === 'max' && <MaxIntro onEnd={introState.onEnd} />}
            </>
        )}
          <div className={`relative ${!isNavHidden ? 'pb-24' : ''}`}>
            {renderContent()}
          </div>
       </Suspense>
      {!isNavHidden && <BottomNav activeView={activeView} setActiveView={setActiveView} />}
      {showNotificationPrompt && (
        <NotificationPermissionPrompt
            onAllow={handleAllowNotifications}
            onDismiss={handleDismissNotificationPrompt}
        />
       )}
       {deferredInstallPrompt && !pwaPromptDismissed && !isNavHidden && (
        <PwaInstallPrompt
            onInstall={handleInstallClick}
            onDismiss={handleDismissPwaPrompt}
        />
       )}
      <DevMenu 
        isOpen={isDevMenuOpen}
        onClose={handleCloseDevMenu}
        onNavigate={handleNavigateToDevScreen}
        onAddBalance={handleDebugAddBalance}
      />
    </div>
  );
};

const App: React.FC = () => (
 <ThemeProvider>
    <SoundProvider>
      <AppContent />
    </SoundProvider>
 </ThemeProvider>
);


export default App;