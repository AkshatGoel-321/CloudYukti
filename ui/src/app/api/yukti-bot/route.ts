import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response("Missing GROQ_API_KEY", { status: 500 });
  }

  // Add a system prompt for focused answers
  const systemPrompt = {
    role: "system",
    content:
      "You are Yukti Bot, an expert assistant for AceCloud. Answer user queries about GPU selection and cloud cost optimization. Be concise, accurate, and helpful. If asked about specific workloads, recommend the best GPU instance and explain your reasoning. Only answer questions relevant to cloud GPUs, pricing, and optimization.",
  };

  // Ensure system prompt is always first
  const groqMessages = [systemPrompt, ...messages.filter((m: any) => m.role !== "system")];

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: groqMessages,
      stream: true,
    }),
  });

  if (!groqRes.body) {
    return new Response("No response from Groq", { status: 500 });
  }

  // Stream only the content field from each chunk
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = groqRes.body!.getReader();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += new TextDecoder().decode(value);

        // Split on newlines for SSE/data: chunks
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;
          if (trimmed === "data: [DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(trimmed.replace(/^data:\s*/, ""));
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          } catch (e) {
            // Ignore malformed lines
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}