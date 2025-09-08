// import { checkSubscription } from "@/lib/subscription";
// import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
// import { client } from "@/lib/utils";
// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const groq = client;

// const instructionMessage = {
//   role: "system",
//   content:
//     "You are a code generator. You must return only markdown code blocks with the correct language tag (e.g., ```javascript). Use code comments for explanation.",
// };
// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
//     const body = await req.json();
//     const { messages } = body;

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!messages) {
//       return new NextResponse("Message not found", { status: 400 });
//     }

//     const free_trial = await checkApiLimit();
//     const isPro = await checkSubscription();
//     if (!free_trial && !isPro) {
//       return new NextResponse("Your free trial has expired", { status: 403 });
//     }

//     const completion = await groq.chat.completions.create({
//       messages: [instructionMessage, ...messages],
//       // model: "gpt-3.5-turbo",
//       model:"llama-3.1-8b-instant"
      
//     });

//     await increaseApiLimit();

//     return NextResponse.json(completion.choices[0].message);
//   } catch (error) {
//     console.log("Code generation error: ", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }


import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, increaseApiLimit } from "@/lib/userApiLimit";
import { client } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const groq = client;

// Enhanced system instruction with better guidelines
const getInstructionMessage = (language?: string) => ({
  role: "system" as const,
  content: `You are an expert code generator specialized in writing clean, efficient, and production-ready code.

STRICT REQUIREMENTS:
- Return ONLY markdown code blocks with correct language tags (e.g., \`\`\`javascript, \`\`\`python)
- Write production-quality code with proper error handling
- Use clear, descriptive variable names and functions
- Include helpful comments explaining complex logic
- Follow best practices and conventions for the specified language
- Optimize for readability and maintainability
- Include input validation where appropriate
- Handle edge cases

${language ? `Focus on ${language.toUpperCase()} specific best practices and idioms.` : ''}

Do NOT include explanations outside the code blocks.`,
});

// Message validation and sanitization
function validateMessages(messages: any[]): { isValid: boolean; error?: string } {
  if (!Array.isArray(messages)) {
    return { isValid: false, error: "Messages must be an array" };
  }

  if (messages.length === 0) {
    return { isValid: false, error: "At least one message is required" };
  }

  if (messages.length > 10) {
    return { isValid: false, error: "Too many messages (max 10)" };
  }

  for (const message of messages) {
    if (!message.role || !message.content) {
      return { isValid: false, error: "Each message must have role and content" };
    }
    
    if (!['user', 'assistant', 'system'].includes(message.role)) {
      return { isValid: false, error: "Invalid message role" };
    }

    if (typeof message.content !== 'string') {
      return { isValid: false, error: "Message content must be a string" };
    }

    if (message.content.length > 4000) {
      return { isValid: false, error: "Message content too long (max 4000 characters)" };
    }
  }

  return { isValid: true };
}

// Extract programming language from messages
function extractLanguage(messages: any[]): string | undefined {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    'javascript': 'javascript',
    'js': 'javascript',
    'typescript': 'typescript',
    'ts': 'typescript',
    'python': 'python',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c++': 'cpp',
    'csharp': 'csharp',
    'c#': 'csharp',
    'php': 'php',
    'ruby': 'ruby',
    'go': 'go',
    'rust': 'rust',
    'swift': 'swift',
    'kotlin': 'kotlin',
  };

  for (const [key, value] of Object.entries(languageMap)) {
    if (lastMessage?.includes(key)) {
      return value;
    }
  }

  return undefined;
}

