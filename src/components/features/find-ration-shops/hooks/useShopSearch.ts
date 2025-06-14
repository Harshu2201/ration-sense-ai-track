
import { useState } from 'react';
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

export const useShopSearch = () => {
  const [shops, setShops] = useState<RationShop[]>([]);
  const [loading, setLoading] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [searchCoordinates, setSearchCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();

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

  const handleSearch = async (location: string) => {
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

  return {
    shops,
    loading,
    usingMockData,
    searchCoordinates,
    getCurrentLocation,
    handleSearch
  };
};
