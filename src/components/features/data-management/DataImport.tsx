
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DataImport = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataSource, setDataSource] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !dataSource) {
      toast({
        title: "Missing Information",
        description: "Please select a file and specify the data source.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Import Successful",
        description: `Successfully imported ${selectedFile.name} from ${dataSource}`,
      });
      
      // Reset form
      setSelectedFile(null);
      setDataSource('');
      setDescription('');
      
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "There was an error processing the file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Official Government Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Upload Dataset File</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.json,.xlsx"
              onChange={handleFileSelect}
              className="mt-1"
            />
            {selectedFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="data-source">Data Source</Label>
            <Select value={dataSource} onValueChange={setDataSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tn-pds">Tamil Nadu PDS Portal</SelectItem>
                <SelectItem value="up-ration">UP Ration Shop System</SelectItem>
                <SelectItem value="data-gov-in">Data.gov.in</SelectItem>
                <SelectItem value="nfsa">National Food Security Act Portal</SelectItem>
                <SelectItem value="other">Other Official Source</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the dataset..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button 
            onClick={handleImport} 
            disabled={!selectedFile || !dataSource || isProcessing}
            className="w-full"
          >
            {isProcessing ? "Processing..." : "Import Dataset"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Supported Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Official Government Portals</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tamil Nadu PDS Stock Reports</li>
                <li>• UP Ration Shop Listings</li>
                <li>• NFSA Implementation Data</li>
                <li>• State-wise PDS Statistics</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Supported File Formats</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CSV (Comma Separated Values)</li>
                <li>• JSON (JavaScript Object Notation)</li>
                <li>• XLSX (Excel Spreadsheet)</li>
                <li>• XML (Extensible Markup Language)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-800">Data Guidelines</h4>
              <p className="text-sm text-orange-700 mt-1">
                Only upload official government datasets from verified sources. Ensure data is recent and comes from legitimate government portals or open data initiatives.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
