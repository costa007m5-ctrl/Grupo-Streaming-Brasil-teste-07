// Future icon source: https://icons8.com.br using the CDN link option.

import type { Group, Activity, ProfileStat, Achievement, ProfileActivity, SettingItem, WalletTransaction, AvailableService, ChatMessage, GroupMember, GroupRule, FeaturedContent, MovieInfo } from './types';
import { GroupStatus } from './types';
import {
    UserGroupIcon,
    ClockIcon,
    BanknotesIcon,
    StarIcon,
    ShieldIcon,
    HeartIcon,
    BellIcon,
    LockClosedIcon,
    HeadphonesIcon,
    UsersIcon,
    RectangleStackIcon,
    EditProfileIcon,
    AccountVerificationIcon,
    GroupHistoryIcon,
    SettingsIconHex,
    DevicePhoneMobileIcon,
    ComputerDesktopIcon,
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
    SpeakerWaveIcon,
    ArrowDownTrayIcon,
    CurrencyDollarIcon,
    ShieldExclamationIcon,
    QuestionMarkCircleIcon,
} from './components/Icons';

export const TMDB_API_KEY = 'e095c08fa4bd9162e1552eeb58fe58be';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Mapeamento dos nossos IDs de serviço para os IDs de network do TMDB (usado para descobrir conteúdo)
export const TMDB_NETWORK_IDS: Record<string, number> = {
  netflix: 213,
  primevideo: 1024,
  max: 49, // HBO network id is used for Max
  disneyplus: 2739,
};

// Mapeamento dos nossos IDs de serviço para os IDs de provider do TMDB (usado para verificar "onde assistir")
export const TMDB_PROVIDER_IDS: Record<string, number> = {
  netflix: 8,
  primevideo: 119,
  max: 384, // Max provider ID
  disneyplus: 337,
  crunchyroll: 283,
  globoplay: 307,
  paramountplus: 531,
  // Apple TV+ is 350, Star+ is 619, if needed later
};

// Mapeamento das nossas categorias para IDs de gênero do TMDB
export const TMDB_GENRE_IDS: Record<string, number> = {
  music: 10402,
};


export const RECIPIENT_USER_DATA = {
    name: 'Maria Costa',
    cpfMasked: '***.456.***-**',
    walletId: '@maria.costa'
};

export const RECENT_ACTIVITY_DATA: Activity[] = [
  {
    id: 1,
    description: 'Pagamento Netflix realizado',
    timestamp: 'Hoje, 14:30',
    amount: -12.50,
    logo: 'https://img.icons8.com/color/96/netflix.png',
  },
  {
    id: 2,
    description: 'Novo membro no grupo Spotify',
    timestamp: 'Ontem, 16:45',
    amount: null,
    logo: 'https://img.icons8.com/color/96/spotify.png',
  }
];

export const PROFILE_STATS_DATA: ProfileStat[] = [
    { id: 1, value: '3', label: 'Grupos ativos', icon: UserGroupIcon },
    { id: 2, value: '8', label: 'Total de grupos', icon: RectangleStackIcon },
    { id: 3, value: 'R$ 456,78', label: 'Economia total', icon: BanknotesIcon },
    { id: 4, value: '4.8', label: 'Avaliação', icon: StarIcon },
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
    { id: 1, title: 'Conta Verificada', description: 'Documentos confirmados', icon: ShieldIcon },
    { id: 2, title: 'Membro Pontual', description: '100% pagamentos em dia', icon: ClockIcon },
    { id: 3, title: 'Bem Avaliado', description: 'Nota 4.8/5.0', icon: HeartIcon },
    { id: 4, title: 'Participante Ativo', description: '8 grupos participados', icon: UsersIcon },
];

export const PROFILE_ACTIVITY_DATA: ProfileActivity[] = [
    { id: 1, name: 'Netflix Premium', date: '2024-01-15', logo: 'https://img.icons8.com/color/96/netflix.png' },
    { id: 2, name: 'Spotify Premium', date: '2024-01-10', logo: 'https://img.icons8.com/color/96/spotify.png' },
    { id: 3, name: 'Disney+ Premium', date: '2024-01-08', logo: 'https://img.icons8.com/fluency/96/disney-plus.png' },
];

