/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Zap, Check, MapPin, CreditCard, Send } from "lucide-react"
import { AnimatedBackground } from "@/components/AnimatedBG"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export default function YuktiBotPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (status !== "authenticated") {
      toast({ title: "You must be signed in to view this page." })
      setTimeout(() => {
        router.push("/sign-in")
      }, 750)
    }
  }, [status, router, toast])

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content: "Hi! I'm Yukti Bot. Ask me anything about GPU selection or cost optimization on AceCloud.",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setInput("")

    // Call the backend route for streaming response
    const response = await fetch("/api/yukti-bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, { role: "user", content: input }] }),
    })

    if (!response.body) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't get a response." }])
      setLoading(false)
      return
    }

    // Streaming response
    const reader = response.body.getReader()
    let assistantMsg = ""
    setMessages((prev) => [...prev, { role: "assistant", content: "" }])
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = new TextDecoder().decode(value)
      assistantMsg += chunk
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        if (last?.role === "assistant") {
          return [...prev.slice(0, -1), { role: "assistant", content: assistantMsg }]
        }
        return prev
      })
    }
    setLoading(false)
  }

  const formatMessage = (content: string) => {
    // Check if the message contains GPU recommendation
    if (content.includes("Resource Name:")) {
      const lines = content.split("*").filter((line) => line.trim())
      const recommendation = {
        intro: lines[0],
        details: lines.slice(1).map((line) => line.trim()),
      }

      return (
        <div className="space-y-4">
          <p className="text-foreground">{recommendation.intro}</p>
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="space-y-3">
              {recommendation.details.map((detail, index) => {
                const [label, value] = detail.split(":").map((s) => s.trim())
                return (
                  <div key={index} className="flex items-center space-x-2">
                    {label === "Resource Name" && <Zap className="w-4 h-4 text-primary" />}
                    {label === "Region" && <MapPin className="w-4 h-4 text-primary" />}
                    {label === "GPU Description" && <Check className="w-4 h-4 text-primary" />}
                    {label === "Price per hour" && <CreditCard className="w-4 h-4 text-primary" />}
                    <span className="text-muted-foreground font-medium">{label}:</span>
                    <span className="text-foreground">
                      {label === "Price per hour" ? (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {value.replace("INR", "").trim()}
                        </Badge>
                      ) : (
                        value
                      )}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )
    }
    return <p className="text-foreground">{content}</p>
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Yukti Bot Hero Section */}
      <AnimatedBackground />
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col justify-center items-center px-4 pt-24 pb-12"
      >
        <div className="max-w-2xl w-full text-center mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4">
            Yukti Bot – Your Cloud GPU AI Assistant
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            Ask anything about GPU selection, pricing, or cloud cost optimization.
            <br />
            <span className="text-primary font-medium">Powered by AceCloud&apos;s real-time knowledge base and LLM.</span>
          </p>
        </div>
      </motion.section>

      {/* Chat Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex flex-col items-center justify-center px-4 py-8"
      >
        <div className="w-full max-w-xl bg-card rounded-xl shadow-lg flex flex-col h-[70vh] border border-border">
          <div className="flex items-center px-6 py-4 border-b border-border bg-muted/50 rounded-t-xl">
            <span className="text-xl font-bold text-primary">Yukti Bot</span>
            <span className="ml-2 text-xs text-muted-foreground">AI Assistant for GPU Selection</span>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-muted/30">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] text-sm shadow ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground border border-border"
                  }`}
                >
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex items-center border-t border-border px-4 py-3 bg-background/80 backdrop-blur-sm rounded-b-xl"
          >
            <input
              className="flex-1 px-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-background"
              type="text"
              placeholder="Ask about GPU selection, pricing, or cost optimization…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" className="ml-2 px-4 py-2" disabled={loading}>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Thinking...</span>
                </div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </motion.section>
    </div>
  )
}
