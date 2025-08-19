import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
import { client } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { text } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!text) {
      return new NextResponse("Message not found", { status: 400 });
    }

    const free_trial = await checkApiLimit();

    const isPro = await checkSubscription();

    if (!free_trial && !isPro) {
      return new NextResponse("Your free trial has expired", { status: 403 });
    }
    const prompt = `Correct the grammar and rewrite this: "${text}"`;
    const completion = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
    });
    await increaseApiLimit();

    return NextResponse.json(completion.choices[0].message.content);
  } catch (error) {
    console.log("Conversation error: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
