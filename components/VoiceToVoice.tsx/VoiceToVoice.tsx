// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Mic, Square, Volume2, Play, Pause, Download, Copy, Trash2, RotateCcw, Sparkles, Loader2, MessageCircle, Bot, User } from "lucide-react";
// import { voices } from "@/const";

// export default function VoiceToVoicePage() {
//   const [recording, setRecording] = useState(false);
//   const [inputAudioURL, setInputAudioURL] = useState<string | null>(null);
//   const [outputAudioURL, setOutputAudioURL] = useState<string | null>(null);
//   const [transcript, setTranscript] = useState<string | null>(null);
//   const [response, setResponse] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [recordingDuration, setRecordingDuration] = useState(0);
//   const [isPlayingInput, setIsPlayingInput] = useState(false);
//   const [isPlayingOutput, setIsPlayingOutput] = useState(false);
//   const [currentInputTime, setCurrentInputTime] = useState(0);
//   const [currentOutputTime, setCurrentOutputTime] = useState(0);
//   const [inputDuration, setInputDuration] = useState(0);
//   const [outputDuration, setOutputDuration] = useState(0);
//   const [voice, setVoice] = useState("Fritz-PlayAI");
//   const [conversationHistory, setConversationHistory] = useState<Array<{
//     type: 'user' | 'assistant';
//     text: string;
//     audioURL?: string;
//     timestamp: Date;
//   }>>([]);

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   const inputAudioRef = useRef<HTMLAudioElement | null>(null);
//   const outputAudioRef = useRef<HTMLAudioElement | null>(null);

