// "use client";

// import { useState } from "react";
// import {
//   Image as ImageIcon,
//   Download,
//   Copy,
//   Trash2,
//   Sparkles,
//   Loader2,
//   Camera,
//   Palette,
//   Settings,
//   Zap,
//   Eye,
//   RefreshCw,
// } from "lucide-react";
// import { toast } from "sonner";

// interface GeneratedImage {
//   url: string;
//   revised_prompt?: string;
// }

// interface ImageResponse {
//   images: GeneratedImage[];
//   model: string;
//   size: string;
//   quality?: string;
//   style?: string;
// }

// export default function ImageCreatorPage() {
//   const [prompt, setPrompt] = useState("");
//   const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [model, setModel] = useState("dall-e-3");
//   const [size, setSize] = useState("1024x1024");
//   const [quality, setQuality] = useState("standard");
//   const [style, setStyle] = useState("vivid");
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   const models = [
//     { 
//       id: "dall-e-3", 
//       name: "DALL-E 3", 
//       description: "Latest model, highest quality",
//       sizes: ["1024x1024", "1792x1024", "1024x1792"]
//     },
//     { 
//       id: "dall-e-2", 
//       name: "DALL-E 2", 
//       description: "Fast generation, good quality",
//       sizes: ["256x256", "512x512", "1024x1024"]
//     }
//   ];

//   const qualities = [
//     { id: "standard", name: "Standard", description: "Faster generation" },
//     { id: "hd", name: "HD", description: "Higher quality, slower" }
//   ];

//   const styles = [
//     { id: "vivid", name: "Vivid", description: "More artistic and creative" },
//     { id: "natural", name: "Natural", description: "More realistic and photographic" }
//   ];

//   const handleGenerateImage = async () => {
//     if (!prompt.trim()) {
//       toast.error("Please enter a description for your image!");
//       return;
//     }

//     if (prompt.length > 4000) {
//       toast.error("Prompt is too long! Maximum 4000 characters allowed.");
//       return;
//     }

//     setLoading(true);
//     setGeneratedImages([]);

//     try {
//       const response = await fetch("/api/image-creator", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           prompt: prompt.trim(),
//           model,
//           size,
//           quality: model === "dall-e-3" ? quality : undefined,
//           style: model === "dall-e-3" ? style : undefined,
//           n: 1
//         }),
//       });

//       if (response.ok) {
//         const data: ImageResponse = await response.json();
//         setGeneratedImages(data.images);
//         toast.success("Image generated successfully!");
//       } else if (response.status === 403) {
//         toast.error("Free trial expired. Please upgrade to Pro!");
//       } else if (response.status === 400) {
//         const errorText = await response.text();
//         toast.error(errorText || "Invalid prompt. Please try again.");
//       } else {
//         throw new Error("Failed to generate image");
//       }
//     } catch (error) {
//       console.error("Image generation error:", error);
//       toast.error("Could not generate image. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadImage = async (imageUrl: string, index: number) => {
//     try {
//       const response = await fetch(imageUrl);
//       const blob = await response.blob();
//       const url = URL.createObjectURL(blob);
      
//       const element = document.createElement("a");
//       element.href = url;
//       element.download = `ai-generated-image-${index + 1}.png`;
//       document.body.appendChild(element);
//       element.click();
//       document.body.removeChild(element);
      
//       URL.revokeObjectURL(url);
//       toast.success("Image downloaded successfully!");
//     } catch (error) {
//       toast.error("Failed to download image");
//     }
//   };

//   const handleCopyPrompt = async () => {
//     if (prompt) {
//       await navigator.clipboard.writeText(prompt);
//       toast.success("Prompt copied to clipboard!");
//     }
//   };

//   const handleClear = () => {
//     setPrompt("");
//     setGeneratedImages([]);
//     setSelectedImage(null);
//     toast.success("Cleared successfully!");
//   };

//   const currentModelData = models.find(m => m.id === model);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
//             <ImageIcon className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">
//             AI Image Creator
//           </h1>
//           <p className="text-gray-600 text-lg">
//             Generate stunning images from text descriptions with AI
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Input Panel */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden sticky top-4">
//               <div className="p-6">
//                 {/* Prompt Input */}
//                 <div className="mb-6">
//                   <div className="flex items-center space-x-3 mb-4">
//                     <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                       <Palette className="w-4 h-4 text-white" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       Describe Your Image
//                     </h3>
//                   </div>

//                   <div className="relative">
//                     <textarea
//                       value={prompt}
//                       onChange={(e) => setPrompt(e.target.value)}
//                       placeholder="A futuristic city at sunset with flying cars, neon lights, and towering skyscrapers..."
//                       className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 leading-relaxed text-sm"
//                       maxLength={4000}
//                     />
//                     <div className="absolute bottom-3 right-3 text-xs text-gray-400">
//                       {prompt.length}/4000
//                     </div>
//                   </div>
//                 </div>

//                 {/* Model Selection */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     <Settings className="w-4 h-4 inline mr-2" />
//                     AI Model
//                   </label>
//                   <div className="space-y-2">
//                     {models.map((m) => (
//                       <button
//                         key={m.id}
//                         onClick={() => {
//                           setModel(m.id);
//                           // Reset size to first available for the new model
//                           setSize(m.sizes[0]);
//                         }}
//                         className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
//                           model === m.id
//                             ? "border-purple-500 bg-purple-50 text-purple-700"
//                             : "border-gray-200 hover:border-gray-300 text-gray-700"
//                         }`}
//                       >
//                         <div className="font-medium text-sm">{m.name}</div>
//                         <div className="text-xs text-gray-500">{m.description}</div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Size Selection */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     Image Size
//                   </label>
//                   <div className="grid grid-cols-1 gap-2">
//                     {currentModelData?.sizes.map((s) => (
//                       <button
//                         key={s}
//                         onClick={() => setSize(s)}
//                         className={`p-3 rounded-lg border transition-all duration-200 text-center ${
//                           size === s
//                             ? "border-purple-500 bg-purple-50 text-purple-700"
//                             : "border-gray-200 hover:border-gray-300 text-gray-700"
//                         }`}
//                       >
//                         <div className="font-medium text-sm">{s}</div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* DALL-E 3 Specific Options */}
//                 {model === "dall-e-3" && (
//                   <>
//                     {/* Quality Selection */}
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium text-gray-700 mb-3">
//                         Quality
//                       </label>
//                       <div className="grid grid-cols-2 gap-2">
//                         {qualities.map((q) => (
//                           <button
//                             key={q.id}
//                             onClick={() => setQuality(q.id)}
//                             className={`p-3 rounded-lg border transition-all duration-200 text-center ${
//                               quality === q.id
//                                 ? "border-purple-500 bg-purple-50 text-purple-700"
//                                 : "border-gray-200 hover:border-gray-300 text-gray-700"
//                             }`}
//                           >
//                             <div className="font-medium text-sm">{q.name}</div>
//                             <div className="text-xs text-gray-500">{q.description}</div>
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Style Selection */}
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium text-gray-700 mb-3">
//                         Style
//                       </label>
//                       <div className="grid grid-cols-1 gap-2">
//                         {styles.map((s) => (
//                           <button
//                             key={s.id}
//                             onClick={() => setStyle(s.id)}
//                             className={`p-3 rounded-lg border transition-all duration-200 text-left ${
//                               style === s.id
//                                 ? "border-purple-500 bg-purple-50 text-purple-700"
//                                 : "border-gray-200 hover:border-gray-300 text-gray-700"
//                             }`}
//                           >
//                             <div className="font-medium text-sm">{s.name}</div>
//                             <div className="text-xs text-gray-500">{s.description}</div>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Generate Button */}
//                 <button
//                   onClick={handleGenerateImage}
//                   disabled={loading || !prompt.trim()}
//                   className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       <span>Creating masterpiece...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Sparkles className="w-5 h-5" />
//                       <span>Generate Image</span>
//                     </>
//                   )}
//                 </button>

