// sample-structuring-script.js
const fs = require('fs');

const rawData = require('./converted.json');
const structuredData = [];

rawData.data.forEach(instance => {
    structuredData.push({
        prompt: `Recommend a GPU instance for ${instance.gpu_description} workloads with:
        - Budget: ₹${instance.price_per_hour}/hour
        - Region: ${instance.region}
        - vCPUs: ${instance.vcpus}
        - RAM: ${instance.ram}GB`,
        
        completion: `Best Option: ${instance.resource_name}
        GPU: ${instance.gpu_description}
        Price: ₹${instance.price_per_hour}/hour (On-demand)
        Specs: ${instance.vcpus}vCPUs + ${instance.ram}GB RAM
        Region: ${instance.region}`
    });
});

fs.writeFileSync('training-data.jsonl', structuredData.map(entry => JSON.stringify(entry)).join('\n'));