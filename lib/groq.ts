import "server-only";
import Groq from "groq-sdk";

// Server-only: the key must never reach the browser bundle.
export const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
