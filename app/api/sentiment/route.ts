import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
import { client } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const groq = client;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { text } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!text) {
      return new NextResponse("Message or Language not found", {
        status: 400,
      });
    }

    const free_trial = await checkApiLimit();

    const isPro = await checkSubscription();

    if (!free_trial && !isPro) {
      return new NextResponse("Your free trial has expired", { status: 403 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      // model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a sentiment analysis expert. Analyze the sentiment of the given text and respond with exactly one word: Positive, Negative, or Neutral. Do not include any explanation or additional text.",
        },
        {
          role: "user",
          content: `Analyze the sentiment: "${text}"`,
        },
      ],
    });

    await increaseApiLimit();
    completion.choices[0].message.content;
    console.log("sentiment");
    return NextResponse.json(completion.choices[0].message.content);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        return new NextResponse(
          "Rate limit exceeded. Please try again later.",
          { status: 429 }
        );
      }
      if (error.message.includes("quota")) {
        return new NextResponse("API quota exceeded", { status: 429 });
      }
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
