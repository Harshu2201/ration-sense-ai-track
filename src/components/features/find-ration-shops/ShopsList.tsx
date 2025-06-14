
import { ShopCard } from "./ShopCard";

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

interface ShopsListProps {
  shops: RationShop[];
  usingMockData: boolean;
}

export const ShopsList = ({ shops, usingMockData }: ShopsListProps) => {
  if (shops.length === 0) {
    return null;
  }

  return (
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
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
};
