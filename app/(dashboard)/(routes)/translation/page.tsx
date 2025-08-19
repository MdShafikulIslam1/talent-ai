"use client";
import Heading from "@/components/heading";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userProModal } from "@/hooks/user-pro-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema, languageOptions } from "./constant";

const TranslationPage = () => {
  const proModal = userProModal();
  const router = useRouter();
  const [translatedText, setTranslatedText] = useState<string>("");
  const [originalText, setOriginalText] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      to: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setTranslatedText("");
    setOriginalText("");
    try {
      const response = await axios.post("/api/translation", {
        text: data?.text,
        to: data?.to,
      });
      console.log("response",response?.data)
      setTranslatedText(response.data);
      setOriginalText(data?.text);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        console.error("Error during translation:", error);
      }
    } finally {
      router.refresh();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
  };

  return (
    <div>
      <Heading
        title="Text Translation"
        description="Translate any text from one language to another"
        icon={Languages}
        iconColor="text-blue-700"
        bgColor="bg-blue-700/10"
      />
      <div className="px-4 lg:px-8 mb-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full p-4 px-3 md:px-6 border rounded-lg focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              name="text"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-6">
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter text to translate..."
                      {...field}
                      className="border-0 focus-visible:ring-0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-2">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languageOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              disabled={isLoading}
              type="submit"
            >
              Translate
            </Button>
          </form>
        </Form>

        {/* Display output section */}
        <div className="mt-6 space-y-4">
          {isLoading && (
            <div className="p-8 w-full rounded-lg flex items-center justify-center bg-muted">
              <Loader isLoading={isLoading} />
            </div>
          )}

          {translatedText && originalText && (
            <div className="relative p-6 border rounded-xl bg-emerald-50 space-y-6 shadow-sm">
              {/* Original Text */}
              <div>
                <h2 className="text-lg font-bold mb-2 text-gray-800">
                  📝 Original Text
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {originalText}
                </p>
              </div>

              {/* Paraphrased Text with Top-Right Copy Button */}
              <div>
                <button
                  onClick={handleCopy}
                  className="absolute top-0 right-0 mt-3 mr-2 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none"
                >
                  📋 <span>Copy</span>
                </button>

                {copied && (
                  <span className="absolute top-0 right-24 mt-4 text-sm text-emerald-800 bg-white border border-emerald-300 px-3 py-1 rounded shadow transition-opacity duration-200">
                    ✅ Copied!
                  </span>
                )}

                <h2 className="text-lg font-bold mb-2 text-emerald-800">
                  🌐 Translated Version
                </h2>
                <p className="text-emerald-700 whitespace-pre-wrap">
                  {translatedText}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationPage;
