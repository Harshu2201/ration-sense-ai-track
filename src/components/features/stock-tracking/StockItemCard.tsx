
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface StockItem {
  name: string;
  category: string;
  currentStock: number;
  totalCapacity: number;
  unit: string;
  lastUpdated: string;
  status: 'good' | 'low' | 'critical' | 'out';
  icon: React.ReactNode;
}

interface StockItemCardProps {
  item: StockItem;
}

export const StockItemCard = ({ item }: StockItemCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-orange-100 text-orange-800';
      case 'out': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {item.icon}
            <h4 className="font-semibold">{item.name}</h4>
          </div>
          <Badge className={getStatusColor(item.status)}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{item.currentStock} {item.unit} available</span>
            <span>{item.totalCapacity} {item.unit} capacity</span>
          </div>
          <Progress 
            value={(item.currentStock / item.totalCapacity) * 100} 
            className="h-2"
          />
          <p className="text-xs text-gray-500">Last updated: {item.lastUpdated}</p>
        </div>
      </CardContent>
    </Card>
  );
};
