// Vercel serverless function — proxies CV/portfolio extraction to Anthropic.
// The ANTHROPIC_API_KEY env var is set in Vercel dashboard and never exposed to the browser.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no servidor.' });
  }

  try {
    const { files, prompt } = req.body || {};

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Nenhum ficheiro recebido.' });
    }
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt em falta.' });
    }
    if (files.length > 5) {
      return res.status(400).json({ error: 'Demasiados ficheiros (máx. 5).' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: [...files, { type: 'text', text: prompt }],
        }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(response.status).json({
        error: data?.error?.message || 'Erro na análise.',
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Extraction handler error:', err);
    return res.status(500).json({ error: 'Erro inesperado no servidor.' });
  }
}

// Increase body size limit for base64-encoded PDFs (default 1MB is too small)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};
