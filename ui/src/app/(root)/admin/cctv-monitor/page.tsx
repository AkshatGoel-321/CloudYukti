"use client";

import { useState, useEffect } from "react";
import CameraGrid from "@/components/dashboard/CameraGrid";
import MetricsPanel from "@/components/dashboard/MetricsPanel";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import { generateRandomMetrics } from "@/lib/mockDataGenerator";

const Dashboard = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [metrics, setMetrics] = useState({
    totalPeople: 0,
    crowdDensity: 0,
    alerts: [],
    violations: [],
  });

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateRandomMetrics());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col px-8 py-24 space-y-6 bg-gradient-to-r from-black to-gray-900 min-h-screen text-white">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">CCTV Monitoring Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${
              viewMode === "grid" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${
              viewMode === "list" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-wrap -mx-4">
        {/* Camera Grid Section */}
        <div className="w-full lg:w-1/2 px-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md h-[70vh] overflow-y-auto">
            <CameraGrid viewMode={viewMode} />
          </div>
        </div>

        {/* Side Panels Section */}
        <div className="w-full lg:w-1/2 px-4 space-y-4">
          {/* Metrics Panel */}
          <div className="bg-gray-800  rounded-lg shadow-md">
            <MetricsPanel metrics={metrics} />
          </div>

          {/* Alerts Panel */}
          <div className="bg-gray-800  rounded-lg shadow-md">
            <AlertsPanel alerts={metrics.alerts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
