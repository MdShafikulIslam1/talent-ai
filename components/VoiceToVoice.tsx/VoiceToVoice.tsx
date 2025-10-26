// "use client";

// import { History, MessageCircle, Mic, Square, Trash2 } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { toast } from "sonner";
// // --- CONFIG: adjust these to tune sensitivity / timings ---
// const API_ENDPOINT = "https://shofik.app.n8n.cloud/webhook/voice-to-voice"; // বা আপনার webhook URL (উদাহরণ: "https://shofik.app.n8n.cloud/...")
// const SILENCE_THRESHOLD = 0.01; // RMS threshold (lower = more sensitive). Tune as needed.
// const SILENCE_DURATION = 1500; // milliseconds of continuous "silence" to trigger stop
// const AUTO_RESTART_DELAY = 500; // ms delay after AI finished speaking before restarting listening

// export default function VoiceToVoicePage() {
//   const [modeActive, setModeActive] = useState(false); // overall continuous conversation mode on/off
//   const [listening, setListening] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [speaking, setSpeaking] = useState(false);
//   const [inputAudioURL, setInputAudioURL] = useState<string | null>(null);
//   const [outputAudioURL, setOutputAudioURL] = useState<string | null>(null);
//   const [transcript, setTranscript] = useState<string | null>(null);
//   const [responseText, setResponseText] = useState<string | null>(null);
//   const [conversationHistory, setConversationHistory] = useState<
//     Array<{
//       type: "user" | "assistant";
//       text: string;
//       audioURL?: string;
//       timestamp: Date;
//     }>
//   >([]);
//   const [conversationCount, setConversationCount] = useState(0);
//   const [hasContext, setHasContext] = useState(false);

//   // refs for audio processing
//   const mediaStreamRef = useRef<MediaStream | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const analyserRef = useRef<AnalyserNode | null>(null);
//   const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
//   const rmsIntervalRef = useRef<number | null>(null);
//   const silenceTimerRef = useRef<number | null>(null);
//   const outputAudioRef = useRef<HTMLAudioElement | null>(null);

//   // durations and play state for UI
//   const [recordingDuration, setRecordingDuration] = useState(0);
//   const recordingTimerRef = useRef<number | null>(null);

//   // ---------- Helpers ----------
//   const formatDuration = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const startRecordingTimer = () => {
//     if (recordingTimerRef.current)
//       window.clearInterval(recordingTimerRef.current);
//     setRecordingDuration(0);
//     recordingTimerRef.current = window.setInterval(() => {
//       setRecordingDuration((s) => s + 1);
//     }, 1000);
//   };

//   const stopRecordingTimer = () => {
//     if (recordingTimerRef.current) {
//       window.clearInterval(recordingTimerRef.current);
//       recordingTimerRef.current = null;
//     }
//   };

//   // compute RMS from analyser float time domain data
//   const computeRMS = (buffer: Float32Array) => {
//     let sum = 0;
//     for (let i = 0; i < buffer.length; i++) {
//       const v = buffer[i];
//       sum += v * v;
//     }
//     return Math.sqrt(sum / buffer.length);
//   };

//   // ---------- Core: start listening ----------
//   const startListening = async () => {
//     if (listening || processing || speaking) return;
//     try {
//       // request mic
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaStreamRef.current = stream;

//       // prepare MediaRecorder
//       audioChunksRef.current = [];
//       const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
//       mediaRecorderRef.current = recorder;

//       recorder.ondataavailable = (e) => {
//         if (e.data && e.data.size > 0) {
//           audioChunksRef.current.push(e.data);
//         }
//       };

//       recorder.onstop = () => {
//         // form the final blob and set input URL (for UI and history)
//         const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//         const url = URL.createObjectURL(blob);
//         setInputAudioURL(url);
//       };

//       recorder.start();
//       setListening(true);
//       startRecordingTimer();

//       // prepare analyser + audioContext for silence detection
//       const audioCtx = new (window.AudioContext ||
//         (window as any).webkitAudioContext)();
//       audioContextRef.current = audioCtx;
//       const source = audioCtx.createMediaStreamSource(stream);
//       sourceNodeRef.current = source;
//       const analyser = audioCtx.createAnalyser();
//       analyser.fftSize = 2048;
//       source.connect(analyser);
//       analyserRef.current = analyser;

//       // realtime check interval: sample every 100ms
//       if (rmsIntervalRef.current) window.clearInterval(rmsIntervalRef.current);
//       rmsIntervalRef.current = window.setInterval(() => {
//         if (!analyserRef.current) return;
//         const buffer = new Float32Array(analyserRef.current.fftSize);
//         analyserRef.current.getFloatTimeDomainData(buffer);
//         const rms = computeRMS(buffer);

