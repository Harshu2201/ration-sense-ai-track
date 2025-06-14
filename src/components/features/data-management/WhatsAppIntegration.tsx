
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppMessage {
  id: string;
  phone: string;
  message: string;
  timestamp: Date;
  type: 'stock_report' | 'complaint' | 'query';
  processed: boolean;
}

export const WhatsAppIntegration = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [recentMessages, setRecentMessages] = useState<WhatsAppMessage[]>([
    {
      id: '1',
      phone: '+91-9876543210',
      message: 'Rice stock: 500kg, Wheat: 200kg, Sugar: 50kg - Rajaji Nagar Shop, Chennai',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'stock_report',
      processed: true
    },
    {
      id: '2',
      phone: '+91-9876543211',
      message: 'Shop closed during working hours - Block 15 Shop, Lucknow',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: 'complaint',
      processed: false
    },
    {
      id: '3',
      phone: '+91-9876543212',
      message: 'What is the current stock at my nearest ration shop?',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      type: 'query',
      processed: true
    }
  ]);
  const { toast } = useToast();

  const handleWebhookSetup = async () => {
    if (!webhookUrl) {
      toast({
        title: "Webhook URL Required",
        description: "Please enter a valid webhook URL",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate webhook configuration
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsConfigured(true);
      
      toast({
        title: "WhatsApp Webhook Configured",
        description: "Successfully connected to WhatsApp Business API",
      });
    } catch (error) {
      toast({
        title: "Configuration Failed",
        description: "Could not configure WhatsApp webhook",
        variant: "destructive"
      });
    }
  };

  const sendTestMessage = async () => {
    if (!testPhone || !testMessage) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and test message",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate sending message via WhatsApp API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Test Message Sent",
        description: `Message sent to ${testPhone}`,
      });
      
      setTestMessage('');
      setTestPhone('');
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Could not send test message",
        variant: "destructive"
      });
    }
  };

  const processMessage = async (messageId: string) => {
    setRecentMessages(messages => 
      messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, processed: true }
          : msg
      )
    );

    toast({
      title: "Message Processed",
      description: "Data extracted and added to system",
    });
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'stock_report':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'complaint':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'query':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            WhatsApp Business Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Crowdsourced Data Collection</h4>
            <p className="text-sm text-blue-700">
              Enable citizens to report stock levels, complaints, and queries via WhatsApp. 
              This helps maintain real-time data when official APIs are unavailable.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">WhatsApp Business API Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-domain.com/whatsapp-webhook"
                  className="flex-1"
                />
                <Button 
                  onClick={handleWebhookSetup}
                  disabled={isConfigured}
                >
                  {isConfigured ? 'Connected' : 'Configure'}
                </Button>
              </div>
            </div>

            {isConfigured && (
              <div className="p-3 bg-green-50 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700">WhatsApp integration is active</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isConfigured && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Send Test Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="test-phone">Phone Number</Label>
                  <Input
                    id="test-phone"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+91-9876543210"
                  />
                </div>
                <div>
                  <Label htmlFor="test-message">Message</Label>
                  <Input
                    id="test-message"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Test message"
                  />
                </div>
              </div>
              <Button onClick={sendTestMessage} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Test Message
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent WhatsApp Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3 flex-1">
                      {getMessageTypeIcon(message.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{message.phone}</span>
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{message.message}</p>
                        <span className="text-xs text-blue-600 capitalize">{message.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                    {!message.processed && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => processMessage(message.id)}
                      >
                        Process
                      </Button>
                    )}
                    {message.processed && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Processed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-800">Setup Instructions</h4>
              <div className="text-sm text-orange-700 mt-1 space-y-1">
                <p>1. Set up WhatsApp Business API account</p>
                <p>2. Configure webhook URL to receive messages</p>
                <p>3. Train users to send structured messages: "Stock: Rice 500kg, Wheat 200kg - Shop Name, Location"</p>
                <p>4. Use natural language processing to extract data from messages</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
