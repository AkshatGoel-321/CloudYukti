// lib/fetchAceCloudData.ts
export async function fetchAceCloudData(region: string) {
    const res = await fetch(`https://api.acecloudgpu.com/v1/instances?region=${region}`);
    const data = await res.json();
  
    return data.instances.map((item: any) => ({
      name: item.gpu,
      cpu: item.cpu,
      ram: item.ram,
      price_per_hour: parseFloat(item.price_per_hour),
      price_per_month: parseFloat(item.price_per_month),
      price_per_spot: parseFloat(item.price_per_spot),
      region: item.region,
    }));
  }
  