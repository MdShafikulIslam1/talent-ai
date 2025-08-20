// app/api/text-to-audio/route.ts

// Groq for Text to Audio Conversion
import { voices } from "@/const";
import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
import { client } from "@/lib/utils"; // Using your existing Groq client
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { text, voice = "Fritz-PlayAI", speed = 1.0 } = body;
    console.log("body: ", body);

    if (!text || !text.trim()) {
      return new NextResponse("Text is required", { status: 400 });
    }

    if (text.length > 4000) {
      return new NextResponse("Text is too long. Maximum 4000 characters allowed.", { status: 400 });
    }

    // Validate voice parameter
    const isValidVoice = voices.map(v => v.id === voice);
    if (!isValidVoice.includes(true)) {
      return new NextResponse("Invalid voice selection", { status: 400 });
    }

    // Validate speed parameter
    if (speed < 0.25 || speed > 4.0) {
      return new NextResponse("Invalid speed. Must be between 0.25 and 4.0", { status: 400 });
    }

    // Check API limits
    const free_trial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!free_trial && !isPro) {
      return new NextResponse("Your free trial has expired", { status: 403 });
    }

    // Note: Groq doesn't have text-to-speech capabilities yet
    // So we'll use OpenAI for this functionality
    // You'll need to install openai: npm install openai

    // Generate speech using OpenAI's text-to-speech
    const mp3 = await client.audio.speech.create({
      // model: "tts-1", // Use tts-1-hd for higher quality but slower generation
      model:"playai-tts",
      voice, // Use Fritz voice for Groq
      input: text,
      speed: speed,
      response_format: "mp3"
    });

    // Convert the response to a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Increase API limit count
    if (!isPro) {
      await increaseApiLimit();
    }

    // Return the audio file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache'
      },
    });

  } catch (error) {
    console.log("Text to audio error: ", error);
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('rate_limit')) {
        return new NextResponse("Rate limit exceeded. Please try again later.", { status: 429 });
      }
      if (error.message.includes('invalid_request')) {
        return new NextResponse("Invalid request. Please check your input.", { status: 400 });
      }
      if (error.message.includes('quota')) {
        return new NextResponse("API quota exceeded. Please try again later.", { status: 429 });
      }
    }
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Alternative implementation using ElevenLabs (if you prefer)
/*
import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { text, voice = "21m00Tcm4TlvDq8ikWAM", speed = 1.0 } = body; // Default to Rachel voice

    if (!text || !text.trim()) {
      return new NextResponse("Text is required", { status: 400 });
    }

    if (text.length > 4000) {
      return new NextResponse("Text is too long. Maximum 4000 characters allowed.", { status: 400 });
    }

    // Check API limits
    const free_trial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!free_trial && !isPro) {
      return new NextResponse("Your free trial has expired", { status: 403 });
    }

    // ElevenLabs API call
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1', // or 'eleven_multilingual_v2' for multilingual
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs API error:', errorData);
      return new NextResponse("Failed to generate audio", { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    // Increase API limit count
    if (!isPro) {
      await increaseApiLimit();
    }

    // Return the audio file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache'
      },
    });

  } catch (error) {
    console.log("Text to audio error: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
*/