import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
import { client } from "@/lib/groq";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

/** Generates interview questions with short model answers for a role or topic. */
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { text } = await req.json();
    if (!text || typeof text !== "string" || !text.trim()) {
      return new NextResponse("Tell us the role or topic", { status: 400 });
    }
    if (text.length > 500) {
      return new NextResponse("Please keep it under 500 characters.", { status: 400 });
    }

    const free_trial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!free_trial && !isPro) {
      return new NextResponse("Your free trial has expired", { status: 403 });
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content:
            "You are an experienced hiring manager. Write 8 realistic interview questions for the role or topic the user gives, mixing technical, practical and behavioural questions. After each question, add a short model answer (2-3 sentences). Format as a numbered list: the question in bold on one line, then 'Answer:' and the answer. Plain Markdown only.",
        },
        { role: "user", content: text.trim() },
      ],
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      return new NextResponse("Could not generate questions. Please try again.", { status: 502 });
    }

    if (!isPro) {
      await increaseApiLimit();
    }
    return NextResponse.json(content);
  } catch (error) {
    console.log("[INTERVIEW_QUESTIONS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
