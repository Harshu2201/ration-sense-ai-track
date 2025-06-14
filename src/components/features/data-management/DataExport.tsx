
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, FileText, Database, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DataExport = () => {
  const [exportFormat, setExportFormat] = useState('');
  const [dataRange, setDataRange] = useState('');
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const dataTypes = [
    { id: 'ration-shops', label: 'Ration Shop Locations', description: 'Shop addresses, contact info, and operating hours' },
    { id: 'stock-data', label: 'Stock Information', description: 'Current stock levels for all commodities' },
    { id: 'price-data', label: 'Price Information', description: 'Current and historical pricing data' },
    { id: 'complaints', label: 'Complaint Records', description: 'Community reported issues and their status' },
    { id: 'weather-data', label: 'Weather Analysis', description: 'Weather impact assessments on supply chains' }
  ];

  const handleTableSelection = (tableId: string, checked: boolean) => {
    if (checked) {
      setSelectedTables([...selectedTables, tableId]);
    } else {
      setSelectedTables(selectedTables.filter(id => id !== tableId));
    }
  };

  const handleExport = async () => {
    if (!exportFormat || selectedTables.length === 0) {
      toast({
        title: "Missing Selection",
        description: "Please select export format and at least one data type.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Export Successful",
        description: `Data exported in ${exportFormat.toUpperCase()} format. Download should start automatically.`,
      });
      
      // In a real implementation, this would trigger a file download
      console.log('Exporting data:', { format: exportFormat, tables: selectedTables, range: dataRange });
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export PDS Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="export-format">Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select export format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
                <SelectItem value="xlsx">XLSX (Excel Spreadsheet)</SelectItem>
                <SelectItem value="xml">XML (Extensible Markup Language)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="data-range">Data Range</Label>
            <Select value={dataRange} onValueChange={setDataRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select data range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last 7 Days</SelectItem>
                <SelectItem value="last-month">Last 30 Days</SelectItem>
                <SelectItem value="last-quarter">Last 3 Months</SelectItem>
                <SelectItem value="last-year">Last 12 Months</SelectItem>
                <SelectItem value="all-time">All Available Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data Types to Export</Label>
            <div className="space-y-3 mt-2">
              {dataTypes.map((dataType) => (
                <div key={dataType.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    id={dataType.id}
                    checked={selectedTables.includes(dataType.id)}
                    onCheckedChange={(checked) => handleTableSelection(dataType.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={dataType.id} className="font-medium cursor-pointer">
                      {dataType.label}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{dataType.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleExport} 
            disabled={!exportFormat || selectedTables.length === 0 || isExporting}
            className="w-full"
          >
            {isExporting ? "Exporting..." : "Export Data"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Export Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-blue-700">Ration Shops</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3,891</div>
              <div className="text-sm text-green-700">Stock Records</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">156</div>
              <div className="text-sm text-orange-700">Complaint Reports</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800">Open Data Initiative</h4>
              <p className="text-sm text-green-700 mt-1">
                All exported data is part of our transparency initiative. Use this data for research, analysis, and improving PDS services in your community.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
