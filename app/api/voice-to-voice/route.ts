// // app/api/voice-to-voice/route.ts

// import { checkSubscription } from "@/lib/subscription";
// import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
// import { client } from "@/lib/utils"; // Using your existing Groq client for transcription
// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";

// // We'll need OpenAI for text-to-speech since Groq doesn't have TTS yet
// const OpenAI = require('openai');

// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Get the form data containing the audio file and voice preference
//     const formData = await req.formData();
//     const audioFile = formData.get("audio") as File;
//     const voice = formData.get("voice") as string || "alloy";

//     if (!audioFile) {
//       return new NextResponse("Audio file not found", { status: 400 });
//     }

//     // Validate voice parameter
//     const validVoices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
//     if (!validVoices.includes(voice)) {
//       return new NextResponse("Invalid voice selection", { status: 400 });
//     }

//     // Check API limits
//     const free_trial = await checkApiLimit();
//     const isPro = await checkSubscription();

//     if (!free_trial && !isPro) {
//       return new NextResponse("Your free trial has expired", { status: 403 });
//     }

//     // Step 1: Convert voice to text using Groq Whisper
//     console.log("Step 1: Converting voice to text...");
//     const transcription = await client.audio.transcriptions.create({
//       file: audioFile,
//       model: "whisper-large-v3",
//       response_format: "json",
//       language: "en",
//       temperature: 0.0,
//     });

//     const userText = transcription.text;
//     console.log("Transcription:", userText);

//     if (!userText || userText.trim().length === 0) {
//       return new NextResponse("Could not transcribe audio. Please try speaking more clearly.", { status: 400 });
//     }

//     // Step 2: Generate AI response using Groq
//     console.log("Step 2: Generating AI response...");
//     const chatCompletion = await client.chat.completions.create({
//       model: "llama3-8b-8192", // or "mixtral-8x7b-32768" for more advanced responses
//       messages: [
//         {
//           role: "system",
//           content: `You are a helpful, friendly AI assistant designed for voice conversations. 
//                    Keep your responses natural, conversational, and concise (ideally 1-3 sentences). 
//                    Respond as if you're having a spoken conversation - be warm, engaging, and personable.
//                    Avoid overly long explanations unless specifically asked for detailed information.`
//         },
//         {
//           role: "user",
//           content: userText
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: 150, // Keep responses concise for voice
//       top_p: 0.9,
//     });

//     const aiResponse = chatCompletion.choices[0]?.message?.content;
//     console.log("AI Response:", aiResponse);

//     if (!aiResponse) {
//       return new NextResponse("Could not generate AI response", { status: 500 });
//     }

//     // Step 3: Convert AI response to speech using OpenAI
//     console.log("Step 3: Converting response to speech...");
//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });

//     const mp3 = await openai.audio.speech.create({
//       model: "tts-1", // Use tts-1-hd for higher quality
//       voice: voice,
//       input: aiResponse,
//       speed: 1.0,
//       response_format: "mp3"
//     });

//     // Convert the response to a buffer
//     const audioBuffer = Buffer.from(await mp3.arrayBuffer());
    
//     // Convert buffer to base64 for JSON response
//     const audioBase64 = audioBuffer.toString('base64');

//     // Increase API limit count (this counts as 3 API calls: transcription, chat, and TTS)
//     if (!isPro)


// app/api/voice-to-voice/route.ts

import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
import { client } from "@/lib/utils"; // Groq client
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const OpenAI = require("openai");

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the form data
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const voice = (formData.get("voice") as string) || "alloy";

    if (!audioFile) {
      return new NextResponse("Audio file not found", { status: 400 });
    }

    // Validate voice parameter
    const validVoices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
    if (!validVoices.includes(voice)) {
      return new NextResponse("Invalid voice selection", { status: 400 });
    }

    // Check API limits
    const free_trial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!free_trial && !isPro) {
      return new NextResponse("Your free trial has expired", { status: 403 });
    }

    // Step 1: Voice -> Text (Groq Whisper)
    console.log("Step 1: Converting voice to text...");
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3", // or whisper-large-v3-turbo
      response_format: "json",
      language: "en",
      temperature: 0.0,
    });

    const userText = transcription.text;
    console.log("Transcription:", userText);

    if (!userText || userText.trim().length === 0) {
      return new NextResponse(
        "Could not transcribe audio. Please try speaking more clearly.",
        { status: 400 }
      );
    }

    // Step 2: AI Response (Groq Chat)
    console.log("Step 2: Generating AI response...");
    const chatCompletion = await client.chat.completions.create({
      model: "llama3-8b-8192", // or mixtral-8x7b-32768
      messages: [
        {
          role: "system",
          content: `You are a helpful, friendly AI assistant designed for voice conversations. 
                   Keep your responses natural, conversational, and concise (ideally 1-3 sentences). 
                   Respond as if you're having a spoken conversation - be warm, engaging, and personable.`,
        },
        { role: "user", content: userText },
      ],
      temperature: 0.7,
      max_tokens: 150,
      top_p: 0.9,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content;
    console.log("AI Response:", aiResponse);

    if (!aiResponse) {
      return new NextResponse("Could not generate AI response", { status: 500 });
    }

    // Step 3: Text -> Speech (OpenAI TTS)
    console.log("Step 3: Converting response to speech...");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // or "tts-1-hd"
      voice: voice,
      input: aiResponse,
      speed: 1.0,
      response_format: "mp3",
    });

    // Convert to Buffer & Base64
    const audioBuffer = Buffer.from(await mp3.arrayBuffer());
    const audioBase64 = audioBuffer.toString("base64");

    // Step 4: Increase API usage
    if (!isPro) {
      // Count this as 3 calls: STT, Chat, TTS
      await increaseApiLimit();
      await increaseApiLimit();
      await increaseApiLimit();
    }

    // Step 5: Return JSON with transcript + AI response + speech
    return NextResponse.json({
      success: true,
      transcription: userText,
      aiResponse: aiResponse,
      audio: audioBase64, // front-end can convert base64 → Audio
      format: "mp3",
      voice: voice,
    });
  } catch (error) {
    console.error("Voice-to-Voice Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

