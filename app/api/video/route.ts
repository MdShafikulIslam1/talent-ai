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
      prompt: prompt,
    };

    const free_trial = await checkApiLimit();

    if (!free_trial) {
      return new NextResponse("Your free trial has expired", { status: 403 });
    }

    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      { input }
    );

    await increaseApiLimit();

    return NextResponse.json(response);
  } catch (error) {
    console.log("Video generation error: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
