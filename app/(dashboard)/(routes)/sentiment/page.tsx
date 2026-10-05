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
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// ✅ Form schema
const formSchema = z.object({
  prompt: z.string().min(1, { message: "Text is required" }),
});

const SentimentAnalyzerPage = () => {
  const proModal = userProModal();
  const [sentiment, setSentiment] = useState<string>("");
  const [originalText, setOriginalText] = useState<string>("");
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSentiment("");
    setOriginalText(data.prompt);
    try {
      const response = await axios.post("/api/sentiment", {
        text: data.prompt,
      });
      console.log("response sentiment",response.data)
      setSentiment(response?.data|| "");
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Sentiment Analyzer"
        description="Analyze your text to determine if it's Positive, Neutral, or Negative"
        icon={MessageCircle}
        iconColor="text-flame"
        bgColor="bg-flame/10"
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
                      placeholder="Type your sentence here..."
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
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 space-y-4">
          {isLoading && (
            <div className="p-8 w-full rounded-lg flex items-center justify-center bg-muted">
              <Loader isLoading={isLoading} />
            </div>
          )}

          {!sentiment && !isLoading && (
            <Empty title="No sentiment analysis yet" />
          )}

          {sentiment && originalText && (
            <div className="p-6 border rounded-xl bg-flame-50 space-y-4 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-ink-700 mb-1">
                  📝 Input Text
                </h2>
                <p className="text-ink-700 whitespace-pre-wrap">
                  {originalText}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-flame-700 mb-1">
                  📊 Sentiment
                </h2>
                <p
                  className={`text-xl font-semibold ${
                    sentiment === "Positive"
                      ? "text-brand-600"
                      : sentiment === "Negative"
                      ? "text-flame"
                      : "text-ink-500"
                  }`}
                >
                  {sentiment}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalyzerPage;