//   const handleStartRecording = async () => {
//     setTranscript(null);
//     setResponse(null);
//     setOutputAudioURL(null);
//     setRecordingDuration(0);
    
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (e) => {
//         audioChunksRef.current.push(e.data);
//       };

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//         const url = URL.createObjectURL(audioBlob);
//         setInputAudioURL(url);
//         stream.getTracks().forEach(track => track.stop());
//       };

//       mediaRecorder.start();
//       setRecording(true);

//       intervalRef.current = setInterval(() => {
//         setRecordingDuration(prev => prev + 1);
//       }, 1000);

//       alert("Recording started!");
//     } catch (error) {
//       console.error('Error accessing microphone:', error);
//       alert('Could not access microphone. Please check permissions.');
//     }
//   };

//   const handleStopRecording = () => {
//     mediaRecorderRef.current?.stop();
//     setRecording(false);
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//     alert("Recording stopped!");
//   };

//   const handleVoiceToVoice = async () => {
//     if (!inputAudioURL) return;

//     const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//     const formData = new FormData();
//     formData.append('audio', blob, 'voice.webm');
//     formData.append('voice', voice);

//     setLoading(true);
//     setTranscript(null);
//     setResponse(null);
//     setOutputAudioURL(null);

//     try {
//       const response = await fetch('/api/voice-to-voice', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
        
//         if (data.success) {
//           setTranscript(data.transcript);
//           setResponse(data.response);
          
//           // Convert the base64 audio to blob and create URL
//           const audioBlob = new Blob([
//             new Uint8Array(atob(data.audio).split('').map(c => c.charCodeAt(0)))
//           ], { type: 'audio/mpeg' });
//           const audioUrl = URL.createObjectURL(audioBlob);
//           setOutputAudioURL(audioUrl);

//           // Add to conversation history
//           const newHistory = [
//             ...conversationHistory,
//             {
//               type: 'user' as const,
//               text: data.transcript,
//               audioURL: inputAudioURL,
//               timestamp: new Date()
//             },
//             {
//               type: 'assistant' as const,
//               text: data.response,
//               audioURL: audioUrl,
//               timestamp: new Date()
//             }
//           ];
//           setConversationHistory(newHistory);

//           alert("Voice conversation completed!");
//         } else {
//           throw new Error("Voice to voice conversion failed");
//         }
//       } else if (response.status === 403) {
//         alert("Free trial expired. Please upgrade to Pro!");
//       } else {
//         throw new Error('Failed to process voice');
//       }
//     } catch (error) {
//       console.error('Voice to voice error:', error);
//       alert('Could not process voice conversation. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDuration = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const handleInputPlayPause = () => {
//     if (!inputAudioRef.current) return;
//     if (isPlayingInput) {
//       inputAudioRef.current.pause();
//     } else {
//       inputAudioRef.current.play();
//     }
//     setIsPlayingInput(!isPlayingInput);
//   };

//   const handleOutputPlayPause = () => {
//     if (!outputAudioRef.current) return;
//     if (isPlayingOutput) {
//       outputAudioRef.current.pause();
//     } else {
//       outputAudioRef.current.play();
//     }
//     setIsPlayingOutput(!isPlayingOutput);
//   };

//   const handleCopyTranscript = async () => {
//     if (transcript) {
//       await navigator.clipboard.writeText(transcript);
//       alert("Transcript copied to clipboard!");
//     }
//   };

//   const handleCopyResponse = async () => {
//     if (response) {
//       await navigator.clipboard.writeText(response);
//       alert("Response copied to clipboard!");
//     }
//   };

//   const handleDownloadOutput = () => {
//     if (outputAudioURL) {
//       const element = document.createElement("a");
//       element.href = outputAudioURL;
//       element.download = "ai-response.mp3";
//       document.body.appendChild(element);
//       element.click();
//       document.body.removeChild(element);
//       alert("AI response audio downloaded!");
//     }
//   };

//   const handleClear = () => {
//     setTranscript(null);
//     setResponse(null);
//     setInputAudioURL(null);
//     setOutputAudioURL(null);
//     setRecordingDuration(0);
//     setCurrentInputTime(0);
//     setCurrentOutputTime(0);
//     setInputDuration(0);
//     setOutputDuration(0);
//     setIsPlayingInput(false);
//     setIsPlayingOutput(false);
//     audioChunksRef.current = [];
//     setConversationHistory([]);
//     alert("Cleared successfully!");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
//             <MessageCircle className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">Voice to Voice AI</h1>
//           <p className="text-gray-600 text-lg">
//             Have a natural conversation with AI - speak and get spoken responses
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Recording Card */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-6">
//               <div className="p-8">
//                 {/* Voice Selection */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     Choose AI Voice
//                   </label>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                     {voices.map((v) => (
//                       <button
//                         key={v.id}
//                         onClick={() => setVoice(v.id)}
//                         className={`p-3 rounded-lg border transition-all duration-200 text-left ${
//                           voice === v.id
//                             ? 'border-purple-500 bg-purple-50 text-purple-700'
//                             : 'border-gray-200 hover:border-gray-300 text-gray-700'
//                         }`}
//                       >
//                         <div className="font-medium text-sm">{v.name}</div>
//                         <div className="text-xs text-gray-500">{v.description}</div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Recording Status */}
//                 <div className="text-center mb-8">
//                   {recording && (
//                     <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-6 py-3 rounded-full mb-4 animate-pulse">
//                       <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
//                       <span className="font-semibold text-lg">Recording • {formatDuration(recordingDuration)}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Recording Button */}
//                 <div className="flex justify-center mb-8">
//                   <button
//                     onClick={recording ? handleStopRecording : handleStartRecording}
//                     disabled={loading}
//                     className={`
//                       relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform
//                       ${recording 
//                         ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 scale-110 shadow-2xl shadow-red-500/30' 
//                         : 'bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 hover:scale-105 shadow-xl shadow-purple-500/30'
//                       }
//                       ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}
//                     `}
//                   >
//                     {recording && (
//                       <>
//                         <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
//                         <div className="absolute inset-6 rounded-full border-2 border-red-200 animate-pulse"></div>
//                       </>
//                     )}
                    
//                     {recording ? (
//                       <Square className="w-12 h-12 text-white fill-current" />
//                     ) : (
//                       <Mic className="w-12 h-12 text-white" />
//                     )}
//                   </button>
//                 </div>

//                 <div className="text-center mb-6">
//                   <p className="text-gray-600 mb-2 text-lg font-medium">
//                     {recording ? 'Click to stop recording' : 'Click to start voice conversation'}
//                   </p>
//                   <p className="text-gray-500">
//                     Speak naturally and get an AI response in your chosen voice
//                   </p>
//                 </div>

//                 {/* Process Button */}
//                 {inputAudioURL && !loading && (
//                   <button
//                     onClick={handleVoiceToVoice}
//                     className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2"
//                   >
//                     <Sparkles className="w-5 h-5" />
//                     <span>Process Voice Conversation</span>
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Loading State */}
//             {loading && (
//               <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
//                 <div className="text-center">
//                   <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4">
//                     <Sparkles className="w-8 h-8 text-white animate-pulse" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Processing Your Voice</h3>
//                   <p className="text-gray-600 mb-4">Converting speech to text, generating response, and creating audio...</p>
//                   <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full animate-pulse" style={{width: '75%'}}></div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Audio Players and Results */}
//             {(inputAudioURL || outputAudioURL) && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 {/* Input Audio */}
//                 {inputAudioURL && (
//                   <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
//                     <div className="flex items-center space-x-3 mb-4">
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
//                         <User className="w-5 h-5 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-800">Your Voice</h3>
//                         <p className="text-gray-500 text-sm">Duration: {formatDuration(recordingDuration)}</p>
//                       </div>
//                     </div>
                    