//                 {/* Action Buttons */}
//                 <div className="grid grid-cols-2 gap-3 mt-4">
//                   <button
//                     onClick={handleCopyPrompt}
//                     className="flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
//                   >
//                     <Copy className="w-4 h-4" />
//                     <span>Copy Prompt</span>
//                   </button>
//                   <button
//                     onClick={handleClear}
//                     className="flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     <span>Clear All</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Results Panel */}
//           <div className="lg:col-span-2">
//             {/* Loading State */}
//             {loading && (
//               <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
//                 <div className="text-center">
//                   <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
//                     <Camera className="w-8 h-8 text-white animate-pulse" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                     AI Creating Your Image
//                   </h3>
//                   <p className="text-gray-600 mb-4">
//                     Our AI is bringing your vision to life...
//                   </p>
//                   <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div
//                       className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full animate-pulse"
//                       style={{ width: "75%" }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Generated Images */}
//             {generatedImages.length > 0 && (
//               <div className="space-y-6">
//                 {generatedImages.map((image, index) => (
//                   <div
//                     key={index}
//                     className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-500 hover:shadow-2xl"
//                   >
//                     <div className="p-6">
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
//                             <Eye className="w-5 h-5 text-white" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-800">
//                               Generated Image #{index + 1}
//                             </h3>
//                             <p className="text-sm text-gray-500">
//                               {model.toUpperCase()} • {size} • {model === "dall-e-3" ? `${quality} quality • ${style} style` : ""}
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => handleDownloadImage(image.url, index)}
//                           className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
//                         >
//                           <Download className="w-5 h-5" />
//                         </button>
//                       </div>

