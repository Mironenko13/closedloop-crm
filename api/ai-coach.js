const Anthropic = require('@anthropic-ai/sdk');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' });
  }

  const { trade, stage, notes, value, riskFlags, name, contact, role, industry } = req.body;

  const client = new Anthropic({ apiKey });

  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 700,
      system: `You are an expert roofing business coach for a company operating in central Pennsylvania's Susquehanna Valley (Union, Snyder, Northumberland, Montour, Columbia, and Lycoming counties). You understand PA-specific roofing: ice & water shield requirements, steep-pitch challenges on older homes, slate roof repairs, standing seam metal in rural areas, insurance claims with Erie/State Farm/Nationwide, seasonal weather windows (April–November prime season, freeze risk Oct–March), material sourcing from local suppliers like Boise Cascade and ABC Supply, and the mix of residential, commercial, agricultural, and Mennonite community work that defines the region. Given a job's details, give specific, actionable advice. Keep it to 3-5 bullet points. Be direct and practical — this is for a busy roofer, not a boardroom.`,
      messages: [{
        role: 'user',
        content: `You are advising on this ${trade} roofing job in central PA:
- Customer: ${name}${industry ? ` (${industry})` : ''}
- Contact: ${contact}${role ? `, ${role}` : ''}
- Job Value: ${value}
- Current Stage: ${stage}
- Job Type: ${trade}
- Notes: ${notes || 'None'}${riskFlags ? `\n- Risk Flags: ${riskFlags}` : ''}

Give 4 specific action items to move this job forward from the ${stage} stage. Requirements:
1. Each item must be specific to the ${stage} stage of a ${trade} roofing job
2. Reference ${contact} or the customer name directly in at least 2 items
3. Include concrete operational details: materials, permits, crew scheduling, weather windows, or PA-specific considerations
4. Keep each item under 3 sentences — clear and immediately actionable

Format as numbered action items, no preamble.`,
      }],
    });

    return res.status(200).json({ text: msg.content[0].text });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Unknown error occurred' });
  }
}