//                     <audio
//                       ref={inputAudioRef}
//                       src={inputAudioURL}
//                       onTimeUpdate={() => setCurrentInputTime(inputAudioRef.current?.currentTime || 0)}
//                       onLoadedMetadata={() => setInputDuration(inputAudioRef.current?.duration || 0)}
//                       onPlay={() => setIsPlayingInput(true)}
//                       onPause={() => setIsPlayingInput(false)}
//                       onEnded={() => setIsPlayingInput(false)}
//                       className="hidden"
//                     />
                    
//                     <div className="flex items-center space-x-2 mb-3">
//                       <button
//                         onClick={handleInputPlayPause}
//                         className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 transition-colors"
//                       >
//                         {isPlayingInput ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
//                       </button>
//                       <div className="flex-1 text-sm text-gray-500">
//                         {formatTime(currentInputTime)} / {formatTime(inputDuration)}
//                       </div>
//                     </div>

//                     {transcript && (
//                       <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                         <div className="flex justify-between items-start mb-2">
//                           <span className="text-xs font-medium text-blue-700">TRANSCRIPT</span>
//                           <button onClick={handleCopyTranscript} className="text-blue-600 hover:text-blue-800">
//                             <Copy className="w-3 h-3" />
//                           </button>
//                         </div>
//                         <p className="text-sm text-blue-800">{transcript}</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Output Audio */}
//                 {outputAudioURL && (
//                   <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
//                     <div className="flex items-center space-x-3 mb-4">
//                       <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                         <Bot className="w-5 h-5 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-800">AI Response</h3>
//                         <p className="text-gray-500 text-sm">Voice: {voices.find(v => v.id === voice)?.name}</p>
//                       </div>
//                     </div>
                    
//                     <audio
//                       ref={outputAudioRef}
//                       src={outputAudioURL}
//                       onTimeUpdate={() => setCurrentOutputTime(outputAudioRef.current?.currentTime || 0)}
//                       onLoadedMetadata={() => setOutputDuration(outputAudioRef.current?.duration || 0)}
//                       onPlay={() => setIsPlayingOutput(true)}
//                       onPause={() => setIsPlayingOutput(false)}
//                       onEnded={() => setIsPlayingOutput(false)}
//                       className="hidden"
//                     />
                    
//                     <div className="flex items-center space-x-2 mb-3">
//                       <button
//                         onClick={handleOutputPlayPause}
//                         className="w-8 h-8 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center text-purple-600 transition-colors"
//                       >
//                         {isPlayingOutput ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
//                       </button>
//                       <div className="flex-1 text-sm text-gray-500">
//                         {formatTime(currentOutputTime)} / {formatTime(outputDuration)}
//                       </div>
//                       <button
//                         onClick={handleDownloadOutput}
//                         className="text-purple-600 hover:text-purple-800"
//                       >
//                         <Download className="w-4 h-4" />
//                       </button>
//                     </div>

