"use client"; // Required if using Client Components in the App Router

import React,{useState,useEffect} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  registerables,
} from "chart.js";
import DensityGraph from "@/components/analytics/DensityGraph";
import ViolationChart from "@/components/analytics/ViolationChart";
import TrendAnalysis from "@/components/analytics/TrendAnalysis";
import AnomaliesList from "@/components/analytics/AnomaliesList";

// Register Chart.js components
ChartJS.register(CategoryScale, ...registerables);

const Analytics = () => {
    const [currentTime, setCurrentTime] = useState<string>("");
  const [cpuUsage, setCpuUsage] = useState<string>("40%");
  const [memoryUsage, setMemoryUsage] = useState<string>("25 GB / 64 GB");
  const [storageUsage, setStorageUsage] = useState<string>("500 GB / 1 TB");

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(`${Math.floor(Math.random() * 100)}%`);
      setMemoryUsage(
        `${Math.floor(Math.random() * 64)} GB / 64 GB`
      );
      setStorageUsage(
        `${Math.floor(Math.random() * 1024)} GB / 1 TB`
      );
    }, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata",
      };
      setCurrentTime(now.toLocaleTimeString("en-IN", options));
    };

    updateCurrentTime();
    const timer = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8 bg-gradient-to-r from-black to-gray-900">
      {/* Page Title */}
      <h1 className="text-3xl font-bold my-6 text-center text-white">Analytics Dashboard</h1>

      {/* Grid Layout */}
      <div className="flex justify-center items-center space-x-8 p-4 text-white">
            <div className="flex flex-col items-center">
              <span className="text-sm">CPU</span>
              <span className="text-sm">{cpuUsage}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm">Memory</span>
              <span className="text-sm">{memoryUsage}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm">Storage</span>
              <span className="text-sm">{storageUsage}</span>
            </div>
            <div className="text-sm">{currentTime}</div>
          </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Density Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Density Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <DensityGraph />
          </CardContent>
        </Card>

        {/* Violation Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Violation Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ViolationChart />
          </CardContent>
        </Card>
      </div>

      {/* Full-Width Cards */}
      <div className="mt-6 space-y-6">
        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendAnalysis />
          </CardContent>
        </Card>

        {/* Anomalies List */}
        <Card>
          <CardHeader>
            <CardTitle>Anomalies List</CardTitle>
          </CardHeader>
          <CardContent>
            <AnomaliesList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;