"use client";
import { Loader2, Mic, MicOff, Square } from "lucide-react";
import { useRef, useState } from "react";

interface ConversationItem {
  type: "user" | "assistant";
  text: string;
  audioURL?: string;
  timestamp: Date;
}

export default function ElevenLabsVoiceAssistant() {
  const [recording, setRecording] = useState(false);
  const [inputAudioURL, setInputAudioURL] = useState<string | null>(null);
  const [outputAudioURL, setOutputAudioURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationItem[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const SILENCE_THRESHOLD = 0.08;
  const SILENCE_DURATION = 3000; // 3 seconds

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
        const url = URL.createObjectURL(blob);
        setInputAudioURL(url);
        await sendAudioToAPI(blob);
      };

      mediaRecorder.start();

      // Setup audio analysis for silence detection
      audioContextRef.current = new AudioContext();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 512;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const checkSilence = () => {
        // Check if still recording
        if (mediaRecorderRef.current?.state !== "recording") {
          return;
        }

        analyserRef.current!.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 256;

        if (avg < SILENCE_THRESHOLD) {
          // Silence detected - start timer if not already started
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              stopRecording();
            }, SILENCE_DURATION);
          }
        } else {
          // Sound detected - reset timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        }

        // Continue checking
        requestAnimationFrame(checkSilence);
      };
      checkSilence();

      console.log("Recording started...");
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      const stream = mediaRecorderRef.current.stream;
      stream.getTracks().forEach(track => track.stop());
      
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
      const formData = new FormData();
      formData.append("audio", blob, "voice.webm");

      const res = await fetch("/api/voice-to-voice", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error: ${errorText}`);
      }

      const data = await res.json();
      console.log("API Response:", data);

      // Update transcript and response
      setTranscript(data.transcription);
      setResponse(data.aiResponse);

      // Add to conversation history
      setConversationHistory(prev => [
        ...prev,
        {
          type: "user",
          text: data.transcription,
          timestamp: new Date(),
        },
        {
          type: "assistant",
          text: data.aiResponse,
          timestamp: new Date(),
        },
      ]);

      // Convert base64 audio to blob and play
      const audioData = atob(data.audio);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      const audioBlob = new Blob([audioArray], { type: "audio/mpeg" });
      const audioURL = URL.createObjectURL(audioBlob);

      setOutputAudioURL(audioURL);

      // Play the audio
      if (audioRef.current) {
        audioRef.current.src = audioURL;
        
        // Play with error handling
        audioRef.current.play().catch(err => {
          console.error("Audio play error:", err);
        });

        // When audio ends, start recording again for continuous conversation
        audioRef.current.onended = () => {
          console.log("AI response finished, ready for next input");
          // Optionally auto-restart recording:
          // startRecording();
        };
      }

      console.log("AI response ready and playing!");
    } catch (err) {
      console.error("Error processing voice:", err);
      alert("Error processing your voice. Please try again.");
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

  const clearConversation = async () => {
    setConversationHistory([]);
    setTranscript(null);
    setResponse(null);
    setInputAudioURL(null);
    setOutputAudioURL(null);

    // Also clear on backend
    try {
      const formData = new FormData();
      formData.append("clearHistory", "true");
      await fetch("/api/voice-to-voice", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Error clearing history:", err);
    }
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
            {conversationHistory.length > 0 && (
              <p className="text-white text-opacity-80 text-sm mt-2">
                {conversationHistory.length / 2} conversation(s)
              </p>
            )}
          </div>

          <div className="flex flex-col items-center space-y-6">
            {/* Main microphone button */}
            <div className="relative">
              <button
                onClick={recording ? stopRecording : startRecording}
                disabled={loading}
                className={`relative w-32 h-32 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center ${
                  recording
                    ? "bg-gradient-to-br from-red-400 to-red-600 animate-pulse"
                    : loading
                    ? "bg-gradient-to-br from-gray-400 to-gray-600 cursor-not-allowed"
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
                  {recording ? "Listening..." : loading ? "Processing..." : "Tap to speak"}
                </span>
              </div>
            </div>

            {/* Loading indicator */}
            <div className="h-20 flex items-center justify-center">
              {loading && (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="w-10 h-10 animate-spin text-white" />
                  <span className="text-white text-sm">Processing...</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleStopAll}
                className="group px-8 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur rounded-full transition-all duration-200 border border-white border-opacity-30 flex items-center space-x-2"
              >
                <Square className="w-4 h-4 text-white" />
                <span className="text-white font-medium">Stop</span>
              </button>

              {conversationHistory.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="group px-8 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur rounded-full transition-all duration-200 border border-white border-opacity-30"
                >
                  <span className="text-white font-medium">Clear History</span>
                </button>
              )}
            </div>

            {/* Display latest transcript and response */}
            {(transcript || response) && (
              <div className="w-full mt-6 space-y-3">
                {transcript && (
                  <div className="bg-white bg-opacity-20 backdrop-blur rounded-2xl p-4 border border-white border-opacity-30">
                    <p className="text-white text-opacity-70 text-xs mb-1">You said:</p>
                    <p className="text-white text-sm">{transcript}</p>
                  </div>
                )}
                {response && (
                  <div className="bg-white bg-opacity-20 backdrop-blur rounded-2xl p-4 border border-white border-opacity-30">
                    <p className="text-white text-opacity-70 text-xs mb-1">AI replied:</p>
                    <p className="text-white text-sm">{response}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Activity indicator */}
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

      {/* Hidden audio element */}
      <audio ref={audioRef} hidden />
    </div>
  );
}