//         // if rms is below threshold, start/continue silence timer
//         if (rms <= SILENCE_THRESHOLD) {
//           if (!silenceTimerRef.current) {
//             silenceTimerRef.current = window.setTimeout(() => {
//               // silence duration reached -> stop recording and send
//               handleSilenceDetected();
//             }, SILENCE_DURATION);
//           }
//         } else {
//           // sound detected -> clear timer
//           if (silenceTimerRef.current) {
//             window.clearTimeout(silenceTimerRef.current);
//             silenceTimerRef.current = null;
//           }
//         }
//       }, 100);
//       toast.success("Listening...");
//     } catch (err) {
//       console.error("startListening error:", err);
//       toast.error(
//         "Could not access microphone. অনুগ্রহ করে পারমিশন নিশ্চিত করুন।"
//       );
//       cleanupAll();
//     }
//   };

//   const stopListening = () => {
//     try {
//       if (
//         mediaRecorderRef.current &&
//         mediaRecorderRef.current.state !== "inactive"
//       ) {
//         mediaRecorderRef.current.stop();
//       }

//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach((t) => t.stop());
//         mediaStreamRef.current = null;
//       }

//       if (audioContextRef.current) {
//         try {
//           audioContextRef.current.close();
//         } catch (e) {
//           // ignore
//         }
//         audioContextRef.current = null;
//       }
//       if (rmsIntervalRef.current) {
//         window.clearInterval(rmsIntervalRef.current);
//         rmsIntervalRef.current = null;
//       }
//       if (silenceTimerRef.current) {
//         window.clearTimeout(silenceTimerRef.current);
//         silenceTimerRef.current = null;
//       }
//       setListening(false);
//       stopRecordingTimer();
//     } catch (err) {
//       console.error("stopListening error:", err);
//     }
//   };

//   const handleSilenceDetected = () => {
//     // user paused -> stop recorder and send blob
//     stopListening();
//     // small delay to let recorder finalize
//     setTimeout(() => {
//       sendRecordedAudio();
//     }, 150);
//   };

//   // ---------- send recorded audio to API and handle response ----------
//   const sendRecordedAudio = async () => {
//     if (processing) return;
//     const chunks = audioChunksRef.current;
//     if (!chunks || chunks.length === 0) {
//       // nothing recorded
//       if (modeActive) {
//         // restart listening
//         setTimeout(() => startListening(), 200);
//       }
//       return;
//     }

//     setProcessing(true);
//     setResponseText(null);
//     setOutputAudioURL(null);

//     try {
//       const blob = new Blob(chunks, { type: "audio/webm" });
//       // append to form data
//       const formData = new FormData();
//       formData.append("data", blob, "voice.webm");
//       //   formData.append("context", hasContext ? "true" : "false");

//       // POST to API (update API_ENDPOINT as needed)
//       const res = await fetch(API_ENDPOINT, {
//         method: "POST",
//         body: formData,
//       });

//       // handle different response types:
//       // - if server returns audio blob: we will create objectURL and play
//       // - if server returns JSON with base64 audio + transcription + aiResponse: handle accordingly
//       if (!res.ok) {
//         if (res.status === 403) {
//           toast.error(
//             "Free trial expired or access denied. Upgrade/Check credential."
//           );
//         } else {
//           toast.error("Server error while processing audio.");
//         }
//         throw new Error("API error");
//       }

//       const contentType = res.headers.get("content-type") || "";
//       if (contentType.includes("application/json")) {
//         const data = await res.json();
//         // expected fields: success, transcription, aiResponse, audio (base64), conversationCount, hasContext
//         if (data.success) {
//           if (data.transcription) setTranscript(data.transcription);
//           if (data.aiResponse) setResponseText(data.aiResponse);
//           if (data.conversationCount)
//             setConversationCount(data.conversationCount);
//           if (typeof data.hasContext === "boolean")
//             setHasContext(data.hasContext);

