export default async function handler(req, res) {
  const { MercadoPagoConfig, Preference } = await import("https://esm.sh/mercadopago");
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
    const { price, description } = req.body;

    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: "Preço inválido." });
    }
    
    const origin = req.headers.origin;
    if (!origin) {
      return res.status(400).json({ error: "Origem da requisição desconhecida." });
    }

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [{
          title: description || "Pagamento no app",
          quantity: 1,
          currency_id: "BRL",
          unit_price: price,
        }],
        back_urls: {
          success: `${origin}?payment=success&amount=${price}`,
          failure: `${origin}?payment=failure`,
        },
        auto_return: "approved",
      },
    });

    if (result?.init_point) {
        console.log("✅ Preferência criada:", result.id);
        return res.status(200).json({ init_point: result.init_point });
    } else {
        console.error("❌ Resposta inválida do Mercado Pago:", result);
        return res.status(500).json({ error: "Resposta inválida do gateway de pagamento." });
    }
    
  } catch (error) {
    console.error("❌ Erro ao criar preferência:", error);
    const errorMessage = error.cause?.message || "Falha ao criar preferência de pagamento.";
    return res.status(500).json({ error: errorMessage });
  }
}