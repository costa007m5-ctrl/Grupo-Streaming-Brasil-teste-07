// Future icon source: https://icons8.com.br using the CDN link option.

import type { Group, Activity, ProfileStat, Achievement, ProfileActivity, SettingItem, WalletTransaction, AvailableService, ChatMessage, GroupMember, GroupRule, FeaturedContent, MovieInfo } from './types';
import { GroupStatus } from './types';
import {
    UserGroupIcon,
    ClockIcon,
    BanknotesIcon,
    StarIcon,
    // FIX: Replaced ShieldCheckIcon with ShieldIcon as it is the correct exported component name.
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

export const FAQ_DATA = [
    { id: 1, category: 'Primeiros Passos', question: 'Como o Grupo Streaming Brasil funciona?', answer: 'Nossa plataforma conecta pessoas para dividir assinaturas de serviços de streaming. Você pode entrar em um grupo existente ou criar o seu, pagando apenas uma fração do valor total e economizando todo mês.', popular: true },
    { id: 2, category: 'Pagamentos e Carteira', question: 'Como funciona o pagamento seguro com custódia?', answer: 'Seu dinheiro fica protegido em nossa plataforma (custódia) e só é liberado para o anfitrião após você confirmar que recebeu o acesso ao serviço. Se houver qualquer problema, como credenciais inválidas sem resolução, garantimos o reembolso para sua carteira no app.', popular: true },
    { id: 3, category: 'Grupos', question: 'O que faço se as credenciais do grupo não funcionarem?', answer: 'Primeiro, tente contato com o anfitrião pelo chat do grupo. Se não houver resposta em 24h, abra um chamado de suporte e nossa equipe irá intermediar. Se o problema não for resolvido, seu dinheiro será devolvido graças ao nosso sistema de custódia.', popular: true },
    { id: 4, category: 'Conta e Segurança', question: 'É seguro compartilhar as senhas dos serviços?', answer: 'Você compartilha apenas a senha do serviço de streaming (ex: Netflix) com os membros do seu grupo, e nunca a senha do nosso aplicativo. Recomendamos criar senhas específicas para cada serviço e não reutilizar senhas importantes.', popular: true },
    { id: 5, category: 'Primeiros Passos', question: 'Como eu começo a economizar?', answer: 'É simples! Crie sua conta, adicione saldo à sua carteira via PIX ou cartão, explore os grupos disponíveis para os serviços que você ama e clique em "Participar". O valor será debitado e você receberá o acesso.' },
    { id: 6, category: 'Primeiros Passos', question: 'Preciso ter uma assinatura antes de criar um grupo?', answer: 'Sim. Para ser um anfitrião, você precisa ser o titular da assinatura do serviço de streaming. Se você quer apenas participar, não precisa ter uma assinatura prévia.' },
    { id: 7, category: 'Grupos', question: 'Como eu crio meu próprio grupo?', answer: 'Na tela "Explorar", clique no botão de "+" no canto inferior direito. Escolha o serviço, defina o número de vagas, o preço (calculado automaticamente com base no valor original) e as regras. Depois, é só publicar!' },
    { id: 8, category: 'Grupos', question: 'Quais são as responsabilidades de um anfitrião?', answer: 'O anfitrião é responsável por manter a assinatura do serviço de streaming ativa e paga, garantir que as credenciais compartilhadas estejam corretas e dar suporte básico aos membros do grupo através do chat.' },
    { id: 9, category: 'Grupos', question: 'Posso participar de quantos grupos eu quiser?', answer: 'Sim! Não há limite para o número de grupos que você pode participar. Aproveite para ter acesso a múltiplos serviços por um preço justo.' },
    { id: 10, category: 'Grupos', question: 'Como funciona o chat do grupo?', answer: 'Cada grupo possui um chat privado para que os membros e o anfitrião possam se comunicar. É o canal ideal para resolver problemas de acesso, combinar perfis e interagir.' },
    { id: 11, category: 'Grupos', question: 'O que acontece se um membro não pagar?', answer: 'O pagamento é pré-pago e gerenciado pela nossa plataforma. Se um membro não renovar o pagamento para o próximo mês, sua vaga é automaticamente liberada para outra pessoa.' },
    { id: 12, category: 'Grupos', question: 'Como eu saio de um grupo?', answer: 'Nos detalhes do seu grupo, haverá uma opção para "Sair do Grupo". Ao sair, você perderá o acesso ao final do ciclo de pagamento atual. Não há multas ou taxas para sair.' },
    { id: 13, category: 'Pagamentos e Carteira', question: 'Como adiciono saldo à minha carteira?', answer: 'Vá para a aba "Carteira", clique em "Adicionar", digite o valor e escolha a forma de pagamento. Aceitamos PIX, cartão de crédito e boleto.' },
    { id: 14, category: 'Pagamentos e Carteira', question: 'Existem taxas para usar a plataforma?', answer: 'Para os membros, o preço exibido já é o final. Para os anfitriões, aplicamos uma pequena taxa de serviço sobre o valor total arrecadado para cobrir os custos operacionais e de segurança da plataforma.' },
    { id: 15, category: 'Pagamentos e Carteira', question: 'Como funcionam os reembolsos?', answer: 'Se um anfitrião não fornecer o acesso ou o serviço não funcionar, e o problema não for resolvido, nosso sistema de custódia garante que o valor pago seja estornado para sua carteira no app.' },
    { id: 16, category: 'Pagamentos e Carteira', question: 'Posso transferir saldo para outro usuário?', answer: 'Sim! Na sua carteira, você pode transferir qualquer valor do seu saldo para outro usuário da plataforma, sem taxas. Você só precisa do ID da conta da pessoa.' },
    { id: 17, category: 'Pagamentos e Carteira', question: 'Como posso sacar meu saldo?', answer: 'Para realizar saques, sua conta precisa estar verificada. Após a verificação, vá em "Carteira", clique em "Sacar" e informe sua chave PIX. O valor será enviado para sua conta bancária.' },
    { id: 18, category: 'Conta e Segurança', question: 'Como altero minha senha?', answer: 'Vá em "Perfil" > "Privacidade e Segurança" > "Alterar Senha". Por segurança, você poderá precisar confirmar sua identidade.' },
    { id: 19, category: 'Conta e Segurança', question: 'O que é a verificação de conta?', answer: 'A verificação de conta é um processo onde você nos envia seus dados e documentos para confirmar sua identidade. Contas verificadas têm limites maiores e podem realizar saques, além de transmitir mais confiança na plataforma.' },
    { id: 20, category: 'Conta e Segurança', question: 'Meus dados estão seguros?', answer: 'Sim. Levamos a segurança a sério. Usamos criptografia de ponta e seguimos as melhores práticas de segurança para proteger seus dados pessoais e financeiros.' },
    { id: 21, category: 'Conta e Segurança', question: 'O que é Autenticação de Dois Fatores (2FA)?', answer: 'É uma camada extra de segurança. Além da sua senha, você precisará de um código gerado por um aplicativo no seu celular para fazer login, garantindo que só você possa acessar sua conta.' },
    { id: 22, category: 'Resolução de Problemas', question: 'O anfitrião não responde no chat. O que fazer?', answer: 'Aguarde um prazo de 24 horas. Se após esse período não houver resposta, você pode abrir um ticket de suporte em "Perfil" > "Suporte" para que nossa equipe possa intervir.' },
    { id: 23, category: 'Resolução de Problemas', question: 'Meu pagamento foi aprovado mas não entrei no grupo. E agora?', answer: 'Normalmente o acesso é imediato. Se não for, pode ser um problema temporário. Tente fechar e abrir o aplicativo. Se o problema persistir, contate nosso suporte imediatamente.' },
    { id: 24, category: 'Resolução de Problemas', question: 'O aplicativo está lento ou travando.', answer: 'Tente limpar o cache do seu navegador ou do aplicativo. Verifique sua conexão com a internet. Se o problema continuar, entre em contato com o suporte informando o modelo do seu aparelho e a versão do app.' },
    { id: 25, category: 'Pagamentos e Carteira', question: 'O que é cashback?', answer: 'Em promoções especiais, você pode receber uma porcentagem do valor pago de volta na sua carteira. Fique de olho nas notificações para não perder!' },
    { id: 26, category: 'Grupos', question: 'Posso trocar de vaga/perfil dentro do grupo?', answer: 'A organização de qual perfil cada membro usa (ex: "Perfil 1", "Perfil do João") é combinada diretamente com o anfitrião e os outros membros através do chat do grupo.' },
    { id: 27, category: 'Conta e Segurança', question: 'Como denuncio um usuário ou grupo?', answer: 'Dentro dos detalhes do grupo ou no perfil de um usuário, você encontrará um botão ou ícone de "Denunciar". Sua denúncia é anônima e será analisada pela nossa equipe de moderação.' },
    { id: 28, category: 'Primeiros Passos', question: 'O serviço é legal?', answer: 'Facilitar o compartilhamento de contas familiares ou planos premium entre pessoas é uma prática comum. Atuamos como uma ferramenta de gestão para facilitar essa divisão, de forma transparente e segura para todos.' },
    { id: 29, category: 'Pagamentos e Carteira', question: 'Quanto tempo leva para o saldo via boleto ser creditado?', answer: 'Boletos podem levar até 2 dias úteis para serem compensados e o saldo ser adicionado à sua carteira. Para crédito instantâneo, recomendamos o uso de PIX ou cartão de crédito.' },
    { id: 30, category: 'Grupos', question: 'O anfitrião pode me remover do grupo?', answer: 'Um anfitrião só pode solicitar a remoção de um membro se houver quebra de regras. A remoção é analisada pela nossa equipe. Se removido indevidamente, você será reembolsado.' },
    { id: 31, category: 'Conta e Segurança', question: 'Esqueci minha senha, como recupero?', answer: 'Na tela de login, clique em "Esqueceu a senha?". Você receberá um e-mail com as instruções para criar uma nova senha.' },
    { id: 32, category: 'Pagamentos e Carteira', question: 'Meu saldo na carteira expira?', answer: 'Não, seu saldo na carteira não tem data de validade. Você pode usá-lo quando quiser para pagar por grupos ou transferir para amigos.' },
    { id: 33, category: 'Grupos', question: 'O que acontece se o preço da assinatura do serviço aumentar?', answer: 'O anfitrião é responsável por ajustar o valor total do grupo. Os membros serão notificados sobre a alteração de preço antes da próxima cobrança e poderão decidir se desejam continuar no grupo.' },
    { id: 34, category: 'Conta e Segurança', question: 'Como posso baixar meus dados?', answer: 'Em "Perfil" > "Privacidade e Segurança" > "Dados Pessoais", você encontrará a opção de solicitar o download de todas as suas informações.' },
    { id: 35, category: 'Resolução de Problemas', question: 'Recebi uma cobrança que não reconheço.', answer: 'Vá em "Carteira" > "Extrato" para ver todos os detalhes das suas transações. Se ainda assim não reconhecer, entre em contato com nosso suporte imediatamente.' },
    { id: 36, category: 'Primeiros Passos', question: 'O aplicativo está disponível para iPhone e Android?', answer: 'Nosso aplicativo é um PWA (Progressive Web App), o que significa que ele funciona em qualquer dispositivo com um navegador moderno. Você pode "instalar" o app na sua tela inicial para uma experiência nativa, tanto no iOS quanto no Android.' },
    { id: 37, category: 'Grupos', question: 'O que é a "avaliação do anfitrião"?', answer: 'Após participar de um grupo, você pode avaliar o anfitrião. Isso ajuda outros usuários a saberem se o anfitrião é confiável, organizado e rápido na comunicação, construindo uma comunidade mais segura.' },
    { id: 38, category: 'Pagamentos e Carteira', question: 'Posso pagar um grupo diretamente com PIX ou Cartão?', answer: 'Não. Para garantir a segurança de todos através do nosso sistema de custódia, todos os pagamentos de grupos são feitos usando o saldo da sua carteira no app. Você primeiro adiciona saldo e depois o utiliza para entrar nos grupos.' },
    { id: 39, category: 'Conta e Segurança', question: 'Como posso excluir minha conta?', answer: 'Você pode solicitar a exclusão da sua conta através da Central de Ajuda, abrindo um ticket de suporte. Lembre-se que esta ação é permanente e todos os seus dados serão apagados.' },
    { id: 40, category: 'Resolução de Problemas', question: 'O chat do grupo não está funcionando.', answer: 'Tente recarregar a página ou reiniciar o aplicativo. Se o problema persistir, pode ser uma instabilidade temporária. Por favor, reporte ao suporte se o problema durar mais de algumas horas.' },
    { id: 41, category: 'Grupos', question: 'As vagas são preenchidas automaticamente?', answer: 'Quando um membro sai, a vaga fica disponível na tela "Explorar" para que um novo usuário possa entrar. O anfitrião não precisa gerenciar isso manualmente.' },
    { id: 42, category: 'Pagamentos e Carteira', question: 'Qual o valor mínimo para adicionar à carteira?', answer: 'O valor mínimo para depósitos é de R$10,00. Isso nos ajuda a otimizar os custos de transação e manter as taxas baixas.' },
    { id: 43, category: 'Conta e Segurança', question: 'Posso alterar o e-mail da minha conta?', answer: 'A alteração de e-mail é um processo de segurança delicado. Por favor, entre em contato com o suporte para solicitar a alteração, e nossa equipe irá guiá-lo no processo.' },
    { id: 44, category: 'Resolução de Problemas', question: 'Um membro está violando as regras do grupo. O que eu faço?', answer: 'Tente resolver amigavelmente no chat. Se não for possível, denuncie o membro através do perfil dele ou reporte o ocorrido para nosso suporte, incluindo prints da conversa se possível.' },
    { id: 45, category: 'Grupos', question: 'O que significa um grupo estar "Pendente"?', answer: 'Normalmente, todos os grupos ficam "Ativos". Um status "Pendente" pode indicar um problema com a assinatura do anfitrião. Nossa equipe já está ciente e em contato para resolver.' },
    { id: 46, category: 'Primeiros Passos', question: 'O aplicativo está disponível para iPhone e Android?', answer: 'Nosso aplicativo é um PWA (Progressive Web App), o que significa que ele funciona em qualquer dispositivo com um navegador moderno. Você pode "instalar" o app na sua tela inicial para uma experiência nativa, tanto no iOS quanto no Android.' },
    { id: 47, category: 'Pagamentos e Carteira', question: 'Onde vejo meu histórico de transações?', answer: 'Na aba "Carteira", clique em "Extrato" para ver um histórico detalhado de todas as suas entradas e saídas de saldo, incluindo pagamentos de grupos, depósitos e transferências.' },
    { id: 48, category: 'Conta e Segurança', question: 'Alguém pode ver meu saldo?', answer: 'Não. Suas informações financeiras, incluindo seu saldo, são estritamente confidenciais e visíveis apenas para você.' },
    { id: 49, category: 'Resolução de Problemas', question: 'A página de um serviço de streaming (Netflix, etc.) não carrega dentro do app.', answer: 'As seções de serviços como Netflix e Disney+ são simulações para fins de descoberta de conteúdo e não um acesso direto ao serviço. Para assistir, use as credenciais do grupo no site ou app oficial do serviço.' },
    { id: 50, category: 'Grupos', question: 'Por que o número de vagas varia entre os grupos?', answer: 'O número de vagas é definido pelo anfitrião com base no plano de assinatura que ele possui. Por exemplo, um plano Premium pode permitir 4 telas simultâneas, logo, 4 vagas no grupo.' },
];