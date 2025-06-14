
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to RationTrack
          </h1>
          <p className="text-xl text-gray-600">
            Your AI-powered PDS transparency platform
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/features')}
          >
            <div className="text-3xl mb-3">📍</div>
            <h3 className="text-lg font-semibold mb-2">Find Ration Shops</h3>
            <p className="text-gray-600">Locate nearby ration shops and check their current stock status.</p>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/features')}
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">Stock Tracking</h3>
            <p className="text-gray-600">Real-time updates on rice, wheat, kerosene, and other commodities.</p>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/features')}
          >
            <div className="text-3xl mb-3">🚨</div>
            <h3 className="text-lg font-semibold mb-2">Report Issues</h3>
            <p className="text-gray-600">Help improve transparency by reporting problems or irregularities.</p>
          </div>

          <div 
            className="bg-white p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/data-management')}
          >
            <div className="text-3xl mb-3">💾</div>
            <h3 className="text-lg font-semibold mb-2">Data Hub</h3>
            <p className="text-gray-600">Import official datasets and contribute community data.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.email}!</h2>
          <p className="text-gray-600 mb-4">
            You're now part of the RationTrack community. Start by exploring the features above or contribute to our data collection efforts through the Data Hub.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/features')} className="bg-orange-500 hover:bg-orange-600">
              Explore Features
            </Button>
            <Button onClick={() => navigate('/data-management')} variant="outline">
              Visit Data Hub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
