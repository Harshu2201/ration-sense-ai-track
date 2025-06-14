
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, AlertTriangle, Thermometer } from "lucide-react";

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

interface WeatherSupplyRiskProps {
  weatherData: WeatherData;
}

export const WeatherSupplyRisk = ({ weatherData }: WeatherSupplyRiskProps) => {
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

  const getStatusColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
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
  );
};
