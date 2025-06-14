
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const StockAlertCreator = () => {
  const [formData, setFormData] = useState({
    shop_id: '',
    shop_name: '',
    commodity_name: '',
    arrival_date: '',
    quantity_kg: '',
    message: ''
  });
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const createAlert = async () => {
    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('stock_alerts')
        .insert([{
          shop_id: formData.shop_id,
          shop_name: formData.shop_name,
          commodity_name: formData.commodity_name,
          arrival_date: formData.arrival_date,
          quantity_kg: formData.quantity_kg ? parseInt(formData.quantity_kg) : null,
          message: formData.message || null
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock alert created successfully",
      });

      // Reset form
      setFormData({
        shop_id: '',
        shop_name: '',
        commodity_name: '',
        arrival_date: '',
        quantity_kg: '',
        message: ''
      });

      return data;
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: "Failed to create stock alert",
        variant: "destructive",
      });
      return null;
    } finally {
      setCreating(false);
    }
  };

  const sendNotifications = async (alertId: string) => {
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-stock-notifications', {
        body: { alertId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notifications sent to matching users",
      });
    } catch (error) {
      console.error('Error sending notifications:', error);
      toast({
        title: "Error",
        description: "Failed to send notifications",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const createAndSend = async () => {
    const alert = await createAlert();
    if (alert) {
      await sendNotifications(alert.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Create Stock Alert
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shop_id">Shop ID</Label>
            <Input
              id="shop_id"
              placeholder="shop1"
              value={formData.shop_id}
              onChange={(e) => setFormData(prev => ({ ...prev, shop_id: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="shop_name">Shop Name</Label>
            <Input
              id="shop_name"
              placeholder="Fair Price Shop - Ward 12"
              value={formData.shop_name}
              onChange={(e) => setFormData(prev => ({ ...prev, shop_name: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="commodity">Commodity</Label>
            <Select 
              value={formData.commodity_name} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, commodity_name: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select commodity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rice">Rice</SelectItem>
                <SelectItem value="Wheat">Wheat</SelectItem>
                <SelectItem value="Sugar">Sugar</SelectItem>
                <SelectItem value="Kerosene">Kerosene</SelectItem>
                <SelectItem value="Cooking Oil">Cooking Oil</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="arrival_date">Arrival Date</Label>
            <Input
              id="arrival_date"
              type="date"
              value={formData.arrival_date}
              onChange={(e) => setFormData(prev => ({ ...prev, arrival_date: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="quantity">Quantity (kg)</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="1000"
            value={formData.quantity_kg}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity_kg: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="message">Custom Message (Optional)</Label>
          <Textarea
            id="message"
            placeholder="Additional information about the stock arrival..."
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={createAlert} 
            disabled={creating || !formData.shop_name || !formData.commodity_name || !formData.arrival_date}
            variant="outline"
          >
            {creating ? 'Creating...' : 'Create Alert Only'}
          </Button>
          <Button 
            onClick={createAndSend} 
            disabled={creating || sending || !formData.shop_name || !formData.commodity_name || !formData.arrival_date}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {creating || sending ? 'Processing...' : 'Create & Send Notifications'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
