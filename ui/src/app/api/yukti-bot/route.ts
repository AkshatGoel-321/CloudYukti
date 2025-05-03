import { NextRequest } from "next/server";

export const runtime = "edge";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  
  // Get the latest user message
  const userMessage = messages[messages.length - 1].content;

  try {
    // Forward the query to FastAPI server
    const response = await fetch(`${FASTAPI_URL}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userMessage,
        top_k: 3 // You can make this configurable if needed
      }),
    });

    if (!response.body) {
      return new Response("No response from recommendation server", { status: 500 });
    }

    // Stream the response from FastAPI
    const stream = new ReadableStream({
      async start(controller) {
        if (!response.body) {
          throw new Error("Response body is null");
        }
        const reader = response.body.getReader();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Error calling recommendation service:", error);
    return new Response("Error processing request", { status: 500 });
  }
}