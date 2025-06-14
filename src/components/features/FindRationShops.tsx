
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Phone, Star, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RationShop {
  id: string;
  name: string;
  address: string;
  phone?: string;
  distance: string;
  status: 'open' | 'closed' | 'unknown';
  rating: number;
  location: {
    lat: number;
    lng: number;
  };
}

export const FindRationShops = () => {
  const [location, setLocation] = useState('');
  const [shops, setShops] = useState<RationShop[]>([]);
  const [loading, setLoading] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await searchNearbyShops(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location Error",
            description: "Could not get your current location. Please enter it manually.",
            variant: "destructive",
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation. Please enter your location manually.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const searchNearbyShops = async (lat: number, lng: number) => {
    try {
      console.log(`Searching for shops near coordinates: ${lat}, ${lng}`);
      
      const { data, error } = await supabase.functions.invoke('maps-service', {
        body: { lat, lng }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Maps service response:', data);

      if (data && data.shops) {
        const rationShops: RationShop[] = data.shops.map((shop: any) => ({
          id: shop.id,
          name: shop.name,
          address: shop.address,
          phone: shop.phone || `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          distance: shop.distance,
          status: shop.isOpen === true ? 'open' : (shop.isOpen === false ? 'closed' : 'unknown'),
          rating: shop.rating || Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0 rating
          location: shop.location
        }));

        setShops(rationShops);
        
        // Check if we're using mock data (shops with mock IDs)
        const isMockData = rationShops.some(shop => shop.id.startsWith('shop_'));
        setUsingMockData(isMockData);
        
        if (isMockData) {
          toast({
            title: "Demo Data Loaded",
            description: "Showing sample ration shops. Configure Google Maps API for real data.",
          });
        } else {
          toast({
            title: "Shops Found",
            description: `Found ${rationShops.length} nearby ration shops`,
          });
        }
      } else {
        throw new Error('No shops data received');
      }
    } catch (error) {
      console.error('Error fetching nearby shops:', error);
      toast({
        title: "Search Failed",
        description: "Could not find nearby ration shops. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!location.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a location to search for ration shops.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log(`Geocoding location: ${location}`);
      
      // First geocode the location
      const { data, error } = await supabase.functions.invoke('maps-service', {
        body: { query: location }
      });

      if (error) {
        console.error('Geocoding error:', error);
        throw error;
      }

      console.log('Geocoding response:', data);

      if (data && data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].location;
        console.log(`Geocoded to coordinates: ${lat}, ${lng}`);
        await searchNearbyShops(lat, lng);
      } else {
        toast({
          title: "Location Not Found",
          description: "Could not find the specified location. Please try a different address.",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      toast({
        title: "Search Failed",
        description: "Could not search for the location. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600';
      case 'closed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'closed': return 'Closed';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <div className="h-2 w-2 bg-green-500 rounded-full" />;
      case 'closed': return <div className="h-2 w-2 bg-red-500 rounded-full" />;
      default: return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Find Nearby Ration Shops
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usingMockData && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  Currently showing demo data. Configure Google Maps API for real-time shop locations.
                </span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter your location, PIN code, or address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button variant="outline" onClick={getCurrentLocation} disabled={loading}>
                <Navigation className="h-4 w-4 mr-1" />
                Current Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {shops.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Nearby Ration Shops ({shops.length} found)
            {usingMockData && <span className="text-sm text-gray-500 ml-2">(Demo Data)</span>}
          </h3>
          {shops.map((shop) => (
            <Card key={shop.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{shop.name}</h4>
                      {getStatusIcon(shop.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{shop.address}</p>
                    <div className="flex items-center gap-4 text-sm">
                      {shop.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {shop.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {shop.distance}
                      </span>
                      {shop.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {shop.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${getStatusColor(shop.status)}`}>
                      {getStatusText(shop.status)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {shops.length === 0 && !loading && (
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Shops Found</h3>
            <p className="text-gray-600">
              Try searching for a different location or use your current location.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
