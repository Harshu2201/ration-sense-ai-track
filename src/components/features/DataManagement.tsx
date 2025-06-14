
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Database, Users, Download, TrendingUp, BarChart3, Bell, MessageCircle, Phone } from "lucide-react";
import { DataImport } from "./data-management/DataImport";
import { CommunityData } from "./data-management/CommunityData";
import { DataExport } from "./data-management/DataExport";
import { MacroTrends } from "./data-management/MacroTrends";
import { StockForecasting } from "./data-management/StockForecasting";
import { AlertManagement } from "./data-management/AlertManagement";
import { StockAlertCreator } from "./data-management/StockAlertCreator";
import { WhatsAppIntegration } from "./data-management/WhatsAppIntegration";
import { RationChatbot } from "./RationChatbot";

export const DataManagement = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          PDS Data Management
        </h1>
        <p className="text-lg text-gray-600">
          Import official government datasets, manage community-contributed data, analyze macro-level trends, predict stock arrivals, manage user alerts, and enable crowdsourced data collection
        </p>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Data Import
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Community Data
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Macro Trends
          </TabsTrigger>
          <TabsTrigger value="forecasting" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Stock Forecasting
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alert System
          </TabsTrigger>
          <TabsTrigger value="chatbot" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import">
          <DataImport />
        </TabsContent>

        <TabsContent value="community">
          <CommunityData />
        </TabsContent>

        <TabsContent value="whatsapp">
          <WhatsAppIntegration />
        </TabsContent>

        <TabsContent value="trends">
          <MacroTrends />
        </TabsContent>

        <TabsContent value="forecasting">
          <StockForecasting />
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-6">
            <StockAlertCreator />
            <AlertManagement />
          </div>
        </TabsContent>

        <TabsContent value="chatbot">
          <RationChatbot />
        </TabsContent>

        <TabsContent value="export">
          <DataExport />
        </TabsContent>
      </Tabs>
    </div>
  );
};
