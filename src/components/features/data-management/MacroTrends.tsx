
import { DatasetSelector } from "./macro-trends/DatasetSelector";
import { TrendChart } from "./macro-trends/TrendChart";
import { APIStatusCard } from "./macro-trends/APIStatusCard";
import { useMacroTrends } from "./macro-trends/hooks";

export const MacroTrends = () => {
  const {
    datasets,
    selectedDataset,
    setSelectedDataset,
    trendData,
    loading,
    fetchingDatasets,
    fetchTrendData,
    exportTrendData
  } = useMacroTrends();

  return (
    <div className="space-y-6">
      <DatasetSelector
        datasets={datasets}
        selectedDataset={selectedDataset}
        loading={loading}
        fetchingDatasets={fetchingDatasets}
        onDatasetChange={setSelectedDataset}
        onFetchTrends={fetchTrendData}
      />

      <TrendChart
        trendData={trendData}
        onExport={exportTrendData}
      />

      <APIStatusCard />
    </div>
  );
};
