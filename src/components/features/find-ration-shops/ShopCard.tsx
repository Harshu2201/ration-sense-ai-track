
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Phone, Navigation, Star, Clock } from "lucide-react";

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

interface ShopCardProps {
  shop: RationShop;
}

export const ShopCard = ({ shop }: ShopCardProps) => {
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
    <Card className="hover:shadow-lg transition-shadow border-l-2 border-l-green-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-blue-600" />
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
  );
};
