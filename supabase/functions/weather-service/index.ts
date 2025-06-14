
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lat, lon } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the OpenWeather API key from Supabase secrets
    const { data: secrets } = await supabaseClient.rpc('get_secret', {
      secret_name: 'OPENWEATHER_API_KEY'
    })
    
    const apiKey = secrets

    if (!apiKey) {
      throw new Error('OpenWeather API key not found')
    }

    // Fetch current weather and forecast
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
    
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )

    if (!weatherResponse.ok || !forecastResponse.ok) {
      throw new Error('Weather API request failed')
    }

    const weatherData = await weatherResponse.json()
    const forecastData = await forecastResponse.json()

    // Analyze weather conditions for supply delays
    const analyzeSupplyRisk = (weather: any, forecast: any) => {
      const currentConditions = weather.weather[0].main.toLowerCase()
      const windSpeed = weather.wind?.speed || 0
      const temperature = weather.main.temp
      
      let riskLevel = 'low'
      let delayPrediction = '0-1 days'
      let factors = []

      // Check for severe weather conditions
      if (currentConditions.includes('rain') || currentConditions.includes('storm')) {
        riskLevel = 'medium'
        delayPrediction = '1-2 days'
        factors.push('Heavy rainfall may affect transportation')
      }

      if (windSpeed > 10) {
        riskLevel = 'medium'
        factors.push('High wind speeds may delay deliveries')
      }

      if (temperature > 40 || temperature < 5) {
        riskLevel = 'medium'
        factors.push('Extreme temperatures may affect supply chain')
      }

      // Check forecast for next 3 days for severe weather
      const severeWeatherAhead = forecast.list.slice(0, 8).some((item: any) => 
        item.weather[0].main.toLowerCase().includes('storm') ||
        item.weather[0].main.toLowerCase().includes('snow') ||
        item.wind.speed > 15
      )

      if (severeWeatherAhead) {
        riskLevel = 'high'
        delayPrediction = '2-5 days'
        factors.push('Severe weather expected in coming days')
      }

      return { riskLevel, delayPrediction, factors }
    }

    const supplyAnalysis = analyzeSupplyRisk(weatherData, forecastData)

    const response = {
      current: {
        temperature: Math.round(weatherData.main.temp),
        condition: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind?.speed || 0
      },
      supplyRisk: supplyAnalysis,
      location: `${weatherData.name}, ${weatherData.sys.country}`
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Weather service error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
