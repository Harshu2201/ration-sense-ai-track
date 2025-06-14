
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  alertId: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { alertId }: NotificationRequest = await req.json();
    console.log('Processing notifications for alert:', alertId);

    // Get the alert details
    const { data: alert, error: alertError } = await supabase
      .from('stock_alerts')
      .select('*')
      .eq('id', alertId)
      .single();

    if (alertError || !alert) {
      throw new Error('Alert not found');
    }

    // Get users with matching preferences
    const { data: users, error: usersError } = await supabase
      .from('user_alert_preferences')
      .select(`
        *,
        profiles!inner(email)
      `)
      .or(`preferred_shops.cs.{${alert.shop_id}},preferred_commodities.cs.{${alert.commodity_name}}`);

    if (usersError) {
      throw new Error('Failed to fetch users');
    }

    console.log(`Found ${users?.length || 0} users with matching preferences`);

    let emailsSent = 0;
    let smsCount = 0;

    for (const userPref of users || []) {
      const userEmail = userPref.profiles?.email;
      
      // Check if we already sent notifications to this user for this alert
      const { data: existingNotifications } = await supabase
        .from('sent_notifications')
        .select('notification_type')
        .eq('user_id', userPref.user_id)
        .eq('alert_id', alertId);

      const sentTypes = existingNotifications?.map(n => n.notification_type) || [];

      // Send email notification
      if (userPref.email_notifications && userEmail && !sentTypes.includes('email')) {
        try {
          const emailContent = generateEmailContent(alert);
          console.log(`Sending email to ${userEmail}`);
          
          // In a real implementation, you would integrate with an email service like Resend
          // For now, we'll just log the email content
          console.log('Email content:', emailContent);
          
          // Mark as sent
          await supabase
            .from('sent_notifications')
            .insert({
              user_id: userPref.user_id,
              alert_id: alertId,
              notification_type: 'email'
            });
          
          emailsSent++;
        } catch (error) {
          console.error(`Failed to send email to ${userEmail}:`, error);
        }
      }

      // Send SMS notification
      if (userPref.sms_notifications && userPref.phone_number && !sentTypes.includes('sms')) {
        try {
          const smsContent = generateSMSContent(alert);
          console.log(`Sending SMS to ${userPref.phone_number}`);
          
          // In a real implementation, you would integrate with an SMS service
          // For now, we'll just log the SMS content
          console.log('SMS content:', smsContent);
          
          // Mark as sent
          await supabase
            .from('sent_notifications')
            .insert({
              user_id: userPref.user_id,
              alert_id: alertId,
              notification_type: 'sms'
            });
          
          smsCount++;
        } catch (error) {
          console.error(`Failed to send SMS to ${userPref.phone_number}:`, error);
        }
      }
    }

    // Update alert as sent
    await supabase
      .from('stock_alerts')
      .update({ sent_at: new Date().toISOString() })
      .eq('id', alertId);

    console.log(`Notifications sent: ${emailsSent} emails, ${smsCount} SMS`);

    return new Response(
      JSON.stringify({
        success: true,
        emailsSent,
        smsCount,
        message: `Sent ${emailsSent} emails and ${smsCount} SMS notifications`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-stock-notifications function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};

function generateEmailContent(alert: any): string {
  const arrivalDate = new Date(alert.arrival_date).toLocaleDateString('en-IN');
  return `
    <h2>🌾 Stock Alert - ${alert.commodity_name} Available!</h2>
    <p><strong>Shop:</strong> ${alert.shop_name}</p>
    <p><strong>Commodity:</strong> ${alert.commodity_name}</p>
    <p><strong>Arrival Date:</strong> ${arrivalDate}</p>
    ${alert.quantity_kg ? `<p><strong>Quantity:</strong> ${alert.quantity_kg} kg</p>` : ''}
    ${alert.message ? `<p><strong>Additional Info:</strong> ${alert.message}</p>` : ''}
    <p>Visit the shop early to ensure availability!</p>
    <p>Best regards,<br>RationTrack Team</p>
  `;
}

function generateSMSContent(alert: any): string {
  const arrivalDate = new Date(alert.arrival_date).toLocaleDateString('en-IN');
  return `🌾 ${alert.commodity_name} available at ${alert.shop_name} on ${arrivalDate}. ${alert.quantity_kg ? `Qty: ${alert.quantity_kg}kg. ` : ''}Visit early! - RationTrack`;
}

serve(handler);
