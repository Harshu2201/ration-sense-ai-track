
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Send, MessageCircle, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LanguageSelector } from "@/components/LanguageSelector";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: string;
}

export const RationChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const { toast } = useToast();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const addMessage = (text: string, isUser: boolean, language: string = selectedLanguage) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      language
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Send to Whisper for transcription
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: { audio: base64Audio, language: selectedLanguage }
      });

      if (error) throw error;

      const transcribedText = data.text;
      if (transcribedText) {
        addMessage(transcribedText, true);
        await processUserQuery(transcribedText);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Audio Processing Error",
        description: "Could not process voice input. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processUserQuery = async (query: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ration-chatbot', {
        body: { 
          query, 
          language: selectedLanguage,
          context: "ration_stock_inquiry"
        }
      });

      if (error) throw error;

      addMessage(data.response, false);
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: "Error",
        description: "Could not process your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addMessage(inputText, true);
    await processUserQuery(inputText);
    setInputText('');
  };

  const getGreeting = () => {
    switch (selectedLanguage) {
      case 'hindi':
        return 'नमस्ते! मैं आपका राशन सहायक हूँ। आप मुझसे स्टॉक के बारे में पूछ सकते हैं।';
      case 'tamil':
        return 'வணக்கம்! நான் உங்கள் ரேஷன் உதவியாளர். நீங்கள் என்னிடம் பொருட்கள் பற்றி கேட்கலாம்.';
      case 'bengali':
        return 'নমস্কার! আমি আপনার রেশন সহায়ক। আপনি আমাকে স্টক সম্পর্কে জিজ্ঞাসা করতে পারেন।';
      case 'telugu':
        return 'నమస్కారం! నేను మీ రేషన్ సహాయకుడను. మీరు నన్ను స్టాక్ గురించి అడగవచ్చు.';
      case 'marathi':
        return 'नमस्कार! मी तुमचा रेशन सहाय्यक आहे. तुम्ही मला साठ्याबद्दल विचारू शकता.';
      default:
        return 'Hello! I am your ration assistant. You can ask me about stock availability.';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Ration Stock Chatbot
          </CardTitle>
          <div className="w-48">
            <LanguageSelector 
              value={selectedLanguage} 
              onValueChange={setSelectedLanguage} 
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-96 border rounded-lg p-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">{getGreeting()}</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.isUser ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="text-left mb-4">
                <div className="inline-block bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm">Processing...</span>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                selectedLanguage === 'hindi' 
                  ? "अपना सवाल यहाँ लिखें..."
                  : selectedLanguage === 'tamil'
                  ? "உங்கள் கேள்வியை இங்கே எழுதுங்கள்..."
                  : "Type your question here..."
              }
              disabled={isProcessing}
            />
            <Button type="submit" disabled={isProcessing || !inputText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={isRecording ? "destructive" : "outline"}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </form>

          <div className="text-xs text-gray-500 text-center">
            {selectedLanguage === 'hindi' && 
              "उदाहरण: 'कितना चावल बचा है?' या 'चीनी उपलब्ध है क्या?'"
            }
            {selectedLanguage === 'tamil' && 
              "உதாரணம்: 'எவ்வளவு அரிசி உள்ளது?' அல்லது 'சர்க்கரை கிடைக்குமா?'"
            }
            {selectedLanguage === 'english' && 
              "Example: 'How much rice is available?' or 'Is sugar in stock?'"
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
