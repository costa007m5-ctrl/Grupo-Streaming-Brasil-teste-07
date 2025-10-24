export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Check if the token exists and is not a placeholder value
  const isConfigured = !!process.env.MP_ACCESS_TOKEN && !process.env.MP_ACCESS_TOKEN.includes('COLOQUE_AQUI');

  res.status(200).json({ isMercadoPagoConfigured: isConfigured });
}
