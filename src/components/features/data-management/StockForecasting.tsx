
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Calendar, AlertTriangle, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface HistoricalData {
  date: string;
  stockLevel: number;
  arrivalAmount: number;
  commodity: string;
  governmentSchedule?: boolean;
}

interface ForecastData {
  date: string;
  predictedArrival: number;
  confidence: number;
  type: 'historical' | 'forecast' | 'scheduled';
  commodity: string;
}

interface ForecastInsights {
  nextArrivalDate: string;
  predictedAmount: number;
  confidence: number;
  seasonalTrend: string;
  riskFactors: string[];
  recommendations: string[];
}

export const StockForecasting = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [insights, setInsights] = useState<ForecastInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const { toast } = useToast();

  const chartConfig = {
    predictedArrival: {
      label: "Predicted Arrival",
      color: "hsl(var(--chart-1))",
    },
    confidence: {
      label: "Confidence",
      color: "hsl(var(--chart-2))",
    },
  };

  useEffect(() => {
    // Load historical data on component mount
    loadHistoricalData();
  }, []);

  const loadHistoricalData = async () => {
    try {
      // Simulate loading historical supply data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockHistoricalData: HistoricalData[] = generateMockHistoricalData();
      setHistoricalData(mockHistoricalData);
      
      toast({
        title: "Historical Data Loaded",
        description: "Successfully loaded 6 months of supply pattern data",
      });
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: "Could not load historical supply data",
        variant: "destructive"
      });
    }
  };

  const generateMockHistoricalData = (): HistoricalData[] => {
    const data: HistoricalData[] = [];
    const commodities = ['Rice', 'Wheat', 'Sugar', 'Kerosene'];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    for (let i = 0; i < 180; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      commodities.forEach(commodity => {
        // Simulate weekly arrivals with some randomness
        if (i % 7 === 0 || Math.random() > 0.8) {
          data.push({
            date: currentDate.toISOString().split('T')[0],
            stockLevel: Math.floor(Math.random() * 500) + 100,
            arrivalAmount: Math.floor(Math.random() * 200) + 50,
            commodity,
            governmentSchedule: Math.random() > 0.7
          });
        }
      });
    }
    
    return data;
  };

  const runForecast = async () => {
    if (!selectedCommodity || !selectedShop) {
      toast({
        title: "Missing Selection",
        description: "Please select both commodity and shop",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate ARIMA/Prophet forecasting computation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const forecast = generateForecastData(selectedCommodity);
      const forecastInsights = generateInsights(forecast);
      
      setForecastData(forecast);
      setInsights(forecastInsights);
      
      toast({
        title: "Forecast Generated",
        description: `Generated 30-day forecast for ${selectedCommodity} using time-series analysis`,
      });
      
    } catch (error) {
      toast({
        title: "Forecast Failed",
        description: "Could not generate forecast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateForecastData = (commodity: string): ForecastData[] => {
    const data: ForecastData[] = [];
    const today = new Date();
    
    // Add historical data points (last 30 days)
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      if (i % 7 === 0 || Math.random() > 0.8) {
        data.push({
          date: date.toISOString().split('T')[0],
          predictedArrival: Math.floor(Math.random() * 150) + 50,
          confidence: 95,
          type: 'historical',
          commodity
        });
      }
    }
    
    // Add forecast data points (next 30 days)
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Prophet-like seasonal patterns
      const weeklyPattern = Math.sin((i % 7) * Math.PI / 3.5) * 20;
      const monthlyTrend = Math.cos(i * Math.PI / 15) * 30;
      const baseAmount = 100;
      const noise = (Math.random() - 0.5) * 20;
      
      const predictedAmount = Math.max(0, baseAmount + weeklyPattern + monthlyTrend + noise);
      const confidence = Math.max(60, 95 - (i * 1.5)); // Confidence decreases over time
      
      // Simulate government scheduled arrivals
      const isScheduled = i % 7 === 0 || (i === 14) || (i === 28);
      
      if (predictedAmount > 30 || isScheduled) {
        data.push({
          date: date.toISOString().split('T')[0],
          predictedArrival: Math.round(predictedAmount),
          confidence: Math.round(confidence),
          type: isScheduled ? 'scheduled' : 'forecast',
          commodity
        });
      }
    }
    
    return data;
  };

  const generateInsights = (forecast: ForecastData[]): ForecastInsights => {
    const futureForecast = forecast.filter(f => f.type === 'forecast' || f.type === 'scheduled');
    const nextArrival = futureForecast[0];
    
    const seasonalTrend = Math.random() > 0.5 ? 'increasing' : 'stable';
    
    const riskFactors = [];
    if (futureForecast.some(f => f.confidence < 70)) riskFactors.push('Low confidence in long-term predictions');
    if (Math.random() > 0.7) riskFactors.push('Monsoon season may affect transportation');
    if (Math.random() > 0.8) riskFactors.push('Festival period may increase demand');
    
    const recommendations = [];
    recommendations.push('Monitor actual arrivals vs predictions to improve model accuracy');
    if (seasonalTrend === 'increasing') {
      recommendations.push('Prepare additional storage capacity for increased supply');
    }
    recommendations.push('Coordinate with government schedules for optimal stock management');
    
    return {
      nextArrivalDate: nextArrival?.date || 'Unknown',
      predictedAmount: nextArrival?.predictedArrival || 0,
      confidence: nextArrival?.confidence || 0,
      seasonalTrend,
      riskFactors,
      recommendations
    };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'historical': return 'hsl(var(--muted-foreground))';
      case 'forecast': return 'hsl(var(--chart-1))';
      case 'scheduled': return 'hsl(var(--chart-3))';
      default: return 'hsl(var(--chart-1))';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Stock Arrival Forecasting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Shop</label>
              <Select value={selectedShop} onValueChange={setSelectedShop}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a ration shop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shop1">Fair Price Shop - Ward 12</SelectItem>
                  <SelectItem value="shop2">PDS Store - Village Center</SelectItem>
                  <SelectItem value="shop3">Ration Depot - East Block</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Select Commodity</label>
              <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose commodity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">Rice (BPL)</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="sugar">Sugar</SelectItem>
                  <SelectItem value="kerosene">Kerosene</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={runForecast} 
            disabled={loading || !selectedCommodity || !selectedShop}
            className="w-full"
          >
            {loading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Running Time-Series Analysis...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Forecast
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {insights && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Next Predicted Arrival
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold">{insights.nextArrivalDate}</p>
                  <p className="text-sm text-gray-600">Expected arrival date</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">{insights.predictedAmount} kg</p>
                  <p className="text-sm text-gray-600">Predicted quantity</p>
                </div>
                <Badge className={getConfidenceColor(insights.confidence)}>
                  {insights.confidence}% Confidence
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Factors & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Risk Factors:</h4>
                  <ul className="text-sm space-y-1">
                    {insights.riskFactors.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Recommendations:</h4>
                  <ul className="text-sm space-y-1">
                    {insights.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {forecastData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Time-Series Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="predictedArrival"
                    stroke="var(--color-predictedArrival)"
                    fill="var(--color-predictedArrival)"
                    fillOpacity={0.3}
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="var(--color-confidence)"
                    strokeDasharray="5 5"
                    yAxisId="confidence"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded"></div>
                <span>Historical Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Predicted Arrivals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Government Scheduled</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Forecasting Model Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Applied Algorithms</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ARIMA for trend analysis</li>
                <li>• Seasonal decomposition</li>
                <li>• Government schedule integration</li>
                <li>• Historical pattern recognition</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Data Sources</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 6 months historical supply data</li>
                <li>• Government shipment schedules</li>
                <li>• Seasonal consumption patterns</li>
                <li>• External factors (weather, festivals)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
