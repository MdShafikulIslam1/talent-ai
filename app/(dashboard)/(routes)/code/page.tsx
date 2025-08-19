"use client";
import BotAvatar from "@/components/botAvatar";
import Empty from "@/components/empty";
import Heading from "@/components/heading";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/userAvatar";
import { userProModal } from "@/hooks/user-pro-modal";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Code } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import * as z from "zod";
import { formSchema } from "./constant";

interface Message {
  role: string;
  content: string;
}

const CodePage = () => {
  const proModal = userProModal();
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const userMessages = {
        role: "user",
        content: data.prompt,
      };
      const newMessages = [...messages, userMessages];

      const response = await axios.post("/api/code", {
        messages: newMessages,
      });

      setMessages((preState) => [...preState, userMessages, response.data]);

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
        title="Code Generation"
        description="Generate code using ai with text"
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
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
                        placeholder="generate toggle button"
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
                Generate
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
          {messages.length === 0 && !isLoading && (
            <Empty title="No code is started yet" />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10 "
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="w-full overflow-auto my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 p-1 rounded-lg" {...props} />
                    ),
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;

// "use client";

// import BotAvatar from "@/components/botAvatar";
// import Empty from "@/components/empty";
// import Heading from "@/components/heading";
// import Loader from "@/components/loader";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import UserAvatar from "@/components/userAvatar";
// import { userProModal } from "@/hooks/user-pro-modal";
// import { cn } from "@/lib/utils";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { Code } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import ReactMarkdown from "react-markdown";
// import * as z from "zod";
// import { formSchema } from "./constant";

// // Syntax highlighter
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// interface Message {
//   role: string;
//   content: string;
// }

// const CodePage = () => {
//   const proModal = userProModal();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const router = useRouter();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       prompt: "",
//     },
//   });

//   const isLoading = form.formState.isSubmitting;

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     try {
//       const userMessages = {
//         role: "user",
//         content: data.prompt,
//       };
//       const newMessages = [...messages, userMessages];

//       const response = await axios.post("/api/code", {
//         messages: newMessages,
//       });

//       setMessages((prevState) => [...prevState, userMessages, response.data]);
//       form.reset();
//     } catch (error: any) {
//       if (error?.response?.status === 403) {
//         proModal.onOpen();
//       }
//     } finally {
//       router.refresh();
//     }
//   };

//   return (
//     <div>
//       <Heading
//         title="Code Generation"
//         description="Generate code using AI with text"
//         icon={Code}
//         iconColor="text-green-700"
//         bgColor="bg-green-700/10"
//       />

//       <div className="px-4 lg:px-8 mb-8">
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="w-full p-4 px-3 md:px-6 border rounded-lg focus-within:shadow-sm grid grid-cols-12 gap-2"
//           >
//             <FormField
//               name="prompt"
//               render={({ field }) => (
//                 <FormItem className="col-span-12 lg:col-span-10">
//                   <FormControl className="m-0 p-0">
//                     <Input
//                       className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
//                       disabled={isLoading}
//                       placeholder="e.g. generate toggle button"
//                       {...field}
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <Button
//               className="col-span-12 lg:col-span-2 w-full"
//               disabled={isLoading}
//             >
//               Generate
//             </Button>
//           </form>
//         </Form>

//         {/* Generated Messages */}
//         <div className="mt-4 space-y-4">
//           {isLoading && (
//             <div className="p-8 w-full rounded-lg flex items-center justify-center bg-muted">
//               <Loader isLoading={isLoading} />
//             </div>
//           )}

//           {messages.length === 0 && !isLoading && (
//             <Empty title="No code is started yet" />
//           )}

//           <div className="flex flex-col-reverse gap-y-4">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={cn(
//                   "p-8 w-full flex items-start gap-x-8 rounded-lg",
//                   message.role === "user"
//                     ? "bg-white border border-black/10"
//                     : "bg-muted"
//                 )}
//               >
//                 {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
//                 <ReactMarkdown
//                   components={{
//                     code({ node, inline, className, children, ...props }) {
//                       const match = /language-(\w+)/.exec(className || "");
//                       return !inline && match ? (
//                         <SyntaxHighlighter
//                           language={match[1]}
//                           style={oneDark}
//                           PreTag="div"
//                           className="rounded-lg overflow-x-auto"
//                           {...props}
//                         >
//                           {String(children).replace(/\n$/, "")}
//                         </SyntaxHighlighter>
//                       ) : (
//                         <code className="bg-black/10 p-1 rounded-lg" {...props}>
//                           {children}
//                         </code>
//                       );
//                     },
//                   }}
//                   className="text-sm overflow-hidden leading-7"
//                 >
//                   {message.content}
//                 </ReactMarkdown>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CodePage;
