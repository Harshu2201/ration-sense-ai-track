
import { Package, Wheat, Fuel } from "lucide-react";

export interface StockItem {
  name: string;
  category: string;
  currentStock: number;
  totalCapacity: number;
  unit: string;
  lastUpdated: string;
  status: 'good' | 'low' | 'critical' | 'out';
  icon: React.ReactNode;
}

export interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
  };
  supplyRisk: {
    riskLevel: 'low' | 'medium' | 'high';
    delayPrediction: string;
    factors: string[];
  };
  location: string;
}

export const getMockStockData = (): StockItem[] => [
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
