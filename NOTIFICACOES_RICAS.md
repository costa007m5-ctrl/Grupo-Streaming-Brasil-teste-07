# 🔔 Sistema de Notificações Ricas - GSB

## O que são Notificações Ricas?

As notificações ricas são notificações expandidas que aparecem no seu celular com:
- 📸 **Imagens grandes** - Imagens expandidas que chamam atenção
- 📝 **Múltiplas linhas de texto** - Informações completas sem precisar abrir o app
- 🔘 **Botões de ação** - Ações rápidas direto na notificação
- 🎨 **Design atraente** - Visual moderno e profissional

## Tipos de Notificações Disponíveis

### 💰 Pagamento Recebido
Receba notificações quando alguém transferir dinheiro para você.

**Informações exibidas:**
- Valor recebido
- Nome de quem enviou
- Imagem do dinheiro em movimento

**Ações disponíveis:**
- 👁️ Ver Detalhes
- ✖️ Fechar

---

### 👥 Novo Membro no Grupo
Seja notificado quando alguém entrar no seu grupo de streaming.

**Informações exibidas:**
- Nome do novo membro
- Nome do grupo
- Avatar do membro
- Imagem de grupo

**Ações disponíveis:**
- 👁️ Ver Grupo
- 💬 Enviar Mensagem
- ✖️ Fechar

---

### ⏰ Lembrete de Pagamento
Nunca mais esqueça de pagar suas assinaturas!

**Informações exibidas:**
- Nome do grupo/serviço
- Valor a pagar
- Data de vencimento
- Imagem de calendário

**Ações disponíveis:**
- 💳 Pagar Agora
- 🔔 Lembrar Depois
- ✖️ Fechar

---

### 💬 Nova Mensagem no Chat
Receba mensagens do chat do grupo em tempo real.

**Informações exibidas:**
- Nome de quem enviou
- Nome do grupo
- Mensagem completa
- Avatar do remetente

**Ações disponíveis:**
- 💬 Responder
- 👁️ Ver Chat
- ✖️ Fechar

---

### 🎁 Promoções
Fique por dentro das ofertas especiais!

**Informações exibidas:**
- Título da promoção
- Descrição completa
- Imagem de presente

**Ações disponíveis:**
- 🎁 Ver Promoção
- ✖️ Fechar

---

### 🎬 Novo Conteúdo
Seja avisado quando novos filmes/séries chegarem aos streamings.

**Informações exibidas:**
- Nome do serviço (Netflix, Disney+, etc.)
- Título do conteúdo
- Imagem/poster do conteúdo

**Ações disponíveis:**
- ▶️ Assistir
- ⭐ Salvar
- ✖️ Fechar

---

## Como Testar

1. Abra o app GSB
2. Faça login (se ainda não estiver logado)
3. Vá para **Perfil** → **Notificações**
4. Na seção "Testar Notificações Ricas", clique em qualquer botão:
   - 💰 Pagamento
   - 👥 Novo Membro
   - ⏰ Lembrete
   - 💬 Mensagem
   - 🎁 Promoção
   - 🎬 Conteúdo

5. Verifique sua barra de notificações do Android
6. Expanda a notificação para ver a imagem grande
7. Teste os botões de ação

## Recursos Técnicos

### Para Desenvolvedores

O sistema de notificações ricas foi implementado usando:

- **Firebase Cloud Messaging (FCM)** - Para envio de push notifications
- **Service Worker API** - Para receber notificações em background
- **Notification API** - Para criar notificações ricas

### Funções Disponíveis

```typescript
import {
  sendPaymentNotification,
  sendNewMemberNotification,
  sendPaymentReminderNotification,
  sendChatMessageNotification,
  sendPromotionNotification,
  sendNewContentNotification
} from './lib';

// Exemplo: Enviar notificação de pagamento
await sendPaymentNotification(150.00, 'João Silva');

// Exemplo: Enviar notificação de novo membro
await sendNewMemberNotification('Netflix Premium', 'Maria Santos');
```

### Personalização

Você pode criar notificações customizadas usando a função `sendRichNotification`:

```typescript
import { sendRichNotification } from './lib';

await sendRichNotification({
  title: 'Seu Título',
  body: 'Sua mensagem aqui',
  icon: '/icon-192.png',
  image: 'https://exemplo.com/imagem.jpg',
  actions: [
    { action: 'action1', title: 'Ação 1' },
    { action: 'action2', title: 'Ação 2' }
  ],
  requireInteraction: true
});
```

## Compatibilidade

✅ Android (Chrome, Samsung Internet, Firefox)
✅ Windows (Chrome, Edge, Firefox)
✅ macOS (Chrome, Edge, Firefox, Safari 16+)
⚠️ iOS - Suporte limitado (apenas Safari 16.4+ e PWA instalado)

## Dicas

1. **Permitir notificações** - Sempre aceite quando o app pedir permissão
2. **Não perturbe** - Configure o modo "Não Perturbe" do seu celular se não quiser ser incomodado
3. **Configurar preferências** - Use as opções em Perfil → Notificações para escolher quais tipos receber
4. **Testar primeiro** - Use os botões de teste para ver como ficam as notificações

## Suporte

Se as notificações não estiverem funcionando:

1. Verifique se você deu permissão de notificações para o app
2. Verifique se o "Não Perturbe" não está ativado
3. Verifique as configurações de notificação do sistema
4. Tente reinstalar o PWA (se instalado)
5. Limpe o cache e os dados do navegador

---

**Desenvolvido com ❤️ pela equipe GSB**
