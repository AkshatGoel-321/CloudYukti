/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { AnimatedBackground } from "@/components/AnimatedBG"
import { motion } from "framer-motion"
import SliderInput from "@/components/SliderInput"
import RecommendationCard from "@/components/RecommendationCard"
import { Card, CardContent } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Page() {
  const { data: session, status } = useSession();
    const router = useRouter()
  
      useEffect(() => {
        if (status !== "authenticated") {
          toast({title:"You must be signed in to view this page."})
          setTimeout(() => {
              router.push("/sign-in");
          }, 750);
          
        }
      }, [status,router]);
    
  const [formData, setFormData] = useState({
    os: '',
    budget: '',
    country: '',
    region: '',
    cpus: '4',
    ram: '16',
    vram: '8',
    datasetSize: '',
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

  // ...existing code...
  const handleRequestGpu = async () => {
    try {
      const res = await fetch("/api/gpu-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget),
          cpus: parseInt(formData.cpus),
          ram: parseFloat(formData.ram),
          vram: parseFloat(formData.vram),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Request Submitted",
          description: "Your requirement request has been saved. We'll notify you when a matching GPU is available.",
          className: "bg-green-500 text-white border-none",
          variant: "default",
        });
      } else {
        toast({
          title: "Request Failed",
          description: data.error || "Failed to submit your request.",
          className: "bg-red-500 text-white border-none",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Request Failed",
        description: err.message || "Failed to submit your request.",
        className: "bg-red-500 text-white border-none",
        variant: "destructive",
      });
    }
  };
// ...existing code...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const budget = parseFloat(formData.budget) || 0;
    const cpus = parseInt(formData.cpus) || 0;
    const ram = parseFloat(formData.ram) || 0;
    const vram = parseFloat(formData.vram) || 0;

    if (!formData.os || !formData.country || !formData.datasetSize ||!formData.region || budget <= 0 || cpus <= 0 || ram <= 0 || vram <= 0) {
      setError('Please fill in all required fields with valid values.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/gpu-recommender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, budget, cpus, ram, vram,datasetSize: parseInt(formData.datasetSize) }),
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
    <div className="min-h-screen flex items-center justify-center bg-background py-20">
      <AnimatedBackground />

      <div className="w-full max-w-7xl px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center gradient-text flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="CloudYukti Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            AceCloud X CloudYukti GPU Recommender
          </h1>
        </motion.div>

        <div
          className={`mx-auto ${result && result.recommendation ? "grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl" : "max-w-2xl"}`}
        >
          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Card className="shadow-md">
              <CardContent className="p-6 pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="os" className="text-sm font-medium">
                        Operating System
                      </label>
                      <select
                        id="os"
                        name="os"
                        value={formData.os}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select OS</option>
                        <option value="windows">Windows</option>
                        <option value="linux">Linux</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="budget" className="text-sm font-medium">
                        Budget (USD per Month)
                      </label>
                      <input
                        type="number"
                        id="budget"
                        name="budget"
                        placeholder="e.g., 500"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="country" className="text-sm font-medium">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select Country</option>
                        <option value="india">India</option>
                        <option value="us">US</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="region" className="text-sm font-medium">
                        Region
                      </label>
                      <select
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        required
                        disabled={!formData.country || regionOptions.length === 0}
                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
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

                  <div className="space-y-6">
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
                  </div>
                <div className="space-y-2">
                  <label htmlFor="datasetSize" className="text-sm font-medium">
                    Dataset Size (GB)
                  </label>
                  <input
                    type="number"
                    id="datasetSize"
                    name="datasetSize"
                    placeholder="e.g., 100"
                    value={formData.datasetSize || ""}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
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
                        "Get Recommendation"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Container */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 w-full"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-center"
              >
                <p>
                  <strong>Error:</strong> {error}
                </p>
                {error.includes("No GPUs found matching your criteria") && (
                  <div className="mt-4">
                    <Button
                      onClick={handleRequestGpu}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Raise Request for this Configuration
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Clicking will notify our team of your requirements.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {result && result.recommendation && <RecommendationCard recommendation={result.recommendation} />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}