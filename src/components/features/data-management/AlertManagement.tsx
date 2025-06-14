
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, MessageSquare, Settings, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AlertPreferences {
  id?: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  phone_number: string;
  preferred_shops: string[];
  preferred_commodities: string[];
}

export const AlertManagement = () => {
  const [preferences, setPreferences] = useState<AlertPreferences>({
    email_notifications: true,
    sms_notifications: false,
    phone_number: '',
    preferred_shops: [],
    preferred_commodities: []
  });
  const [newShop, setNewShop] = useState('');
  const [newCommodity, setNewCommodity] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_alert_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences({
          id: data.id,
          email_notifications: data.email_notifications || false,
          sms_notifications: data.sms_notifications || false,
          phone_number: data.phone_number || '',
          preferred_shops: data.preferred_shops || [],
          preferred_commodities: data.preferred_commodities || []
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load alert preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      const upsertData = {
        user_id: user.id,
        email_notifications: preferences.email_notifications,
        sms_notifications: preferences.sms_notifications,
        phone_number: preferences.phone_number,
        preferred_shops: preferences.preferred_shops,
        preferred_commodities: preferences.preferred_commodities
      };

      const { error } = await supabase
        .from('user_alert_preferences')
        .upsert(upsertData, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Alert preferences saved successfully",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save alert preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addShop = () => {
    if (newShop.trim() && !preferences.preferred_shops.includes(newShop.trim())) {
      setPreferences(prev => ({
        ...prev,
        preferred_shops: [...prev.preferred_shops, newShop.trim()]
      }));
      setNewShop('');
    }
  };

  const removeShop = (shop: string) => {
    setPreferences(prev => ({
      ...prev,
      preferred_shops: prev.preferred_shops.filter(s => s !== shop)
    }));
  };

  const addCommodity = () => {
    if (newCommodity.trim() && !preferences.preferred_commodities.includes(newCommodity.trim())) {
      setPreferences(prev => ({
        ...prev,
        preferred_commodities: [...prev.preferred_commodities, newCommodity.trim()]
      }));
      setNewCommodity('');
    }
  };

  const removeCommodity = (commodity: string) => {
    setPreferences(prev => ({
      ...prev,
      preferred_commodities: prev.preferred_commodities.filter(c => c !== commodity)
    }));
  };

  if (loading) {
    return <div className="p-6">Loading alert preferences...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Stock Alert Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Methods */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Notification Methods
            </h4>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="email"
                checked={preferences.email_notifications}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, email_notifications: checked as boolean }))
                }
              />
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sms"
                checked={preferences.sms_notifications}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, sms_notifications: checked as boolean }))
                }
              />
              <Label htmlFor="sms" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS Notifications
              </Label>
            </div>

            {preferences.sms_notifications && (
              <div className="ml-6">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={preferences.phone_number}
                  onChange={(e) => 
                    setPreferences(prev => ({ ...prev, phone_number: e.target.value }))
                  }
                />
              </div>
            )}
          </div>

          {/* Preferred Shops */}
          <div className="space-y-4">
            <h4 className="font-semibold">Preferred Shops</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Add shop name"
                value={newShop}
                onChange={(e) => setNewShop(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addShop()}
              />
              <Button onClick={addShop} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.preferred_shops.map((shop, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {shop}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeShop(shop)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Preferred Commodities */}
          <div className="space-y-4">
            <h4 className="font-semibold">Preferred Commodities</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Add commodity (e.g., Rice, Wheat)"
                value={newCommodity}
                onChange={(e) => setNewCommodity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCommodity()}
              />
              <Button onClick={addCommodity} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.preferred_commodities.map((commodity, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {commodity}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeCommodity(commodity)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={savePreferences} disabled={saving}>
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
