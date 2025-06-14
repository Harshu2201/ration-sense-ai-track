
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatbotRequest {
  query: string;
  language: string;
  context?: string;
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
    const { query, language, context }: ChatbotRequest = await req.json();
    
    console.log('Processing chatbot query:', query, 'Language:', language);

    // Get current stock data (mock data for now, could be from database)
    const stockData = await getCurrentStockData();
    
    // Create system prompt based on language
    const systemPrompt = getSystemPrompt(language, stockData);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    console.log('Bot response:', botResponse);

    return new Response(
      JSON.stringify({ response: botResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in ration-chatbot function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};

async function getCurrentStockData() {
  // Mock stock data - in production, this would come from your database
  return {
    rice: { available: 850, total: 1000, unit: 'kg', status: 'good' },
    wheat: { available: 150, total: 800, unit: 'kg', status: 'low' },
    sugar: { available: 45, total: 200, unit: 'kg', status: 'critical' },
    kerosene: { available: 0, total: 500, unit: 'liters', status: 'out' },
    dal: { available: 120, total: 300, unit: 'kg', status: 'good' },
    oil: { available: 80, total: 150, unit: 'liters', status: 'good' }
  };
}

function getSystemPrompt(language: string, stockData: any): string {
  const stockInfo = Object.entries(stockData)
    .map(([item, data]: [string, any]) => `${item}: ${data.available}${data.unit} available (${data.status})`)
    .join(', ');

  switch (language) {
    case 'hindi':
      return `आप एक सहायक राशन दुकान असिस्टेंट हैं। आपको राशन की उपलब्धता के बारे में जानकारी देनी है। 

वर्तमान स्टॉक: ${stockInfo}

उत्तर हमेशा हिंदी में दें। संक्षिप्त और उपयोगी जानकारी दें। यदि कोई चीज़ उपलब्ध नहीं है तो वैकल्पिक सुझाव दें।`;

    case 'tamil':
      return `நீங்கள் ஒரு உதவிகரமான ரேஷன் கடை உதவியாளர். ரேஷன் பொருட்களின் கிடைக்கும் தன்மை பற்றி தகவல் கொடுக்க வேண்டும்.

தற்போதைய இருப்பு: ${stockInfo}

எப்போதும் தமிழில் பதில் கொடுங்கள். சுருக்கமான மற்றும் பயனுள்ள தகவல் கொடுங்கள். ஏதேனும் பொருள் கிடைக்கவில்லை என்றால் மாற்று ஆலோசனைகள் கொடுங்கள்.`;

    case 'bengali':
      return `আপনি একজন সহায়ক রেশন দোকানের সহায়ক। রেশনের প্রাপ্যতা সম্পর্কে তথ্য দিতে হবে।

বর্তমান স্টক: ${stockInfo}

সর্বদা বাংলায় উত্তর দিন। সংক্ষিপ্ত এবং উপযোগী তথ্য দিন। কোন জিনিস না থাকলে বিকল্প পরামর্শ দিন।`;

    case 'telugu':
      return `మీరు సహాయక రేషన్ దుకాణం అసిస్టెంట్. రేషన్ లభ్యత గురించి సమాచారం ఇవ్వాలి.

ప్రస్తుత స్టాక్: ${stockInfo}

ఎల్లప్పుడూ తెలుగులో జవాబు ఇవ్వండి. క్లుప్తంగా మరియు ఉపయోగకరమైన సమాచారం ఇవ్వండి. ఏదైనా వస్తువు లేకపోతే ప్రత్యామ్నాయ సూచనలు ఇవ్వండి।`;

    case 'marathi':
      return `तुम्ही एक सहाय्यक रेशन दुकान असिस्टंट आहात. रेशनच्या उपलब्धतेबद्दल माहिती द्यावी.

सध्याचा साठा: ${stockInfo}

नेहमी मराठीत उत्तर द्या. संक्षिप्त आणि उपयुक्त माहिती द्या. काही वस्तू उपलब्ध नसल्यास पर्यायी सूचना द्या.`;

    default:
      return `You are a helpful ration shop assistant. You need to provide information about ration availability.

Current stock: ${stockInfo}

Always respond in English. Provide brief and useful information. If any item is not available, suggest alternatives.`;
  }
}

serve(handler);