//                       <div className="relative group cursor-pointer">
//                         <img
//                           src={image.url}
//                           alt={`Generated image ${index + 1}`}
//                           className="w-full rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
//                           onClick={() => setSelectedImage(image.url)}
//                         />
//                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all duration-300 flex items-center justify-center">
//                           <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                         </div>
//                       </div>

//                       {image.revised_prompt && (
//                         <div className="mt-4 p-4 bg-gray-50 rounded-xl">
//                           <h4 className="text-sm font-medium text-gray-700 mb-2">
//                             AI Revised Prompt:
//                           </h4>
//                           <p className="text-sm text-gray-600 leading-relaxed">
//                             {image.revised_prompt}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Empty State */}
//             {!loading && generatedImages.length === 0 && (
//               <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
//                 <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl mb-6">
//                   <ImageIcon className="w-10 h-10 text-purple-500" />
//                 </div>
//                 <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//                   Ready to Create Magic?
//                 </h3>
//                 <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                   Describe your vision in the prompt box and watch as AI transforms your words into stunning visual art.
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto text-sm">
//                   <div className="bg-purple-50 p-4 rounded-xl">
//                     <Zap className="w-5 h-5 text-purple-500 mx-auto mb-2" />
//                     <p className="text-purple-700 font-medium">Fast Generation</p>
//                   </div>
//                   <div className="bg-pink-50 p-4 rounded-xl">
//                     <Sparkles className="w-5 h-5 text-pink-500 mx-auto mb-2" />
//                     <p className="text-pink-700 font-medium">High Quality</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Image Modal */}
//         {selectedImage && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <div className="relative max-w-4xl max-h-[90vh] w-full">
//               <button
//                 onClick={() => setSelectedImage(null)}
//                 className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
//               >
//                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//               <img
//                 src={selectedImage}
//                 alt="Full size generated image"
//                 className="w-full h-full object-contain rounded-2xl"
//               />
//             </div>
//           </div>
//         )}

