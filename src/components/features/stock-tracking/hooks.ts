
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getMockStockData, type StockItem, type WeatherData } from './utils';

export const useStockTracking = () => {
  const [selectedShop, setSelectedShop] = useState('');
  const [stockData, setStockData] = useState<StockItem[]>(getMockStockData());
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

  return {
    selectedShop,
    setSelectedShop,
    stockData,
    weatherData,
    loadingWeather
  };
};
