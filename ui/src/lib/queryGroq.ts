// lib/queryGroq.ts
import { UserInput, GPUOption } from '@/types';

const apiKey = process.env.OPENROUTER_API_KEY!;
const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

export async function queryGroq(userInput: UserInput, gpus: GPUOption[]) {
  const formattedOptions = gpus.map((gpu, i) => 
    `${i + 1}. ${gpu.name} - ${gpu.cpu}, ${gpu.ram} RAM, $${gpu.price_per_month}/month`
  ).join('\n');

  const prompt = `
A user wants to use the following setup:
- Requirement: ${userInput.modelType}
- Dataset Size: ${userInput.datasetSize}
- Monthly Budget: $${userInput.budget}
- Region: ${userInput.region}

Here are some available GPU options:
${formattedOptions}

Based on their budget and requirement, which GPU option is best and why?
Provide a brief recommendation with cost reasoning.
`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-1',
      messages: [
        { role: 'system', content: 'You are a GPU selection assistant for AI workloads.' },
        { role: 'user', content: prompt }
      ],
    })
  });

  const data = await response.json();
  return {
    bestOption: gpus[0].name,
    reasoning: data.choices[0].message.content,
    costDetails: gpus[0],
  };
}