//           // handle base64 audio
//           if (data.audio) {
//             const bytes = Uint8Array.from(atob(data.audio), (c) =>
//               c.charCodeAt(0)
//             );
//             const audioBlob = new Blob([bytes], { type: "audio/mpeg" });
//             const audioUrl = URL.createObjectURL(audioBlob);
//             setOutputAudioURL(audioUrl);
//             playOutputAudioAndContinue(
//               audioUrl,
//               data.transcription,
//               data.aiResponse
//             );
//             toast.success("AI responded.");
//           } else {
//             // no audio - maybe text only. Add to history and restart listening
//             addToHistoryAndMaybeRestart(data.transcription, data.aiResponse);
//           }
//         } else {
//           throw new Error("API returned success:false");
//         }
//       } else if (
//         contentType.startsWith("audio/") ||
//         contentType.includes("octet-stream")
//       ) {
//         // server returned raw audio blob
//         const audioBlob = await res.blob();
//         const audioUrl = URL.createObjectURL(audioBlob);
//         setOutputAudioURL(audioUrl);
//         playOutputAudioAndContinue(audioUrl);
//         toast.success("AI audio received.");
//       } else {
//         // fallback: try blob
//         const blob = await res.blob();
//         const audioUrl = URL.createObjectURL(blob);
//         setOutputAudioURL(audioUrl);
//         playOutputAudioAndContinue(audioUrl);
//       }
//     } catch (err) {
//       console.error("sendRecordedAudio error:", err);
//       toast.error("Failed to process voice. আবার চেষ্টা করুন।");
//       // ensure we restart listening in continuous mode
//       if (modeActive) {
//         setTimeout(() => startListening(), 700);
//       }
//     } finally {
//       setProcessing(false);
//       // reset recorded chunks for next turn
//       audioChunksRef.current = [];
//       setRecordingDuration(0);
//       stopRecordingTimer();
//     }
//   };

//   // add conversation items and optionally restart listening
//   const addToHistoryAndMaybeRestart = (
//     userText?: string | null,
//     aiText?: string | null
//   ) => {
//     const now = new Date();
//     const newHistory = [...conversationHistory];
//     if (userText) {
//       newHistory.push({
//         type: "user",
//         text: userText,
//         audioURL: inputAudioURL || undefined,
//         timestamp: now,
//       });
//     }
//     if (aiText) {
//       newHistory.push({ type: "assistant", text: aiText, timestamp: now });
//     }
//     setConversationHistory(newHistory);
//     // restart listening if modeActive
//     if (modeActive) {
//       setTimeout(() => startListening(), 500);
//     }
//   };

//   // ---------- play the AI audio, and when finished, restart listening (if modeActive) ----------
//   const playOutputAudioAndContinue = (
//     audioUrl: string,
//     transcription?: string,
//     aiText?: string
//   ) => {
//     // ensure any existing audio is stopped
//     if (outputAudioRef.current) {
//       try {
//         outputAudioRef.current.pause();
//       } catch (e) {}
//     }
//     const audio = new Audio(audioUrl);
//     outputAudioRef.current = audio;
//     setSpeaking(true);
//     // push to history immediately (will show while playing)
//     const now = new Date();
//     const newHistory = [...conversationHistory];
//     if (transcription)
//       newHistory.push({
//         type: "user",
//         text: transcription,
//         audioURL: inputAudioURL || undefined,
//         timestamp: now,
//       });
//     if (aiText)
//       newHistory.push({
//         type: "assistant",
//         text: aiText,
//         audioURL: audioUrl,
//         timestamp: now,
//       });
//     setConversationHistory(newHistory);

//     audio.onended = () => {
//       setSpeaking(false);
//       // free objectURL? we might keep for download UI; leave it for now
//       if (modeActive) {
//         setTimeout(() => {
//           startListening();
//         }, AUTO_RESTART_DELAY);
//       }
//     };

//     audio.onerror = (e) => {
//       console.error("Audio play error", e);
//       setSpeaking(false);
//       if (modeActive) {
//         setTimeout(() => startListening(), AUTO_RESTART_DELAY);
//       }
//     };

//     // start playing
//     audio.play().catch((err) => {
//       console.error("Play failed", err);
//       setSpeaking(false);
//       if (modeActive) {
//         setTimeout(() => startListening(), AUTO_RESTART_DELAY);
//       }
//     });
//   };

//   // ---------- Cleanup everything ----------
//   const cleanupAll = () => {
//     stopListening();
//     setModeActive(false);
//     setListening(false);
//     setProcessing(false);
//     setSpeaking(false);

//     if (outputAudioRef.current) {
//       try {
//         outputAudioRef.current.pause();
//       } catch (e) {}
//       outputAudioRef.current = null;
//     }
//     if (audioChunksRef.current) audioChunksRef.current = [];
//     setInputAudioURL(null);
//     setOutputAudioURL(null);
//     stopRecordingTimer();
//     if (rmsIntervalRef.current) {
//       window.clearInterval(rmsIntervalRef.current);
//       rmsIntervalRef.current = null;
//     }
//     if (silenceTimerRef.current) {
//       window.clearTimeout(silenceTimerRef.current);
//       silenceTimerRef.current = null;
//     }
//     if (audioContextRef.current) {
//       try {
//         audioContextRef.current.close();
//       } catch (e) {}
//       audioContextRef.current = null;
//     }
//     if (mediaStreamRef.current) {
//       mediaStreamRef.current.getTracks().forEach((t) => t.stop());
//       mediaStreamRef.current = null;
//     }
//   };

