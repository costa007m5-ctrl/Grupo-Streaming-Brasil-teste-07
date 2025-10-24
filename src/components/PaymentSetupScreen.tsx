import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, DocumentDuplicateIcon } from '../components/Icons';

const Header: React.FC<{ onBack: () => void; }> = ({ onBack }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4">
        <div className="relative flex justify-center items-center text-gray-800 w-full h-8">
            <button onClick={onBack} className="absolute left-0 p-2 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Configurar Pagamentos</h1>
        </div>
    </header>
);

const PIX_API_CODE = `import { MercadoPagoConfig, Payment } from "mercadopago";

export default async function handler(req, res) {
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
      notification_url: \`\${origin}/api/mp-webhook\`,
    };
    
    const result = await payment.create({ body: paymentData });
    const qrCodeData = result.point_of_interaction?.transaction_data;

    if (qrCodeData?.qr_code && qrCodeData?.qr_code_base64) {
      return res.status(200).json({
        pixKey: qrCodeData.qr_code,
        qrCodeBase64: qrCodeData.qr_code_base64,
        paymentId: result.id,
      });
    } else {
      return res.status(500).json({ error: "Resposta inválida do gateway de pagamento ao criar PIX." });
    }
  } catch (error) {
    const errorMessage = error.cause?.message || "Falha ao criar pagamento PIX.";
    return res.status(500).json({ error: errorMessage });
  }
}`;

const PREFERENCE_API_CODE = `import { MercadoPagoConfig, Preference } from "mercadopago";

export default async function handler(req, res) {
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
          success: \`\${origin}?payment=success&amount=\${price}\`,
          failure: \`\${origin}?payment=failure\`,
        },
        auto_return: "approved",
      },
    });

    if (result?.init_point) {
        return res.status(200).json({ init_point: result.init_point });
    } else {
        return res.status(500).json({ error: "Resposta inválida do gateway de pagamento." });
    }
  } catch (error) {
    const errorMessage = error.cause?.message || "Falha ao criar preferência de pagamento.";
    return res.status(500).json({ error: errorMessage });
  }
}`;

const WEBHOOK_API_CODE = `import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from '@supabase/supabase-js';

// Inicializa o cliente admin do Supabase.
// Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente do seu projeto Vercel.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { type, data } = req.body;
  if (type === 'payment' && data?.id) {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
        return res.status(500).json({ error: "Configuração do servidor incompleta." });
    }
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);
    
    try {
      const paymentInfo = await payment.get({ id: data.id });
      if (paymentInfo?.status === 'approved') {
        // LÓGICA PARA ATUALIZAR SEU BANCO DE DADOS AQUI
        // Ex: Adicionar saldo ao usuário correspondente ao 'paymentInfo.payer.email'
      }
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao processar webhook' });
    }
  }
  res.status(200).send('ok');
}`;


const CORS_CODE = `{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
      ]
    }
  ]
}`;

const CodeBlock: React.FC<{ title: string; code: string; filename: string; step: number; path: string; }> = ({ title, code, filename, step, path }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const handleCopy = () => {
        if (copySuccess) return;
        navigator.clipboard.writeText(code).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Falhou!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-gray-800">{step}. {title}</h2>
            <p className="text-sm text-gray-600">
                Crie um arquivo chamado <code className="bg-gray-200 text-gray-700 px-1 py-0.5 rounded-md">{filename}</code> no diretório <code className="bg-gray-200 text-gray-700 px-1 py-0.5 rounded-md">{path}</code> da sua aplicação backend.
            </p>
            <div className="bg-gray-800 text-white rounded-xl overflow-hidden relative">
                <button onClick={handleCopy} className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-1 px-2 rounded-md flex items-center space-x-1">
                    <DocumentDuplicateIcon className="w-4 h-4"/>
                    <span>{copySuccess || 'Copiar'}</span>
                </button>
                <pre className="text-sm whitespace-pre-wrap p-4 overflow-x-auto">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}

interface PaymentSetupScreenProps {
    onBack: () => void;
    onSaveVercelUrl: (url: string) => void;
    currentVercelUrl: string;
}

const PaymentSetupScreen: React.FC<PaymentSetupScreenProps> = ({ onBack, onSaveVercelUrl, currentVercelUrl }) => {
    const [urlInput, setUrlInput] = useState('');
    const [mpStatus, setMpStatus] = useState<'checking' | 'configured' | 'unconfigured' | 'error' | 'idle'>('idle');


    useEffect(() => {
        setUrlInput(currentVercelUrl);
        if (currentVercelUrl) {
            checkMpStatus(currentVercelUrl);
        }
    }, [currentVercelUrl]);

    const checkMpStatus = async (url: string) => {
        setMpStatus('checking');
        try {
            const response = await fetch(`${url}/api/check-mp-config`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`A verificação de status falhou: ${response.status} ${errorText}`);
            }
            const data = await response.json();
            if (data.isMercadoPagoConfigured) {
                setMpStatus('configured');
            } else {
                setMpStatus('unconfigured');
            }
        } catch (error) {
            console.error("Failed to check MP status:", error);
            setMpStatus('error');
        }
    };
    
    const handleSaveAndCheck = (url: string) => {
        const formattedUrl = url.trim