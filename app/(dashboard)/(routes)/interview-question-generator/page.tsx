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

const InterviewQuestionGenerator = () => {
  const proModal = userProModal();
  const [message, setMessage] = useState("");
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
    setMessage("");
    setOriginalText(data.prompt);
    try {
      const response = await axios.post("/api/grammar-correction", {
        text: data.prompt,
      });
      console.log("response: ", response);

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
        <div>
          {" "}
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
        </div>
        {/* message contents */}
        <div className="mt-4 space-y-4">
          {/* show loading when ai is generating */}
          {isLoading && (
            <div className="p-8 w-full rounded-lg flex items-center justify-center bg-muted">
              <Loader isLoading={isLoading} />
            </div>
          )}
          {/* show empty state if no conversation */}
          {!message && !isLoading && (
            <Empty title="No conversation is started" />
          )}

          {message && originalText && (
            <div className="p-4 border rounded-md bg-blue-50 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2 text-blue-800">
                  Original Text:
                </h2>
                <p className="text-blue-700 whitespace-pre-wrap">
                  {originalText}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2 text-green-800">
                  Correction Text:
                </h2>
                <p className="text-green-700 whitespace-pre-wrap">{message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestionGenerator;
