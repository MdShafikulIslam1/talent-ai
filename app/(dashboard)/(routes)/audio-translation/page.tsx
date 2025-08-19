// "use client";

// import Heading from "@/components/heading";
// import Loader from "@/components/loader";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { userProModal } from "@/hooks/user-pro-modal";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import { Languages } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { formSchema, languageOptions } from "./constant";

// const AudioPage = () => {
//   const proModal = userProModal();
//   const router = useRouter();
//   const [file, setFile] = useState<File | null>(null);
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       file: "",
//       language: "English", // Default format
//     },
//   });

//   const isLoading = form.formState.isSubmitting;

//   const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//     }
//   };

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     if (!file) {
//       alert("Please upload an audio file.");
//       return;
//     }
//     try {
//       const formData = new FormData();
//       formData.append("file", file); // Assuming single file upload
//       formData.append("language", data.language);
//       const response = await axios.post(
//         "https://audio-translation-backend.onrender.com/audio-to-text-translate",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("response of audio translation", response.data);
//       // form.reset();
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
//         title="Audio Translation"
//         description="Upload your audio file and choose language for translation"
//         icon={Languages}
//         iconColor="text-blue-700"
//         bgColor="bg-blue-700/10"
//       />
//       <div className="px-4 lg:px-8 mb-8">
//         <div>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="w-full p-4 px-3 md:px-6 border rounded-lg focus-within:shadow-sm grid grid-cols-12 gap-2 justify-center items-center"
//             >
//               {/* Input for audio file */}
//               {/* <FormField
//                 name="file"
//                 render={({ field }) => (
//                   <FormItem className="col-span-12 lg:col-span-6">
//                     <FormControl className="m-0 p-0">
//                       <Input
//                         type="file"
//                         accept="audio/*"
//                         disabled={isLoading}
//                         {...field}
//                         className="cursor-pointer border-dashed border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               /> */}
//               <FormField
//                 name="file"
//                 render={({ field }) => (
//                   <FormItem className="col-span-12 lg:col-span-6">
//                     <FormControl>
//                       <div className="flex items-center h-full w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 hover:border-blue-500 transition duration-200">
//                         <Input
//                           type="file"
//                           accept="audio/*"
//                           disabled={isLoading}
//                           className="cursor-pointer w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//                           {...field}
//                           onChange={handleAudioFileChange}
//                         />
//                       </div>
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               {/* select field for language */}
//               <FormField
//                 control={form.control}
//                 name="language"
//                 render={({ field }) => (
//                   <FormItem className="col-span-12 lg:col-span-2">
//                     <Select
//                       disabled={isLoading}
//                       onValueChange={field.onChange}
//                       // defaultValue={field.value}
//                       value={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Language" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {languageOptions.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 className="col-span-12 lg:col-span-2 w-full"
//                 disabled={isLoading}
//               >
//                 Upload
//               </Button>
//             </form>
//           </Form>
//         </div>
//         {/* message contents */}
//         <div className="mt-4 space-y-4">
//           {/* Show loading when uploading */}
//           {isLoading && (
//             <div className="p-8 w-full rounded-lg flex items-center justify-center bg-muted">
//               <Loader isLoading={isLoading} />
//             </div>
//           )}
//           {/* Show empty state if no audio uploaded */}
//           {/* {audioUrls.length === 0 && !isLoading && (
//             <Empty title="No Audio uploaded yet" />
//           )} */}
//           {/* Show audio player */}
//           {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
//             {audioUrls.map((url) => (
//               <Card key={url} className="rounded-lg overflow-hidden">
//                 <CardFooter className="p-2">
//                   <audio controls className="w-full">
//                     <source src={url} type="audio/mp3" />
//                     Your browser does not support the audio element.
//                   </audio>
//                   <Button
//                     onClick={() => window.open(url)}
//                     variant="secondary"
//                     className="w-full mt-2"
//                   >
//                     <Download className="w-4 h-4 mr-3" />
//                     Download
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AudioPage;


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

const AudioPage = () => {
  const proModal = userProModal();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: "",
      language: "English", // Default format
    },
  });

  const isLoading = form.formState.isSubmitting;

  // File input change handler
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Form submission handler
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!file) {
      alert("Please upload an audio file.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file); // Assuming single file upload
      formData.append("language", data.language);
      const response = await axios.post(
        "https://audio-translation-backend.onrender.com/audio-to-text-translate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("response of audio translation", response.data);
      form.reset(); // Reset form after successful submission
      setFile(null); // Clear file state
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        console.error("Error occurred during audio translation:", error);
        // Show an error message in the UI if needed
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Speech Translation"
        description="Upload your audio file and choose language for translation"
        icon={Languages}
        iconColor="text-blue-700"
        bgColor="bg-blue-700/10"
      />
      <div className="px-4 lg:px-8 mb-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full p-4 px-3 md:px-6 border rounded-lg focus-within:shadow-sm grid grid-cols-12 gap-2 justify-center items-center"
            >
              {/* Input for audio file */}
              <FormField
                name="file"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl>
                      <div className="flex items-center h-full w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 hover:border-blue-500 transition duration-200">
                        <Input
                          type="file"
                          accept="audio/mpeg, audio/wav, audio/*"
                          disabled={isLoading}
                          className="cursor-pointer w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                          {...field}
                          onChange={handleAudioFileChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Select field for language */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languageOptions.map((option) => (
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
              >
                Upload
              </Button>
            </form>
          </Form>
        </div>

        {/* Message content section */}
        <div className="mt-4 space-y-4">
          {/* Show loading indicator when uploading */}
          {isLoading && (
            <div className="p-8 w-full rounded-lg flex items-center justify-center bg-muted">
              <Loader isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPage;
