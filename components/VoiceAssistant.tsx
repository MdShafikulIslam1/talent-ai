"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Volume2, Loader2, X, Sparkles, ArrowRight, MessageSquare, Headphones } from 'lucide-react';

// TypeScript interfaces
interface Feature {
  name: string;
  route: string;
  description: string;
  icon?: string;
}

interface ResponseContent {
  name?: string;
  description?: string;
  route?: string;
  icon?: string;
  text?: string;
  example?: string;
  command?: string;
}

interface VoiceResponse {
  type: 'features' | 'detailed_features' | 'navigation' | 'route_info' | 'help' | 'error' | 'default' | 'success';
  title: string;
  message?: string;
  content?: ResponseContent[] | ResponseContent;
  suggestion?: string;
}

interface ApiResponse {
  success: boolean;
  transcript?: string;
  intent?: string;
  confidence?: number;
  response?: VoiceResponse;
  error?: string;
}

const VoiceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<VoiceResponse | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Website features data
  const features: Feature[] = [
    { name: 'Conversation', route: '/conversation', description: 'AI-powered chat conversations with advanced language models for natural dialogue', icon: '💬' },
    { name: 'Code Generation', route: '/code', description: 'Generate clean, efficient code in multiple programming languages with AI assistance', icon: '👨‍💻' },
    { name: 'Sentiment Analysis', route: '/sentiment', description: 'Analyze emotions and sentiments in text with AI precision and detailed insights', icon: '🎭' },
    { name: 'Voice to Text', route: '/voice-to-text', description: 'Convert speech to accurate text transcriptions instantly using advanced AI', icon: '🎙️' },
    { name: 'Text to Audio', route: '/text-to-audio', description: 'Transform written content into natural-sounding speech with AI voice synthesis', icon: '🔊' },
    { name: 'Voice to Voice', route: '/voice-to-voice', description: 'Real-time voice conversation with AI assistant for natural interactions', icon: '🗣️' },
    { name: 'Text Translation', route: '/translation', description: 'Translate text between multiple languages accurately with AI-powered translation', icon: '🌐' },
    { name: 'Grammar Correction', route: '/grammar-correction', description: 'Fix grammar, spelling, and style errors intelligently with AI assistance', icon: '✅' },
    { name: 'Summarize Text', route: '/summarize-text', description: 'Create concise summaries from long-form content using advanced AI algorithms', icon: '📄' },
    { name: 'Smart Paraphraser', route: '/smart-paraphraser', description: 'Rewrite content while maintaining original meaning with intelligent paraphrasing', icon: '🔄' },
    { name: 'Dashboard', route: '/dashboard', description: 'Main dashboard with overview of all features and usage statistics', icon: '🏠' },
    { name: 'Settings', route: '/settings', description: 'Manage your account settings and preferences for personalized experience', icon: '⚙️' }
  ];

  const handleStartRecording = async (): Promise<void> => {
    setResponse(null);
    setRecordingDuration(0);
    setTranscript('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
        handleTranscribe(audioBlob);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setRecording(true);

      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setResponse({
        type: 'error',
        title: '❌ Microphone Error',
        message: 'Could not access microphone. Please check permissions and try again.',
        suggestion: 'Make sure microphone permissions are enabled for this website.'
      });
    }
  };

  const handleStopRecording = (): void => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleTranscribe = async (audioBlob: Blob): Promise<void> => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice.webm');

      const response = await fetch('/api/voice-assistant', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.success && data.response) {
        setTranscript(data.transcript || '');
        setResponse(data.response);
      } else {
        setResponse({
          type: 'error',
          title: '❌ Processing Error',
          message: data.error || 'Could not process your voice request.',
          suggestion: 'Please try speaking more clearly or check your internet connection.'
        });
      }
      
    } catch (error) {
      console.error('Transcription error:', error);
      setResponse({
        type: 'error',
        title: '❌ Connection Error', 
        message: 'Sorry, I couldn\'t connect to the server. Please check your internet connection and try again.',
        suggestion: 'Make sure you have a stable internet connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNavigation = (route: string): void => {
    console.log('Navigating to:', route);
    
    // Show success message first
    setResponse({
      type: 'success',
      title: '✅ Navigating...',
      message: `Taking you to ${route}`,
      suggestion: 'Redirecting now!'
    });
    
    // Close modal and navigate after a short delay
    setTimeout(() => {
      setIsOpen(false);
      
      // Try multiple navigation methods
      if (typeof window !== 'undefined') {
        // Method 1: Try using Next.js router if available
        if ((window as any).next && (window as any).next.router) {
          (window as any).next.router.push(route);
        }
        // Method 2: Try history API
        else if (window.history && window.history.pushState) {
          window.history.pushState({}, '', route);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        // Method 3: Fallback to location change
        else {
          window.location.href = route;
        }
      }
    }, 1500);
  };

  // Safe access helper function
  const safeGet = (obj: any, path: string, defaultValue: any = ''): any => {
    try {
      return path.split('.').reduce((current, key) => current?.[key], obj) || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const renderResponse = (): JSX.Element | null => {
    if (!response) return null;

    switch (response.type) {
      case 'features':
        return (
          <div className=" bg-brand-50 rounded-2xl p-6 border border-brand-100">
            <h3 className="text-xl font-bold text-ink-700 mb-3">{safeGet(response, 'title', '🚀 Our Features')}</h3>
            <p className="text-ink-500 mb-4">{safeGet(response, 'message', 'Here are our amazing AI-powered features:')}</p>
            
            {/* Show actual website features */}
            <div className="grid gap-3">
              {features.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => handleNavigation(feature.route)}>
                  <span className="text-xl">{feature.icon}</span>
                  <div className="flex-1">
                    <span className="font-medium text-ink-700">{feature.name}</span>
                    <p className="text-sm text-ink-500 mt-1">{feature.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-400" />
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-brand-100 rounded-xl">
              <p className="text-sm text-brand-600">{safeGet(response, 'suggestion', 'Click any feature to explore it, or say "tell me more about [feature name]"!')}</p>
            </div>
          </div>
        );

      case 'detailed_features':
        return (
          <div className=" bg-brand-50 rounded-2xl p-6 border border-brand-100">
            <h3 className="text-xl font-bold text-ink-700 mb-3">{safeGet(response, 'title', '✨ Feature Details')}</h3>
            <p className="text-ink-500 mb-4">{safeGet(response, 'message', 'Here are detailed descriptions of our features:')}</p>
            <div className="space-y-4">
              {features.slice(0, 4).map((feature, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-ink-700 mb-2 flex items-center">
                    <span className="mr-3 text-lg">{feature.icon}</span>
                    {feature.name}
                  </h4>
                  <p className="text-ink-500 text-sm leading-relaxed mb-3">{feature.description}</p>
                  <button
                    onClick={() => handleNavigation(feature.route)}
                    className="text-brand-600 hover:text-brand-600 text-sm font-medium flex items-center space-x-1"
                  >
                    <span>Try it now</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-brand-100 rounded-xl">
              <p className="text-sm text-brand-600">{safeGet(response, 'suggestion', 'Want to try a specific feature? Just say "go to [feature name]"!')}</p>
            </div>
          </div>
        );

      case 'navigation':
        const navContent = response.content as ResponseContent;
        return (
          <div className=" bg-brand-50 rounded-2xl p-6 border border-brand-100">
            <h3 className="text-xl font-bold text-ink-700 mb-3">{response.title}</h3>
            <p className="text-ink-500 mb-4">{response.message}</p>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h4 className="font-semibold text-ink-700 mb-2 flex items-center">
                <span className="mr-2 text-lg">{navContent?.icon || '🔗'}</span>
                {navContent?.name || 'Destination'}
              </h4>
              <p className="text-ink-500 text-sm mb-4">{navContent?.description || 'Feature description'}</p>
              <button
                onClick={() => handleNavigation(navContent?.route || '/')}
                className=" bg-brand text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-600 transition-all flex items-center space-x-2 w-full justify-center"
              >
                <span>Navigate Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 p-3 bg-brand-100 rounded-xl">
              <p className="text-sm text-brand-600">{response.suggestion}</p>
            </div>
          </div>
        );

      case 'help':
        const helpCommands = [
          { text: '🎯 Show all features', example: '"Show me features" or "What can you do?"' },
          { text: '📍 Navigate anywhere', example: '"Go to conversation" or "Take me to dashboard"' },
          { text: '📚 Learn about features', example: '"Tell me about voice to text"' },
          { text: '🔍 Get detailed info', example: '"Give me more details about features"' }
        ];

        return (
          <div className=" bg-brand-50 rounded-2xl p-6 border border-brand-100">
            <h3 className="text-xl font-bold text-ink-700 mb-3">🤖 Voice Commands Help</h3>
            <p className="text-ink-500 mb-4">I can understand natural speech! Here are some examples:</p>
            <div className="space-y-3">
              {helpCommands.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="font-medium text-ink-700 mb-1">{item.text}</div>
                  <div className="text-sm text-brand-600 bg-brand-50 px-3 py-1 rounded-lg inline-block">
                    {item.example}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-brand-100 rounded-xl">
              <p className="text-sm text-brand-600">💡 Speak naturally! I understand context and can help you navigate our website easily.</p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className=" bg-flame-50 rounded-2xl p-6 border border-flame-100">
            <h3 className="text-xl font-bold text-ink-700 mb-3">{response.title}</h3>
            <p className="text-ink-500 mb-4">{response.message}</p>
            <div className="bg-flame-100 p-3 rounded-xl">
              <p className="text-sm text-flame-700">{response.suggestion}</p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className=" bg-brand-50 rounded-2xl p-6 border border-brand-100 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-ink-700 mb-2">{response.title}</h3>
            <p className="text-ink-500">{response.message}</p>
          </div>
        );

      default:
        return (
          <div className=" bg-ink-50 rounded-2xl p-6 border border-ink-200">
            <h3 className="text-xl font-bold text-ink-700 mb-3">🤖 AI Voice Assistant</h3>
            <p className="text-ink-500 mb-4">I can help you explore our AI-powered features and navigate the website!</p>
            
            {/* Show quick feature preview */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {features.slice(0, 4).map((feature, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-sm text-center cursor-pointer hover:shadow-md transition-shadow"
                     onClick={() => handleNavigation(feature.route)}>
                  <div className="text-lg mb-1">{feature.icon}</div>
                  <div className="text-xs font-medium text-ink-700">{feature.name}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-ink-100 p-3 rounded-xl">
              <p className="text-sm text-ink-700">💬 Try saying: "Show me all features" or "Go to conversation"</p>
            </div>
          </div>
        );
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  return (
    <>
      {/* Floating Voice Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-brand hover:bg-brand-600 text-white rounded-full shadow-2xl hover:shadow-brand/30 transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-50 animate-pulse"
      >
        <Headphones className="w-8 h-8" />
      </button>

      {/* Voice Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-ink-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-ink-700">AI Voice Assistant</h2>
                    <p className="text-ink-500">Speak naturally - I understand context!</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 bg-ink-100 hover:bg-ink-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-ink-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Transcript Display */}
              {transcript && (
                <div className="mb-4 p-3 bg-ink-50 rounded-xl">
                  <p className="text-sm text-ink-500 mb-1">You said:</p>
                  <p className="text-ink-700 font-medium">"{transcript}"</p>
                </div>
              )}

              {/* Recording Status */}
              {recording && (
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 bg-flame-50 text-flame px-6 py-3 rounded-full animate-pulse">
                    <div className="w-3 h-3 bg-flame rounded-full animate-ping"></div>
                    <span className="font-semibold">Listening • {formatDuration(recordingDuration)}</span>
                  </div>
                </div>
              )}

              {/* Recording Button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={recording ? handleStopRecording : handleStartRecording}
                  disabled={loading}
                  className={`
                    relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform
                    ${recording 
                      ? ' bg-flame scale-110 shadow-xl shadow-flame/30' 
                      : ' bg-brand hover:scale-105 shadow-xl shadow-brand/30'
                    }
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}
                  `}
                >
                  {recording && (
                    <div className="absolute inset-0 rounded-full border-4 border-flame animate-ping"></div>
                  )}
                  
                  {loading ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : recording ? (
                    <Square className="w-8 h-8 text-white fill-current" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </button>
              </div>

              {/* Instructions */}
              <div className="text-center mb-6">
                <p className="text-ink-500 font-medium">
                  {recording ? 'I\'m listening... Speak naturally!' : 'Click to start speaking'}
                </p>
                <p className="text-sm text-ink-500 mt-2">
                  Try: "What features do you have?" • "Take me to the conversation tool" • "Help me navigate"
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-2 text-brand-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing your request...</span>
                  </div>
                </div>
              )}

              {/* Response */}
              {response && !loading && (
                <div className="mt-6">
                  {renderResponse()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;