import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
import { client } from "@/lib/groq";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Groq caps audio uploads at 25 MB.
const MAX_BYTES = 25 * 1024 * 1024;
const LANGUAGES = ["English", "Bengali", "Spanish", "French", "Hindi", "German", "Arabic"];

/**
 * Speech translation: Whisper transcribes the recording, then the chat model
 * translates the transcript into the chosen language.
 */
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const language = String(formData.get("language") || "English");

    if (!(file instanceof File) || file.size === 0) {
      return new NextResponse("Audio file is required", { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return new NextResponse("Audio file is too large. Maximum 25 MB.", { status: 400 });
    }
    if (!LANGUAGES.includes(language)) {
      return new NextResponse("Unsupported language", { status: 400 });
    }

    const free_trial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!free_trial && !isPro) {
      return new NextResponse("Your free trial has expired", { status: 403 });
    }

    const transcription = await client.audio.transcriptions.create({
      file,
      model: "whisper-large-v3",
      response_format: "json",
      temperature: 0,
    });
    const transcript = transcription.text.trim();
    if (!transcript) {
      return new NextResponse("No speech was found in this recording.", { status: 422 });
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the user's text into ${language}. Keep the meaning, tone and names. Reply with the translation only, no notes or quotes. If the text is already in ${language}, return it unchanged.`,
        },
        { role: "user", content: transcript },
      ],
    });
    const translation = completion.choices[0]?.message?.content?.trim();
    if (!translation) {
      return new NextResponse("Could not translate this recording. Please try again.", { status: 502 });
    }

    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json({ transcript, translation, language });
  } catch (error) {
    console.log("[AUDIO_TRANSLATION_ERROR]", error);
    if (error instanceof Error && error.message.includes("rate_limit")) {
      return new NextResponse("Rate limit exceeded. Please try again later.", { status: 429 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
