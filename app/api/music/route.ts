import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import ReplicateAi from "replicate";

const replicate = new ReplicateAi({
  auth: process.env.REPLICATE_API_TOKEN,
});
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Music prompt not found", { status: 400 });
    }
    const input = {
      prompt_b: prompt,
    };

    const free_trial = await checkApiLimit();

    if (!free_trial) {
      return new NextResponse("Your free trial has expired", { status: 403 });
    }

    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      { input }
    );

    await increaseApiLimit();

    return NextResponse.json(response);
  } catch (error) {
    console.log("Music generation error: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
