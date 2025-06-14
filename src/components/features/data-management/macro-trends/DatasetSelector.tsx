
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, TrendingUp, RefreshCw } from "lucide-react";

interface DatasetInfo {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  recordCount: number;
}

interface DatasetSelectorProps {
  datasets: DatasetInfo[];
  selectedDataset: string;
  loading: boolean;
  fetchingDatasets: boolean;
  onDatasetChange: (value: string) => void;
  onFetchTrends: () => void;
}

export const DatasetSelector = ({
  datasets,
  selectedDataset,
  loading,
  fetchingDatasets,
  onDatasetChange,
  onFetchTrends
}: DatasetSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data.gov.in Macro Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Select Dataset</label>
            <Select value={selectedDataset} onValueChange={onDatasetChange} disabled={fetchingDatasets}>
              <SelectTrigger>
                <SelectValue placeholder={fetchingDatasets ? "Loading datasets..." : "Choose a dataset"} />
              </SelectTrigger>
              <SelectContent>
                {datasets.map((dataset) => (
                  <SelectItem key={dataset.id} value={dataset.id}>
                    {dataset.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={onFetchTrends} 
            disabled={loading || !selectedDataset}
            className="flex items-center gap-2"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
            {loading ? "Fetching..." : "Fetch Trends"}
          </Button>
        </div>

        {selectedDataset && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm">
              <strong>Dataset:</strong> {datasets.find(d => d.id === selectedDataset)?.title}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {datasets.find(d => d.id === selectedDataset)?.description}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Last Updated: {datasets.find(d => d.id === selectedDataset)?.lastUpdated} | 
              Records: {datasets.find(d => d.id === selectedDataset)?.recordCount?.toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
