
export default async function handler(req, res) {
  // Dynamically import to avoid top-level await issues in Vercel's build environment
  const { GoogleGenAI, Modality } = await import('https://cdn.jsdelivr.net/npm/@google/genai@latest/dist/index.js');

  // Configura os cabeçalhos CORS para permitir chamadas do seu frontend
  res.setHeader('Access-Control-Allow-Origin', '*'); // Em produção, restrinja para o seu domínio
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responde a requisições OPTIONS (pre-flight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Permite apenas o método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Chave da API Gemini não configurada no servidor." });
    }
    const ai = new GoogleGenAI({ apiKey });
    
    const { requestType } = req.body;

    switch(requestType) {
      case 'image':
      case 'image-generate': {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "O 'prompt' é obrigatório." });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        let base64ImageBytes = null;
        for (const part of response.candidates?.[0]?.content.parts || []) {
            if (part.inlineData) {
                base64ImageBytes = part.inlineData.data;
                break;
            }
        }

        if (!base64ImageBytes) throw new Error("A IA não retornou uma imagem.");
        
        return res.status(200).json({ image: base64ImageBytes });
      }

      case 'image-edit': {
        const { prompt, base64Image } = req.body;
        if (!prompt || !base64Image) return res.status(400).json({ error: " 'prompt' e 'base64Image' são obrigatórios." });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Image, mimeType: 'image/png' } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        let newBase64Image = null;
        for (const part of response.candidates?.[0]?.content.parts || []) {
            if (part.inlineData) {
                newBase64Image = part.inlineData.data;
                break;
            }
        }

        if (!newBase64Image) throw new Error("A IA não conseguiu editar a imagem.");

        return res.status(200).json({ image: newBase64Image });
      }

      case 'text':
      default: {
        const { prompt, systemInstruction, responseSchema } = req.body;
        if (!prompt) return res.status(400).json({ error: "O 'prompt' é obrigatório." });

        const modelConfig = {
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" },
        };
        if (systemInstruction) modelConfig.config.systemInstruction = systemInstruction;
        if (responseSchema) modelConfig.config.responseSchema = responseSchema;

        const response = await ai.models.generateContent(modelConfig);
        const jsonResponse = JSON.parse(response.text);

        return res.status(200).json(jsonResponse);
      }
    }
  } catch (error) {
    console.error("Erro na Serverless Function:", error);
    let errorMessage = error.message || "Erro ao se comunicar com a API Gemini.";
    if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('excedeu sua cota') || errorMessage.toLowerCase().includes('rate limit')) {
        errorMessage = 'Você atingiu o limite de requisições por minuto. Por favor, aguarde um pouco antes de tentar novamente.';
    }
    return res.status(500).json({ error: errorMessage });
  }
}
