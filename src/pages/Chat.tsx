import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Send, ArrowLeft, Bot } from 'lucide-react';
import { chatWithCoach, BackendPredictionRequest } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'coach';
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [athleteData, setAthleteData] = useState<BackendPredictionRequest | null>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const conversationHistoryRef = useRef<string>('');

  useEffect(() => {
    const storedAthleteData = sessionStorage.getItem('athleteData');
    const storedPredictions = sessionStorage.getItem('predictions');

    if (!storedAthleteData || !storedPredictions) {
      toast.error('No athlete data found', {
        description: 'Please fill out the form first to get predictions',
      });
      navigate('/');
      return;
    }

    try {
      setAthleteData(JSON.parse(storedAthleteData));
      setPredictions(JSON.parse(storedPredictions));
      
      const welcomeMessage: Message = {
        id: 'welcome',
        sender: 'coach',
        content: 'Hello! 👋 I\'m your AI performance coach. I can help you with:\n\n• Performance analysis and readiness assessment\n• Personalized nutrition and diet plans\n• Training and recovery recommendations\n• Injury risk management\n\nWhat would you like to know?',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } catch (e) {
      setError('Failed to load athlete data');
    }
  }, [navigate]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !athleteData || !predictions || loading) return;

    const question = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    setError(null);

    try {
      const response = await chatWithCoach(
        athleteData,
        predictions,
        question,
        conversationHistoryRef.current
      );

      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, coachMessage]);
      conversationHistoryRef.current += `\nUser: ${question}\nCoach: ${response.response}\n`;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to get coach response';
      setError(errorMsg);
      toast.error('Chat error', {
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCoachResponse = (text: string) => {
    const lines = text.split('\n');
    let inSection = false;
    
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (trimmed === '') return <br key={index} />;
      
      if (trimmed.match(/^[A-Z\s&()]+:$/)) {
        inSection = true;
        return (
          <div key={index} className="font-bold text-blue-400 mt-4 mb-2 first:mt-0 text-base">
            {trimmed}
          </div>
        );
      }
      
      if (trimmed.startsWith('- ')) {
        return (
          <div key={index} className="ml-4 mb-1.5 text-sm text-gray-300">
            {trimmed}
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-1.5 text-sm text-gray-300">
          {trimmed}
        </div>
      );
    });
  };

  if (!athleteData || !predictions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300">Loading athlete data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Top Bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-400 ml-4">chat.para-athlete-monitor.ai</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
            Web View
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
            Responsive
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI COACH CHAT</h1>
              <p className="text-sm text-gray-400 mt-1">
                Get personalized coaching advice based on your performance predictions
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <Alert className="bg-red-500/20 border-red-500/30 mb-6">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Chat Area */}
        <Card className="w-full bg-slate-800 border-slate-700 shadow-lg">
          <CardHeader className="border-b border-slate-700 bg-slate-700/30">
            <CardTitle className="text-white">Coach Chat</CardTitle>
            <CardDescription className="text-gray-400">
              Ask questions about your performance, nutrition, training, or recovery
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 bg-slate-800">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'coach' && (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-blue-500/30">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                          : 'bg-slate-700 border border-slate-600 text-gray-100'
                      }`}
                    >
                      {message.sender === 'coach' ? (
                        <div className="text-sm leading-relaxed whitespace-pre-line">
                          {formatCoachResponse(message.content)}
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      )}
                      <p
                        className={`text-xs mt-2 ${
                          message.sender === 'user'
                            ? 'text-blue-100'
                            : 'text-gray-400'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-green-500/30">
                        <span className="text-white text-sm font-bold">You</span>
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md ring-2 ring-blue-500/30">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-slate-700 border border-slate-600 rounded-2xl px-4 py-3 shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-slate-700 p-4 bg-slate-700/30">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about your performance, nutrition, or training..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 focus:border-blue-500 rounded-xl"
                  disabled={loading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-6"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-1">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
