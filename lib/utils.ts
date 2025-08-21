import OpenAI from 'openai';import Groq from 'groq-sdk';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(url: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}${url}`;
}




export const client = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, // ✅ use .env
  dangerouslyAllowBrowser: true,
});


// Single OpenAI client for all operations
// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Use server-side env var
// });