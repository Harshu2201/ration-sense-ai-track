
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation, Building2, AlertCircle } from "lucide-react";

interface SearchSectionProps {
  location: string;
  setLocation: (location: string) => void;
  loading: boolean;
  usingMockData: boolean;
  onSearch: () => void;
  onGetCurrentLocation: () => void;
}

export const SearchSection = ({ 
  location, 
  setLocation, 
  loading, 
  usingMockData, 
  onSearch, 
  onGetCurrentLocation 
}: SearchSectionProps) => {
  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-green-50">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Building2 className="h-5 w-5 text-orange-600" />
          Government Ration Shop Locator
        </CardTitle>
        <p className="text-sm text-gray-600">
          Find authorized Fair Price Shops and PDS centers in your area
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        {usingMockData && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Demo Mode: Showing sample government ration shops for demonstration purposes.
              </span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Enter PIN code, area name, or full address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          />
          <div className="flex gap-2">
            <Button 
              onClick={onSearch} 
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading ? 'Searching...' : 'Find Shops'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onGetCurrentLocation} 
              disabled={loading}
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <Navigation className="h-4 w-4 mr-1" />
              Use Location
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
