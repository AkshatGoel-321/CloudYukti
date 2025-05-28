/* eslint-disable prefer-const */
// import { auth } from '@/auth';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://dev-portal.openstack.acecloudhosting.com/api/v1/pricing?is_gpu=true&resource=instances';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY!;

type GPUOption = {
  country: string;
  operating_system: string;
  resource_class: string;
  resource_name: string;
  vcpus: number;
  ram: number;
  price_per_hour: number;
  price_per_month: number;
  price_per_spot: number;
  gpu_description: string;
  region: string;
};

type RecommendationResponse = {
  gpu_name: string;
  gpu_description: string;
  prices: {
    hourly: number;
    monthly: number;
    spot: number;
  };
  specs: {
    vcpus: number;
    ram: number;
  };
//   reasoning: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth(); // Get session using the auth() helper
    console.log("API POST - Session from auth():", JSON.stringify(session, null, 2));

    // **CRITICAL: Uncomment and use this authorization check**
    if (!session || !session.user?._id) {
      console.log("API POST - Unauthorized: No session or user._id found.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { os, region, cpus, ram, budget,datasetSize } = await req.json();

    if (!os || !region || !cpus || !ram || !budget || !datasetSize) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // 2. Fetch GPU options from API
    const apiUrl = `${API_URL}&region=${region}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch GPU options' }, { status: 500 });
    }

    // Debug: Log initial data
    console.log('Initial GPU options:', data.data?.length);

    // 3. Filter GPU options with logging
    const gpuOptions: GPUOption[] = Array.isArray(data.data) ? data.data : [];
    
    // Separate filters with counts for debugging
    const osFiltered = gpuOptions.filter(gpu => {
      const matchesOS = gpu.operating_system?.toLowerCase().includes(os.toLowerCase());
      if (!matchesOS) console.log(`OS mismatch: ${gpu.operating_system} vs ${os}`);
      return matchesOS;
    });
    console.log('After OS filter:', osFiltered.length);

    const regionFiltered = osFiltered.filter(gpu => {
      const normalizedRegion = region.toLowerCase().includes('mum') ? 'mumbai' : 
                             region.toLowerCase().includes('del') ? 'delhi' : 
                             region.toLowerCase().includes('noi') ? 'noida' : region;
      const matchesRegion = gpu.region.toLowerCase() === normalizedRegion.toLowerCase();
      if (!matchesRegion) console.log(`Region mismatch: ${gpu.region} vs ${normalizedRegion}`);
      return matchesRegion;
    });
    console.log('After region filter:', regionFiltered.length);

    const specsFiltered = regionFiltered.filter(gpu => {
      const matchesCPUs = gpu.vcpus >= cpus;
      const matchesRAM = gpu.ram >= ram;
      if (!matchesCPUs) console.log(`CPU mismatch: ${gpu.vcpus} vs ${cpus}`);
      if (!matchesRAM) console.log(`RAM mismatch: ${gpu.ram} vs ${ram}`);
      return matchesCPUs && matchesRAM;
    });
    console.log('After specs filter:', specsFiltered.length);

    const filteredGPUs = specsFiltered.filter(gpu => {
      const withinBudget = gpu.price_per_month <= budget;
      if (!withinBudget) console.log(`Budget mismatch: ${gpu.price_per_month} vs ${budget}`);
      return withinBudget;
    });
    console.log('Final filtered count:', filteredGPUs.length);

    if (filteredGPUs.length === 0) {
      return NextResponse.json({ 
        error: 'No GPUs found matching your criteria',
        debug: {
          totalOptions: gpuOptions.length,
          afterOsFilter: osFiltered.length,
          afterRegionFilter: regionFiltered.length,
          afterSpecsFilter: specsFiltered.length,
          afterBudgetFilter: filteredGPUs.length
        }
      }, { status: 200 });
    }

    // 4. Create prompt for LLM
    const prompt = `
You are a professional cloud infrastructure consultant.

A user is looking for the best GPU instance that meets their needs. They have NOT specified a pricing model preference (hourly, monthly, or spot). Their ONLY budget constraint is a **monthly budget** of $${budget}.

Here are the available GPU options:
${filteredGPUs.map(gpu => `
- GPU: ${gpu.gpu_description}
  Specs: ${gpu.vcpus} vCPUs, ${gpu.ram}GB RAM
  Prices: Hourly: $${gpu.price_per_hour}, Monthly: $${gpu.price_per_month}, Spot: $${gpu.price_per_spot}
  OS: ${gpu.operating_system}, Region: ${gpu.region}
`).join('\n')}

User technical requirements:
- Operating System: ${os}
- Minimum vCPUs: ${cpus}
- Minimum RAM: ${ram} GB
- Dataset Size: ${datasetSize} GB
- Budget: $${budget} per month

✅ Recommend the best option based on:
1. Value for money within the monthly budget (even if spot/hourly options offer better deal).
2. Performance: How well the GPU fits their technical needs.
3. Suitability of pricing type (e.g. when to prefer spot, hourly, or monthly).
4. Any reliability considerations if recommending spot pricing.
5. Avoid recommending multiple — choose the **single best GPU**.

📌 Format your answer exactly like:
GPU_NAME: [Name]
DESCRIPTION: [Detailed description]
PRICING:
- Hourly: $[hourly_rate]
- Monthly: $[monthly_rate]
- Spot: $[spot_rate]
SPECS:
- vCPUs: [number]
- RAM: [number] GB

`;

    // 5. Get recommendation from Groq
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a GPU infrastructure advisor.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1024
      })
    });

    if (!groqResponse.ok) {
      return NextResponse.json({ error: 'Failed to get recommendation' }, { status: 500 });
    }

    // 6. Parse LLM response
    const llmData = await groqResponse.json();
    const recommendation = llmData.choices[0].message.content;

    // 7. Format and return response
    const parsedRecommendation = parseRecommendation(recommendation);
    return NextResponse.json({ recommendation: parsedRecommendation });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Service temporarily unavailable' 
    }, { status: 503 });
  }
}

function parseRecommendation(text: string): RecommendationResponse {
  const lines = text.split('\n');
  let result: Partial<RecommendationResponse> = {};

  for (const line of lines) {
    if (line.startsWith('GPU_NAME:')) result.gpu_name = line.split(':')[1].trim();
    if (line.startsWith('DESCRIPTION:')) result.gpu_description = line.split(':')[1].trim();
    if (line.startsWith('PRICING:')) {
      result.prices = {
        hourly: parseFloat(lines[lines.indexOf(line) + 1].split('$')[1]),
        monthly: parseFloat(lines[lines.indexOf(line) + 2].split('$')[1]),
        spot: parseFloat(lines[lines.indexOf(line) + 3].split('$')[1])
      };
    }
    if (line.startsWith('SPECS:')) {
      result.specs = {
        vcpus: parseInt(lines[lines.indexOf(line) + 1].split(':')[1]),
        ram: parseInt(lines[lines.indexOf(line) + 2].split(':')[1])
      };
    }
   
  }

  return result as RecommendationResponse;
}
