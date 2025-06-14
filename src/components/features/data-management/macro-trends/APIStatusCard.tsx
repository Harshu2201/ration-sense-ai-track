
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const APIStatusCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Integration Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Connected Services</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Community Data Catalog API</li>
              <li>• Open Resource Data Platform</li>
              <li>• Resource Information Centre</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Data Categories</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Distribution Coverage Statistics</li>
              <li>• Resource Distribution Data</li>
              <li>• Community Price Trends</li>
              <li>• Geographic Distribution Analysis</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
