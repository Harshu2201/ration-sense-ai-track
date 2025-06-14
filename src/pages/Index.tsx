
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, BarChart3, AlertTriangle, Database, Shield } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <NavBar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="h-12 w-12" />
              <h1 className="text-4xl font-bold">RationTrack</h1>
            </div>
            <p className="text-xl mb-2">
              Government of India - Public Distribution System
            </p>
            <p className="text-lg opacity-90">
              Digital Transparency Platform for Fair Price Shops
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Shield className="h-3 w-3 mr-1" />
                Government Verified
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Ministry of Consumer Affairs
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {user?.email}!
          </h2>
          <p className="text-gray-600 mb-4">
            Access real-time information about ration shops, stock availability, and contribute to transparency in the Public Distribution System.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/features')} className="bg-orange-600 hover:bg-orange-700">
              Explore Services
            </Button>
            <Button onClick={() => navigate('/data-management')} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Data Management
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all group"
            onClick={() => navigate('/features')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Find Ration Shops</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Locate authorized Fair Price Shops and check their operational status in real-time.
            </p>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-green-300 transition-all group"
            onClick={() => navigate('/features')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Stock Monitoring</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Track availability of rice, wheat, sugar, kerosene and other essential commodities.
            </p>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-red-300 transition-all group"
            onClick={() => navigate('/features')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Report Issues</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Report irregularities, quality issues, or other concerns to improve system transparency.
            </p>
          </div>

          <div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
            onClick={() => navigate('/data-management')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Data Hub</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Access official datasets, contribute community data, and analyze distribution trends.
            </p>
          </div>
        </div>

        {/* Government Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">About This Platform</h3>
              <p className="text-gray-600 text-sm mb-3">
                RationTrack is an official digital initiative to bring transparency and efficiency to India's Public Distribution System. 
                This platform enables real-time monitoring of fair price shops and commodity availability.
              </p>
              <p className="text-gray-600 text-sm">
                Developed in accordance with the National Food Security Act, 2013 and Digital India initiatives.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Features</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Real-time shop location and status tracking</li>
                <li>• Multi-language support for better accessibility</li>
                <li>• AI-powered chatbot for instant assistance</li>
                <li>• Community reporting and feedback system</li>
                <li>• Official data integration and analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
