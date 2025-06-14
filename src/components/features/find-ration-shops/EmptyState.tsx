
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface EmptyStateProps {
  loading: boolean;
}

export const EmptyState = ({ loading }: EmptyStateProps) => {
  if (loading) {
    return null;
  }

  return (
    <Card className="border-dashed">
      <CardContent className="p-8 text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Centers Found</h3>
        <p className="text-gray-600">
          Enter your location above to find authorized distribution centers in your area.
        </p>
      </CardContent>
    </Card>
  );
};
