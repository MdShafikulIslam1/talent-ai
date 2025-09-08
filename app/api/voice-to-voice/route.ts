// // app/api/voice-to-voice/route.ts

// import { voices } from "@/const";
// import { checkSubscription } from "@/lib/subscription";
// import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
// import { client } from "@/lib/utils"; // Groq client
// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";


// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Get the form data
//     const formData = await req.formData();
//     const audioFile = formData.get("audio") as File;
//     const voice = (formData.get("voice") as string) || "alloy";

//     if (!audioFile) {
//       return new NextResponse("Audio file not found", { status: 400 });
//     }

//     // Validate voice parameter
//     const isValidVoice = voices.map(v => v.id === voice);
//      if (!isValidVoice.includes(true)) {
//        return new NextResponse("Invalid voice selection", { status: 400 });
//      }

//     // Check API limits
//     const free_trial = await checkApiLimit();
//     const isPro = await checkSubscription();
//     if (!free_trial && !isPro) {
//       return new NextResponse("Your free trial has expired", { status: 403 });
//     }

//     // Step 1: Voice -> Text (Groq Whisper)
//     console.log("Step 1: Converting voice to text...");
//     const transcription = await client.audio.transcriptions.create({
//       file: audioFile,
//       model: "whisper-large-v3", // or whisper-large-v3-turbo
//       response_format: "json",
//       language: "en",
//       temperature: 0.0,
//     });

//     const userText = transcription.text;
//     console.log("Transcription:", userText);

//     if (!userText || userText.trim().length === 0) {
//       return new NextResponse(
//         "Could not transcribe audio. Please try speaking more clearly.",
//         { status: 400 }
//       );
//     }

//     // Step 2: AI Response (Groq Chat)
//     console.log("Step 2: Generating AI response...");
//     const chatCompletion = await client.chat.completions.create({
//       model: "llama-3.1-8b-instant", // or mixtral-8x7b-32768
//       messages: [
//         {
//           role: "system",
//           content: `You are a helpful, friendly AI assistant designed for voice conversations. 
//                    Keep your responses natural, conversational, and concise (ideally 1-3 sentences). 
//                    Respond as if you're having a spoken conversation - be warm, engaging, and personable.`,
//         },
//         { role: "user", content: userText },
//       ],
//       temperature: 0.7,
//       max_tokens: 150,
//       top_p: 0.9,
//     });

//     const aiResponse = chatCompletion.choices[0]?.message?.content;
//     console.log("AI Response:", aiResponse);

//     if (!aiResponse) {
//       return new NextResponse("Could not generate AI response", { status: 500 });
//     }

//     // Step 3: Text -> Speech (OpenAI TTS)
//     console.log("Step 3: Converting response to speech...");

//     const mp3 = await client.audio.speech.create({
//       model: "playai-tts", // or "tts-1-hd"
//       voice: voice,
//       input: aiResponse,
//       speed: 1.0,
//       response_format: "mp3",
//     });

//     // Convert to Buffer & Base64
//     const audioBuffer = Buffer.from(await mp3.arrayBuffer());
//     const audioBase64 = audioBuffer.toString("base64");

//     // Step 4: Increase API usage
//     if (!isPro) {
//       // Count this as 3 calls: STT, Chat, TTS
//       await increaseApiLimit();
//       await increaseApiLimit();
//       await increaseApiLimit();
//     }

//     // Step 5: Return JSON with transcript + AI response + speech
//     return NextResponse.json({
//       success: true,
//       transcription: userText,
//       aiResponse: aiResponse,
//       audio: audioBase64, // front-end can convert base64 → Audio
//       format: "mp3",
//       voice: voice,
//     });
//   } catch (error) {
//     console.error("Voice-to-Voice Error:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }


// WITH MEMORY

// app/api/voice-to-voice/route.ts

import { voices } from "@/const";
import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
import { client } from "@/lib/utils"; // Groq client
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// In-memory storage for conversation history (you might want to use Redis or database in production)
const conversationMemory = new Map<string, Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>>();

// Helper function to manage conversation history
function getConversationHistory(userId: string) {
  return conversationMemory.get(userId) || [];
}

function addToConversationHistory(userId: string, role: 'user' | 'assistant', content: string) {
  const history = getConversationHistory(userId);
  history.push({ role, content, timestamp: new Date() });
  
  // Keep only last 10 conversations to manage memory usage
  if (history.length > 20) { // 10 user + 10 assistant messages
    history.splice(0, 2); // Remove oldest user-assistant pair
  }
  
  conversationMemory.set(userId, history);
}

function clearConversationHistory(userId: string) {
  conversationMemory.delete(userId);
}

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
    const clearHistory = formData.get("clearHistory") === "true";

    // Handle clear history request
    if (clearHistory) {
      clearConversationHistory(userId);
      return NextResponse.json({ 
        success: true, 
        message: "Conversation history cleared" 
      });
    }

    if (!audioFile) {
      return new NextResponse("Audio file not found", { status: 400 });
    }

    // Validate voice parameter
    const isValidVoice = voices.map(v => v.id === voice);
     if (!isValidVoice.includes(true)) {
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
      model: "whisper-large-v3",
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

    // Get conversation history for context
    const conversationHistory = getConversationHistory(userId);
    
    // Build messages array with conversation history
    const messages = [
      {
        role: "system" as const,
        content: `You are a helpful, friendly AI assistant designed for voice conversations. 
                 Keep your responses natural, conversational, and concise (ideally 1-3 sentences). 
                 Respond as if you're having a spoken conversation - be warm, engaging, and personable.
                 You have memory of previous conversations in this session, so you can reference earlier topics naturally.
                 If this is a follow-up question or relates to something discussed before, acknowledge that context.`,
      },
      // Add conversation history
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      // Add current user message
      { role: "user" as const, content: userText },
    ];

    // Step 2: AI Response (Groq Chat) with conversation context
    console.log("Step 2: Generating AI response with context...");
    const chatCompletion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messages,
      temperature: 0.7,
      max_tokens: 200, // Increased slightly for more context-aware responses
      top_p: 0.9,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content;
    console.log("AI Response:", aiResponse);

    if (!aiResponse) {
      return new NextResponse("Could not generate AI response", { status: 500 });
    }

    // Store both user input and AI response in conversation history
    addToConversationHistory(userId, 'user', userText);
    addToConversationHistory(userId, 'assistant', aiResponse);

    // Step 3: Text -> Speech (TTS)

    const mp3 = await client.audio.speech.create({
      model: "playai-tts",
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
      await increaseApiLimit();
      await increaseApiLimit();
      await increaseApiLimit();
    }

    // Step 5: Return JSON with transcript + AI response + speech + conversation count
    return NextResponse.json({
      success: true,
      transcription: userText,
      aiResponse: aiResponse,
      audio: audioBase64,
      format: "mp3",
      voice: voice,
      conversationCount: conversationHistory.length / 2, // Number of conversation pairs
      hasContext: conversationHistory.length > 0
    });
  } catch (error) {
    console.error("Voice-to-Voice Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Optional: Add a GET endpoint to retrieve conversation history
export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const history = getConversationHistory(userId);
    return NextResponse.json({
      success: true,
      history: history,
      count: history.length / 2
    });
  } catch (error) {
    console.error("Error fetching conversation history:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
