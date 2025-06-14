
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Globe, Download, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScrapingTarget {
  id: string;
  name: string;
  url: string;
  state: string;
  dataType: string;
  lastScraped?: Date;
  status: 'active' | 'blocked' | 'error' | 'pending';
  robotsTxtAllowed: boolean;
}

interface ScrapedData {
  id: string;
  source: string;
  data: any[];
  scrapedAt: Date;
  recordCount: number;
}

export const WebScrapingUtility = () => {
  const [scrapingTargets] = useState<ScrapingTarget[]>([
    {
      id: 'tn-pds',
      name: 'Tamil Nadu PDS Portal',
      url: 'https://tnpds.gov.in',
      state: 'Tamil Nadu',
      dataType: 'Stock Reports',
      lastScraped: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'active',
      robotsTxtAllowed: true
    },
    {
      id: 'kerala-pds',
      name: 'Kerala Civil Supplies',
      url: 'https://civilsupplieskerala.gov.in',
      state: 'Kerala',
      dataType: 'Price Data',
      lastScraped: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'active',
      robotsTxtAllowed: true
    },
    {
      id: 'up-uparjan',
      name: 'UP eUparjan Portal',
      url: 'https://uparjan.up.gov.in',
      state: 'Uttar Pradesh',
      dataType: 'Procurement Data',
      status: 'pending',
      robotsTxtAllowed: false
    },
    {
      id: 'onorc-portal',
      name: 'One Nation One Ration Card',
      url: 'https://onorc.in',
      state: 'National',
      dataType: 'Card Data',
      lastScraped: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'blocked',
      robotsTxtAllowed: false
    }
  ]);

  const [selectedTarget, setSelectedTarget] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [scrapingInterval, setScrapingInterval] = useState('daily');
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData[]>([]);
  const { toast } = useToast();

  const checkRobotsTxt = async (url: string): Promise<boolean> => {
    try {
      // Simulate robots.txt check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Most government sites allow crawling, but with rate limits
      const allowedDomains = ['tnpds.gov.in', 'civilsupplieskerala.gov.in', 'data.gov.in'];
      const domain = new URL(url).hostname;
      
      return allowedDomains.some(allowed => domain.includes(allowed));
    } catch (error) {
      return false;
    }
  };

  const startScraping = async () => {
    if (!selectedTarget && !customUrl) {
      toast({
        title: "No Target Selected",
        description: "Please select a target or enter a custom URL",
        variant: "destructive"
      });
      return;
    }

    const target = scrapingTargets.find(t => t.id === selectedTarget);
    const urlToScrape = target?.url || customUrl;

    if (!urlToScrape) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid URL to scrape",
        variant: "destructive"
      });
      return;
    }

    setIsScrapingActive(true);

    try {
      // Check robots.txt first
      const robotsAllowed = await checkRobotsTxt(urlToScrape);
      
      if (!robotsAllowed) {
        toast({
          title: "Scraping Not Allowed",
          description: "robots.txt disallows scraping this site. Consider contacting them for API access.",
          variant: "destructive"
        });
        setIsScrapingActive(false);
        return;
      }

      // Simulate scraping process
      toast({
        title: "Scraping Started",
        description: `Extracting data from ${target?.name || urlToScrape}...`,
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate scraped data
      const mockScrapedData: ScrapedData = {
        id: Date.now().toString(),
        source: target?.name || 'Custom URL',
        data: generateMockScrapedData(target?.dataType || 'General'),
        scrapedAt: new Date(),
        recordCount: Math.floor(Math.random() * 500) + 100
      };

      setScrapedData(prev => [mockScrapedData, ...prev].slice(0, 10));

      toast({
        title: "Scraping Completed",
        description: `Successfully extracted ${mockScrapedData.recordCount} records`,
      });

    } catch (error) {
      toast({
        title: "Scraping Failed",
        description: "An error occurred while scraping data",
        variant: "destructive"
      });
    } finally {
      setIsScrapingActive(false);
    }
  };

  const generateMockScrapedData = (dataType: string) => {
    const baseData = {
      'Stock Reports': [
        { shop_id: 'TN001', rice_stock: 450, wheat_stock: 200, location: 'Chennai' },
        { shop_id: 'TN002', rice_stock: 380, wheat_stock: 150, location: 'Madurai' }
      ],
      'Price Data': [
        { commodity: 'Rice', price: 28.50, market: 'Kochi', date: '2024-12-15' },
        { commodity: 'Wheat', price: 32.00, market: 'Thiruvananthapuram', date: '2024-12-15' }
      ],
      'Procurement Data': [
        { district: 'Lucknow', wheat_procured: 15000, rice_procured: 8000, date: '2024-12-01' },
        { district: 'Kanpur', wheat_procured: 12000, rice_procured: 6500, date: '2024-12-01' }
      ]
    };

    return baseData[dataType as keyof typeof baseData] || [
      { id: 1, value: 'Sample data 1' },
      { id: 2, value: 'Sample data 2' }
    ];
  };

  const exportScrapedData = (dataId: string) => {
    const data = scrapedData.find(d => d.id === dataId);
    if (!data) return;

    const exportObj = {
      source: data.source,
      scraped_at: data.scrapedAt.toISOString(),
      record_count: data.recordCount,
      data: data.data
    };

    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const fileName = `scraped-${data.source.replace(/\s+/g, '-').toLowerCase()}-${data.scrapedAt.toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', fileName);
    linkElement.click();

    toast({
      title: "Export Successful",
      description: "Scraped data exported successfully",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'blocked':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Web Scraping Utility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">Ethical Scraping Guidelines</h4>
                <div className="text-sm text-yellow-700 mt-1 space-y-1">
                  <p>• Always check robots.txt before scraping</p>
                  <p>• Respect rate limits and don't overload servers</p>
                  <p>• Only scrape publicly available data</p>
                  <p>• Consider contacting site owners for API access</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target-select">Select Government Portal</Label>
              <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a portal to scrape" />
                </SelectTrigger>
                <SelectContent>
                  {scrapingTargets.map((target) => (
                    <SelectItem key={target.id} value={target.id}>
                      {target.name} ({target.state})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="custom-url">Or Enter Custom URL</Label>
              <Input
                id="custom-url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.gov.in/data"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="interval">Scraping Interval</Label>
              <Select value={scrapingInterval} onValueChange={setScrapingInterval}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={startScraping} 
                disabled={isScrapingActive}
                className="w-full"
              >
                {isScrapingActive ? "Scraping..." : "Start Scraping"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scrapingTargets.map((target) => (
              <div key={target.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(target.status)}
                  <div>
                    <p className="font-medium">{target.name}</p>
                    <p className="text-sm text-gray-600">{target.state} • {target.dataType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={target.robotsTxtAllowed ? "default" : "destructive"}>
                    {target.robotsTxtAllowed ? "Allowed" : "Blocked"}
                  </Badge>
                  {target.lastScraped && (
                    <span className="text-xs text-gray-500">
                      {target.lastScraped.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {scrapedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Scraped Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scrapedData.map((data) => (
                <div key={data.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium">{data.source}</p>
                      <p className="text-sm text-gray-600">
                        {data.recordCount} records • {data.scrapedAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportScrapedData(data.id)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
