// import { checkSubscription } from "@/lib/subscription";
// import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Get the form data containing the audio file
//     const formData = await req.formData();
//     const audioFile = formData.get("audio") as File;

//     if (!audioFile) {
//       return new NextResponse("Audio file not found", { status: 400 });
//     }

//     // Check API limits
//     const free_trial = await checkApiLimit();
//     const isPro = await checkSubscription();

//     if (!free_trial && !isPro) {
//       return new NextResponse("Your free trial has expired", { status: 403 });
//     }

//     // Convert the audio file to transcription using OpenAI Whisper
//     const transcription = await openai.audio.transcriptions.create({
//       file: audioFile,
//       model: "whisper-1",
//       response_format: "json",
//       language: "bn", // Optional: specify language
//     });

//     // Increase API limit count
//     if (!isPro) {
//       await increaseApiLimit();
//     }

//     return NextResponse.json({ 
//       text: transcription.text,
//       success: true 
//     });

//   } catch (error) {
//     console.log("Voice to text error: ", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }


// USING GROQ Whisper for Voice to Text Conversion


import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
import { client } from "@/lib/utils"; // Using your existing client
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the form data containing the audio file
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return new NextResponse("Audio file not found", { status: 400 });
    }

    // Check API limits
    const free_trial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!free_trial && !isPro) {
      return new NextResponse("Your free trial has expired", { status: 403 });
    }

    // Convert the audio file to transcription using Groq Whisper
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      response_format: "json",
      language: "en", // Optional: specify language
      temperature: 0.0, // For more deterministic results
    });

    // Increase API limit count
    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json({ 
      text: transcription.text,
      success: true 
    });

  } catch (error) {
    console.log("Voice to text error: ", error);
    
    // Handle specific Groq errors
    if (error instanceof Error) {
      if (error.message.includes('rate_limit')) {
        return new NextResponse("Rate limit exceeded. Please try again later.", { status: 429 });
      }
      if (error.message.includes('invalid_request')) {
        return new NextResponse("Invalid audio format. Please try again with a different recording.", { status: 400 });
      }
    }
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}