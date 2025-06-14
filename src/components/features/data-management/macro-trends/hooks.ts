
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getMockDatasets, generateMockTrendData } from './utils';

interface TrendData {
  period: string;
  value: number;
  category: string;
}

interface DatasetInfo {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  recordCount: number;
}

export const useMacroTrends = () => {
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDatasets, setFetchingDatasets] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableDatasets();
  }, []);

  const fetchAvailableDatasets = async () => {
    setFetchingDatasets(true);
    try {
      // Simulate API call to Data.gov.in catalog
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockDatasets = getMockDatasets();
      setDatasets(mockDatasets);
      
      toast({
        title: "Datasets Loaded",
        description: `Found ${mockDatasets.length} relevant PDS datasets from Data.gov.in`,
      });
      
    } catch (error) {
      toast({
        title: "Error Loading Datasets",
        description: "Could not fetch datasets from Data.gov.in API",
        variant: "destructive"
      });
    } finally {
      setFetchingDatasets(false);
    }
  };

  const fetchTrendData = async () => {
    if (!selectedDataset) {
      toast({
        title: "No Dataset Selected",
        description: "Please select a dataset to view trends",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to fetch actual trend data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock trend data based on selected dataset
      const mockTrendData = generateMockTrendData(selectedDataset);
      setTrendData(mockTrendData);
      
      toast({
        title: "Trends Loaded",
        description: `Successfully fetched macro-level trends for ${datasets.find(d => d.id === selectedDataset)?.title}`,
      });
      
    } catch (error) {
      toast({
        title: "Error Fetching Trends",
        description: "Could not fetch trend data from Data.gov.in",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportTrendData = () => {
    if (trendData.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please fetch trend data first",
        variant: "destructive"
      });
      return;
    }

    const dataStr = JSON.stringify(trendData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${selectedDataset}-trends.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Export Successful",
      description: "Trend data exported successfully",
    });
  };

  return {
    datasets,
    selectedDataset,
    setSelectedDataset,
    trendData,
    loading,
    fetchingDatasets,
    fetchTrendData,
    exportTrendData
  };
};