export const SETTINGS_ITEMS: SettingItem[] = [
    { id: 1, label: 'Editar perfil', icon: EditProfileIcon },
    { id: 2, label: 'Verificação de conta', icon: AccountVerificationIcon },
    { id: 3, label: 'Histórico de grupos', icon: GroupHistoryIcon },
    { id: 4, label: 'Minhas avaliações', icon: StarIcon },
    { id: 5, label: 'Notificações', icon: BellIcon },
    { id: 6, label: 'Privacidade e segurança', icon: LockClosedIcon },
    { id: 9, label: 'Sons e Mídia', icon: SpeakerWaveIcon },
    { id: 7, label: 'Suporte', icon: HeadphonesIcon },
    { id: 8, label: 'Configurações', icon: SettingsIconHex },
];

export const WALLET_TRANSACTIONS_DATA: WalletTransaction[] = [
   // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
   {
    id: 7,
    name: 'Transferência para @maria.costa',
    date: 'Hoje • 10:12',
    status: 'Concluído',
    amount: -25.00,
    logo: 'transfer_out',
    type: 'transfer_out',
    metadata: { recipient_id: 'some-uuid-for-maria' },
  },
  // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
  {
    id: 1,
    name: 'Cashback Netflix',
    date: '14/01/2024 • 14:35',
    status: 'Concluído',
    amount: 2.50,
    logo: 'cashback',
    type: 'cashback',
    metadata: { group_id: 1 },
  },
  // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
  {
    id: 2,
    name: 'Spotify Premium',
    date: '09/01/2024 • 09:15',
    status: 'Concluído',
    amount: -8.50,
    logo: 'spotify',
    type: 'payment',
    metadata: { group_id: 2 },
  },
  // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
  {
    id: 3,
    name: 'Depósito PIX',
    date: '07/01/2024 • 16:20',
    status: 'Concluído',
    amount: 100.00,
    logo: 'pix',
    type: 'deposit',
    metadata: {},
  },
    // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
    {
    id: 4,
    name: 'Disney+ Premium',
    date: '04/01/2024 • 11:45',
    status: 'Concluído',
    amount: -9.90,
    logo: 'disney',
    type: 'payment',
    metadata: { group_id: 4 },
  },
  // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
  {
    id: 5,
    name: 'Reembolso Amazon Prime',
    date: '02/01/2024 • 13:10',
    status: 'Concluído',
    amount: 7.25,
    logo: 'amazon',
    type: 'cashback',
    metadata: { group_id: 5 },
  },
  // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
  {
    id: 6,
    name: 'Netflix Premium',
    date: '14/01/2024 • 14:30',
    status: 'Concluído',
    amount: -12.50,
    logo: 'netflix',
    type: 'payment',
    metadata: { group_id: 1 },
  },
  // FIX: Added missing 'type' and 'metadata' properties to satisfy the WalletTransaction interface.
  {
    id: 8,
    name: 'Saque PIX',
    date: 'Ontem • 18:55',
    status: 'Concluído',
    amount: -50.00,
    logo: 'withdraw',
    type: 'withdrawal',
    metadata: {},
  },
];

export const MY_REVIEWS_DATA = [
    {
        id: 1,
        serviceName: 'Netflix Premium',
        hostName: 'Maria Silva',
        date: '20/12/2023',
        rating: 5,
        review: 'Excelente anfitriã, sempre muito atenciosa e organizada. O acesso foi liberado rapidamente. Recomendo a todos!',
        logo: 'https://img.icons8.com/color/96/netflix.png',
    },
    {
        id: 2,
        serviceName: 'Spotify Premium',
        hostName: 'Carlos Lima',
        date: '15/11/2023',
        rating: 4,
        review: 'Grupo bom, tudo funcionou como o esperado. Apenas um pequeno atraso para receber o convite, mas nada que atrapalhasse.',
        logo: 'https://img.icons8.com/color/96/spotify.png',
    }
];

export const GROUP_HISTORY_DATA = [
    {
        id: 1,
        serviceName: 'YouTube Premium',
        period: 'Jun 2023 - Dez 2023',
        status: 'Encerrado',
        hostName: 'Ana Costa',
        logo: 'https://img.icons8.com/color/48/youtube-play.png',
    },
    {
        id: 2,
        serviceName: 'Max',
        period: 'Mar 2023 - Ago 2023',
        status: 'Encerrado',
        hostName: 'Pedro Lima',
        logo: 'https://logodownload.org/wp-content/uploads/2023/04/max-logo-1.png',
    }
];

