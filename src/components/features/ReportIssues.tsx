
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  type: string;
  description: string;
  shopName: string;
  status: 'pending' | 'investigating' | 'resolved';
  date: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    type: 'Stock Shortage',
    description: 'Rice not available for 3 days',
    shopName: 'Fair Price Shop - Ward 12',
    status: 'investigating',
    date: '2024-06-13'
  },
  {
    id: '2',
    type: 'Quality Issue',
    description: 'Wheat quality is poor',
    shopName: 'PDS Store - Village Center',
    status: 'resolved',
    date: '2024-06-12'
  }
];

export const ReportIssues = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [formData, setFormData] = useState({
    type: '',
    shopName: '',
    description: ''
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!formData.type || !formData.shopName || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newReport: Report = {
      id: (reports.length + 1).toString(),
      type: formData.type,
      description: formData.description,
      shopName: formData.shopName,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    setReports([newReport, ...reports]);
    setFormData({ type: '', shopName: '', description: '' });
    
    toast({
      title: "Report Submitted",
      description: "Your report has been submitted successfully. We'll investigate and take appropriate action.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'investigating': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Report an Issue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select issue type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stock-shortage">Stock Shortage</SelectItem>
              <SelectItem value="quality-issue">Quality Issue</SelectItem>
              <SelectItem value="overpricing">Overpricing</SelectItem>
              <SelectItem value="irregular-hours">Irregular Operating Hours</SelectItem>
              <SelectItem value="staff-behavior">Staff Behavior</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={formData.shopName} onValueChange={(value) => setFormData({...formData, shopName: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select ration shop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fair Price Shop - Ward 12">Fair Price Shop - Ward 12</SelectItem>
              <SelectItem value="PDS Store - Village Center">PDS Store - Village Center</SelectItem>
              <SelectItem value="Ration Depot - East Block">Ration Depot - East Block</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Describe the issue in detail..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
          />

          <Button onClick={handleSubmit} className="w-full">
            Submit Report
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Previous Reports</h3>
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{report.type}</h4>
                <Badge className={getStatusColor(report.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(report.status)}
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{report.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{report.shopName}</span>
                <span>{report.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
