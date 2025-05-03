import { NextApiRequest, NextApiResponse } from 'next';

const gpuInstances = [
  { resource_class: 'T4', vcpus: 4, ram: 16, price_per_hour: 0.35, region: 'us-central' },
  { resource_class: 'A100', vcpus: 8, ram: 40, price_per_hour: 2.48, region: 'us-west' },
  { resource_class: 'L4', vcpus: 8, ram: 32, price_per_hour: 1.20, region: 'us-east' },
  { resource_class: 'V100', vcpus: 8, ram: 32, price_per_hour: 1.80, region: 'asia-south' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { gpu, workload, budget } = req.body;

    const selected = gpuInstances.find(g => g.resource_class.toLowerCase() === gpu.toLowerCase());
    if (!selected) return res.status(404).json({ error: 'GPU not found' });

    const suggestions = gpuInstances.filter(inst =>
      inst.price_per_hour < selected.price_per_hour &&
      inst.vcpus >= selected.vcpus - 2 &&
      inst.ram >= selected.ram - 8 &&
      (!budget || inst.price_per_hour <= parseFloat(budget))
    ).map(inst => ({
      gpu: inst.resource_class,
      price_per_hour: inst.price_per_hour,
      region: inst.region,
      why: `Cheaper for ${workload} with comparable compute.`,
    }));

    return res.status(200).json({ selected, suggestions });
  }
  res.status(405).end();
}