export const CONNECTED_DEVICES_DATA = [
    {
        id: 1,
        isCurrent: true,
        device: 'iPhone 14 Pro',
        location: 'São Paulo, BR',
        lastActive: 'Agora mesmo',
        icon: DevicePhoneMobileIcon,
    },
    {
        id: 2,
        isCurrent: false,
        device: 'Desktop Windows',
        location: 'Rio de Janeiro, BR',
        lastActive: 'Ontem às 20:45',
        icon: ComputerDesktopIcon,
    },
    {
        id: 3,
        isCurrent: false,
        device: 'Samsung Galaxy S22',
        location: 'Belo Horizonte, BR',
        lastActive: '2 dias atrás',
        icon: DevicePhoneMobileIcon,
    }
];

export const ACTIVITY_HISTORY_DATA = [
     {
        id: 1,
        icon: LockClosedIcon,
        description: 'Senha alterada com sucesso',
        timestamp: 'Hoje, 09:30',
        details: 'IP: 189.12.34.56'
    },
    {
        id: 2,
        icon: ComputerDesktopIcon,
        description: 'Login em novo dispositivo',
        timestamp: 'Ontem, 20:45',
        details: 'Desktop Windows - Rio de Janeiro, BR'
    },
    {
        id: 3,
        icon: DevicePhoneMobileIcon,
        description: 'Sessão desconectada',
        timestamp: '3 dias atrás',
        details: 'Macbook Pro - Salvador, BR'
    }
];

export const AVAILABLE_SERVICES_DATA: AvailableService[] = [
  { id: 'netflix', name: 'Netflix', logoUrl: 'https://img.icons8.com/color/96/netflix.png', bgColor: '#000000', category: 'movie', originalPrice: 55.90, officialUrl: 'https://www.netflix.com/signup' },
  { id: 'spotify', name: 'Spotify', logoUrl: 'https://img.icons8.com/color/96/spotify.png', bgColor: '#1DB954', category: 'music', originalPrice: 21.90, officialUrl: 'https://www.spotify.com/br-pt/premium/' },
  { id: 'disneyplus', name: 'Disney+', logoUrl: 'https://img.icons8.com/fluency/96/disney-plus.png', bgColor: '#001e61', category: 'movie', originalPrice: 33.90, officialUrl: 'https://www.disneyplus.com/' },
  { id: 'primevideo', name: 'Prime Video', logoUrl: 'https://img.icons8.com/color/96/amazon-prime-video.png', bgColor: '#00A8E1', category: 'movie', originalPrice: 14.90, officialUrl: 'https://www.primevideo.com/' },
  { id: 'youtubepremium', name: 'YouTube Premium', logoUrl: 'https://img.icons8.com/color/48/youtube-play.png', bgColor: '#FFFFFF', category: 'music', originalPrice: 20.90, officialUrl: 'https://www.youtube.com/premium' },
  { id: 'max', name: 'Max', logoUrl: 'https://logodownload.org/wp-content/uploads/2023/04/max-logo-1.png', bgColor: '#9062F4', category: 'movie', originalPrice: 29.90, officialUrl: 'https://www.max.com/' },
  { id: 'crunchyroll', name: 'Crunchyroll', logoUrl: 'https://img.icons8.com/color/96/crunchyroll.png', bgColor: '#F47521', category: 'movie', originalPrice: 25.00, officialUrl: 'https://www.crunchyroll.com/' },
  { id: 'deezer', name: 'Deezer', logoUrl: 'https://img.icons8.com/color/96/deezer.png', bgColor: '#191414', category: 'music', originalPrice: 19.90, officialUrl: 'https://www.deezer.com/' },
  { id: 'globoplay', name: 'Globoplay', logoUrl: 'https://logodownload.org/wp-content/uploads/2020/11/globoplay-logo-1.png', bgColor: '#FFFFFF', category: 'tv', originalPrice: 22.90, officialUrl: 'https://globoplay.globo.com/assine/' },
  { id: 'amazonmusic', name: 'Amazon Music', logoUrl: 'https://img.icons8.com/color/96/amazon-music.png', bgColor: '#333745', category: 'music', originalPrice: 16.90, officialUrl: 'https://www.amazon.com.br/music/unlimited' },
  { id: 'paramountplus', name: 'Paramount+', logoUrl: 'https://logodownload.org/wp-content/uploads/2021/04/paramount-plus-logo-0.png', bgColor: '#FFFFFF', category: 'movie', originalPrice: 19.90, officialUrl: 'https://www.paramountplus.com/' },
  { id: 'skyplus', name: 'Sky+', logoUrl: 'https://logodownload.org/wp-content/uploads/2018/12/sky-logo-5.png', bgColor: '#FFFFFF', category: 'tv', originalPrice: 29.90, officialUrl: 'https://www.sky.com.br/sky-mais' },
  { id: 'clarotv', name: 'Claro TV+', logoUrl: 'https://logodownload.org/wp-content/uploads/2021/08/claro-tv-mais-logo-1.png', bgColor: '#FFFFFF', category: 'tv', originalPrice: 59.90, officialUrl: 'https://www.claro.com.br/tv' },
];

