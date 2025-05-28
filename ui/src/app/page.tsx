"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Cpu, CreditCard, Database } from "lucide-react"
import { AnimatedBackground } from "@/components/AnimatedBG"

export default function HomePage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 py-24">
        <motion.div
          className="max-w-3xl w-full text-center mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold gradient-text mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            GPU Cost Optimizer & Recommender for Cloud Workloads
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Instantly find the best-fit GPU cloud instance for your AI/ML, data, or compute workloads.
            <br />
            <span className="text-primary font-medium">
              Save costs, maximize performance, and get clear recommendations—powered by AceCloud&apos;s real-time pricing
              and knowledge base.
            </span>
          </motion.p>
          <motion.div
            className="flex flex-col md:flex-row justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link href="/gpurecommender">
              <Button className="group bg-primary text-primary-foreground font-semibold px-8 py-6 rounded-lg hover:bg-primary/90 transition-all">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/yukti-bot">
              <Button
                variant="outline"
                className="border-primary text-primary font-semibold px-8 py-6 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>
          <motion.div
            className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span>#CloudOptimization</span>
            <span>#AI4Cloud</span>
            <span>#Hackathon2025</span>
            <span>#CostEfficiency</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={item} className="p-6 border rounded-lg text-center shadow card-hover bg-card">
            <div className="flex justify-center mb-4">
              <Database className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Smart Workload Input</h3>
            <p className="text-muted-foreground">
              Enter your model type, dataset size, training/inference needs, budget, and region. The system tailors
              recommendations to your requirements.
            </p>
          </motion.div>
          <motion.div variants={item} className="p-6 border rounded-lg text-center shadow card-hover bg-card">
            <div className="flex justify-center mb-4">
              <Cpu className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Real-Time GPU Pricing</h3>
            <p className="text-muted-foreground">
              Instantly fetches up-to-date GPU instance specs and pricing from AceCloud&apos;s public API for accurate,
              transparent cost comparisons.
            </p>
          </motion.div>
          <motion.div variants={item} className="p-6 border rounded-lg text-center shadow card-hover bg-card">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Clear Recommendations</h3>
            <p className="text-muted-foreground">
              Get multiple instance options with detailed cost breakdowns, spot vs on-demand pricing, and contextual
              explanations—no guesswork.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 ">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Ready to optimize your cloud GPU costs?</h2>
          <p className="text-muted-foreground mb-6">
            Try our developer-friendly, scalable, and user-centric solution now.
          </p>
          <Link href="/gpurecommender">
            <Button className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-all">
              Start Optimizing
              <CreditCard className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
