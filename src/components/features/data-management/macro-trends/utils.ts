
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

export const generateMockTrendData = (datasetId: string): TrendData[] => {
  const periods = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'];
  
  switch (datasetId) {
    case 'pds-coverage-2024':
      return periods.map((period, index) => ({
        period,
        value: 85 + (index * 2) + Math.random() * 3,
        category: 'Coverage %'
      }));
    case 'foodgrain-allocation-2024':
      return periods.map((period, index) => ({
        period,
        value: 450000 + (index * 15000) + Math.random() * 10000,
        category: 'Allocation (MT)'
      }));
    case 'ration-shop-density':
      return periods.map((period, index) => ({
        period,
        value: 12.5 + (index * 0.3) + Math.random() * 0.5,
        category: 'Shops per 1000 people'
      }));
    case 'price-trends-commodities':
      return periods.map((period, index) => ({
        period,
        value: 28 + (index * 1.2) + Math.random() * 2,
        category: 'Average Price (₹/kg)'
      }));
    default:
      return [];
  }
};

export const getMockDatasets = (): DatasetInfo[] => {
  return [
    {
      id: 'pds-coverage-2024',
      title: 'PDS Coverage Statistics 2024',
      description: 'State-wise PDS coverage and beneficiary data',
      lastUpdated: '2024-12-01',
      recordCount: 35840
    },
    {
      id: 'foodgrain-allocation-2024',
      title: 'Foodgrain Allocation Trends',
      description: 'Monthly foodgrain allocation patterns across states',
      lastUpdated: '2024-11-28',
      recordCount: 12456
    },
    {
      id: 'ration-shop-density',
      title: 'Ration Shop Density Analysis',
      description: 'Geographic distribution and accessibility metrics',
      lastUpdated: '2024-11-25',
      recordCount: 8921
    },
    {
      id: 'price-trends-commodities',
      title: 'Commodity Price Trends',
      description: 'Historical price data for essential commodities',
      lastUpdated: '2024-12-10',
      recordCount: 15678
    }
  ];
};
