import "server-only";
import Groq from "groq-sdk";

// Server-only: the key must never reach the browser bundle.
// Created on first use, not at import: `next build` imports every route
// without runtime secrets, and the Groq constructor throws on a missing key.
let instance: Groq | undefined;

export const client = new Proxy({} as Groq, {
  get(_target, prop) {
    instance ??= new Groq({ apiKey: process.env.GROQ_API_KEY });
    return Reflect.get(instance, prop, instance);
  },
});
