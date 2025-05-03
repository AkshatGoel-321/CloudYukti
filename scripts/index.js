// save as convert-currency.js
const fs = require('fs');
const path = require('path');

// Get arguments from command line
const [inputFile, usdToInrRate] = process.argv.slice(2);

if (!inputFile || !usdToInrRate) {
    console.error('Usage: node convert-currency.js <input-file> <usd-to-inr-rate>');
    process.exit(1);
}
const osSet = new Set();

// Read input file
const rawData = fs.readFileSync(path.resolve(__dirname, inputFile));
const originalData = JSON.parse(rawData);
const noOfOs = 0 ;
// Process data
const convertedData = originalData.data.map(instance => {
    if (instance.operating_system) {
        osSet.add(instance.operating_system);
    }
    if (instance.currency === 'USD' &&
        instance.country === 'india' &&
        (instance.region === 'mumbai' || instance.region === 'delhi' || instance.region === 'noida')) {    
        // Convert all price fields
        Object.keys(instance).forEach(key => {
            if (key.startsWith('price_')) {
                instance[key] = parseFloat((instance[key] * usdToInrRate).toFixed(2));
            }
        });
        instance.currency = 'INR';
    }
    return instance;
});
// Log distinct OS types
console.log('Distinct OS types:', Array.from(osSet));
console.log('Number of distinct OS types:', osSet.size);

// Create new object with converted data
const output = {
    ...originalData,
    data: convertedData
};

// Write output file
fs.writeFileSync(
    path.resolve(__dirname, 'converted.json'),
    JSON.stringify(output, null, 2)
);

console.log('Conversion complete. Saved to converted.json');