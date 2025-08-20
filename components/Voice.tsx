"use client";

import { useState, useRef } from "react";
import { Mic, Square, Send, Volume2, Loader2, FileAudio, Sparkles, Copy, Download, Trash2 } from "lucide-react";

import axios from "axios";
import { toast } from "sonner";

export default function VoiceToTextPage() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartRecording = async () => {
    setTranscript(null);
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
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);

      // Start duration counter
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      toast.success("Recording started!");
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    toast.success("Recording stopped!");
  };

  const handleTranscribe = async () => {
    if (!audioURL) return;

    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', blob, 'voice.webm');

    setLoading(true);
    setTranscript(null);

    try {
      const response = await axios.post('/api/voice-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      if (data.success) {
        setTranscript(data.text);
        toast.success("Transcription completed!");
      } else {
        throw new Error("Transcription failed");
      }
    } catch (error) {
      console.error('Transcription error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error("Free trial expired. Please upgrade to Pro!");
      } else {
        toast.error('Could not transcribe audio. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyText = async () => {
    if (transcript) {
      await navigator.clipboard.writeText(transcript);
      toast.success("Text copied to clipboard!");
    }
  };

  const handleDownloadText = () => {
    if (transcript) {
      const element = document.createElement("a");
      const file = new Blob([transcript], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "transcription.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Text file downloaded!");
    }
  };

  const handleClear = () => {
    setTranscript(null);
    setAudioURL(null);
    setRecordingDuration(0);
    audioChunksRef.current = [];
    toast.success("Cleared successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Voice to Text</h1>
          <p className="text-gray-600 text-lg">
            Record your voice and get instant AI-powered transcription
          </p>
        </div>

        {/* Main Recording Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="p-8">
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
                  relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 transform
                  ${recording 
                    ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 scale-110 shadow-2xl shadow-red-500/30' 
                    : 'bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:scale-105 shadow-xl shadow-red-500/30'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}
                `}
              >
                {/* Animated rings for recording */}
                {recording && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
                    <div className="absolute inset-6 rounded-full border-2 border-red-200 animate-pulse"></div>
                  </>
                )}
                
                {recording ? (
                  <Square className="w-16 h-16 text-white fill-current" />
                ) : (
                  <Mic className="w-16 h-16 text-white" />
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-2 text-lg font-medium">
                {recording ? 'Click to stop recording' : 'Click to start recording'}
              </p>
              <p className="text-gray-500">
                Make sure your microphone is enabled for best results
              </p>
            </div>
          </div>
        </div>

        {/* Audio Player and Controls */}
        {audioURL && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6 transform transition-all duration-500 hover:shadow-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <FileAudio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">Recording Ready</h3>
                <p className="text-gray-500">Duration: {formatDuration(recordingDuration)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <audio 
                controls 
                src={audioURL} 
                className="w-full h-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              
              <button
                onClick={handleTranscribe}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>AI is transcribing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Convert to Text with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Processing Your Audio</h3>
              <p className="text-gray-600 mb-4">Our advanced AI is converting your speech to text...</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full animate-pulse" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Transcription Result */}
        {transcript && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform transition-all duration-500 hover:shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">AI Transcription Result</h3>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-l-4 border-red-500 mb-6">
              <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                {transcript}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={handleCopyText}
                className="flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Text</span>
              </button>
              <button
                onClick={handleDownloadText}
                className="flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
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
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
          <h4 className="font-semibold text-gray-800 mb-3 text-lg">💡 Tips for Better Transcription</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <ul className="space-y-2">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Minimize background noise</li>
              <li>• Keep your microphone close but not too close</li>
            </ul>
            <ul className="space-y-2">
              <li>• Pause briefly between sentences</li>
              <li>• Speak in a quiet environment</li>
              <li>• Use good quality microphone if possible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}