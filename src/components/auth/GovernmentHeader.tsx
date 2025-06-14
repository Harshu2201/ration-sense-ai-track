
import { Building2 } from "lucide-react";

export const GovernmentHeader = () => {
  return (
    <div className="bg-gradient-to-r from-orange-600 to-green-600 text-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3">
          <Building2 className="h-8 w-8" />
          <div className="text-center">
            <h1 className="text-2xl font-bold">Government of India</h1>
            <p className="text-sm opacity-90">Ministry of Consumer Affairs, Food & Public Distribution</p>
          </div>
        </div>
      </div>
    </div>
  );
};
