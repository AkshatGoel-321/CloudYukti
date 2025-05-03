import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;

  const GROK_API_URL = "https://api.groq.com/openai/v1/chat/completions"; // Replace with actual
  const GROK_API_KEY = process.env.GROK_API_KEY!;

  const response = await fetch(GROK_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "You are an expert GPU cloud cost optimizer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'No response.';

  res.status(200).json({ reply });
}
