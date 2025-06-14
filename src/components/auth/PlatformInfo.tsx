
import { Badge } from "@/components/ui/badge";
import { Building2, Shield, Users, Globe } from "lucide-react";

export const PlatformInfo = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Building2 className="h-12 w-12 text-orange-600" />
        <div>
          <h2 className="text-3xl font-bold text-gray-800">RationTrack</h2>
          <p className="text-gray-600">Digital PDS Transparency Platform</p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300">
          <Shield className="h-3 w-3 mr-1" />
          Government Verified
        </Badge>
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
          <Users className="h-3 w-3 mr-1" />
          Public Service
        </Badge>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">
          <Globe className="h-3 w-3 mr-1" />
          Multi-Language
        </Badge>
      </div>
    </div>
  );
};
