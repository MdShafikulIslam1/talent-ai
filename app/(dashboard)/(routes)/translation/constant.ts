import * as z from "zod";

export const formSchema = z.object({
  text: z.string().min(1, "Text is required"),
  to: z.string().min(1, "To Language is required"),
});

export const languageOptions = [
  { label: "English", value: "English" },
  { label: "Bengali", value: "Bengali" },
  { label: "Spanish", value: "Spanish" },
];
