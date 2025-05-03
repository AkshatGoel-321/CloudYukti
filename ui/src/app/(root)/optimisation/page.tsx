'use client'
import { useState } from 'react';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

// Define interfaces for type safety
interface Suggestion {
  gpu: string;
  price_per_hour: number;
  region: string;
  why: string;
}

interface ApiResponse {
  selected: Suggestion;
  suggestions: Suggestion[];
}

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export default function OptimizationPage() {
  const [gpu, setGpu] = useState('A100');
  const [workload, setWorkload] = useState('training');
  const [budget, setBudget] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [prompt, setPrompt] = useState('');
  const [grokResponse, setGrokResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gpuOptions = ['T4', 'A100', 'L4', 'V100'];
  const workloadOptions = ['training', 'inference'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/optimisation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          gpu, 
          workload, 
          budget: parseFloat(budget) || 0 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch suggestions');
      }

      setSuggestions(data.suggestions);

      const all = [data.selected, ...data.suggestions];
      setChartData({
        labels: all.map(s => s.gpu),
        datasets: [{
          label: 'Cost ($/hr)',
          data: all.map(s => s.price_per_hour),
          backgroundColor: ['#4ade80', '#60a5fa', '#facc15', '#f87171'],
        }],
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setSuggestions([]);
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrokPrompt = async () => {
    try {
      if (!prompt.trim()) {
        return;
      }

      const res = await fetch('/api/grok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to get Grok response');
      }

      const data = await res.json();
      setGrokResponse(data.reply);
    } catch (error) {
      console.error('Error:', error);
      setGrokResponse('Failed to get response from Grok');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">GPU Optimization</h1>

      {/* Optimization Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={gpu} onChange={(e) => setGpu(e.target.value)} className="w-full p-2 border rounded">
          {gpuOptions.map(g => <option key={g}>{g}</option>)}
        </select>

        <select value={workload} onChange={(e) => setWorkload(e.target.value)} className="w-full p-2 border rounded">
          {workloadOptions.map(w => <option key={w}>{w}</option>)}
        </select>

        <input
          type="number"
          placeholder="Budget ($/hr)"
          className="w-full p-2 border"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <button 
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`} 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Optimizing...' : 'Optimize'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Suggestions</h2>
          <ul className="mt-2 space-y-3">
            {suggestions.map((s, i) => (
              <li key={i} className="p-4 border rounded shadow">
                <strong>{s.gpu}</strong> – ${s.price_per_hour}/hr<br />
                Region: {s.region}<br />
                💡 {s.why}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chart */}
      {chartData && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">Cost Comparison</h2>
          <Line data={chartData} />
        </div>
      )}

      {/* Grok Section */}
      <div className="mt-10 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Ask Grok (Natural Language Optimizer)</h2>
        <textarea
          className="w-full border p-2 mb-2 rounded"
          rows={3}
          placeholder="e.g. How can I reduce cost for LLM training under $1/hr?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={handleGrokPrompt} className="bg-green-600 text-white px-4 py-2 rounded">
          Ask Grok
        </button>
        {grokResponse && (
          <div className="mt-4 p-3 bg-white rounded border">
            <strong>Grok says:</strong>
            <p>{grokResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}
