
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

    // Try to get the Google Maps API key from Supabase secrets
    let apiKey = null
    try {
      const { data: secrets } = await supabaseClient.rpc('get_secret', {
        secret_name: 'GOOGLE_MAPS_API_KEY'
      })
      apiKey = secrets
    } catch (error) {
      console.log('No Google Maps API key configured, using mock data')
    }

    let response

    if (query) {
      if (apiKey) {
        // Try real geocoding first
        try {
          const geocodeResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`
          )
          
          if (geocodeResponse.ok) {
            const geocodeData = await geocodeResponse.json()
            
            if (geocodeData.status === 'OK') {
              response = {
                results: geocodeData.results.map((result: any) => ({
                  address: result.formatted_address,
                  location: result.geometry.location,
                  placeId: result.place_id
                }))
              }
            }
          }
        } catch (error) {
          console.log('Real geocoding failed, falling back to mock data')
        }
      }
      
      // Fallback to mock geocoding
      if (!response) {
        response = {
          results: [
            {
              address: `${query}, India`,
              location: { 
                lat: 18.5204 + (Math.random() - 0.5) * 0.1, 
                lng: 73.8567 + (Math.random() - 0.5) * 0.1 
              },
              placeId: `mock_place_${Date.now()}`
            }
          ]
        }
      }
    } else if (lat && lng) {
      if (apiKey) {
        // Try real places search first
        try {
          const placesResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=ration+shop+fair+price+pds&key=${apiKey}`
          )
          
          if (placesResponse.ok) {
            const placesData = await placesResponse.json()
            
            if (placesData.status === 'OK') {
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
          }
        } catch (error) {
          console.log('Real places search failed, falling back to mock data')
        }
      }
      
      // Fallback to mock nearby shops
      if (!response) {
        const mockShops = [
          {
            id: 'shop_001',
            name: 'Fair Price Shop - Ward 12',
            address: 'Main Market Road, Near Bus Stand',
            location: { 
              lat: lat + (Math.random() - 0.5) * 0.01, 
              lng: lng + (Math.random() - 0.5) * 0.01 
            },
            rating: 4.2,
            isOpen: true,
            distance: calculateDistance(lat, lng, lat + 0.005, lng + 0.005)
          },
          {
            id: 'shop_002',
            name: 'PDS Store - Village Center',
            address: 'Panchayat Road, Village Square',
            location: { 
              lat: lat + (Math.random() - 0.5) * 0.02, 
              lng: lng + (Math.random() - 0.5) * 0.02 
            },
            rating: 3.8,
            isOpen: false,
            distance: calculateDistance(lat, lng, lat + 0.008, lng + 0.008)
          },
          {
            id: 'shop_003',
            name: 'Ration Depot - East Block',
            address: 'School Road, East Side',
            location: { 
              lat: lat + (Math.random() - 0.5) * 0.015, 
              lng: lng + (Math.random() - 0.5) * 0.015 
            },
            rating: 4.5,
            isOpen: true,
            distance: calculateDistance(lat, lng, lat + 0.012, lng + 0.012)
          },
          {
            id: 'shop_004',
            name: 'Community PDS Center',
            address: 'Community Hall, Block A',
            location: { 
              lat: lat + (Math.random() - 0.5) * 0.025, 
              lng: lng + (Math.random() - 0.5) * 0.025 
            },
            rating: 4.0,
            isOpen: true,
            distance: calculateDistance(lat, lng, lat + 0.015, lng + 0.015)
          },
          {
            id: 'shop_005',
            name: 'Gram Panchayat Ration Shop',
            address: 'Panchayat Building, Central Area',
            location: { 
              lat: lat + (Math.random() - 0.5) * 0.03, 
              lng: lng + (Math.random() - 0.5) * 0.03 
            },
            rating: 3.5,
            isOpen: false,
            distance: calculateDistance(lat, lng, lat + 0.018, lng + 0.018)
          }
        ]
        
        response = { shops: mockShops }
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