//                     {response && (
//                       <div className="mt-4 p-3 bg-purple-50 rounded-lg">
//                         <div className="flex justify-between items-start mb-2">
//                           <span className="text-xs font-medium text-purple-700">AI RESPONSE</span>
//                           <button onClick={handleCopyResponse} className="text-purple-600 hover:text-purple-800">
//                             <Copy className="w-3 h-3" />
//                           </button>
//                         </div>
//                         <p className="text-sm text-purple-800">{response}</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Action Buttons */}
//             {(inputAudioURL || outputAudioURL) && (
//               <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
//                 <button
//                   onClick={handleClear}
//                   className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   <span>Clear All</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Conversation History Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-4">
//               <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
//                 <MessageCircle className="w-5 h-5 text-purple-600" />
//                 <span>Conversation History</span>
//               </h3>
              
//               {conversationHistory.length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <MessageCircle className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <p className="text-gray-500 text-sm">No conversations yet</p>
//                   <p className="text-gray-400 text-xs mt-1">Start by recording your voice</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4 max-h-96 overflow-y-auto">
//                   {conversationHistory.map((item, index) => (
//                     <div
//                       key={index}
//                       className={`p-3 rounded-lg ${
//                         item.type === 'user' 
//                           ? 'bg-blue-50 border-l-3 border-blue-500' 
//                           : 'bg-purple-50 border-l-3 border-purple-500'
//                       }`}
//                     >
//                       <div className="flex items-center space-x-2 mb-2">
//                         {item.type === 'user' ? (
//                           <User className="w-4 h-4 text-blue-600" />
//                         ) : (
//                           <Bot className="w-4 h-4 text-purple-600" />
//                         )}
//                         <span className={`text-xs font-medium ${
//                           item.type === 'user' ? 'text-blue-700' : 'text-purple-700'
//                         }`}>
//                           {item.type === 'user' ? 'YOU' : 'AI'}
//                         </span>
//                         <span className="text-xs text-gray-500">
//                           {item.timestamp.toLocaleTimeString()}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-800 mb-2">{item.text}</p>
//                       {item.audioURL && (
//                         <audio controls className="w-full h-8 text-xs">
//                           <source src={item.audioURL} type="audio/mpeg" />
//                         </audio>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tips Section */}
//         <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
//           <h4 className="font-semibold text-gray-800 mb-3 text-lg">💡 Tips for Better Voice Conversations</h4>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//             <ul className="space-y-2">
//               <li>• Speak clearly and at a normal pace</li>
//               <li>• Use a quiet environment with minimal background noise</li>
//               <li>• Ask specific questions for better AI responses</li>
//             </ul>
//             <ul className="space-y-2">
//               <li>• Keep your microphone close but not too close</li>
//               <li>• Try different AI voices to find your preference</li>
//               <li>• Pause between sentences for clearer processing</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Volume2, Play, Pause, Download, Copy, Trash2, RotateCcw, Sparkles, Loader2, MessageCircle, Bot, User, Brain, History } from "lucide-react";
// Your actual voices configuration
const voices = [
  { id: "Fritz-PlayAI", name: "Fritz", description: "Clear and precise" },
  { id: "Arista-PlayAI", name: "Arista", description: "Clear and articulate" },
  { id: "Atlas-PlayAI", name: "Atlas", description: "Strong and confident" },
  { id: "Basil-PlayAI", name: "Basil", description: "Warm and friendly" },
  { id: "Briggs-PlayAI", name: "Briggs", description: "Deep and authoritative" },
  { id: "Calum-PlayAI", name: "Calum", description: "Casual and conversational" },
  { id: "Celeste-PlayAI", name: "Celeste", description: "Smooth and professional" },
  { id: "Cheyenne-PlayAI", name: "Cheyenne", description: "Expressive and dynamic" },
  { id: "Chip-PlayAI", name: "Chip", description: "Energetic and upbeat" },
  { id: "Cillian-PlayAI", name: "Cillian", description: "Calm and soothing" },
  { id: "Deedee-PlayAI", name: "Deedee", description: "Friendly and approachable" },
  { id: "Gail-PlayAI", name: "Gail", description: "Warm and empathetic" },
];