//         {/* Tips Section */}
//         <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
//           <h4 className="font-semibold text-gray-800 mb-3 text-lg">
//             🎨 Tips for Better Image Generation
//           </h4>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//             <ul className="space-y-2">
//               <li>• Be specific about colors, lighting, and mood</li>
//               <li>• Include artistic styles (e.g., "watercolor", "digital art")</li>
//               <li>• Mention camera angles and composition</li>
//             </ul>
//             <ul className="space-y-2">
//               <li>• Use descriptive adjectives for better results</li>
//               <li>• Specify the setting and environment clearly</li>
//               <li>• Experiment with different models and settings</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

"use client";

import { useState } from "react";

// Custom SVG Icons
const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    <circle cx="9" cy="9" r="2"/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

const Download = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const Copy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

const Trash2 = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const Sparkles = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    <path d="M20 3v4"/>
    <path d="M22 5h-4"/>
    <path d="M4 17v2"/>
    <path d="M5 18H3"/>
  </svg>
);

const Loader2 = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

const Camera = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
);

const Palette = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5"/>
    <circle cx="17.5" cy="10.5" r=".5"/>
    <circle cx="8.5" cy="7.5" r=".5"/>
    <circle cx="6.5" cy="12.5" r=".5"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
  </svg>
);

const Settings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const Zap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
  </svg>
);

const Eye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

interface GeneratedImage {
  url: string;
  revised_prompt?: string;
}

interface ImageResponse {
  images: GeneratedImage[];
  model: string;
  size: string;
  provider?: string;
}