export const TOP_5_SERVICES_IDS: string[] = [
  'netflix',
  'primevideo',
  'spotify',
  'disneyplus',
  'youtubepremium',
];

export const POPULAR_FAQ_CATEGORIES = [
    { id: "payments", title: "Pagamentos", icon: CurrencyDollarIcon },
    { id: "groups", title: "Problemas com Grupo", icon: ShieldExclamationIcon },
    { id: "app", title: "Dúvidas sobre o App", icon: QuestionMarkCircleIcon },
    { id: "security", title: "Conta e Segurança", icon: LockClosedIcon },
];

export const FAQ_DATA = {
    payments: {
        title: "Pagamentos e Cobrança",
        icon: CurrencyDollarIcon,
        questions: [
            { question: "Como funciona o pagamento seguro (custódia)?", answer: "Seu dinheiro fica protegido em nossa plataforma e só é liberado para o anfitrião após você confirmar que recebeu o acesso ao serviço. Se houver qualquer problema e o anfitrião não resolver, garantimos o reembolso para sua carteira no app." },
            { question: "Quais métodos de pagamento são aceitos?", answer: "Você pode adicionar saldo à sua carteira via PIX, boleto ou cartão de crédito. Os pagamentos dos grupos são sempre debitados do saldo da sua carteira no aplicativo." },
            { question: "Como funciona o reembolso?", answer: "Se você não receber acesso ao grupo ou se o serviço for interrompido por culpa do anfitrião, você pode abrir uma disputa. Nossa equipe analisará o caso e, se comprovado o problema, o valor será estornado para sua carteira." },
            { question: "Recebi uma cobrança que não reconheço. O que fazer?", answer: "Todas as cobranças são referentes a mensalidades de grupos. Você pode ver todas as suas transações na tela 'Carteira' > 'Extrato'. Se ainda assim não reconhecer, entre em contato com nosso suporte imediatamente." },
            { question: "Posso parcelar o pagamento da mensalidade?", answer: "Não, o pagamento da mensalidade do grupo é um valor único debitado do seu saldo a cada mês." },
            { question: "O que acontece se eu não tiver saldo no dia do pagamento?", answer: "Você receberá uma notificação para adicionar saldo. Se o pagamento não for efetuado em até 48 horas após o vencimento, você será removido automaticamente do grupo para que a vaga possa ser liberada." },
            { question: "Como funciona o cashback?", answer: "Ocasionalmente, oferecemos promoções de cashback. O valor do cashback é creditado na sua carteira do app após a confirmação do pagamento e pode ser usado para pagar futuras mensalidades ou sacar." },
            { question: "Há alguma taxa para usar o aplicativo?", answer: "Para membros, não há taxas. Para anfitriões, uma pequena taxa de serviço é adicionada ao valor total do plano para cobrir os custos operacionais e de segurança da plataforma. Esse valor já está incluso no preço final por vaga." },
            { question: "Como adicionar saldo na minha carteira?", answer: "Vá para a tela 'Carteira', clique em 'Adicionar' e escolha o valor e o método de pagamento (PIX, boleto ou cartão)." },
            { question: "Onde vejo meu histórico de pagamentos?", answer: "Na tela 'Carteira', clique em 'Extrato' para ver todas as suas transações, incluindo pagamentos de grupos, depósitos e saques." },
        ]
    },
    groups: {
        title: "Gerenciamento de Grupos",
        icon: UserGroupIcon,
        questions: [
            { question: "As credenciais do grupo não funcionam. O que eu faço?", answer: "Primeiro, tente entrar em contato com o anfitrião pelo chat do grupo para verificar se as credenciais estão corretas. Se não obtiver resposta em 24 horas, abra um chamado em nossa 'Central de Ajuda' e nossa equipe irá intermediar." },
            { question: "Como faço para criar meu próprio grupo?", answer: "Na tela 'Explorar', clique no botão de '+' no canto inferior direito. Escolha o serviço, defina o número de vagas, o preço com base no valor do seu plano e as regras. É simples e rápido!" },
            { question: "Quais são as responsabilidades de um anfitrião?", answer: "O anfitrião é responsável por: \n1. Manter a assinatura do serviço de streaming ativa. \n2. Garantir que as credenciais fornecidas estejam corretas e funcionais. \n3. Responder aos membros no chat do grupo para resolver problemas." },
            { question: "Como posso sair de um grupo?", answer: "Vá para a tela 'Meus Grupos', selecione o grupo que deseja sair e procure pela opção 'Sair do grupo'. Lembre-se que ao sair, você perde o acesso no final do ciclo de pagamento atual e não há reembolso pelo período já pago." },
            { question: "Um membro está violando as regras. Como denunciar?", answer: "Dentro da tela de detalhes do seu grupo, você pode denunciar o grupo ou um membro específico. Nossa equipe de moderação irá analisar a situação." },
            { question: "Posso participar de mais de um grupo do mesmo serviço?", answer: "Sim, você pode participar de quantos grupos desejar, inclusive de mais de um grupo do mesmo serviço (por exemplo, dois grupos de Netflix)." },
            { question: "O que significa 'preço por vaga'?", answer: "É o valor total da assinatura do anfitrião (incluindo nossa taxa de serviço) dividido pelo número total de vagas no grupo. É o valor que cada membro, incluindo o anfitrião, paga mensalmente." },
            { question: "Como funciona o chat do grupo?", answer: "Cada grupo tem um chat privado para todos os membros e o anfitrião. É o principal canal para comunicação, tirar dúvidas e resolver problemas relacionados ao acesso." },
            { question: "O que acontece quando um grupo fica cheio?", answer: "Quando todas as vagas são preenchidas, o grupo não aceita mais novos membros. Você pode procurar por outros grupos do mesmo serviço." },
            { question: "O anfitrião pode me remover do grupo?", answer: "Sim, o anfitrião pode remover um membro por violação das regras ou falta de pagamento. Se você for removido injustamente, entre em contato com o suporte." },
        ]
    },
    security: {
        title: "Conta e Segurança",
        icon: LockClosedIcon,
        questions: [
            { question: "É seguro compartilhar as credenciais do serviço de streaming?", answer: "Você compartilha as credenciais apenas com os membros do seu grupo. Recomendamos que o anfitrião use uma senha única e exclusiva para o serviço compartilhado, diferente de suas senhas pessoais." },
            { question: "Como altero minha senha do app?", answer: "Vá em 'Perfil' > 'Privacidade e Segurança' > 'Alterar Senha'. Por segurança, pode ser necessário confirmar sua identidade." },
            { question: "O que é a Autenticação de Dois Fatores (2FA)?", answer: "É uma camada extra de segurança. Além da sua senha, você precisará de um código gerado por um aplicativo (como Google Authenticator) ou enviado por SMS para fazer login." },
            { question: "Como ativo a 2FA?", answer: "Vá em 'Perfil' > 'Privacidade e Segurança' > 'Autenticação em 2 Fatores' e siga as instruções para configurar." },
            { question: "Esqueci minha senha. Como recupero?", answer: "Na tela de login, clique em 'Esqueceu a senha?' e insira seu e-mail. Enviaremos um link para você criar uma nova senha." },
            { question: "Como vejo os dispositivos conectados à minha conta?", answer: "Em 'Perfil' > 'Privacidade e Segurança' > 'Dispositivos Conectados', você pode ver todas as sessões ativas e desconectar dispositivos que não reconhece." },
            { question: "Meus dados pessoais estão seguros?", answer: "Sim. Usamos criptografia e seguimos as melhores práticas de segurança para proteger seus dados. Leia nossa Política de Privacidade para mais detalhes." },
            { question: "Como excluo minha conta?", answer: "Para excluir sua conta, vá em 'Perfil' > 'Privacidade e Segurança' > 'Dados Pessoais'. Lembre-se que esta ação é permanente e todos os seus dados serão apagados." },
            { question: "O que é a verificação de conta?", answer: "É um processo onde você nos envia documentos para comprovar sua identidade. Contas verificadas têm limites maiores para transações e mais credibilidade na plataforma, sendo um requisito para saques e para ser anfitrião." },
            { question: "Por que preciso verificar meu número de celular?", answer: "A verificação do celular é uma medida de segurança importante para recuperação de conta e para habilitar a autenticação de dois fatores via SMS." },
        ]
    },
    app: {
        title: "Funcionalidades do App",
        icon: QuestionMarkCircleIcon,
        questions: [
            { question: "Como funciona a carteira digital?", answer: "Sua carteira armazena o saldo que você adiciona à plataforma. Todos os pagamentos de mensalidades de grupos são debitados automaticamente deste saldo." },
            { question: "Posso transferir dinheiro para outro usuário?", answer: "Sim, você pode transferir saldo da sua carteira para qualquer outro usuário da plataforma usando o ID da conta dele. A transferência é instantânea e sem taxas." },
            { question: "Como faço para sacar dinheiro da minha carteira?", answer: "Para sacar, sua conta precisa estar verificada. Vá em 'Carteira' > 'Sacar', insira o valor e sua chave PIX. O valor será transferido para sua conta bancária." },
            { question: "O que é o Buscador Mágico (IA)?", answer: "É uma ferramenta na tela 'Filmes e Séries' que usa Inteligência Artificial para encontrar um filme com base na sua descrição, mesmo que você não saiba o nome." },
            { question: "Como instalo o aplicativo no meu celular (PWA)?", answer: "Se você acessar nosso site pelo navegador do celular (Chrome no Android ou Safari no iOS), verá um aviso para 'Adicionar à Tela de Início'. Ao aceitar, um ícone do app será criado, funcionando como um aplicativo nativo." },
            { question: "Para que serve a 'Minha Lista' na tela de filmes?", answer: "Você pode adicionar filmes e séries à sua lista para encontrá-los facilmente mais tarde. É uma ótima forma de organizar o que você quer assistir." },
            { question: "Como funcionam as notificações?", answer: "Enviamos notificações para avisar sobre novos membros no seu grupo, mensagens no chat, lembretes de pagamento e novidades importantes. Você pode gerenciar suas preferências em 'Perfil' > 'Notificações'." },
            { question: "Como altero o tema do aplicativo (claro/escuro)?", answer: "Vá em 'Perfil' > 'Aparência' e escolha entre o tema escuro (padrão) ou o clássico (claro)." },
            { question: "Onde vejo os grupos que já participei?", answer: "Em 'Perfil' > 'Histórico de Grupos', você pode ver tanto os grupos ativos quanto os que já foram encerrados." },
            { question: "Posso avaliar um anfitrião ou membro?", answer: "Sim. Após sair ou o grupo ser encerrado, você terá a oportunidade de avaliar sua experiência com o anfitrião. Essas avaliações ajudam a manter a comunidade segura e confiável." },
        ]
    },
    troubleshooting: {
        title: "Resolução de Problemas",
        icon: ShieldExclamationIcon,
        questions: [
            { question: "Não consigo fazer login. O que fazer?", answer: "Verifique se seu e-mail e senha estão corretos. Se o problema persistir, use a função 'Esqueceu a senha?'. Se sua conta usa 2FA, garanta que o código do aplicativo autenticador está correto." },
            { question: "Meu pagamento via PIX não foi confirmado.", answer: "Pagamentos PIX geralmente são instantâneos. Se o saldo não apareceu em sua carteira após alguns minutos, verifique se o pagamento foi realmente concluído no seu banco e entre em contato com o suporte com o comprovante." },
            { question: "O aplicativo está lento ou travando.", answer: "Tente limpar o cache do seu navegador ou, se estiver usando o PWA, feche e abra o aplicativo novamente. Manter o navegador atualizado também ajuda." },
            { question: "Não estou recebendo as notificações.", answer: "Verifique se você permitiu as notificações para nosso site nas configurações do seu navegador ou celular. Você também pode revisar suas preferências em 'Perfil' > 'Notificações'." },
            { question: "Não consigo encontrar um grupo para um serviço específico.", answer: "Isso pode significar que não há grupos com vagas abertas para esse serviço no momento. Você pode ser o primeiro a criar um grupo e convidar outros para participar!" },
            { question: "O anfitrião não responde no chat.", answer: "Recomendamos aguardar até 24 horas por uma resposta. Se após esse período não houver contato, e você estiver com um problema urgente (como falta de acesso), abra um chamado de suporte." },
            { question: "Não consigo sacar meu dinheiro.", answer: "A função de saque está disponível apenas para contas verificadas. Por favor, complete todas as etapas de verificação em 'Perfil' > 'Verificação de Conta'." },
            { question: "Uma funcionalidade do app não está funcionando como esperado.", answer: "Pedimos desculpas pelo inconveniente. Por favor, relate o problema para nossa equipe de suporte com o máximo de detalhes possível, incluindo o que você estava tentando fazer e qual dispositivo está usando." },
        ]
    }
};