//   // ---------- UI Controls ----------
//   const handleToggleMode = async () => {
//     if (!modeActive) {
//       // start continuous mode
//       setModeActive(true);
//       await startListening();
//     } else {
//       // stop everything
//       cleanupAll();
//       toast.success("Conversation stopped.");
//     }
//   };

//   const handleManualStop = () => {
//     cleanupAll();
//     toast.success("Stopped.");
//   };

//   const handleClearHistory = () => {
//     setConversationHistory([]);
//     setConversationCount(0);
//     setHasContext(false);
//     toast.success("Conversation history cleared.");
//   };

//   const handleDownloadOutput = () => {
//     if (outputAudioURL) {
//       const a = document.createElement("a");
//       a.href = outputAudioURL;
//       a.download = "ai-response.mp3";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       toast.success("Downloaded audio");
//     }
//   };

//   // cleanup on unmount
//   useEffect(() => {
//     return () => {
//       cleanupAll();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ---------- Render UI ----------
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-6">
//           <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-3 shadow-lg">
//             <MessageCircle className="w-6 h-6 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-1">
//             Voice to Voice — Continuous Mode
//           </h1>
//           <p className="text-gray-600 text-sm">
//             একটি বোতামে শুরু করুন — কথা বলুন, থামুন — AI উত্তর শুনুন — আবার
//             বলুন। (Auto silence detection)
//           </p>

//           {/* Status indicators */}
//           <div className="flex items-center justify-center space-x-3 mt-4">
//             <div
//               className={`px-3 py-1 rounded-full text-sm ${
//                 listening
//                   ? "bg-green-100 text-green-700"
//                   : "bg-gray-100 text-gray-500"
//               }`}
//             >
//               {listening ? "Listening..." : "Not listening"}
//             </div>
//             <div
//               className={`px-3 py-1 rounded-full text-sm ${
//                 processing
//                   ? "bg-yellow-100 text-yellow-800"
//                   : "bg-gray-100 text-gray-500"
//               }`}
//             >
//               {processing ? "AI Processing..." : "Idle"}
//             </div>
//             <div
//               className={`px-3 py-1 rounded-full text-sm ${
//                 speaking
//                   ? "bg-purple-100 text-purple-700"
//                   : "bg-gray-100 text-gray-500"
//               }`}
//             >
//               {speaking ? "AI Speaking..." : "Silent"}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main panel */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 mb-6">
//               {/* Voice choices */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Choose AI Voice
//                 </label>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                   {voices.map((v) => (
//                     <button
//                       key={v.id}
//                       onClick={() => setVoice(v.id)}
//                       className={`p-3 rounded-lg border transition-all duration-200 text-left ${
//                         voice === v.id
//                           ? "border-purple-500 bg-purple-50 text-purple-700"
//                           : "border-gray-200 hover:border-gray-300 text-gray-700"
//                       }`}
//                     >
//                       <div className="font-medium text-sm">{v.name}</div>
//                       <div className="text-xs text-gray-500">
//                         {v.description}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Control Buttons */}
//               <div className="flex items-center space-x-3 mb-4">
//                 <button
//                   onClick={handleToggleMode}
//                   className={`px-4 py-3 rounded-xl text-white font-semibold transition ${
//                     modeActive
//                       ? "bg-red-500 hover:bg-red-600"
//                       : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
//                   }`}
//                 >
//                   {modeActive
//                     ? "Stop Conversation"
//                     : "Start Continuous Conversation"}
//                 </button>

//                 <button
//                   onClick={() => {
//                     if (listening) {
//                       stopListening();
//                       toast.success("Manually stopped listening.");
//                     } else {
//                       startListening();
//                     }
//                   }}
//                   className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
//                 >
//                   {listening ? (
//                     <span className="flex items-center space-x-2">
//                       <Square className="w-4 h-4 text-red-500" />
//                       <span>Stop Listening</span>
//                     </span>
//                   ) : (
//                     <span className="flex items-center space-x-2">
//                       <Mic className="w-4 h-4 text-green-600" />
//                       <span>Listen Now</span>
//                     </span>
//                   )}
//                 </button>

//                 <button
//                   onClick={handleClearHistory}
//                   className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
//                 >
//                   <History className="w-4 h-4 inline-block mr-2" /> Clear
//                   History
//                 </button>

