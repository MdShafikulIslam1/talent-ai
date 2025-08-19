"use client";

import Empty from "@/components/empty";
import Heading from "@/components/heading";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userProModal } from "@/hooks/user-pro-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./constant";

interface Message {
  role: string;
  content: string;
}

const GrammarCorrectionPage = () => {
  const proModal = userProModal();
  const [message, setMessage] = useState("");
  const [originalText, setOriginalText] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setMessage("");
    setOriginalText(data.prompt);
    try {
      const response = await axios.post("/api/grammar-correction", {
        text: data.prompt,
      });
      setMessage(response?.data);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }
    } finally {
      router.refresh();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <Heading
        title="Grammar Correction"
        description="Correct your grammar and spelling mistakes"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />

      <div className="px-4 lg:px-8 mb-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full p-4 px-3 md:px-6 border rounded-lg focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="How can I calculate the radius of the earth?"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Correcting..." : "Correct"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 space-y-4">
          {isLoading && (
            <div className="p-8 w-full rounded-lg flex items-center justify-center bg-muted">
              <Loader isLoading={isLoading} />
            </div>
          )}

          {!message && !isLoading && <Empty title="No conversation is started" />}

          {message && originalText && (
            <div className="relative p-6 border rounded-xl bg-violet-50 space-y-6 shadow-sm">
              {/* Original Text */}
              <div>
                <h2 className="text-lg font-bold mb-2 text-gray-800">
                  ✏️ Original Text
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {originalText}
                </p>
              </div>

              {/* Corrected Text with Copy */}
              <div>
                <button
                  onClick={handleCopy}
                  className="absolute top-0 right-0 mt-3 mr-2 flex items-center gap-2 bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 hover:from-violet-600 hover:to-violet-700 focus:outline-none"
                >
                  📋 <span>Copy</span>
                </button>

                {copied && (
                  <span className="absolute top-0 right-24 mt-4 text-sm text-violet-800 bg-white border border-violet-300 px-3 py-1 rounded shadow transition-opacity duration-200">
                    ✅ Copied!
                  </span>
                )}

                <h2 className="text-lg font-bold mb-2 text-violet-800">
                  ✅ Corrected Version
                </h2>
                <p className="text-violet-700 whitespace-pre-wrap">{message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrammarCorrectionPage;
