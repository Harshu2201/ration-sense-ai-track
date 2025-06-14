
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Package, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CommunityData = () => {
  const [formType, setFormType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [stockData, setStockData] = useState({
    shopName: '',
    location: '',
    district: '',
    riceStock: '',
    wheatStock: '',
    keroseneStock: '',
    sugarStock: '',
    lastUpdated: '',
    verificationPhoto: null as File | null
  });

  const [priceData, setPriceData] = useState({
    shopName: '',
    location: '',
    district: '',
    ricePrice: '',
    wheatPrice: '',
    kerosenePrice: '',
    sugarPrice: '',
    reportDate: ''
  });

  const [complaintData, setComplaintData] = useState({
    shopName: '',
    location: '',
    district: '',
    issueType: '',
    description: '',
    reporterName: '',
    contactNumber: ''
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Data Submitted Successfully",
        description: "Your contribution will be verified and added to the database.",
      });
      
      // Reset forms
      setStockData({
        shopName: '', location: '', district: '', riceStock: '', wheatStock: '', 
        keroseneStock: '', sugarStock: '', lastUpdated: '', verificationPhoto: null
      });
      setPriceData({
        shopName: '', location: '', district: '', ricePrice: '', wheatPrice: '', 
        kerosenePrice: '', sugarPrice: '', reportDate: ''
      });
      setComplaintData({
        shopName: '', location: '', district: '', issueType: '', description: '', 
        reporterName: '', contactNumber: ''
      });
      setFormType('');
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStockForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Report Stock Levels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shop-name">Ration Shop Name</Label>
            <Input
              id="shop-name"
              value={stockData.shopName}
              onChange={(e) => setStockData({...stockData, shopName: e.target.value})}
              placeholder="Enter shop name"
            />
          </div>
          <div>
            <Label htmlFor="location">Location/Address</Label>
            <Input
              id="location"
              value={stockData.location}
              onChange={(e) => setStockData({...stockData, location: e.target.value})}
              placeholder="Enter location"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            value={stockData.district}
            onChange={(e) => setStockData({...stockData, district: e.target.value})}
            placeholder="Enter district"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rice-stock">Rice Stock (kg)</Label>
            <Input
              id="rice-stock"
              type="number"
              value={stockData.riceStock}
              onChange={(e) => setStockData({...stockData, riceStock: e.target.value})}
              placeholder="Available rice stock"
            />
          </div>
          <div>
            <Label htmlFor="wheat-stock">Wheat Stock (kg)</Label>
            <Input
              id="wheat-stock"
              type="number"
              value={stockData.wheatStock}
              onChange={(e) => setStockData({...stockData, wheatStock: e.target.value})}
              placeholder="Available wheat stock"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="kerosene-stock">Kerosene Stock (liters)</Label>
            <Input
              id="kerosene-stock"
              type="number"
              value={stockData.keroseneStock}
              onChange={(e) => setStockData({...stockData, keroseneStock: e.target.value})}
              placeholder="Available kerosene stock"
            />
          </div>
          <div>
            <Label htmlFor="sugar-stock">Sugar Stock (kg)</Label>
            <Input
              id="sugar-stock"
              type="number"
              value={stockData.sugarStock}
              onChange={(e) => setStockData({...stockData, sugarStock: e.target.value})}
              placeholder="Available sugar stock"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="last-updated">When was this information last verified?</Label>
          <Input
            id="last-updated"
            type="date"
            value={stockData.lastUpdated}
            onChange={(e) => setStockData({...stockData, lastUpdated: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="verification-photo">Verification Photo (Optional)</Label>
          <Input
            id="verification-photo"
            type="file"
            accept="image/*"
            onChange={(e) => setStockData({...stockData, verificationPhoto: e.target.files?.[0] || null})}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderComplaintForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Report Issues
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="complaint-shop">Ration Shop Name</Label>
            <Input
              id="complaint-shop"
              value={complaintData.shopName}
              onChange={(e) => setComplaintData({...complaintData, shopName: e.target.value})}
              placeholder="Enter shop name"
            />
          </div>
          <div>
            <Label htmlFor="complaint-location">Location</Label>
            <Input
              id="complaint-location"
              value={complaintData.location}
              onChange={(e) => setComplaintData({...complaintData, location: e.target.value})}
              placeholder="Enter location"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="complaint-district">District</Label>
          <Input
            id="complaint-district"
            value={complaintData.district}
            onChange={(e) => setComplaintData({...complaintData, district: e.target.value})}
            placeholder="Enter district"
          />
        </div>

        <div>
          <Label htmlFor="issue-type">Issue Type</Label>
          <Select value={complaintData.issueType} onValueChange={(value) => setComplaintData({...complaintData, issueType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select issue type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stock-shortage">Stock Shortage</SelectItem>
              <SelectItem value="quality-issues">Quality Issues</SelectItem>
              <SelectItem value="overpricing">Overpricing</SelectItem>
              <SelectItem value="shop-closed">Shop Closed During Hours</SelectItem>
              <SelectItem value="corruption">Corruption/Irregularities</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={complaintData.description}
            onChange={(e) => setComplaintData({...complaintData, description: e.target.value})}
            placeholder="Describe the issue in detail..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reporter-name">Your Name</Label>
            <Input
              id="reporter-name"
              value={complaintData.reporterName}
              onChange={(e) => setComplaintData({...complaintData, reporterName: e.target.value})}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <Label htmlFor="contact-number">Contact Number</Label>
            <Input
              id="contact-number"
              value={complaintData.contactNumber}
              onChange={(e) => setComplaintData({...complaintData, contactNumber: e.target.value})}
              placeholder="Enter contact number"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Data Contribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Help keep PDS data accurate by contributing real-time information from your local ration shops.
          </p>
          
          <div className="space-y-3">
            <Label>What would you like to report?</Label>
            <div className="grid md:grid-cols-3 gap-3">
              <Button
                variant={formType === 'stock' ? 'default' : 'outline'}
                onClick={() => setFormType('stock')}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Stock Levels
              </Button>
              <Button
                variant={formType === 'complaints' ? 'default' : 'outline'}
                onClick={() => setFormType('complaints')}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Issues/Complaints
              </Button>
              <Button
                variant={formType === 'other' ? 'default' : 'outline'}
                onClick={() => setFormType('other')}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Shop Information
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {formType === 'stock' && renderStockForm()}
      {formType === 'complaints' && renderComplaintForm()}

      {formType && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? "Submitting..." : "Submit Data"}
          </Button>
        </div>
      )}

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800">Data Verification</h4>
              <p className="text-sm text-blue-700 mt-1">
                All community-contributed data goes through a verification process. Multiple reports from different users help ensure accuracy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Community Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium">Stock Report - Rajaji Nagar Shop</p>
                  <p className="text-sm text-gray-600">Chennai, Tamil Nadu</p>
                </div>
              </div>
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                2 hours ago
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="font-medium">Quality Issue - Block 15 Shop</p>
                  <p className="text-sm text-gray-600">Lucknow, Uttar Pradesh</p>
                </div>
              </div>
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                5 hours ago
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
