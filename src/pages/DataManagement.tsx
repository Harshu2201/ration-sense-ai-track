
import { NavBar } from "@/components/NavBar";
import { DataManagement as DataManagementComponent } from "@/components/features/DataManagement";

const DataManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <DataManagementComponent />
    </div>
  );
};

export default DataManagement;
