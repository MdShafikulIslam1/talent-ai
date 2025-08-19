import * as z from "zod";

export const formSchema = z.object({
  file: z.any(),
  language: z.string().min(1, "Language is required"),
});

// export const languageOptions = [
//   { value: "fr", label: "French" },
//   { value: "es", label: "Spanish" },
//   { value: "bn", label: "Bengali" },
//   { value: "hi", label: "Hindi" },
//   { value: "de", label: "German" },
//   { value: "ar", label: "Arabic" },
//   { value: "zh", label: "Chinese" },
//   { value: "ru", label: "Russian" },
// ];
export const languageOptions = [
  { label: "English", value: "English" },
  { label: "Bengali", value: "Bengali" },
  { label: "Spanish", value: "Spanish" },
];
