// app/api/voice-assistant/route.ts
import { NextResponse } from "next/server";
import { client } from "@/lib/utils"; // Your existing Groq client

// TypeScript interfaces
interface Route {
  label: string;
  href: string;
  keywords: string[];
  description: string;
}

interface Intent {
  type: 'list_features' | 'detailed_features' | 'navigation' | 'route_info' | 'help' | 'unknown';
  route?: Route;
  confidence: number;
  matchedKeywords?: string[];
}

interface ResponseContent {
  name?: string;
  description?: string;
  route?: string;
  icon?: string;
  text?: string;
  example?: string;
  command?: string;
}

interface VoiceResponse {
  type: 'features' | 'detailed_features' | 'navigation' | 'route_info' | 'help' | 'error' | 'default';
  title: string;
  message?: string;
  content?: ResponseContent[] | ResponseContent;
  suggestion?: string;
}

// Define your routes and features with comprehensive keywords
const routes: Route[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    keywords: ["dashboard", "home", "main", "overview", "control panel", "summary", "stats", "statistics"],
    description: "Main dashboard with overview of all features and usage statistics"
  },
  {
    label: "Conversation",
    href: "/conversation", 
    keywords: ["conversation", "chat", "talk", "discuss", "dialogue", "speak", "communicate", "ai chat", "chatbot", "messaging"],
    description: "AI-powered chat conversations with advanced language models for natural dialogue"
  },
  {
    label: "Code Generation",
    href: "/code",
    keywords: ["code", "programming", "coding", "generate code", "development", "script", "algorithm", "software", "developer", "program"],
    description: "Generate clean, efficient code in multiple programming languages with AI assistance"
  },
  {
    label: "Sentiment Analysis", 
    href: "/sentiment",
    keywords: ["sentiment", "emotion", "feeling", "analyze", "mood", "opinion", "attitude", "emotional analysis", "text analysis"],
    description: "Analyze emotions and sentiments in text with AI precision and detailed insights"
  },
  {
    label: "Voice to Text",
    href: "/voice-to-text",
    keywords: ["voice to text", "speech to text", "transcribe", "dictation", "voice recognition", "audio to text", "speech recognition"],
    description: "Convert speech to accurate text transcriptions instantly using advanced AI"
  },
  {
    label: "Text to Audio",
    href: "/text-to-audio", 
    keywords: ["text to audio", "text to speech", "voice", "audio", "speak", "narration", "voice synthesis", "audio generation"],
    description: "Transform written content into natural-sounding speech with AI voice synthesis"
  },
  {
    label: "Voice to Voice",
    href: "/voice-to-voice",
    keywords: ["voice to voice", "voice chat", "audio conversation", "voice dialogue", "speaking", "voice communication"],
    description: "Real-time voice conversation with AI assistant for natural interactions"
  },
  {
    label: "Text Translation",
    href: "/translation",
    keywords: ["translation", "translate", "language", "convert language", "multilingual", "interpreter", "foreign language"],
    description: "Translate text between multiple languages accurately with AI-powered translation"
  },
  {
    label: "Grammar Correction",
    href: "/grammar-correction",
    keywords: ["grammar", "correct", "fix", "spelling", "writing", "proofreading", "editing", "language correction"],
    description: "Fix grammar, spelling, and style errors intelligently with AI assistance"
  },
  {
    label: "Summarize Text", 
    href: "/summarize-text",
    keywords: ["summarize", "summary", "brief", "condense", "short", "abstract", "overview", "key points"],
    description: "Create concise summaries from long-form content using advanced AI algorithms"
  },
  {
    label: "Smart Paraphraser",
    href: "/smart-paraphraser", 
    keywords: ["paraphrase", "rewrite", "rephrase", "reword", "restructure", "reformulate", "restate"],
    description: "Rewrite content while maintaining original meaning with intelligent paraphrasing"
  },
  {
    label: "Settings",
    href: "/settings",
    keywords: ["settings", "preferences", "configuration", "account", "profile", "options", "customize"],
    description: "Manage your account settings and preferences for personalized experience"
  }
];

