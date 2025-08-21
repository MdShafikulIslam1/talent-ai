// // app/api/image-creator/route.ts

// import { checkSubscription } from "@/lib/subscription";
// import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
// import { client, openai } from "@/lib/utils"; // Using your existing Groq client
// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// // Image generation models available
// const IMAGE_MODELS = {
//   "dall-e-3": "dall-e-3",
//   "dall-e-2": "dall-e-2"
// };

// // Image sizes for different models
// const IMAGE_SIZES = {
//   "dall-e-3": ["1024x1024", "1792x1024", "1024x1792"],
//   "dall-e-2": ["256x256", "512x512", "1024x1024"]
// };

// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const body = await req.json();
//     const { 
//       prompt, 
//       model = "dall-e-3", 
//       size = "1024x1024", 
//       quality = "standard",
//       style = "vivid",
//       n = 1 
//     } = body;

//     console.log("Image generation request:", { prompt, model, size, quality, style });

//     // Validate required fields
//     if (!prompt || !prompt.trim()) {
//       return new NextResponse("Prompt is required", { status: 400 });
//     }

//     if (prompt.length > 4000) {
//       return new NextResponse("Prompt is too long. Maximum 4000 characters allowed.", { status: 400 });
//     }

//     // Validate model
//     if (!Object.keys(IMAGE_MODELS).includes(model)) {
//       return new NextResponse("Invalid model selection", { status: 400 });
//     }

//     // Validate size for the selected model
//     if (!IMAGE_SIZES[model as keyof typeof IMAGE_SIZES]?.includes(size)) {
//       return new NextResponse(`Invalid size for ${model} model`, { status: 400 });
//     }

//     // Validate quality (only for DALL-E 3)
//     if (model === "dall-e-3" && !["standard", "hd"].includes(quality)) {
//       return new NextResponse("Invalid quality. Must be 'standard' or 'hd'", { status: 400 });
//     }

//     // Validate style (only for DALL-E 3)
//     if (model === "dall-e-3" && !["vivid", "natural"].includes(style)) {
//       return new NextResponse("Invalid style. Must be 'vivid' or 'natural'", { status: 400 });
//     }

//     // Validate number of images
//     if (n < 1 || n > (model === "dall-e-3" ? 1 : 10)) {
//       const maxImages = model === "dall-e-3" ? 1 : 10;
//       return new NextResponse(`Invalid number of images. Must be between 1 and ${maxImages}`, { status: 400 });
//     }

//     // Check API limits
//     const free_trial = await checkApiLimit();
//     const isPro = await checkSubscription();

//     if (!free_trial && !isPro) {
//       return new NextResponse("Your free trial has expired", { status: 403 });
//     }

//     // Build request parameters
//     const imageParams: any = {
//       model,
//       prompt: prompt.trim(),
//       n,
//       size,
//       response_format: "url"
//     };

//     // Add DALL-E 3 specific parameters
//     if (model === "dall-e-3") {
//       imageParams.quality = quality;
//       imageParams.style = style;
//     }

//      const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY, // Use server-side env var
//     });

//     // Generate image using OpenAI
//     const response = await openai.images.generate(imageParams);

//     // Increase API limit count
//     if (!isPro) {
//       await increaseApiLimit();
//     }

//     // Return the generated images
//     return NextResponse.json({
//       images: response.data,
//       model,
//       size,
//       quality: model === "dall-e-3" ? quality : undefined,
//       style: model === "dall-e-3" ? style : undefined
//     });

//   } catch (error) {
//     console.log("Image generation error: ", error);
    
//     // Handle specific errors
//     if (error instanceof Error) {
//       if (error.message.includes('rate_limit')) {
//         return new NextResponse("Rate limit exceeded. Please try again later.", { status: 429 });
//       }
//       if (error.message.includes('invalid_request')) {
//         return new NextResponse("Invalid request. Please check your prompt.", { status: 400 });
//       }
//       if (error.message.includes('quota')) {
//         return new NextResponse("API quota exceeded. Please try again later.", { status: 429 });
//       }
//       if (error.message.includes('content_policy')) {
//         return new NextResponse("Your prompt violates content policy. Please try a different prompt.", { status: 400 });
//       }
//       if (error.message.includes('billing')) {
//         return new NextResponse("Billing issue. Please check your API credits.", { status: 402 });
//       }
//     }
    
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }




// app/api/image-creator/route.ts
// app/api/image-creator/route.ts

import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Hugging Face models for image generation (free) - Updated
const HF_MODELS = {
  "stable-diffusion-xl": "runwayml/stable-diffusion-v1-5",
  "stable-diffusion-2": "stabilityai/stable-diffusion-2-1",
  "stable-diffusion-3": "CompVis/stable-diffusion-v1-4",
};

// DeepAI API endpoint
const DEEPAI_API_URL = "https://api.deepai.org/api/text2img";

// ------------------- PROVIDER FUNCTIONS -------------------

