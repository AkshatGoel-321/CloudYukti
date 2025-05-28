/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import RequestModel from "@/models/Request"; // Assuming this is your Mongoose model
import { auth } from "@/auth"; // Correct import from your auth.ts

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await auth(); // Get session using the auth() helper
    console.log("API POST - Session from auth():", JSON.stringify(session, null, 2));

    // **CRITICAL: Uncomment and use this authorization check**
    if (!session || !session.user?._id) {
      console.log("API POST - Unauthorized: No session or user._id found.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate required fields
    const { os, budget, country, region, cpus, ram, vram } = body;
    if (!os || !budget || !country || !region || !cpus || !ram || !vram) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = await RequestModel.create({
      userId: session.user._id, // Use _id from the session
      criteria: { os, budget, country, region, cpus, ram, vram },
    });

    return NextResponse.json({ success: true, request });
  } catch (error) {
    console.error("API POST - Error creating request:", error);
    // Check if the error might be due to session.user._id being undefined
    if (error instanceof TypeError && error.message.toLowerCase().includes('_id')) {
        console.error("API POST - Potential issue: session.user._id might have been undefined when creating RequestModel.");
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await auth(); // Get session
    console.log("API GET - Session from auth():", JSON.stringify(session, null, 2));

    if (!session || !session.user?._id) {
      console.log("API GET - Unauthorized: No session or user._id found.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use session.user._id consistently
    const requests = await RequestModel.find({ userId: session.user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("API GET - Error fetching requests:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}