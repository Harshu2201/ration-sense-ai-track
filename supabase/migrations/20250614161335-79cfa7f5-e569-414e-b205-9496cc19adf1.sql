
-- Create table for user alert preferences
CREATE TABLE public.user_alert_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  phone_number TEXT,
  preferred_shops TEXT[] DEFAULT '{}',
  preferred_commodities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for stock alerts
CREATE TABLE public.stock_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  commodity_name TEXT NOT NULL,
  arrival_date DATE NOT NULL,
  quantity_kg INTEGER,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Create table to track sent notifications (prevent duplicates)
CREATE TABLE public.sent_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  alert_id UUID REFERENCES public.stock_alerts NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'sms')),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, alert_id, notification_type)
);

-- Add Row Level Security
ALTER TABLE public.user_alert_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sent_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_alert_preferences
CREATE POLICY "Users can view their own alert preferences" 
  ON public.user_alert_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alert preferences" 
  ON public.user_alert_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alert preferences" 
  ON public.user_alert_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for stock_alerts (readable by all authenticated users)
CREATE POLICY "Authenticated users can view stock alerts" 
  ON public.stock_alerts 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage stock alerts" 
  ON public.stock_alerts 
  FOR ALL 
  TO service_role
  USING (true);

-- RLS policies for sent_notifications
CREATE POLICY "Users can view their own notification history" 
  ON public.sent_notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage notifications" 
  ON public.sent_notifications 
  FOR ALL 
  TO service_role
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_alert_preferences
CREATE TRIGGER on_user_alert_preferences_updated
  BEFORE UPDATE ON public.user_alert_preferences
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