// Hugging Face
async function generateImageWithHuggingFace(prompt: string, model: string): Promise<string> {
  const HF_API_URL = `https://api-inference.huggingface.co/models/${model}`;
  console.log(`Trying Hugging Face with model: ${model}`);

  const response = await fetch(HF_API_URL, {
    headers: {
      "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      inputs: prompt,
      options: { wait_for_model: true, use_cache: false },
    }),
  });

  console.log(`HF Response status: ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`HF Error response: ${errorText}`);
    throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
  }

  // Convert image buffer → base64 string
  const buffer = Buffer.from(await response.arrayBuffer());
  console.log("HF Raw Response size:", buffer.length);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// Replicate
async function generateImageWithReplicate(prompt: string): Promise<string> {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", // Stable Diffusion
      input: { prompt, width: 512, height: 512, num_inference_steps: 20, guidance_scale: 7.5 },
    }),
  });

  if (!response.ok) throw new Error(`Replicate API error: ${response.status}`);
  let result = await response.json();

  // Poll until ready
  while (result.status === "starting" || result.status === "processing") {
    await new Promise((r) => setTimeout(r, 1000));
    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: { "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}` },
    });
    if (!statusResponse.ok) throw new Error("Failed to check prediction status");
    result = await statusResponse.json();
  }

  if (result.status === "succeeded" && result.output) {
    return Array.isArray(result.output) ? result.output[0] : result.output;
  }
  throw new Error("Image generation failed");
}

// DeepAI
async function generateImageWithDeepAI(prompt: string): Promise<string> {
  const response = await fetch(DEEPAI_API_URL, {
    method: "POST",
    headers: {
      "Api-Key": process.env.DEEPAI_API_KEY || "",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ text: prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`DeepAI Error: ${errorText}`);
    throw new Error(`DeepAI API error: ${response.status}`);
  }

  const result = await response.json();
  return result.output_url;
}

// Pollinations (free fallback)
async function generateImageWithPollinations(prompt: string): Promise<string> {
  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&model=flux`;

  const response = await fetch(imageUrl, { method: "HEAD" });
  if (!response.ok) throw new Error("Pollinations API error");

  return imageUrl;
}

// ------------------- API HANDLER -------------------

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const {
      prompt,
      model = "stable-diffusion-xl",
      size = "512x512",
      provider = "pollinations",
    } = body;

    console.log("Free image generation request:", { prompt, model, provider });

    if (!prompt?.trim()) return new NextResponse("Prompt is required", { status: 400 });
    if (prompt.length > 1000)
      return new NextResponse("Prompt is too long. Maximum 1000 characters allowed.", { status: 400 });

    const free_trial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!free_trial && !isPro) return new NextResponse("Your free trial has expired", { status: 403 });

    let imageUrl: string;

    try {
      switch (provider) {
        case "replicate":
          imageUrl = process.env.REPLICATE_API_TOKEN
            ? await generateImageWithReplicate(prompt.trim())
            : await generateImageWithPollinations(prompt.trim());
          break;

        case "huggingface":
          if (!process.env.HUGGING_FACE_API_KEY) {
            console.log("No HF token, falling back to Pollinations");
            imageUrl = await generateImageWithPollinations(prompt.trim());
          } else {
            console.log("Using Hugging Face API");
            const selectedModel = HF_MODELS[model as keyof typeof HF_MODELS] || HF_MODELS["stable-diffusion-xl"];
            imageUrl = await generateImageWithHuggingFace(prompt.trim(), selectedModel);
          }
          break;

        case "deepai":
          imageUrl = process.env.DEEPAI_API_KEY
            ? await generateImageWithDeepAI(prompt.trim())
            : await generateImageWithPollinations(prompt.trim());
          break;

        case "pollinations":
        default:
          imageUrl = await generateImageWithPollinations(prompt.trim());
          break;
      }

      if (!isPro) await increaseApiLimit();

      return NextResponse.json({
        images: [{ url: imageUrl, revised_prompt: prompt.trim() }],
        model: `${provider}-${model}`,
        size,
        provider,
      });
    } catch (providerError) {
      console.log(`${provider} error, falling back to Pollinations:`, providerError);

      imageUrl = await generateImageWithPollinations(prompt.trim());
      if (!isPro) await increaseApiLimit();

      return NextResponse.json({
        images: [{ url: imageUrl, revised_prompt: prompt.trim() }],
        model: "pollinations-free",
        size: "512x512",
        provider: "pollinations",
      });
    }
  } catch (error) {
    console.log("Image generation error: ", error);

    if (error instanceof Error) {
      if (error.message.includes("rate_limit") || error.message.includes("429"))
        return new NextResponse("Rate limit exceeded. Please try again later.", { status: 429 });
      if (error.message.includes("invalid_request") || error.message.includes("400"))
        return new NextResponse("Invalid request. Please check your prompt.", { status: 400 });
      if (error.message.includes("content_policy"))
        return new NextResponse("Your prompt violates content policy. Please try a different prompt.", { status: 400 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
