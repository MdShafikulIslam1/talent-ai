"use client";

import { useState, useRef } from "react";
import {
  Volume2,
  Play,
  Pause,
  Download,
  Copy,
  Trash2,
  FileText,
  Sparkles,
  Loader2,
  VolumeX,
  RotateCcw,
} from "lucide-react";
import { voices } from "@/const";
import { toast } from "sonner";

export default function TextToAudioPage() {
  const [text, setText] = useState("");
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [voice, setVoice] = useState("Fritz-PlayAI");
  const [speed, setSpeed] = useState(1.0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speeds = [
    { value: 0.25, label: "0.25x" },
    { value: 0.5, label: "0.5x" },
    { value: 0.75, label: "0.75x" },
    { value: 1.0, label: "1x" },
    { value: 1.25, label: "1.25x" },
    { value: 1.5, label: "1.5x" },
    { value: 2.0, label: "2x" },
  ];

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to convert!");
      return;
    }

    if (text.length > 4000) {
      toast.error("Text is too long! Maximum 4000 characters allowed.");
      return;
    }

    setLoading(true);
    setAudioURL(null);
    setCurrentTime(0);
    setDuration(0);

    try {
      const response = await fetch("/api/text-to-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          voice: voice,
          speed: speed,
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        toast.success("Audio generated successfully!");
      } else if (response.status === 403) {
        toast.error("Free trial expired. Please upgrade to Pro!");
      } else if (response.status === 400) {
        toast.error("Invalid text input. Please try again.");
      } else {
        throw new Error("Failed to generate audio");
      }
    } catch (error) {
      console.error("Text to audio error:", error);
      toast.error("Could not generate audio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDownloadAudio = () => {
    if (audioURL) {
      const element = document.createElement("a");
      element.href = audioURL;
      element.download = "generated-audio.mp3";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Audio file downloaded!");
    }
  };

  const handleCopyText = async () => {
    if (text) {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied to clipboard!");
    }
  };

  const handleClear = () => {
    setText("");
    setAudioURL(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    toast.success("Cleared successfully!");
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Volume2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Text to Audio
          </h1>
          <p className="text-gray-600 text-lg">
            Convert your text into natural-sounding speech with AI
          </p>
        </div>

        {/* Main Input Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="p-8">
            {/* Text Input */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Enter Your Text
                </h3>
              </div>

              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your text here... (Maximum 4000 characters)"
                  className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 leading-relaxed"
                  maxLength={4000}
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                  {text.length}/4000
                </div>
              </div>
            </div>

            {/* Voice and Speed Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Voice Selection */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Voice
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {voices.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVoice(v.id)}
                      className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                        voice === v.id
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <div className="font-medium text-sm">{v.name}</div>
                      <div className="text-xs text-gray-500">
                        {v.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Speech Speed
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {speeds.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSpeed(s.value)}
                      className={`p-3 rounded-lg border transition-all duration-200 text-center ${
                        speed === s.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <div className="font-medium text-sm">{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateAudio}
              disabled={loading || !text.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI is generating audio...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Audio with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                AI Processing Your Text
              </h3>
              <p className="text-gray-600 mb-4">
                Our advanced AI is converting your text to speech...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full animate-pulse"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Audio Player */}
        {audioURL && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6 transform transition-all duration-500 hover:shadow-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Generated Audio
                </h3>
                <p className="text-gray-500">
                  Voice: {voices.find((v) => v.id === voice)?.name} • Speed:{" "}
                  {speed}x
                </p>
              </div>
            </div>

            {/* Custom Audio Player */}
            <div className="space-y-4">
              <audio
                ref={audioRef}
                src={audioURL}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              {/* Player Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div className="text-sm text-gray-500 min-w-[80px] text-right">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                <button
                  onClick={handleCopyText}
                  className="flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Text</span>
                </button>
                <button
                  onClick={handleDownloadAudio}
                  className="flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Audio</span>
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h4 className="font-semibold text-gray-800 mb-3 text-lg">
            💡 Tips for Better Audio Generation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <ul className="space-y-2">
              <li>• Use proper punctuation for natural pauses</li>
              <li>• Break long sentences into shorter ones</li>
              <li>• Choose the right voice for your content type</li>
            </ul>
            <ul className="space-y-2">
              <li>• Adjust speed based on your audience</li>
              <li>• Use quotation marks for dialogue</li>
              <li>• Add periods for clearer sentence endings</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
