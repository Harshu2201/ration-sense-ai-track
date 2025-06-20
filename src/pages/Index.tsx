
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavBar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="h-12 w-12" />
              <h1 className="text-4xl font-bold">RationTrack</h1>
            </div>
            <p className="text-xl mb-2">
              Community Resource Distribution Platform
            </p>
            <p className="text-lg opacity-90">
              Digital Transparency Platform for Resource Management
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Shield className="h-3 w-3 mr-1" />
                Community Verified
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Resource Management
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
            Access real-time information about resource distribution centers, stock availability, and contribute to transparency in community resource management.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/features')} className="bg-blue-600 hover:bg-blue-700">
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
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
            onClick={() => navigate('/features')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Find Distribution Centers</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Locate authorized distribution centers and check their operational status in real-time.
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
              Track availability of essential resources and commodities at various distribution points.
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
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-purple-300 transition-all group"
            onClick={() => navigate('/data-management')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Data Hub</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Access community datasets, contribute data, and analyze distribution trends.
            </p>
          </div>
        </div>

        {/* Platform Information */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">About This Platform</h3>
              <p className="text-gray-600 text-sm mb-3">
                RationTrack is a community-driven digital initiative to bring transparency and efficiency to resource distribution systems. 
                This platform enables real-time monitoring of distribution centers and resource availability.
              </p>
              <p className="text-gray-600 text-sm">
                Built with community collaboration and digital transparency in mind.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Features</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Real-time center location and status tracking</li>
                <li>• Multi-language support for better accessibility</li>
                <li>• AI-powered chatbot for instant assistance</li>
                <li>• Community reporting and feedback system</li>
                <li>• Data integration and analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
