
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";

interface TrendData {
  period: string;
  value: number;
  category: string;
}

interface TrendChartProps {
  trendData: TrendData[];
  onExport: () => void;
}

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
};

export const TrendChart = ({ trendData, onExport }: TrendChartProps) => {
  if (trendData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Macro-Level Trends</CardTitle>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="var(--color-value)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-value)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Trend Insights</h4>
          <p className="text-sm text-green-700">
            This data is sourced from Data.gov.in's official PDS datasets and provides macro-level trends 
            that can help identify nationwide patterns and inform policy decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
