
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Phone, Star, AlertCircle, Clock, Building2 } from "lucide-react";
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
  const [searchCoordinates, setSearchCoordinates] = useState<{lat: number, lng: number} | null>(null);
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
            title: "Location Access Required",
            description: "Please enable location access or enter your location manually to find nearby ration shops.",
            variant: "destructive",
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services. Please enter your location manually.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const searchNearbyShops = async (lat: number, lng: number) => {
    try {
      console.log(`Searching for shops near coordinates: ${lat}, ${lng}`);
      setSearchCoordinates({ lat, lng });
      
      // Use mock data for demo purposes - in production this would call the maps service
      const mockShops: RationShop[] = [
        {
          id: 'shop_001',
          name: 'Government Fair Price Shop - Block A',
          address: 'Shop No. 12, Sector 15, Near Government Hospital',
          phone: '+91 9876543210',
          distance: '0.5 km',
          status: 'open',
          rating: 4.2,
          location: { lat: lat + 0.01, lng: lng + 0.01 }
        },
        {
          id: 'shop_002',
          name: 'PDS Center - Ward 7',
          address: 'Municipal Building, Main Road, Ward 7',
          phone: '+91 9876543211',
          distance: '1.2 km',
          status: 'open',
          rating: 4.0,
          location: { lat: lat - 0.01, lng: lng + 0.02 }
        },
        {
          id: 'shop_003',
          name: 'Ration Distribution Center',
          address: 'Block C, Housing Colony, Near School',
          phone: '+91 9876543212',
          distance: '2.1 km',
          status: 'closed',
          rating: 3.8,
          location: { lat: lat + 0.02, lng: lng - 0.01 }
        }
      ];

      setShops(mockShops);
      setUsingMockData(true);
      
      toast({
        title: "Shops Located Successfully",
        description: `Found ${mockShops.length} government ration shops in your area.`,
      });
    } catch (error) {
      console.error('Error fetching nearby shops:', error);
      toast({
        title: "Search Failed",
        description: "Unable to locate ration shops. Please try again or contact support.",
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
        description: "Please enter your location (area, PIN code, or address) to find nearby ration shops.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // For demo purposes, use a default coordinate and search
    // In production, this would geocode the location first
    const defaultLat = 28.6139; // Delhi coordinates
    const defaultLng = 77.2090;
    
    await searchNearbyShops(defaultLat, defaultLng);
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
      case 'open': return 'Open Now';
      case 'closed': return 'Closed';
      default: return 'Status Unknown';
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
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-green-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Building2 className="h-5 w-5 text-orange-600" />
            Government Ration Shop Locator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Find authorized Fair Price Shops and PDS centers in your area
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          {usingMockData && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  Demo Mode: Showing sample government ration shops for demonstration purposes.
                </span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Enter PIN code, area name, or full address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading ? 'Searching...' : 'Find Shops'}
              </Button>
              <Button 
                variant="outline" 
                onClick={getCurrentLocation} 
                disabled={loading}
                className="border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Use Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {shops.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Authorized Ration Shops ({shops.length} found)
            </h3>
            {usingMockData && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Demo Data
              </span>
            )}
          </div>
          
          {shops.map((shop) => (
            <Card key={shop.id} className="hover:shadow-lg transition-shadow border-l-2 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-orange-600" />
                      <h4 className="font-semibold text-gray-800">{shop.name}</h4>
                      {getStatusIcon(shop.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{shop.address}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {shop.phone && (
                        <span className="flex items-center gap-1 text-gray-700">
                          <Phone className="h-3 w-3" />
                          {shop.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-gray-700">
                        <Navigation className="h-3 w-3" />
                        {shop.distance} away
                      </span>
                      {shop.rating > 0 && (
                        <span className="flex items-center gap-1 text-gray-700">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {shop.rating.toFixed(1)} rating
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${getStatusColor(shop.status)}`}>
                      {getStatusText(shop.status)}
                    </span>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {shops.length === 0 && !loading && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Shops Found</h3>
            <p className="text-gray-600">
              Enter your location above to find authorized government ration shops in your area.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
