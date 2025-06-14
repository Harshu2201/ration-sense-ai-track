
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Wheat, Fuel, Package } from "lucide-react";

interface StockItem {
  name: string;
  category: string;
  currentStock: number;
  totalCapacity: number;
  unit: string;
  lastUpdated: string;
  status: 'good' | 'low' | 'critical' | 'out';
  icon: React.ReactNode;
}

const mockStockData: StockItem[] = [
  {
    name: 'Rice (BPL)',
    category: 'grains',
    currentStock: 850,
    totalCapacity: 1000,
    unit: 'kg',
    lastUpdated: '2 hours ago',
    status: 'good',
    icon: <Package className="h-4 w-4" />
  },
  {
    name: 'Wheat',
    category: 'grains',
    currentStock: 150,
    totalCapacity: 800,
    unit: 'kg',
    lastUpdated: '1 hour ago',
    status: 'low',
    icon: <Wheat className="h-4 w-4" />
  },
  {
    name: 'Kerosene',
    category: 'fuel',
    currentStock: 0,
    totalCapacity: 500,
    unit: 'liters',
    lastUpdated: '3 hours ago',
    status: 'out',
    icon: <Fuel className="h-4 w-4" />
  },
  {
    name: 'Sugar',
    category: 'essentials',
    currentStock: 45,
    totalCapacity: 200,
    unit: 'kg',
    lastUpdated: '4 hours ago',
    status: 'critical',
    icon: <Package className="h-4 w-4" />
  }
];

export const StockTracking = () => {
  const [selectedShop, setSelectedShop] = useState('');
  const [stockData, setStockData] = useState<StockItem[]>(mockStockData);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-orange-100 text-orange-800';
      case 'out': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'low': return 'bg-yellow-500';
      case 'critical': return 'bg-orange-500';
      case 'out': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Real-time Stock Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedShop} onValueChange={setSelectedShop}>
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

      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">Current Stock Status</h3>
        {stockData.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <h4 className="font-semibold">{item.name}</h4>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.currentStock} {item.unit} available</span>
                  <span>{item.totalCapacity} {item.unit} capacity</span>
                </div>
                <Progress 
                  value={(item.currentStock / item.totalCapacity) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-gray-500">Last updated: {item.lastUpdated}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