export default function VoiceToVoicePage() {
  const [recording, setRecording] = useState(false);
  const [inputAudioURL, setInputAudioURL] = useState<string | null>(null);
  const [outputAudioURL, setOutputAudioURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlayingInput, setIsPlayingInput] = useState(false);
  const [isPlayingOutput, setIsPlayingOutput] = useState(false);
  const [currentInputTime, setCurrentInputTime] = useState(0);
  const [currentOutputTime, setCurrentOutputTime] = useState(0);
  const [inputDuration, setInputDuration] = useState(0);
  const [outputDuration, setOutputDuration] = useState(0);
  const [voice, setVoice] = useState("Fritz-PlayAI");
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'assistant';
    text: string;
    audioURL?: string;
    timestamp: Date;
  }>>([]);
  const [conversationCount, setConversationCount] = useState(0);
  const [hasContext, setHasContext] = useState(false);
  const [memoryStatus, setMemoryStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputAudioRef = useRef<HTMLAudioElement | null>(null);
  const outputAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleStartRecording = async () => {
    setTranscript(null);
    setResponse(null);
    setOutputAudioURL(null);
    setRecordingDuration(0);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setInputAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);

      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      alert("Recording started!");
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    alert("Recording stopped!");
  };

  const handleVoiceToVoice = async () => {
    if (!inputAudioURL) return;

    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', blob, 'voice.webm');
    formData.append('voice', voice);

    setLoading(true);
    setTranscript(null);
    setResponse(null);
    setOutputAudioURL(null);

    try {
      const response = await fetch('/api/voice-to-voice', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          setTranscript(data.transcription);
          setResponse(data.aiResponse);
          setConversationCount(data.conversationCount || 0);
          setHasContext(data.hasContext || false);
          
          // Convert the base64 audio to blob and create URL
          const audioBlob = new Blob([
            new Uint8Array(atob(data.audio).split('').map(c => c.charCodeAt(0)))
          ], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setOutputAudioURL(audioUrl);

          // Add to conversation history
          const newHistory = [
            ...conversationHistory,
            {
              type: 'user' as const,
              text: data.transcription,
              audioURL: inputAudioURL,
              timestamp: new Date()
            },
            {
              type: 'assistant' as const,
              text: data.aiResponse,
              audioURL: audioUrl,
              timestamp: new Date()
            }
          ];
          setConversationHistory(newHistory);

          alert("Voice conversation completed!");
        } else {
          throw new Error("Voice to voice conversion failed");
        }
      } else if (response.status === 403) {
        alert("Free trial expired. Please upgrade to Pro!");
      } else {
        throw new Error('Failed to process voice');
      }
    } catch (error) {
      console.error('Voice to voice error:', error);
      alert('Could not process voice conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearMemory = async () => {
    setMemoryStatus('loading');
    
    try {
      const formData = new FormData();
      formData.append('clearHistory', 'true');
      
      const response = await fetch('/api/voice-to-voice', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConversationHistory([]);
          setConversationCount(0);
          setHasContext(false);
          setMemoryStatus('success');
          alert("AI memory cleared successfully!");
          
          setTimeout(() => setMemoryStatus('idle'), 2000);
        }
      }
    } catch (error) {
      console.error('Error clearing memory:', error);
      setMemoryStatus('error');
      alert('Failed to clear AI memory');
      setTimeout(() => setMemoryStatus('idle'), 2000);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleInputPlayPause = () => {
    if (!inputAudioRef.current) return;
    if (isPlayingInput) {
      inputAudioRef.current.pause();
    } else {
      inputAudioRef.current.play();
    }
    setIsPlayingInput(!isPlayingInput);
  };

  const handleOutputPlayPause = () => {
    if (!outputAudioRef.current) return;
    if (isPlayingOutput) {
      outputAudioRef.current.pause();
    } else {
      outputAudioRef.current.play();
    }
    setIsPlayingOutput(!isPlayingOutput);
  };

  const handleCopyTranscript = async () => {
    if (transcript) {
      await navigator.clipboard.writeText(transcript);
      alert("Transcript copied to clipboard!");
    }
  };

  const handleCopyResponse = async () => {
    if (response) {
      await navigator.clipboard.writeText(response);
      alert("Response copied to clipboard!");
    }
  };

  const handleDownloadOutput = () => {
    if (outputAudioURL) {
      const element = document.createElement("a");
      element.href = outputAudioURL;
      element.download = "ai-response.mp3";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      alert("AI response audio downloaded!");
    }
  };

  const handleClear = async () => {
    // Clear frontend state
    setTranscript(null);
    setResponse(null);
    setInputAudioURL(null);
    setOutputAudioURL(null);
    setRecordingDuration(0);
    setCurrentInputTime(0);
    setCurrentOutputTime(0);
    setInputDuration(0);
    setOutputDuration(0);
    setIsPlayingInput(false);
    setIsPlayingOutput(false);
    audioChunksRef.current = [];
    
    // Clear conversation history and backend memory
    await handleClearMemory();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Voice to Voice AI</h1>
          <p className="text-gray-600 text-lg">
            Have a natural conversation with AI - now with memory of your chat history
          </p>
          
          {/* Memory Status Indicator */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              hasContext 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              <Brain className="w-4 h-4" />
              <span>{hasContext ? `AI remembers ${conversationCount} conversations` : 'New conversation'}</span>
            </div>
            
            {hasContext && (
              <button
                onClick={handleClearMemory}
                disabled={memoryStatus === 'loading'}
                className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
              >
                {memoryStatus === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <History className="w-4 h-4" />
                )}
                <span>Clear Memory</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Recording Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-6">
              <div className="p-8">
                {/* Voice Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose AI Voice
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {voices.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setVoice(v.id)}
                        className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                          voice === v.id
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{v.name}</div>
                        <div className="text-xs text-gray-500">{v.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Context Indicator */}
                {hasContext && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">AI Memory Active</p>
                        <p className="text-xs text-green-600">The AI remembers your previous {conversationCount} conversations in this session</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recording Status */}
                <div className="text-center mb-8">
                  {recording && (
                    <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-6 py-3 rounded-full mb-4 animate-pulse">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                      <span className="font-semibold text-lg">Recording • {formatDuration(recordingDuration)}</span>
                    </div>
                  )}
                </div>

                {/* Recording Button */}
                <div className="flex justify-center mb-8">
                  <button
                    onClick={recording ? handleStopRecording : handleStartRecording}
                    disabled={loading}
                    className={`
                      relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform
                      ${recording 
                        ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 scale-110 shadow-2xl shadow-red-500/30' 
                        : 'bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 hover:scale-105 shadow-xl shadow-purple-500/30'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}
                    `}
                  >
                    {recording && (
                      <>
                        <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
                        <div className="absolute inset-6 rounded-full border-2 border-red-200 animate-pulse"></div>
                      </>
                    )}
                    
                    {recording ? (
                      <Square className="w-12 h-12 text-white fill-current" />
                    ) : (
                      <Mic className="w-12 h-12 text-white" />
                    )}
                  </button>
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-2 text-lg font-medium">
                    {recording ? 'Click to stop recording' : 'Click to start voice conversation'}
                  </p>
                  <p className="text-gray-500">
                    {hasContext 
                      ? 'AI will remember your conversation context' 
                      : 'Speak naturally and get an AI response in your chosen voice'
                    }
                  </p>
                </div>

                {/* Process Button */}
                {inputAudioURL && !loading && (
                  <button
                    onClick={handleVoiceToVoice}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>{hasContext ? 'Continue Conversation' : 'Process Voice Conversation'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4">
                    <Brain className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Processing Your Voice</h3>
                  <p className="text-gray-600 mb-4">
                    {hasContext 
                      ? 'Analyzing your voice with conversation context...' 
                      : 'Converting speech to text, generating response, and creating audio...'
                    }
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full animate-pulse" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Players and Results */}
            {(inputAudioURL || outputAudioURL) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Input Audio */}
                {inputAudioURL && (
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Your Voice</h3>
                        <p className="text-gray-500 text-sm">Duration: {formatDuration(recordingDuration)}</p>
                      </div>
                    </div>
                    
                    <audio
                      ref={inputAudioRef}
                      src={inputAudioURL}
                      onTimeUpdate={() => setCurrentInputTime(inputAudioRef.current?.currentTime || 0)}
                      onLoadedMetadata={() => setInputDuration(inputAudioRef.current?.duration || 0)}
                      onPlay={() => setIsPlayingInput(true)}
                      onPause={() => setIsPlayingInput(false)}
                      onEnded={() => setIsPlayingInput(false)}
                      className="hidden"
                    />
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <button
                        onClick={handleInputPlayPause}
                        className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 transition-colors"
                      >
                        {isPlayingInput ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="flex-1 text-sm text-gray-500">
                        {formatTime(currentInputTime)} / {formatTime(recordingDuration)}
                      </div>
                    </div>

                    {transcript && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium text-blue-700">TRANSCRIPT</span>
                          <button onClick={handleCopyTranscript} className="text-blue-600 hover:text-blue-800">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm text-blue-800">{transcript}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Output Audio */}
                {outputAudioURL && (
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">AI Response</h3>
                        <p className="text-gray-500 text-sm">
                          Voice: {voices.find(v => v.id === voice)?.name} 
                          {hasContext && <span className="text-green-600 ml-2">• With Context</span>}
                        </p>
                      </div>
                    </div>
                    
                    <audio
                      ref={outputAudioRef}
                      src={outputAudioURL}
                      onTimeUpdate={() => setCurrentOutputTime(outputAudioRef.current?.currentTime || 0)}
                      onLoadedMetadata={() => setOutputDuration(outputAudioRef.current?.duration || 0)}
                      onPlay={() => setIsPlayingOutput(true)}
                      onPause={() => setIsPlayingOutput(false)}
                      onEnded={() => setIsPlayingOutput(false)}
                      className="hidden"
                    />
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <button
                        onClick={handleOutputPlayPause}
                        className="w-8 h-8 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center text-purple-600 transition-colors"
                      >
                        {isPlayingOutput ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="flex-1 text-sm text-gray-500">
                        {formatTime(currentOutputTime)} / {formatTime(outputDuration)}
                      </div>
                      <button
                        onClick={handleDownloadOutput}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    {response && (
                      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium text-purple-700">AI RESPONSE</span>
                          <button onClick={handleCopyResponse} className="text-purple-600 hover:text-purple-800">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm text-purple-800">{response}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {(inputAudioURL || outputAudioURL) && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <button
                  onClick={handleClear}
                  className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              </div>
            )}
          </div>

          {/* Conversation History Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <span>Conversation History</span>
              </h3>
              
              {conversationHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                  <p className="text-gray-400 text-xs mt-1">Start by recording your voice</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {conversationHistory.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        item.type === 'user' 
                          ? 'bg-blue-50 border-l-3 border-blue-500' 
                          : 'bg-purple-50 border-l-3 border-purple-500'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        {item.type === 'user' ? (
                          <User className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Bot className="w-4 h-4 text-purple-600" />
                        )}
                        <span className={`text-xs font-medium ${
                          item.type === 'user' ? 'text-blue-700' : 'text-purple-700'
                        }`}>
                          {item.type === 'user' ? 'YOU' : 'AI'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 mb-2">{item.text}</p>
                      {item.audioURL && (
                        <audio controls className="w-full h-8 text-xs">
                          <source src={item.audioURL} type="audio/mpeg" />
                        </audio>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
          <h4 className="font-semibold text-gray-800 mb-3 text-lg">💡 Tips for Better Voice Conversations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <ul className="space-y-2">
              <li>• Speak clearly and at a normal pace</li>
              <li>• Use a quiet environment with minimal background noise</li>
              <li>• Ask specific questions for better AI responses</li>
              <li>• The AI remembers your conversation context</li>
            </ul>
            <ul className="space-y-2">
              <li>• Keep your microphone close but not too close</li>
              <li>• Try different AI voices to find your preference</li>
              <li>• Pause between sentences for clearer processing</li>
              <li>• Clear memory if you want to start fresh</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}