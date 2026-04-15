const Anthropic = require('@anthropic-ai/sdk');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' });
  }

  const { tradeName } = req.body;
  if (!tradeName) {
    return res.status(400).json({ error: 'tradeName is required' });
  }

  const client = new Anthropic({ apiKey });

  try {
    const prompt = `You are configuring a roofing CRM for a "${tradeName}" specialty within a roofing business operating in central Pennsylvania.\nReturn ONLY valid JSON with no markdown, no explanation, no backticks. Format:\n{\n  "checklist": ["step 1", "step 2", ...],\n  "pipeline": ["Stage 1", "Stage 2", ...]\n}`;
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });
    const raw = msg.content[0].text.trim();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.checklist) || !Array.isArray(parsed.pipeline)) {
      throw new Error('bad shape');
    }
    return res.status(200).json(parsed);
  } catch {
    return res.status(500).json({ error: "Couldn't generate that job type — try being more specific." });
  }
}
