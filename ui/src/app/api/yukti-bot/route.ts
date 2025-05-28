import { auth } from "@/auth"; 
import { NextRequest, NextResponse } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const session = await auth(); 

    if (!session || !session.user?._id) {
      console.log("API /api/chat POST - Unauthorized: No session or session.user._id found. Session state:", JSON.stringify(session, null, 2));
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    console.log("API /api/chat POST - Authorized. User ID:", session.user._id);

    const { messages } = await req.json();
    // Get the latest user message
    const userMessage = messages[messages.length - 1].content;

    const response = await fetch(`${FASTAPI_URL}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userMessage,
        top_k: 3, // You can make this configurable if needed
      }),
    });

    if (!response.body) {
      console.error("API /api/chat POST - No response body from recommendation server");
      return new Response("No response from recommendation server", { status: 500 });
    }

    // Stream the response from FastAPI
    const stream = new ReadableStream({
      async start(controller) {
        if (!response.body) {
          // This check is technically redundant due to the one above, but good for safety
          controller.error(new Error("Response body is null"));
          return;
        }
        const reader = response.body.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (streamError) {
          console.error("API /api/chat POST - Error reading stream from FastAPI:", streamError);
          controller.error(streamError);
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
        Connection: "keep-alive",
      },
    });

  } catch (error) {
    console.error("API /api/chat POST - Error processing request:", error);
    if (error instanceof SyntaxError) { // e.g. if req.json() fails
        return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}