// Calculate appropriate model and parameters based on request complexity
function getOptimalSettings(messages: any[]) {
  const totalLength = messages.reduce((sum, msg) => sum + msg.content.length, 0);
  const hasComplexKeywords = messages.some(msg => 
    msg.content.toLowerCase().includes('complex') ||
    msg.content.toLowerCase().includes('advanced') ||
    msg.content.toLowerCase().includes('full application') ||
    msg.content.toLowerCase().includes('complete system')
  );

  // Use more powerful model for complex requests
  if (totalLength > 1000 || hasComplexKeywords) {
    return {
      model: "llama3-70b-8192",
      temperature: 0.3,
      max_tokens: 2500,
    };
  }

  // Use faster model for simple requests
  return {
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
    max_tokens: 1500,
  };
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { messages } = body;

    // Enhanced validation
    const validation = validateMessages(messages);
    if (!validation.isValid) {
      return new NextResponse(validation.error, { status: 400 });
    }

    // Check limits before making API call
    const free_trial = await checkApiLimit();
    const isPro = await checkSubscription();
    
    if (!free_trial && !isPro) {
      return new NextResponse("Your free trial has expired. Please upgrade to continue.", { 
        status: 403 
      });
    }

    // Extract language for better system prompt
    const detectedLanguage = extractLanguage(messages);
    const instructionMessage = getInstructionMessage(detectedLanguage);

    // Get optimal settings based on request complexity
    const settings = getOptimalSettings(messages);

    console.log(`Code generation request: ${settings.model}, Language: ${detectedLanguage || 'auto-detect'}`);

    // Enhanced completion call with retry logic
    let completion;
    let retries = 0;
    const maxRetries = 2;

    while (retries <= maxRetries) {
      try {
        completion = await groq.chat.completions.create({
          messages: [instructionMessage, ...messages],
          ...settings,
          stream: false, // Ensure we get complete response
        });
        break; // Success, exit retry loop
      } catch (apiError: any) {
        retries++;
        
        if (retries > maxRetries) {
          throw apiError;
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
        console.log(`Retry ${retries}/${maxRetries} for code generation`);
      }
    }

    // Validate response
    const responseMessage = completion?.choices[0]?.message;
    if (!responseMessage || !responseMessage.content) {
      throw new Error("Empty response from AI model");
    }

    // Validate that response contains code blocks
    const hasCodeBlocks = responseMessage.content.includes('```');
    if (!hasCodeBlocks) {
      console.warn("Response doesn't contain code blocks, wrapping in generic block");
      responseMessage.content = `\`\`\`${detectedLanguage || 'text'}\n${responseMessage.content}\n\`\`\``;
    }

    // Only increment after successful completion
    await increaseApiLimit();

    // Enhanced logging
    const codeBlockCount = (responseMessage.content.match(/```/g) || []).length / 2;
    console.log(`Code generation completed: ${codeBlockCount} code blocks, ${responseMessage.content.length} characters`);

    // Return enhanced response
    return NextResponse.json({
      ...responseMessage,
      metadata: {
        model: settings.model,
        language: detectedLanguage,
        codeBlocks: Math.floor(codeBlockCount),
        responseLength: responseMessage.content.length,
        generatedAt: new Date().toISOString(),
      }
    });

  } catch (error: any) {
    console.error("Code generation error:", error);
    
    // Enhanced error handling with specific error types
    if (error.message?.includes('rate limit') || error.status === 429) {
      return new NextResponse("Rate limit exceeded. Please wait a moment and try again.", { 
        status: 429 
      });
    }
    
    if (error.message?.includes('quota') || error.status === 402) {
      return new NextResponse("API quota exceeded. Please try again later.", { 
        status: 402 
      });
    }
    
    if (error.message?.includes('timeout') || error.code === 'timeout') {
      return new NextResponse("Request timeout. Please try a simpler request.", { 
        status: 408 
      });
    }
    
    if (error.message?.includes('content_filter')) {
      return new NextResponse("Request blocked by content filter. Please rephrase your request.", { 
        status: 400 
      });
    }

    // Network or connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return new NextResponse("Service temporarily unavailable. Please try again.", { 
        status: 503 
      });
    }
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Optional: Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "code-generation-api",
    timestamp: new Date().toISOString(),
    supportedLanguages: [
      "javascript", "typescript", "python", "java", "cpp", 
      "csharp", "php", "ruby", "go", "rust", "swift", "kotlin"
    ]
  });
}
