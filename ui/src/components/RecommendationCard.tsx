
"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, Server, CreditCard, Zap } from "lucide-react"


interface RecommendationCardProps {
  recommendation: {
    gpu_name: string
    gpu_description: string
    prices: {
      hourly: number | null
      monthly: number | null
      spot: number | null
    }
    specs: {
      vcpus: number
      ram: number
    }
  }
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mt-6"
  >
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5 rounded-t-lg border-b">
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Zap className="h-6 w-6" />
          Recommended GPU Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* GPU Details - span 2 columns on desktop */}
    <div className="p-4 bg-card rounded-lg shadow-sm border md:col-span-2">
  <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
    <Server className="h-4 w-4" />
    GPU Details
  </h3>
  <div className="space-y-2">
    <p className="flex justify-between">
      <span className="text-muted-foreground">Name:</span>
      <span className="font-medium">{recommendation.gpu_name || "N/A"}</span>
    </p>
    <p className="flex items-start gap-2">
      <span className="text-muted-foreground">Description:</span>
      <span className="font-medium text-justify">{recommendation.gpu_description || "N/A"}</span>
    </p>
  </div>
</div>

    {/* Right column: Core Specs + Pricing */}
    <div className="flex flex-col gap-4">
      {/* Core Specifications */}
      <div className="p-4 bg-card rounded-lg shadow-sm border">
        <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          Core Specifications
        </h3>
        <div className="space-y-2">
          <p className="flex justify-between">
            <span className="text-muted-foreground">vCPUs:</span>
            <span className="font-medium">{recommendation.specs.vcpus ?? "N/A"}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">RAM:</span>
            <span className="font-medium">{recommendation.specs.ram ?? "N/A"} GB</span>
          </p>
        </div>
      </div>
      {/* Pricing Options */}
      <div className="p-4 bg-card rounded-lg shadow-sm border">
        <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Pricing Options
        </h3>
        <div className="space-y-2">
          <p className="flex justify-between">
            <span className="text-muted-foreground">Hourly:</span>
            <span className="font-medium text-primary">
              {recommendation.prices.hourly !== null
                ? `$${recommendation.prices.hourly.toFixed(2)}`
                : "N/A"}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">Monthly:</span>
            <span className="font-medium text-primary">
              {recommendation.prices.monthly !== null
                ? `$${recommendation.prices.monthly.toFixed(2)}`
                : "N/A"}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">Spot:</span>
            <span className="font-medium text-primary">
              {recommendation.prices.spot !== null
                ? `$${recommendation.prices.spot.toFixed(2)}`
                : "N/A"}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</CardContent>
    </Card>
  </motion.div>
)
export default RecommendationCard