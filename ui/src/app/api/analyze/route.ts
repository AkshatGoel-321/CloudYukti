import { NextRequest, NextResponse } from 'next/server';
import { vl } from 'moondream';

// Specify edge runtime
export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  if (!process.env.MOONDREAM_API_KEY) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const image = formData.get('image');
    const question = formData.get('question');

    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { error: 'Invalid or missing image' },
        { status: 400 }
      );
    }

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing question' },
        { status: 400 }
      );
    }

    const imageBuffer = await image.arrayBuffer();
    const encodedImage = Buffer.from(imageBuffer);
    
    const model = new vl({
      apiKey: process.env.MOONDREAM_API_KEY
    });

    // Get both caption and answer
    const answer = await model.query({ 
      image: encodedImage, 
      question: question 
    });

    // Convert the answer object to a string if it's not already
    const analysisText = typeof answer === 'object' ? JSON.stringify(answer) : answer;

    return NextResponse.json({ 
      analysis: analysisText 
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}