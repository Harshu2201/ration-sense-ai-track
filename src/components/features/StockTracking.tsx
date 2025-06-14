
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, Wheat, Fuel, Package, CloudRain, AlertTriangle, Thermometer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface WeatherData {
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
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get weather data for current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log('Geolocation not available:', error);
        }
      );
    }
  }, []);

  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoadingWeather(true);
    try {
      const { data, error } = await supabase.functions.invoke('weather-service', {
        body: { lat, lon }
      });

      if (error) throw error;
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast({
        title: "Weather Data Unavailable",
        description: "Could not fetch weather information for supply predictions.",
        variant: "destructive",
      });
    } finally {
      setLoadingWeather(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-orange-100 text-orange-800';
      case 'out': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'border-green-200 bg-green-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'high': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CloudRain className="h-4 w-4 text-green-600" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <CloudRain className="h-4 w-4 text-gray-600" />;
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

      {weatherData && (
        <Card className={`border-2 ${getRiskColor(weatherData.supplyRisk.riskLevel)}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getRiskIcon(weatherData.supplyRisk.riskLevel)}
              Supply Delay Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-4 w-4" />
                  <span className="font-medium">Current Weather</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{weatherData.location}</p>
                <p className="text-sm">
                  {weatherData.current.temperature}°C, {weatherData.current.description}
                </p>
                <p className="text-xs text-gray-500">
                  Humidity: {weatherData.current.humidity}% | Wind: {weatherData.current.windSpeed} km/h
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor(weatherData.supplyRisk.riskLevel)}>
                    {weatherData.supplyRisk.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <p className="text-sm font-medium">
                  Expected Delay: {weatherData.supplyRisk.delayPrediction}
                </p>
                {weatherData.supplyRisk.factors.length > 0 && (
                  <ul className="text-xs text-gray-600 mt-2">
                    {weatherData.supplyRisk.factors.map((factor, index) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
