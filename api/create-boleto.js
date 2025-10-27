export default async function handler(req, res) {
  const { MercadoPagoConfig, Payment } = await import("https://esm.sh/mercadopago");
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

    const { price, description, payerInfo } = req.body;
    
    // Validação dos dados recebidos
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: "Preço inválido." });
    }
    if (!payerInfo || !payerInfo.email || !payerInfo.fullName || !payerInfo.cpf || !payerInfo.address) {
      return res.status(400).json({ error: "Informações do pagador estão incompletas." });
    }
    
    const [firstName, ...lastNameParts] = payerInfo.fullName.trim().split(' ');
    const lastName = lastNameParts.join(' ').trim() || firstName;
    const cleanCpf = payerInfo.cpf.replace(/\D/g, '');

    // Data de expiração para o boleto (3 dias a partir de hoje)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);

    const paymentData = {
      transaction_amount: price,
      description: description || "Pagamento por Boleto",
      payment_method_id: "boleto",
      payer: {
        email: payerInfo.email,
        first_name: firstName,
        last_name: lastName,
        identification: {
          type: "CPF",
          number: cleanCpf,
        },
        address: {
          zip_code: payerInfo.address.cep.replace(/\D/g, ''),
          street_name: payerInfo.address.street,
          street_number: payerInfo.address.number,
          neighborhood: payerInfo.address.neighborhood,
          city: payerInfo.address.city,
          federal_unit: payerInfo.address.state,
        },
      },
      date_of_expiration: expirationDate.toISOString(),
    };
    
    const result = await payment.create({ body: paymentData });
    const transactionData = result.transaction_details;
    const barcode = result.barcode;

    if (transactionData?.external_resource_url && barcode?.content) {
      console.log("✅ Boleto criado:", result.id);
      return res.status(200).json({
        boletoUrl: transactionData.external_resource_url,
        barcode: barcode.content,
        paymentId: result.id,
      });
    } else {
      console.error("❌ Resposta inválida do Mercado Pago para Boleto:", result);
      return res.status(500).json({ error: "Resposta inválida do gateway de pagamento ao criar Boleto." });
    }
  } catch (error) {
    console.error("❌ Erro detalhado ao criar pagamento Boleto:", JSON.stringify(error, null, 2));
    
    let specificMessage = "Falha ao criar pagamento por Boleto.";
    
    // Tenta extrair a mensagem da estrutura de erro do SDK do Mercado Pago
    const apiErrorData = error.data || error.cause?.api_response?.data;

    if (apiErrorData) {
      // A lista 'cause' geralmente contém os erros de validação mais específicos
      if (Array.isArray(apiErrorData.cause) && apiErrorData.cause.length > 0) {
        specificMessage = apiErrorData.cause.map(c => c.description || JSON.stringify(c)).join('; ');
      } else if (apiErrorData.message) {
        specificMessage = apiErrorData.message;
      }
    } else if (error.message) {
      // Fallback para a mensagem de erro genérica do objeto de erro
      specificMessage = error.message;
    }

    return res.status(500).json({ error: specificMessage });
  }
}