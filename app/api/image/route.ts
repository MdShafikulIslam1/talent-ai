import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
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
    const { prompt, amount, resolution } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt || !amount || !resolution) {
      return new NextResponse("Message or amount or resolution not found", {
        status: 400,
      });
    }

    const free_trial = await checkApiLimit();

    const isPro = await checkSubscription();

    if (!free_trial && !isPro) {
      return new NextResponse("Your free trial has expired", { status: 403 });
    }

    const completion = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    await increaseApiLimit();

    return NextResponse.json(completion.data);
  } catch (error) {
    console.log("Image generation  error: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
