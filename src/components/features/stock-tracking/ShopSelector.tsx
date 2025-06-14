
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3 } from "lucide-react";

interface ShopSelectorProps {
  selectedShop: string;
  onShopChange: (value: string) => void;
}

export const ShopSelector = ({ selectedShop, onShopChange }: ShopSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Real-time Stock Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedShop} onValueChange={onShopChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a ration shop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shop1">Fair Price Shop - Ward 12</SelectItem>
            <SelectItem value="shop2">PDS Store - Village Center</SelectItem>
            <SelectItem value="shop3">Ration Depot - East Block</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