export default function ImageCreatorPage() {
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("stable-diffusion-xl");
  const [provider, setProvider] = useState("pollinations");
  const [size, setSize] = useState("512x512");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const providers = [
    { 
      id: "pollinations", 
      name: "Pollinations.ai", 
      description: "Completely free, no API key needed",
      badge: "100% FREE"
    },
    { 
      id: "replicate", 
      name: "Replicate", 
      description: "High quality, uses your existing token",
      badge: "YOUR TOKEN"
    },
    { 
      id: "huggingface", 
      name: "Hugging Face", 
      description: "Good quality, free API key required",
      badge: "FREE TIER"
    },
    { 
      id: "deepai", 
      name: "DeepAI", 
      description: "Fast generation, free API key required",
      badge: "FREE TIER"
    }
  ];

  const models = {
    "stable-diffusion-xl": { name: "Stable Diffusion XL", description: "High quality, detailed images" },
    "stable-diffusion-2": { name: "Stable Diffusion 2.1", description: "Fast, reliable generation" },
    "stable-diffusion-3": { name: "Stable Diffusion 3", description: "Latest model, best quality" }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      alert("Please enter a description for your image!");
      return;
    }

    if (prompt.length > 1000) {
      alert("Prompt is too long! Maximum 1000 characters allowed.");
      return;
    }

    setLoading(true);
    setGeneratedImages([]);

    try {
      const response = await fetch("/api/image-creator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model,
          provider,
          size,
        }),
      });

      if (response.ok) {
        const data: ImageResponse = await response.json();
        setGeneratedImages(data.images);
        console.log("Image generated successfully!");
      } else if (response.status === 403) {
        alert("Free trial expired. Please upgrade to Pro!");
      } else if (response.status === 400) {
        const errorText = await response.text();
        alert(errorText || "Invalid prompt. Please try again.");
      } else {
        throw new Error("Failed to generate image");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      alert("Could not generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async (imageUrl: string, index: number) => {
    try {
      let response;
      
      // Handle data URLs (base64) differently
      if (imageUrl.startsWith('data:')) {
        // Convert data URL to blob
        const base64Data = imageUrl.split(',')[1];
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        
        const element = document.createElement("a");
        element.href = url;
        element.download = `ai-generated-image-${index + 1}.jpg`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        URL.revokeObjectURL(url);
      } else {
        // Handle regular URLs
        response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const element = document.createElement("a");
        element.href = url;
        element.download = `ai-generated-image-${index + 1}.jpg`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        URL.revokeObjectURL(url);
      }
      
      console.log("Image downloaded successfully!");
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("Failed to download image");
    }
  };

  const handleCopyPrompt = async () => {
    if (prompt) {
      await navigator.clipboard.writeText(prompt);
      console.log("Prompt copied to clipboard!");
    }
  };

  const handleClear = () => {
    setPrompt("");
    setGeneratedImages([]);
    setSelectedImage(null);
    console.log("Cleared successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <ImageIcon />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Free AI Image Creator
          </h1>
          <p className="text-gray-600 text-lg">
            Generate stunning images completely free with open-source AI
          </p>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mt-2">
            <Zap />
            <span className="ml-2">100% Free • No OpenAI API costs</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden sticky top-4">
              <div className="p-6">
                {/* Prompt Input */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Palette />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Describe Your Image
                    </h3>
                  </div>

                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A beautiful landscape with mountains and a lake at sunset..."
                      className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 leading-relaxed text-sm"
                      maxLength={1000}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {prompt.length}/1000
                    </div>
                  </div>
                </div>

                {/* Provider Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Settings />
                    <span className="ml-2">AI Provider</span>
                  </label>
                  <div className="space-y-2">
                    {providers.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setProvider(p.id)}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                          provider === p.id
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.description}</div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            p.badge === "100% FREE" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {p.badge}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Selection */}
                {provider === "pollinations" ? null : (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      AI Model
                    </label>
                    <div className="space-y-2">
                      {Object.entries(models).map(([key, m]) => (
                        <button
                          key={key}
                          onClick={() => setModel(key)}
                          className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                            model === key
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                        >
                          <div className="font-medium text-sm">{m.name}</div>
                          <div className="text-xs text-gray-500">{m.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerateImage}
                  disabled={loading || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 />
                      <span>Creating free image...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles />
                      <span>Generate Free Image</span>
                    </>
                  )}
                </button>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                  >
                    <Copy />
                    <span>Copy Prompt</span>
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                  >
                    <Trash2 />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl mb-4">
                    <Camera />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Free AI Creating Your Image
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Using open-source AI to bring your vision to life...
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full animate-pulse"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Images */}
            {generatedImages.length > 0 && (
              <div className="space-y-6">
                {generatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <Eye />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Free Generated Image #{index + 1}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {provider} • {model} • {size} • 100% FREE
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadImage(image.url, index)}
                          className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
                        >
                          <Download />
                        </button>
                      </div>

                      <div className="relative group cursor-pointer">
                        <img
                          src={image.url}
                          alt={`Generated image ${index + 1}`}
                          className="w-full rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                          onClick={() => setSelectedImage(image.url)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all duration-300 flex items-center justify-center">
                          <Eye />
                        </div>
                      </div>

                      {image.revised_prompt && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Generated from prompt:
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {image.revised_prompt}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && generatedImages.length === 0 && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl mb-6">
                  <ImageIcon />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Ready to Create Free AI Art?
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Describe your vision and watch as free, open-source AI transforms your words into beautiful images at no cost.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto text-sm">
                  <div className="bg-green-50 p-4 rounded-xl">
                    <Zap />
                    <p className="text-green-700 font-medium mt-2">100% Free Forever</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <Sparkles />
                    <p className="text-blue-700 font-medium mt-2">Open Source AI</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-[90vh] w-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage}
                alt="Full size generated image"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
          <h4 className="font-semibold text-gray-800 mb-3 text-lg">
            🎨 Tips for Better Free Image Generation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <ul className="space-y-2">
              <li>• Be specific about colors, lighting, and mood</li>
              <li>• Include artistic styles (e.g., "watercolor", "digital art")</li>
              <li>• Mention camera angles and composition</li>
            </ul>
            <ul className="space-y-2">
              <li>• Use descriptive adjectives for better results</li>
              <li>• Specify the setting and environment clearly</li>
              <li>• Try different providers for varied styles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}