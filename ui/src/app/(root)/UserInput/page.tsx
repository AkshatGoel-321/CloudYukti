'use client';

import React, { useState } from 'react';

export default function Page() {
  const [formData, setFormData] = useState({
    os: '',
    budget: '',
    country: '',
    region: '',
    cpus: '',
    ram: '',
    vram: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'country' ? { region: '' } : {}), // Reset region if country changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget),
          cpus: parseInt(formData.cpus),
          ram: parseFloat(formData.ram),
          vram: parseFloat(formData.vram),
        }),
      });

      const data = await res.json();
      console.log('API Response:', data); // Add this line for debugging

      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
    } catch (err: any) {
      console.error('Error:', err); // Add this line for debugging
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const regionOptions =
  formData.country === 'india'
    ? [
        { label: 'Mumbai', value: 'ap-south-mum-1' },
        { label: 'Delhi', value: 'ap-south-del-1' },
        { label: 'Noida', value: 'ap-south-noi-1' },
      ]
    : formData.country === 'us'
    ? [
        { label: 'Atlanta', value: 'us-east-at-1' },
      ]
    : [];

  return (
    <div className="p-6 max-w-xl min-h-screen mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Hardware Recommender</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded-md">

        {/* OS */}
        <select name="os" value={formData.os} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">Select Operating System</option>
          <option value="windows">Windows</option>
          <option value="linux">Linux</option>
        </select>

        {/* Budget */}
        <input
          type="number"
          name="budget"
          placeholder="Budget (USD)"
          value={formData.budget}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Country */}
        <select name="country" value={formData.country} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">Select Country</option>
          <option value="india">India</option>
          <option value="us">US</option>
        </select>

        {/* Region */}
        <select
  name="region"
  value={formData.region}
  onChange={handleChange}
  required
  className="w-full p-2 border rounded"
>
  <option value="">Select Region</option>
  {regionOptions.map(({ label, value }) => (
    <option key={value} value={value}>
      {label}
    </option>
  ))}
</select>


        {/* CPUs */}
        <input
          type="number"
          name="cpus"
          placeholder="Number of CPUs"
          value={formData.cpus}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* RAM */}
        <input
          type="number"
          name="ram"
          placeholder="RAM (GB)"
          value={formData.ram}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* VRAM */}
        <input
          type="number"
          name="vram"
          placeholder="VRAM (GB)"
          value={formData.vram}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {loading ? 'Submitting...' : 'Get Recommendation'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && result.recommendation && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Recommended GPU Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">GPU Details</h3>
              <p><strong>Name:</strong> {result.recommendation.gpu_name}</p>
              <p><strong>Description:</strong> {result.recommendation.gpu_description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Pricing</h3>
              <p><strong>Hourly:</strong> ${result.recommendation.prices.hourly.toFixed(2)}</p>
              <p><strong>Monthly:</strong> ${result.recommendation.prices.monthly.toFixed(2)}</p>
              <p><strong>Spot:</strong> ${result.recommendation.prices.spot.toFixed(2)}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Specifications</h3>
              <p><strong>vCPUs:</strong> {result.recommendation.specs.vcpus}</p>
              <p><strong>RAM:</strong> {result.recommendation.specs.ram}GB</p>
            </div>

           
          </div>
        </div>
      )}

      {/* Debug Information */}
      {result && result.debug && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Debug Information</h3>
          <pre className="text-sm mt-2 whitespace-pre-wrap">
            {JSON.stringify(result.debug, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
