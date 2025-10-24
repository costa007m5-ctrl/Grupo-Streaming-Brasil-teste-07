/**
 * Sistema de Notificações Ricas
 * Cria notificações expandidas com imagens, múltiplas linhas e botões de ação
 */

export interface RichNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
}

/**
 * Envia uma notificação rica através do Service Worker
 */
export async function sendRichNotification(options: RichNotificationOptions): Promise<void> {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    console.warn('Notificações não são suportadas neste navegador');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Permissão de notificação negada');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    const notificationOptions: any = {
      body: options.body,
      icon: options.icon || '/icon-192.png',
      badge: options.badge || '/icon-192.png',
      tag: options.tag || `notification-${Date.now()}`,
      data: options.data,
      requireInteraction: options.requireInteraction || false,
    };

    // Adiciona imagem se fornecida (suportado em Android/Chrome)
    if (options.image) {
      notificationOptions.image = options.image;
    }

    // Adiciona ações se fornecidas (suportado em Android/Chrome)
    if (options.actions && options.actions.length > 0) {
      notificationOptions.actions = options.actions;
    }

    await registration.showNotification(options.title, notificationOptions);
    console.log('✅ Notificação rica enviada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao enviar notificação rica:', error);
  }
}

/**
 * Notificação de Pagamento Recebido
 */
export async function sendPaymentNotification(amount: number, sender: string) {
  await sendRichNotification({
    title: '💰 Pagamento Recebido',
    body: `Você recebeu R$ ${amount.toFixed(2)} de ${sender}`,
    icon: '/icon-192.png',
    image: 'https://img.icons8.com/fluency/480/money-transfer.png',
    tag: 'payment',
    data: { type: 'payment', amount, sender },
    actions: [
      { action: 'view', title: '👁️ Ver Detalhes' },
      { action: 'close', title: '✖️ Fechar' }
    ],
    requireInteraction: true
  });
}

/**
 * Notificação de Novo Membro no Grupo
 */
export async function sendNewMemberNotification(groupName: string, memberName: string, memberAvatar?: string) {
  await sendRichNotification({
    title: '👥 Novo Membro no Grupo',
    body: `${memberName} entrou no grupo ${groupName}! Dê as boas-vindas! 🎉`,
    icon: memberAvatar || '/icon-192.png',
    image: 'https://img.icons8.com/fluency/480/user-group-man-man.png',
    tag: 'new-member',
    data: { type: 'new-member', groupName, memberName },
    actions: [
      { action: 'view-group', title: '👁️ Ver Grupo' },
      { action: 'send-message', title: '💬 Enviar Mensagem' },
      { action: 'close', title: '✖️ Fechar' }
    ],
    requireInteraction: false
  });
}

/**
 * Notificação de Lembrete de Pagamento
 */
export async function sendPaymentReminderNotification(groupName: string, amount: number, dueDate: string) {
  await sendRichNotification({
    title: '⏰ Lembrete de Pagamento',
    body: `Não se esqueça! Pagamento de R$ ${amount.toFixed(2)} para ${groupName} vence em ${dueDate}`,
    icon: '/icon-192.png',
    image: 'https://img.icons8.com/fluency/480/calendar.png',
    tag: 'payment-reminder',
    data: { type: 'payment-reminder', groupName, amount, dueDate },
    actions: [
      { action: 'pay-now', title: '💳 Pagar Agora' },
      { action: 'remind-later', title: '🔔 Lembrar Depois' },
      { action: 'close', title: '✖️ Fechar' }
    ],
    requireInteraction: true
  });
}

/**
 * Notificação de Nova Mensagem no Chat
 */
export async function sendChatMessageNotification(groupName: string, senderName: string, message: string, senderAvatar?: string) {
  await sendRichNotification({
    title: `💬 ${senderName} em ${groupName}`,
    body: message,
    icon: senderAvatar || '/icon-192.png',
    tag: `chat-${groupName}`,
    data: { type: 'chat', groupName, senderName, message },
    actions: [
      { action: 'reply', title: '💬 Responder' },
      { action: 'view', title: '👁️ Ver Chat' },
      { action: 'close', title: '✖️ Fechar' }
    ],
    requireInteraction: false
  });
}

/**
 * Notificação de Promoção
 */
export async function sendPromotionNotification(title: string, description: string) {
  await sendRichNotification({
    title: `🎁 ${title}`,
    body: description,
    icon: '/icon-192.png',
    image: 'https://img.icons8.com/fluency/480/gift.png',
    tag: 'promotion',
    data: { type: 'promotion', title, description },
    actions: [
      { action: 'view-promo', title: '🎁 Ver Promoção' },
      { action: 'close', title: '✖️ Fechar' }
    ],
    requireInteraction: false
  });
}

/**
 * Notificação de Novo Conteúdo Disponível
 */
export async function sendNewContentNotification(serviceName: string, contentTitle: string, contentImage?: string) {
  await sendRichNotification({
    title: `🎬 Novo em ${serviceName}`,
    body: `${contentTitle} está disponível agora!`,
    icon: '/icon-192.png',
    image: contentImage || 'https://img.icons8.com/fluency/480/movie.png',
    tag: 'new-content',
    data: { type: 'new-content', serviceName, contentTitle },
    actions: [
      { action: 'watch', title: '▶️ Assistir' },
      { action: 'save', title: '⭐ Salvar' },
      { action: 'close', title: '✖️ Fechar' }
    ],
    requireInteraction: false
  });
}
