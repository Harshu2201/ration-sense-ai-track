
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

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

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="text-lg font-semibold mb-2">Find Ration Shops</h3>
            <p className="text-gray-600">Locate nearby ration shops and check their current stock status.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">Stock Tracking</h3>
            <p className="text-gray-600">Real-time updates on rice, wheat, kerosene, and other commodities.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-3">🚨</div>
            <h3 className="text-lg font-semibold mb-2">Report Issues</h3>
            <p className="text-gray-600">Help improve transparency by reporting problems or irregularities.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.email}!</h2>
          <p className="text-gray-600">
            You're now part of the RationTrack community. Start by exploring the features above or ask our AI assistant any questions in your preferred language.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