//                 <button
//                   onClick={handleManualStop}
//                   className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
//                 >
//                   <Trash2 className="w-4 h-4 inline-block mr-2" /> Full Stop &
//                   Cleanup
//                 </button>
//               </div>

//               {/* Recording duration & small tips */}
//               <div className="text-sm text-gray-500 mb-4">
//                 Recording duration:{" "}
//                 <span className="font-medium text-gray-700">
//                   {formatDuration(recordingDuration)}
//                 </span>
//                 <span className="ml-4">
//                   Silence threshold: {SILENCE_THRESHOLD} • Silence duration:{" "}
//                   {SILENCE_DURATION}ms
//                 </span>
//               </div>

//               {/* Input/Output blocks */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Input */}
//                 <div className="bg-gray-50 rounded-xl p-4">
//                   <h4 className="font-semibold text-gray-700 mb-2">
//                     Your Latest Recording
//                   </h4>
//                   {inputAudioURL ? (
//                     <div>
//                       <audio src={inputAudioURL} controls className="w-full" />
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-500">
//                       No recording yet. Click Start and speak.
//                     </p>
//                   )}
//                 </div>

//                 {/* Output */}
//                 <div className="bg-gray-50 rounded-xl p-4">
//                   <h4 className="font-semibold text-gray-700 mb-2">
//                     AI Response
//                   </h4>
//                   {outputAudioURL ? (
//                     <div>
//                       <audio src={outputAudioURL} controls className="w-full" />
//                       <div className="flex items-center justify-between mt-2">
//                         <div className="text-sm text-gray-600">
//                           {responseText || "AI response audio ready"}
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={handleDownloadOutput}
//                             className="text-sm px-2 py-1 border rounded"
//                           >
//                             Download
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-500">
//                       AI answer will appear here after processing.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Conversation history + transcript */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
//               <h3 className="font-semibold text-gray-800 mb-3">
//                 Conversation History
//               </h3>
//               {conversationHistory.length === 0 ? (
//                 <div className="text-sm text-gray-500">
//                   No conversation yet.
//                 </div>
//               ) : (
//                 <div className="space-y-3 max-h-64 overflow-y-auto">
//                   {conversationHistory.map((c, i) => (
//                     <div
//                       key={i}
//                       className={`p-3 rounded-lg ${
//                         c.type === "user"
//                           ? "bg-blue-50 border-l-4 border-blue-400"
//                           : "bg-purple-50 border-l-4 border-purple-400"
//                       }`}
//                     >
//                       <div className="flex items-center justify-between mb-1">
//                         <div className="text-xs font-medium">
//                           {c.type === "user" ? "YOU" : "AI"}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {c.timestamp.toLocaleTimeString()}
//                         </div>
//                       </div>
//                       <div className="text-sm text-gray-800">{c.text}</div>
//                       {c.audioURL && (
//                         <audio
//                           className="w-full mt-2"
//                           controls
//                           src={c.audioURL}
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sidebar tips & quick actions */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-4">
//               <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
//                 <MessageCircle className="w-5 h-5 text-purple-600" />
//                 <span>Tips</span>
//               </h3>
//               <ul className="text-sm text-gray-600 space-y-2">
//                 <li>• Use quiet environment for better transcription.</li>
//                 <li>
//                   • Adjust <code>SILENCE_THRESHOLD</code> and{" "}
//                   <code>SILENCE_DURATION</code> if needed.
//                 </li>
//                 <li>
//                   • If AI response is delayed, increase server timeout or reduce
//                   audio length.
//                 </li>
//                 <li>• To test quickly, try short sentences and pause.</li>
//               </ul>

//               <hr className="my-4" />

//               <div className="text-sm text-gray-600">
//                 <div className="mb-2">
//                   <strong>Quick Controls</strong>
//                 </div>
//                 <div className="flex flex-col gap-2">
//                   <button
//                     className="px-3 py-2 rounded border"
//                     onClick={() => {
//                       setModeActive(false);
//                       startListening();
//                     }}
//                   >
//                     Quick Listen
//                   </button>
//                   <button
//                     className="px-3 py-2 rounded border"
//                     onClick={() => {
//                       stopListening();
//                     }}
//                   >
//                     Stop Listen
//                   </button>
//                   <button
//                     className="px-3 py-2 rounded border"
//                     onClick={handleClearHistory}
//                   >
//                     Clear History
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* small footer */}
//         <div className="mt-6 text-center text-sm text-gray-500">
//           Continuous conversation mode । Auto-detect silence and handle
//           request/response loop.
//         </div>
//       </div>
//     </div>
//   );
// }
