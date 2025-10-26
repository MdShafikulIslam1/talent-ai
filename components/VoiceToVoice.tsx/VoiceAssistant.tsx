"use client";
import { Loader2, Mic, MicOff, Square } from "lucide-react";
import { useRef, useState } from "react";

export default function VoiceAssistant() {
  const [recording, setRecording] = useState(false);
  const [inputAudioURL, setInputAudioURL] = useState<string | null>(null);
  const [outputAudioURL, setOutputAudioURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{
      type: "user" | "assistant";
      text: string;
      audioURL?: string;
      timestamp: Date;
    }>
  >([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const SILENCE_THRESHOLD = 0.08; // Adjusted threshold for silence detection
  const SILENCE_DURATION = 3000; // 3 seconds

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecording(true);

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setInputAudioURL(URL.createObjectURL(blob));
        await sendAudioToAPI(blob);
      };

      mediaRecorder.start();

      audioContextRef.current = new AudioContext();
      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 512;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const checkSilence = () => {
        // mediaRecorder state check করছি recording state এর বদলে
        if (mediaRecorderRef.current?.state !== "recording") {
          return;
        }

        analyserRef.current!.getByteFrequencyData(dataArray);
        const avg =
          dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 256;
        
        if (avg < SILENCE_THRESHOLD) {
          // Silence detect হলে timer start
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              stopRecording();
            }, SILENCE_DURATION);
          }
        } else {
          // আওয়াজ পেলে timer reset
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        }
        
        // Next frame check করতে থাকবে
        requestAnimationFrame(checkSilence);
      };
      checkSilence();

      console.log("Recording started...");
    } catch (err) {
      console.error(err);
      console.error("Could not access microphone");
    }
  };

  // const startRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  //     const mediaRecorder = new MediaRecorder(stream);
  //     mediaRecorderRef.current = mediaRecorder;
  //     audioChunksRef.current = [];
  //     setRecording(true);

  //     mediaRecorder.ondataavailable = (e) => {
  //       audioChunksRef.current.push(e.data);
  //     };

  //     mediaRecorder.onstop = async () => {
  //       const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
  //       setInputAudioURL(URL.createObjectURL(blob));
  //       await sendAudioToAPI(blob);
  //     };

  //     mediaRecorder.start();

  //     audioContextRef.current = new AudioContext();
  //     sourceRef.current =
  //       audioContextRef.current.createMediaStreamSource(stream);
  //     analyserRef.current = audioContextRef.current.createAnalyser();
  //     sourceRef.current.connect(analyserRef.current);
  //     analyserRef.current.fftSize = 512;

  //     const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

  //     const checkSilence = () => {
  //       analyserRef.current!.getByteFrequencyData(dataArray);
  //       const avg =
  //         dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 256;
  //       if (avg < SILENCE_THRESHOLD) {
  //         if (!silenceTimerRef.current) {
  //           silenceTimerRef.current = setTimeout(() => {
  //             stopRecording();
  //           }, SILENCE_DURATION);
  //         }
  //       } else {
  //         if (silenceTimerRef.current) {
  //           clearTimeout(silenceTimerRef.current);
  //           silenceTimerRef.current = null;
  //         }
  //       }
  //       if (recording) requestAnimationFrame(checkSilence);
  //     };
  //     checkSilence();

  //     console.log("Recording started...");
  //   } catch (err) {
  //     console.error(err);
  //     console.error("Could not access microphone");
  //   }
  // };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const sendAudioToAPI = async (blob: Blob) => {
    setLoading(true);
    try {
      const sessionId = generateUUID();
      console.log("sessionid", sessionId);
      const formData = new FormData();
      formData.append("data", blob, "voice.webm");
      formData.append("session_id", sessionId);

      const res = await fetch(
        "https://shofik.app.n8n.cloud/webhook/voice-to-voice",
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("API Error");

      const audioBlob = await res.blob();
      setOutputAudioURL(URL.createObjectURL(audioBlob));

      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(audioBlob);
        audioRef.current.play();
        audioRef.current.onended = () => {
          startRecording();
        };
      }
      console.log("AI response ready!");
    } catch (err) {
      console.error(err);
      console.error("Error processing voice");
    } finally {
      setLoading(false);
    }
  };

  const handleStopAll = () => {
    stopRecording();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    console.log("Conversation stopped!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white border-opacity-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
              Voice AI Assistant
            </h1>
            <p className="text-white text-opacity-90 text-lg">
              Speak naturally and let AI respond instantly
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <button
                onClick={recording ? stopRecording : startRecording}
                className={`relative w-32 h-32 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center ${
                  recording
                    ? "bg-gradient-to-br from-red-400 to-red-600 animate-pulse"
                    : "bg-gradient-to-br from-white to-gray-100"
                }`}
              >
                {recording ? (
                  <MicOff className="w-12 h-12 text-white" />
                ) : (
                  <Mic className="w-12 h-12 text-purple-600" />
                )}

                {recording && (
                  <span className="absolute -inset-2 rounded-full border-4 border-white border-opacity-30 animate-ping" />
                )}
              </button>

              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-white text-sm font-medium">
                  {recording ? "Listening..." : "Tap to speak"}
                </span>
              </div>
            </div>

            <div className="h-20 flex items-center justify-center">
              {loading && (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="w-10 h-10 animate-spin text-white" />
                  <span className="text-white text-sm">Processing...</span>
                </div>
              )}
            </div>

            <button
              onClick={handleStopAll}
              className="group px-8 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur rounded-full transition-all duration-200 border border-white border-opacity-30 flex items-center space-x-2"
            >
              <Square className="w-4 h-4 text-white" />
              <span className="text-white font-medium">Stop Everything</span>
            </button>
          </div>

          <div className="mt-12 flex justify-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                recording ? "bg-white animate-bounce" : "bg-white bg-opacity-30"
              }`}
              style={{ animationDelay: "0ms" }}
            />
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                recording ? "bg-white animate-bounce" : "bg-white bg-opacity-30"
              }`}
              style={{ animationDelay: "150ms" }}
            />
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                recording ? "bg-white animate-bounce" : "bg-white bg-opacity-30"
              }`}
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>

      <audio ref={audioRef} hidden />
    </div>
  );
}
