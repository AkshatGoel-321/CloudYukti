'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Image from 'next/image';
import { AnimatedBackground } from "@/components/AnimatedBG";
import { motion } from "framer-motion";

interface SliderInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}

const SliderInput: React.FC<SliderInputProps> = ({ label, name, value, onChange, min, max, step, unit }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}: <span className="font-semibold">{value || min}{unit}</span>
    </label>
    <input
      type="range"
      id={name}
      name={name}
      min={min}
      max={max}
      step={step}
      value={value || min}
      onChange={onChange}
      required
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
    />
    <div className="flex justify-between text-xs text-gray-500">
      <span>{min}{unit}</span>
      <span>{max}{unit}</span>
    </div>
  </div>
);

interface RecommendationCardProps {
  recommendation: {
    gpu_name: string;
    gpu_description: string;
    prices: {
      hourly: number | null;
      monthly: number | null;
      spot: number | null;
    };
    specs: {
      vcpus: number;
      ram: number;
    };
  };
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => (
  <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-lg shadow-md border border-blue-200">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-blue-300">
      🚀 Recommended GPU Configuration
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* GPU Details */}
      <div className="p-3 bg-white rounded shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg text-indigo-700 mb-1">GPU Details</h3>
        <p><strong>Name:</strong> {recommendation.gpu_name || 'N/A'}</p>
        <p><strong>Description:</strong> {recommendation.gpu_description || 'N/A'}</p>
      </div>

      {/* Core Specifications */}
      <div className="p-3 bg-white rounded shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg text-indigo-700 mb-1">Core Specifications</h3>
        <p><strong>vCPUs:</strong> {recommendation.specs.vcpus ?? 'N/A'}</p>
        <p><strong>RAM:</strong> {recommendation.specs.ram ?? 'N/A'} GB</p>
      </div>

      {/* Pricing Options */}
      <div className="p-3 bg-white rounded shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg text-green-700 mb-2">Pricing Options</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Hourly:</span>
            <span className="font-medium text-green-600">
              ${recommendation.prices.hourly?.toFixed(2) ?? 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Monthly:</span>
            <span className="font-medium text-green-600">
              ${recommendation.prices.monthly?.toFixed(2) ?? 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Spot:</span>
            <span className="font-medium text-green-600">
              ${recommendation.prices.spot?.toFixed(2) ?? 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Page() {
  const [formData, setFormData] = useState({
    os: '',
    budget: '',
    country: '',
    region: '',
    cpus: '4',
    ram: '16',
    vram: '8',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'country' ? { region: '' } : {}),
    }));
    setResult(null);
    setError('');
  };

  const handleRequestGpu = () => {
    console.log('Raise Request button clicked for criteria:', formData);
    toast({
      title: "Request Raised",
      description: "Your requirement request has been submitted to our team.",
      className: "bg-green-500 text-white border-none",
      variant: "default",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const budget = parseFloat(formData.budget) || 0;
    const cpus = parseInt(formData.cpus) || 0;
    const ram = parseFloat(formData.ram) || 0;
    const vram = parseFloat(formData.vram) || 0;

    if (!formData.os || !formData.country || !formData.region || budget <= 0 || cpus <= 0 || ram <= 0 || vram <= 0) {
      setError('Please fill in all required fields with valid values.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/gpu-recommender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, budget, cpus, ram, vram }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }

      if (data?.error?.includes('No GPUs found matching your criteria')) {
        setError(data.error);
        setResult(null);
        setLoading(false);
        return;
      }

      if (data?.recommendation) {
        setResult(data);
        setError('');
      } else {
        throw new Error('Received an unexpected response from the server.');
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.message || 'An unexpected error occurred during the request.');
      setResult(null);
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
      ? [{ label: 'Atlanta', value: 'us-east-at-1' }]
      : [];

  return (
    <div className="p-6 min-h-screen py-16 bg-gray-50 pb-24">
      <AnimatedBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 min-h-screen py-16 pb-24"
      >
      <Toaster />
      <div className="flex items-center justify-center mb-6">
      <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 flex items-center gap-2"
          >          <Image 
            src="/logo.png"
            alt="CloudYukti Logo"
            width={40}
            height={40}
            className="object-contain"
          /> 
          AceCloud X CloudYukti GPU Recommender
      </motion.h1>
      </div>
      
      <div className={`mx-auto ${result && result.recommendation ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl place-items-center' : 'max-w-2xl'}`}>
        {/* Form Container */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`${result && result.recommendation ? 'w-full sticky top-6' : 'mx-auto'}`}
          >          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div>
              <label htmlFor="os" className="block text-sm font-medium text-gray-700 mb-1">Operating System</label>
              <select
                id="os"
                name="os"
                value={formData.os}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select OS</option>
                <option value="windows">Windows</option>
                <option value="linux">Linux</option>
              </select>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget (USD per Month)</label>
              <input
                type="number"
                id="budget"
                name="budget"
                placeholder="e.g., 500"
                value={formData.budget}
                onChange={handleChange}
                required
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Country</option>
                  <option value="india">India</option>
                  <option value="us">US</option>
                </select>
              </div>
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  disabled={!formData.country || regionOptions.length === 0}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                >
                  <option value="">Select Region</option>
                  {regionOptions.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <SliderInput
              label="Minimum Number of vCPUs"
              name="cpus"
              value={formData.cpus}
              onChange={handleChange}
              min={1}
              max={64}
              step={1}
              unit=""
            />
            <SliderInput
              label="Minimum RAM"
              name="ram"
              value={formData.ram}
              onChange={handleChange}
              min={4}
              max={512}
              step={4}
              unit=" GB"
            />
            <SliderInput
              label="Minimum GPU VRAM"
              name="vram"
              value={formData.vram}
              onChange={handleChange}
              min={4}
              max={80}
              step={4}
              unit=" GB"
            />
            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Finding Best GPU...
                  </div>
                ) : (
                  'Get Recommendation'
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Results Container */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 w-full flex flex-col items-center"
          >          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center w-full">
              <p><strong>Error:</strong> {error}</p>
              {error.includes('No GPUs found matching your criteria') && (
                <div className="mt-4">
                  <Button onClick={handleRequestGpu} variant="outline">
                    Raise Request for this Configuration
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Clicking will notify our team of your requirements.
                  </p>
                </div>
              )}
            </div>
          )}

          {result && result.recommendation && (
            <>
              <div className="w-full">
                <RecommendationCard recommendation={result.recommendation} />
              </div>
              {result.debug && (
                <div className="mt-6 p-4 bg-gray-100 rounded-md border border-gray-300 w-full">
                  <h3 className="font-semibold text-gray-700">Debug Information</h3>
                  <pre className="text-xs mt-2 whitespace-pre-wrap bg-gray-200 p-3 rounded">
                    {JSON.stringify(result.debug, null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
      </motion.div>
    </div>
  );
}