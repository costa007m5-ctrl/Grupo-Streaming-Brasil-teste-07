
export default async function handler(req, res) {
  const { MercadoPagoConfig, Payment } = await import('https://esm.sh/mercadopago@2.9.0');
  // Adiciona cabeçalhos CORS para desenvolvimento
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      console.error("Token do Mercado Pago não encontrado no ambiente.");
      return res.status(500).json({ error: "Erro de configuração do servidor de pagamento." });
    }

    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);

    const { price, email, description } = req.body;

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: "Preço inválido." });
    }
    if (!email) {
      return res.status(400).json({ error: "E-mail do pagador é obrigatório." });
    }

    const origin = req.headers.origin || 'https://meusite.com';
    const expirationDate = new Date(Date.now() + 15 * 60 * 1000).toISOString().replace('Z', '-03:00');

    const paymentData = {
      transaction_amount: price,
      description: description || "Pagamento no app",
      payment_method_id: "pix",
      payer: { email: email },
      date_of_expiration: expirationDate,
      notification_url: `${origin}/api/mp-webhook`,
    };
    
    const result = await payment.create({ body: paymentData });
    const qrCodeData = result.point_of_interaction?.transaction_data;

    if (qrCodeData?.qr_code && qrCodeData?.qr_code_base64) {
      console.log("✅ Pagamento PIX criado:", result.id);
      return res.status(200).json({
        pixKey: qrCodeData.qr_code,
        qrCodeBase64: qrCodeData.qr_code_base64,
        paymentId: result.id,
      });
    } else {
      console.error("❌ Resposta inválida do Mercado Pago para PIX:", result);
      return res.status(500).json({ error: "Resposta inválida do gateway de pagamento ao criar PIX." });
    }
  } catch (error) {
    console.error("❌ Erro ao criar pagamento PIX:", error);
    const errorMessage = error.cause?.message || "Falha ao criar pagamento PIX.";
    return res.status(500).json({ error: errorMessage });
  }
}
