
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Database, Building2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md border-b-2 border-blue-500 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 
              className="text-xl font-bold text-blue-600 cursor-pointer leading-tight" 
              onClick={() => navigate('/')}
            >
              RationTrack
            </h1>
            <p className="text-xs text-gray-500">Resource Distribution</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/features')}
            className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Services
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/data-management')}
            className="flex items-center gap-2 text-gray-700 hover:text-green-600 hover:bg-green-50"
          >
            <Database className="h-4 w-4" />
            Data Hub
          </Button>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium text-gray-700">Signed in as</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <DropdownMenuItem onClick={() => window.open('https://example.com/', '_blank')} className="cursor-pointer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Main Website
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
