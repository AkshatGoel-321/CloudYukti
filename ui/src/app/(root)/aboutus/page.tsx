"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ShieldCheck, Eye } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-800 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Empowering Security with AI & ML</h1>
        <p className="text-lg md:text-xl max-w-3xl">
          Transforming surveillance into intelligent monitoring for a safer future.
        </p>
      </div>

      {/* Problem Statement Section */}
      <div className="max-w-5xl mx-auto mt-12 p-6">
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardContent className="p-6 text-center">
            <h2 className="text-3xl font-bold mb-4 text-blue-400">The Problem</h2>
            <p className="text-gray-300 text-lg">
              Traditional CCTV systems rely on manual monitoring, making it inefficient for detecting real-time threats like
              overcrowding, suspicious activities, and workplace safety violations.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Our Mission & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12 p-6">
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Users size={48} className="text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white">Crowd Management</h3>
            <p className="text-gray-300 mt-2">
              AI-driven crowd detection to prevent overcrowding and ensure safety compliance.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <ShieldCheck size={48} className="text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white">Crime Prevention</h3>
            <p className="text-gray-300 mt-2">
              Automated anomaly detection to identify suspicious activities and prevent incidents.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Eye size={48} className="text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white">Work Monitoring</h3>
            <p className="text-gray-300 mt-2">
              Ensuring safety and compliance at workplaces by detecting risky behaviors.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col items-center text-center mt-12 pb-12">
        <h2 className="text-3xl font-bold text-blue-400 mb-4">Join Us in Building a Safer Tomorrow</h2>
        <p className="text-lg text-gray-300 max-w-3xl">
          Be part of the revolution in AI-powered surveillance. Together, we can make monitoring smarter and communities safer.
        </p>
        <Button className="mt-6 px-6 py-3 text-lg">Get in Touch</Button>
      </div>
    </div>
  );
}
