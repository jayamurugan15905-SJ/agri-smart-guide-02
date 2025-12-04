import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const quickResponses: Record<string, string> = {
  'turn on pump': 'User Pump Command: TURN ON - Activating irrigation pump now.',
  'turn off pump': 'User Pump Command: TURN OFF - Deactivating irrigation pump.',
  'pump on': 'User Pump Command: TURN ON - Starting irrigation.',
  'pump off': 'User Pump Command: TURN OFF - Stopping irrigation.',
  'when to water': 'Based on current soil moisture levels and crop type, I recommend watering in the early morning (6-8 AM) or late evening (6-8 PM) to minimize evaporation. Check the moisture sensor readings - if below the threshold, irrigate immediately.',
  'help': 'I can help you with:\n• Pump control ("turn on pump", "turn off pump")\n• Watering advice ("when to water")\n• Crop care tips\n• Understanding sensor readings\n• Pest and disease identification\n\nJust type your question!',
  'crop tips': 'Here are some general tips:\n1. Monitor soil moisture daily\n2. Water during cooler parts of the day\n3. Check for pests weekly\n4. Rotate crops seasonally\n5. Use mulching to retain moisture\n6. Adjust irrigation based on weather forecasts',
};

export const FarmerAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Smart Agriculture Assistant. Ask me about irrigation, crop care, or say "turn on pump" to control the system. Type "help" to see what I can do!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerInput = input.toLowerCase().trim();
    let response = '';

    // Check for matching quick responses
    for (const [key, value] of Object.entries(quickResponses)) {
      if (lowerInput.includes(key)) {
        response = value;
        break;
      }
    }

    // Default response if no match
    if (!response) {
      response = `I understand you're asking about "${input}". Based on your current sensor data and crop conditions, I recommend monitoring the situation closely. For specific guidance, try asking about:\n• Watering schedules\n• Crop health tips\n• Pest management\n• Weather preparation`;
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="rounded-xl border-2 border-border bg-card overflow-hidden shadow-card flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-5 border-b border-border bg-gradient-earth">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-foreground/20">
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-primary-foreground">
              Farmer Assistant
            </h3>
            <p className="text-sm text-primary-foreground/80">
              Ask questions or control the system
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === 'user' && "flex-row-reverse"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              message.role === 'assistant' 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            )}>
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className={cn(
              "max-w-[80%] rounded-xl p-3 text-sm",
              message.role === 'assistant' 
                ? "bg-muted text-foreground" 
                : "bg-primary text-primary-foreground"
            )}>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-muted rounded-xl p-3">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-muted/30">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or give a command..."
            className="flex-1 bg-background"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
