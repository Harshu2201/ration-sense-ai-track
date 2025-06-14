
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Phone } from "lucide-react";

interface RationShop {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  status: 'open' | 'closed' | 'limited';
}

const mockShops: RationShop[] = [
  {
    id: '1',
    name: 'Fair Price Shop - Ward 12',
    address: 'Main Bazaar Road, Block A, District Center',
    phone: '+91 98765 43210',
    distance: '0.5 km',
    status: 'open'
  },
  {
    id: '2',
    name: 'PDS Store - Village Center',
    address: 'Village Square, Near Primary School',
    phone: '+91 98765 43211',
    distance: '1.2 km',
    status: 'limited'
  },
  {
    id: '3',
    name: 'Ration Depot - East Block',
    address: 'Eastern Road, Near Bank',
    phone: '+91 98765 43212',
    distance: '2.1 km',
    status: 'closed'
  }
];

export const FindRationShops = () => {
  const [location, setLocation] = useState('');
  const [shops, setShops] = useState<RationShop[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setShops(mockShops);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600';
      case 'limited': return 'text-yellow-600';
      case 'closed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open - Full Stock';
      case 'limited': return 'Limited Stock';
      case 'closed': return 'Closed';
      default: return 'Unknown';
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
          <div className="flex gap-2">
            <Input
              placeholder="Enter your location or PIN code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {shops.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Nearby Ration Shops</h3>
          {shops.map((shop) => (
            <Card key={shop.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{shop.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{shop.address}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {shop.phone}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <Navigation className="h-3 w-3" />
                        {shop.distance}
                      </span>
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
    </div>
  );
};