// Natural language processing function
function analyzeIntent(transcript: string): Intent {
  const lowerTranscript = transcript.toLowerCase().trim();
  
  // Remove common filler words and normalize
  const cleanTranscript = lowerTranscript
    .replace(/\b(um|uh|like|you know|actually|basically|so|well)\b/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  console.log('Analyzing transcript:', cleanTranscript);

  // Feature listing intents - more flexible matching
  const featureWords = ['features', 'capabilities', 'functions', 'tools', 'services', 'options', 'what can you do', 'what do you have', 'show me', 'list'];
  const hasFeatureIntent = featureWords.some(word => cleanTranscript.includes(word));
  
  if (hasFeatureIntent && !cleanTranscript.includes('detail') && !cleanTranscript.includes('more')) {
    return {
      type: 'list_features',
      confidence: 0.9
    };
  }

  // Detailed features intent
  const detailWords = ['more details', 'tell me more', 'detailed', 'explain', 'describe', 'information about', 'details about'];
  const hasDetailIntent = detailWords.some(word => cleanTranscript.includes(word));
  
  if (hasDetailIntent || (hasFeatureIntent && (cleanTranscript.includes('detail') || cleanTranscript.includes('more')))) {
    return {
      type: 'detailed_features',
      confidence: 0.9
    };
  }

  // Navigation intent - very flexible matching
  const navigationWords = ['go to', 'take me to', 'navigate to', 'open', 'visit', 'show me', 'bring me to', 'direct me to', 'access'];
  const hasNavigationKeyword = navigationWords.some(keyword => cleanTranscript.includes(keyword));
  
  // Find matching route with fuzzy matching
  let bestMatch: { route: Route; confidence: number; matchedKeywords: string[] } | null = null;
  
  for (const route of routes) {
    const matchedKeywords: string[] = [];
    let totalScore = 0;
    
    for (const keyword of route.keywords) {
      // Exact match
      if (cleanTranscript.includes(keyword)) {
        matchedKeywords.push(keyword);
        totalScore += keyword.length; // Longer matches get higher scores
      }
      // Fuzzy match for single words
      else if (keyword.split(' ').length === 1) {
        const words = cleanTranscript.split(' ');
        for (const word of words) {
          if (word.length > 3 && (keyword.includes(word) || word.includes(keyword))) {
            matchedKeywords.push(keyword);
            totalScore += word.length * 0.7; // Partial match gets lower score
          }
        }
      }
    }
    
    // Also check if route name is mentioned
    const routeName = route.label.toLowerCase();
    if (cleanTranscript.includes(routeName)) {
      matchedKeywords.push(routeName);
      totalScore += routeName.length * 1.5; // Route name match gets bonus
    }
    
    if (matchedKeywords.length > 0) {
      const confidence = Math.min(0.95, totalScore / 10); // Normalize confidence
      if (!bestMatch || confidence > bestMatch.confidence) {
        bestMatch = { route, confidence, matchedKeywords };
      }
    }
  }

  // If we found a good route match
  if (bestMatch && bestMatch.confidence > 0.3) {
    if (hasNavigationKeyword || bestMatch.confidence > 0.7) {
      return {
        type: 'navigation',
        route: bestMatch.route,
        confidence: bestMatch.confidence,
        matchedKeywords: bestMatch.matchedKeywords
      };
    } else {
      return {
        type: 'route_info',
        route: bestMatch.route,
        confidence: bestMatch.confidence,
        matchedKeywords: bestMatch.matchedKeywords
      };
    }
  }

  // Help intent
  const helpWords = ['help', 'how to', 'guide', 'instructions', 'commands', 'what can i say', 'how do i'];
  if (helpWords.some(word => cleanTranscript.includes(word))) {
    return {
      type: 'help',
      confidence: 0.8
    };
  }

  // If no clear intent but we have some feature-related words
  if (cleanTranscript.includes('feature') || cleanTranscript.includes('tool') || cleanTranscript.includes('service')) {
    return {
      type: 'list_features',
      confidence: 0.6
    };
  }

  return {
    type: 'unknown',
    confidence: 0.1
  };
}

function generateResponse(intent: Intent, transcript: string): VoiceResponse {
  switch (intent.type) {
    case 'list_features':
      return {
        type: 'features',
        title: '🚀 Our Amazing AI Features',
        message: 'Here are our key AI-powered features that can help you:',
        content: routes.filter(r => r.href !== '/dashboard' && r.href !== '/settings').slice(0, 6).map(r => ({
          name: r.label,
          description: r.description,
          route: r.href,
          icon: getFeatureIcon(r.label)
        })),
        suggestion: 'Click any feature to explore it, or say "tell me more about [feature name]" for details!'
      };

    case 'detailed_features':
      return {
        type: 'detailed_features',
        title: '✨ Detailed Feature Overview', 
        message: 'Here\'s what each of our AI features can do for you:',
        content: routes.filter(r => r.href !== '/dashboard' && r.href !== '/settings').slice(0, 4).map(r => ({
          name: r.label,
          description: r.description,
          route: r.href,
          icon: getFeatureIcon(r.label)
        })),
        suggestion: 'Want to try any of these? Just say "go to [feature name]" or click the feature!'
      };

    case 'navigation':
      if (!intent.route) {
        return generateDefaultResponse();
      }
      return {
        type: 'navigation',
        title: `🎯 Navigating to ${intent.route.label}`,
        message: `Taking you to ${intent.route.label} now...`,
        content: {
          name: intent.route.label,
          description: intent.route.description,
          route: intent.route.href,
          icon: getFeatureIcon(intent.route.label)
        },
        suggestion: 'Redirecting you now!'
      };

    case 'route_info':
      if (!intent.route) {
        return generateDefaultResponse();
      }
      return {
        type: 'route_info',
        title: `💡 About ${intent.route.label}`,
        message: `Here's what our ${intent.route.label} feature can do:`,
        content: {
          name: intent.route.label,
          description: intent.route.description,
          route: intent.route.href,
          icon: getFeatureIcon(intent.route.label)
        },
        suggestion: `Say "go to ${intent.route.label.toLowerCase()}" to visit this feature!`
      };

    case 'help':
      return {
        type: 'help',
        title: '🤖 Voice Assistant Help',
        message: 'I understand natural speech! Here are some examples:',
        content: [
          { text: 'Explore features', example: '"What features do you have?" or "Show me your tools"' },
          { text: 'Get detailed info', example: '"Tell me more about conversation" or "Explain voice to text"' },
          { text: 'Navigate anywhere', example: '"Go to dashboard" or "Take me to settings"' },
          { text: 'General questions', example: '"What can you do?" or "Help me navigate"' }
        ],
        suggestion: 'Speak naturally - I understand context and can help you explore our website!'
      };

    default:
      return generateDefaultResponse();
  }
}

function generateDefaultResponse(): VoiceResponse {
  return {
    type: 'default',
    title: '🤖 AI Voice Assistant',
    message: 'I\'m here to help you explore our AI-powered features and navigate the website!',
    content: [
      { text: '🔍 Explore our AI features', command: 'show me features' },
      { text: '📍 Navigate to any section', command: 'go to conversation' },
      { text: '📚 Learn feature details', command: 'tell me about voice to text' },
      { text: '❓ Get help and examples', command: 'help me' }
    ],
    suggestion: 'Try speaking naturally - I understand context and various ways of asking!'
  };
}

function getFeatureIcon(featureName: string): string {
  const iconMap: { [key: string]: string } = {
    'Conversation': '💬',
    'Code Generation': '👨‍💻', 
    'Sentiment Analysis': '🎭',
    'Voice to Text': '🎙️',
    'Text to Audio': '🔊',
    'Voice to Voice': '🗣️',
    'Text Translation': '🌐',
    'Grammar Correction': '✅',
    'Summarize Text': '📄',
    'Smart Paraphraser': '🔄',
    'Dashboard': '🏠',
    'Settings': '⚙️'
  };
  return iconMap[featureName] || '✨';
}

export async function POST(req: Request) {
  try {
    // No authentication required for voice assistant
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({
        success: false,
        error: "No audio file provided",
        response: {
          type: 'error',
          title: '❌ No Audio',
          message: 'No audio file was received. Please try recording again.',
          suggestion: 'Make sure to speak into your microphone and try again.'
        }
      }, { status: 400 });
    }

    // Validate audio file
    if (audioFile.size === 0) {
      return NextResponse.json({
        success: false,
        error: "Empty audio file",
        response: {
          type: 'error',
          title: '❌ Empty Audio',
          message: 'The audio file appears to be empty. Please try recording again.',
          suggestion: 'Make sure you speak clearly into your microphone.'
        }
      }, { status: 400 });
    }

    console.log(`Processing audio file: ${audioFile.name}, size: ${audioFile.size} bytes`);

    // Convert audio to text using Groq Whisper
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3", 
      response_format: "json",
      language: "en", // Can be made dynamic based on user preference
      temperature: 0.1, // Low temperature for more consistent results
      prompt: "This is a voice command for a website with AI features like conversation, code generation, voice to text, text to audio, translation, and more." // Help with context
    });

    const transcript = transcription.text?.trim();
    
    if (!transcript) {
      return NextResponse.json({
        success: false,
        error: "No speech detected",
        response: {
          type: 'error',
          title: '❌ No Speech Detected',
          message: 'I couldn\'t hear any speech in your recording. Please try again.',
          suggestion: 'Speak clearly and make sure your microphone is working properly.'
        }
      }, { status: 400 });
    }

    console.log('Transcribed text:', transcript);

    // Analyze intent and generate response
    const intent = analyzeIntent(transcript);
    console.log('Detected intent:', intent);
    
    const response = generateResponse(intent, transcript);

    return NextResponse.json({
      success: true,
      transcript: transcript,
      intent: intent.type,
      confidence: intent.confidence,
      matchedKeywords: intent.matchedKeywords,
      response: response
    });

  } catch (error) {
    console.error("Voice assistant error:", error);
    
    // Handle specific Groq errors
    let errorResponse: VoiceResponse;
    
    if (error instanceof Error) {
      if (error.message.includes('rate_limit') || error.message.includes('429')) {
        errorResponse = {
          type: 'error',
          title: '⏱️ Rate Limit',
          message: 'Too many requests. Please wait a moment before trying again.',
          suggestion: 'Please wait a few seconds and try your voice command again.'
        };
        return NextResponse.json({
          success: false,
          error: "Rate limit exceeded",
          response: errorResponse
        }, { status: 429 });
      }
      
      if (error.message.includes('invalid_request') || error.message.includes('400')) {
        errorResponse = {
          type: 'error',
          title: '🎵 Audio Format Issue',
          message: 'There was an issue with the audio format. Please try recording again.',
          suggestion: 'Make sure you\'re using a supported browser and speak clearly.'
        };
        return NextResponse.json({
          success: false,
          error: "Invalid audio format",
          response: errorResponse
        }, { status: 400 });
      }
    }
    
    // Generic error response
    errorResponse = {
      type: 'error',
      title: '⚠️ Processing Error',
      message: 'I\'m having trouble processing your voice right now. Please try again.',
      suggestion: 'Check your internet connection and try speaking your command again.'
    };
    
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      response: errorResponse
    }, { status: 500 });
  }
}