"use client";

import React, { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Zap, Check, MapPin, Clock, CreditCard } from 'lucide-react';


export default function YuktiBotPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hi! I’m Yukti Bot. Ask me anything about GPU selection or cost optimization on AceCloud." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    // Call the backend route for streaming response
    const response = await fetch("/api/yukti-bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, { role: "user", content: input }] }),
    });

    if (!response.body) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't get a response." },
      ]);
      setLoading(false);
      return;
    }

    // Streaming response
    const reader = response.body.getReader();
    let assistantMsg = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = new TextDecoder().decode(value);
      assistantMsg += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return [...prev.slice(0, -1), { role: "assistant", content: assistantMsg }];
        }
        return prev;
      });
    }
    setLoading(false);
  };
  const formatMessage = (content: string) => {
    // Check if the message contains GPU recommendation
    if (content.includes("Resource Name:")) {
      const lines = content.split("*").filter(line => line.trim());
      const recommendation = {
        intro: lines[0],
        details: lines.slice(1).map(line => line.trim())
      };
  
      return (
        <div className="space-y-4">
          <p className="text-gray-700">{recommendation.intro}</p>
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-white border-blue-100">
            <div className="space-y-3">
              {recommendation.details.map((detail, index) => {
                const [label, value] = detail.split(":").map(s => s.trim());
                return (
                  <div key={index} className="flex items-center space-x-2">
                    {label === "Resource Name" && <Zap className="w-4 h-4 text-blue-600" />}
                    {label === "Region" && <MapPin className="w-4 h-4 text-blue-600" />}
                    {label === "GPU Description" && <Check className="w-4 h-4 text-blue-600" />}
                    {label === "Price per hour" && <CreditCard className="w-4 h-4 text-blue-600" />}
                    <span className="text-gray-600 font-medium">{label}:</span>
                    <span className="text-gray-800">
                      {label === "Price per hour" ? (
                        <Badge variant="default" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                          {value.replace("INR", "").trim()}
                        </Badge>
                      ) : (
                        value
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      );
    }
    return <p className="text-gray-800">{content}</p>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Yukti Bot Hero Section */}
      <section className="flex flex-col justify-center items-center px-4 pt-24 bg-gradient-to-bl from-white to-blue-100">
        <div className="max-w-2xl w-full text-center mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 mb-4">
            Yukti Bot – Your Cloud GPU AI Assistant
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            Ask anything about GPU selection, pricing, or cloud cost optimization.<br />
            <span className="text-blue-600 font-medium">Powered by AceCloud’s real-time knowledge base and LLM.</span>
          </p>
        </div>
      </section>

      {/* Chat Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-tl from-white to-blue-100">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg flex flex-col h-[70vh] border border-gray-200">
          <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white rounded-t-xl">
            <span className="text-xl font-bold text-blue-700">Yukti Bot</span>
            <span className="ml-2 text-xs text-gray-400">AI Assistant for GPU Selection</span>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-blue-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
  className={`rounded-lg px-4 py-2 max-w-[80%] text-sm shadow ${
    msg.role === "user"
      ? "bg-white text-gray-800"
      : "bg-white text-gray-800 border border-blue-100"
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
            className="flex items-center border-t border-gray-200 px-4 py-3 bg-white rounded-b-xl"
          >
            <input
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              type="text"
              placeholder="Ask about GPU selection, pricing, or cost optimization…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}