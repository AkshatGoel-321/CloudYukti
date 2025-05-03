
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-20 px-8 bg-gradient-to-r from-black to-gray-900">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
            Revolutionize Surveillance with AI
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Harness the power of AI/ML for crowd management, crime prevention, and work monitoring.
          </p>
          <div className="space-x-4">
            <Button className="border-cyan-400 hover:bg-cyan-400 hover:text-black">
              <Link href={''}>Get Started</Link>
            </Button>
            <Button className="border-cyan-400 hover:bg-cyan-400 hover:text-black">
              <Link href='aboutus'>Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 bg-black">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center p-6 border border-gray-800 rounded-lg hover:border-cyan-400 transition-colors">
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Crowd Management</h3>
            <p className="text-gray-400">
              Monitor crowd density and movement patterns in real-time.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center p-6 border border-gray-800 rounded-lg hover:border-cyan-400 transition-colors">
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Crime Prevention</h3>
            <p className="text-gray-400">
              Detect suspicious activities and unauthorized access instantly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center p-6 border border-gray-800 rounded-lg hover:border-cyan-400 transition-colors">
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Work Monitoring</h3>
            <p className="text-gray-400">
              Ensure safety protocols and improve workflow efficiency.
            </p>
          </div>
        </div>
      </section>

     
    </div>
  );
}