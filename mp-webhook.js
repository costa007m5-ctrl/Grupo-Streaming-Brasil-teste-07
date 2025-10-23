import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from '@supabase/supabase-js';

// Inicializa o cliente admin do Supabase.
// Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente do seu projeto Vercel.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS é tratado pelo vercel.json
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { type, data } = req.body;
  
  if (type !== 'payment' || !data?.id) {
    // Não é uma notificação de pagamento que nos interessa, mas respondemos OK para o MP.
    return res.status(200).send('ok');
  }

  const paymentId = data.id.toString();

  try {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      console.error("Webhook MP: Token de acesso não configurado.");
      return res.status(500).json({ error: "Configuração do servidor incompleta." });
    }
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);
    
    // 1. Obter detalhes do pagamento do Mercado Pago
    const paymentInfo = await payment.get({ id: paymentId });

    if (paymentInfo?.status !== 'approved') {
      console.log(`Pagamento ${paymentId} não está aprovado. Status: ${paymentInfo.status}`);
      return res.status(200).send('ok');
    }

    // 2. Verificar se a transação já foi processada para evitar duplicidade
    const { data: existingTransaction, error: findError } = await supabaseAdmin
      .from('transactions')
      .select('id')
      .eq('metadata->>payment_id', paymentId)
      .maybeSingle();

    if (findError) {
      console.error(`Erro ao verificar transação existente para paymentId ${paymentId}:`, findError);
      return res.status(500).json({ error: 'Erro de banco de dados ao verificar transação.' });
    }
    
    if (existingTransaction) {
      console.log(`Transação ${paymentId} já processada.`);
      return res.status(200).send('ok');
    }
    
    const payerEmail = paymentInfo.payer?.email;
    const amount = paymentInfo.transaction_amount;

    if (!payerEmail || !amount) {
      console.error(`Email do pagador ou valor não encontrado no pagamento ${paymentId}:`, paymentInfo);
      return res.status(400).json({ error: 'Dados do pagamento incompletos' });
    }
    
    // 3. Encontrar o perfil do usuário pelo email.
    // Primeiro, busca o usuário na tabela auth.users pelo email.
    // A chave de serviço (service_role_key) tem permissão para isso.
    const { data: user, error: userError } = await supabaseAdmin.from('users').select('id').eq('email', payerEmail).single();
    
    if (userError || !user) {
        console.error(`Usuário com email ${payerEmail} não encontrado:`, userError);
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Com o ID do usuário, busca o perfil correspondente
    const { data: profile, error: profileError } = await supabaseAdmin.from('profiles').select('id, balance').eq('id', user.id).single();
        
    if (profileError || !profile) {
      console.error(`Perfil para usuário ${user.id} não encontrado:`, profileError);
      return res.status(404).json({ error: 'Perfil do usuário não encontrado' });
    }
    
    // 4. Inserir a nova transação e atualizar o saldo do usuário.
    // Idealmente, isso seria uma transação atômica (usando uma função RPC no Supabase).
    // Por simplicidade, faremos em duas etapas.

    // Insere o registro da transação
    const { error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: profile.id,
        amount: amount,
        type: 'deposit',
        status: 'completed',
        description: `Depósito via PIX`,
        metadata: {
          payment_provider: 'mercadopago',
          payment_id: paymentId,
        }
      });
      
    if (transactionError) {
      console.error(`Erro ao inserir transação para usuário ${profile.id}:`, transactionError);
      return res.status(500).json({ error: 'Erro ao registrar transação' });
    }

    // Atualiza o saldo do usuário
    const newBalance = (Number(profile.balance) || 0) + Number(amount);
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', profile.id);

    if (updateError) {
      console.error(`Erro ao atualizar saldo para usuário ${profile.id}:`, updateError);
      // Neste ponto, a transação foi registrada mas o saldo falhou. Requer atenção manual/reconciliação.
      return res.status(500).json({ error: 'Erro ao atualizar saldo do usuário' });
    }

    console.log(`✅ Saldo do usuário ${profile.id} atualizado para ${newBalance}.`);
    res.status(200).send('ok');

  } catch (error) {
    console.error('Erro fatal no processamento do webhook:', error);
    const errorMessage = error.cause?.message || 'Erro interno do servidor';
    res.status(500).json({ error: `Erro ao processar webhook: ${errorMessage}` });
  }
}