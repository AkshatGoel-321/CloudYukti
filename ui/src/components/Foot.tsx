import React from 'react';
import { Linkedin, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-black to-gray-900 text-gray-400 py-4 p-0 mx-0 my-0 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left section - Company name and copyright */}
          <div className="text-center md:text-left">
          <Link href="/"><h4 className="text-lg font-semibold text-white">CloudYukti</h4></Link>
          <p className="text-xs text-gray-600 mt-1">&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
          
          {/* Middle section - Horizontal Quick Links */}
          <div className="flex space-x-6">
            <a href="/analyzer" className="hover:text-white text-sm">Image Analysis</a>
            <a href="/visualizer" className="hover:text-white text-sm">Threat Detection</a>
            <a href="/workflow" className="hover:text-white text-sm">Our Workflow</a>
            <a href="/aboutus" className="hover:text-white text-sm">About Us</a>
          </div>
          
          {/* Right section - Social media */}
          <div className="flex space-x-6">
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://github.com/exploring-solver/CloudYuktiog" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com/whoanshjain" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}