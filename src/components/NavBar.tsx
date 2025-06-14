
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🌾</span>
          <h1 
            className="text-xl font-bold text-orange-600 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            RationTrack
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/features')}
            className="text-gray-700 hover:text-orange-600"
          >
            Features
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/data-management')}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
          >
            <Database className="h-4 w-4" />
            Data Hub
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
