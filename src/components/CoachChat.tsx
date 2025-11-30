import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types';
import { mockMessages } from '@/data/mockData';
import { Send } from 'lucide-react';

export default function CoachChat() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Create new message
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'coach',
      content: inputValue,
      timestamp: new Date()
    };

    // TODO: Replace with actual API call to send message
    console.log('Sending message:', newMessage);

    // Add message to state
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate athlete response after 2 seconds
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'athlete',
        content: 'Thanks for the message! I\'ll keep that in mind.',
        timestamp: new Date()
      };
      
      // TODO: Replace with actual API call to receive message
      console.log('Received message:', responseMessage);
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
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

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="border-b border-gray-200">
        <CardTitle>Coach Chat</CardTitle>
        <CardDescription>
          Communicate with your athletes in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'coach' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'athlete' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs">
                      AT
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.sender === 'coach'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'coach'
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.sender === 'coach' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                      CM
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
}