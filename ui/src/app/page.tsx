import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 py-24 bg-gradient-to-r from-white to-blue-100">
        <div className="max-w-3xl w-full text-center mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 mb-6">
            GPU Cost Optimizer & Recommender for Cloud Workloads
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10">
            Instantly find the best-fit GPU cloud instance for your AI/ML, data, or compute workloads.<br />
            <span className="text-blue-600 font-medium">Save costs, maximize performance, and get clear recommendations—powered by AceCloud’s real-time pricing and knowledge base.</span>
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            <Link href="/optimizer">
              <Button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded hover:bg-blue-500 transition">
                Get Started
              </Button>
            </Link>
            <Link href="/aboutus">
              <Button variant="outline" className="border-blue-600 text-blue-600 font-semibold px-8 py-3 rounded hover:bg-blue-600 hover:text-white transition">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span>#CloudOptimization</span>
            <span>#AI4Cloud</span>
            <span>#Hackathon2025</span>
            <span>#CostEfficiency</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg text-center shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Smart Workload Input</h3>
            <p className="text-gray-600">
              Enter your model type, dataset size, training/inference needs, budget, and region. The system tailors recommendations to your requirements.
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg text-center shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Real-Time GPU Pricing</h3>
            <p className="text-gray-600">
              Instantly fetches up-to-date GPU instance specs and pricing from AceCloud’s public API for accurate, transparent cost comparisons.
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg text-center shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Clear Recommendations</h3>
            <p className="text-gray-600">
              Get multiple instance options with detailed cost breakdowns, spot vs on-demand pricing, and contextual explanations—no guesswork.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-100 to-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-700">
          Ready to optimize your cloud GPU costs?
        </h2>
        <p className="text-gray-700 mb-6">
          Try our developer-friendly, scalable, and user-centric solution now.
        </p>
        <Link href="/optimizer">
          <Button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded hover:bg-blue-500 transition">
            Start Optimizing
          </Button>
        </Link>
      </section>
    </div>
  );
}
