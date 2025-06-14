
import { useState } from 'react';
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, BarChart3, AlertTriangle } from "lucide-react";
import { FindRationShops } from "@/components/features/FindRationShops";
import { StockTracking } from "@/components/features/StockTracking";
import { ReportIssues } from "@/components/features/ReportIssues";

type ActiveFeature = 'find-shops' | 'stock-tracking' | 'report-issues' | null;

const Features = () => {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>(null);

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'find-shops':
        return <FindRationShops />;
      case 'stock-tracking':
        return <StockTracking />;
      case 'report-issues':
        return <ReportIssues />;
      default:
        return null;
    }
  };

  if (activeFeature) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => setActiveFeature(null)}
            className="mb-6"
          >
            ← Back to Features
          </Button>
          {renderFeatureContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            RationTrack Features
          </h1>
          <p className="text-xl text-gray-600">
            Choose a feature to get started
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setActiveFeature('find-shops')}
          >
            <CardContent className="p-6 text-center">
              <MapPin className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Find Ration Shops</h3>
              <p className="text-gray-600">Locate nearby ration shops and check their current stock status.</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setActiveFeature('stock-tracking')}
          >
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Stock Tracking</h3>
              <p className="text-gray-600">Real-time updates on rice, wheat, kerosene, and other commodities.</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setActiveFeature('report-issues')}
          >
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Report Issues</h3>
              <p className="text-gray-600">Help improve transparency by reporting problems or irregularities.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Features;
