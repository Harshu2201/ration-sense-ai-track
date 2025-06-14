
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
    const { query, lat, lng } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the Google Maps API key from Supabase secrets
    const { data: secrets } = await supabaseClient.rpc('get_secret', {
      secret_name: 'GOOGLE_MAPS_API_KEY'
    })
    
    const apiKey = secrets

    if (!apiKey) {
      throw new Error('Google Maps API key not found')
    }

    let response

    if (query) {
      // Geocoding - convert address to coordinates
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`
      )
      
      if (!geocodeResponse.ok) {
        throw new Error('Geocoding API request failed')
      }
      
      const geocodeData = await geocodeResponse.json()
      
      if (geocodeData.status !== 'OK') {
        throw new Error(`Geocoding failed: ${geocodeData.status}`)
      }

      response = {
        results: geocodeData.results.map((result: any) => ({
          address: result.formatted_address,
          location: result.geometry.location,
          placeId: result.place_id
        }))
      }
    } else if (lat && lng) {
      // Places search - find nearby ration shops
      const placesResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=ration+shop+fair+price+pds&key=${apiKey}`
      )
      
      if (!placesResponse.ok) {
        throw new Error('Places API request failed')
      }
      
      const placesData = await placesResponse.json()

      response = {
        shops: placesData.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          location: place.geometry.location,
          rating: place.rating || 0,
          isOpen: place.opening_hours?.open_now,
          distance: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng)
        }))
      }
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
    console.error('Maps service error:', error)
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

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371 // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  
  return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`
}
