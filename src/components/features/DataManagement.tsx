
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Database, Users, Download, TrendingUp } from "lucide-react";
import { DataImport } from "./data-management/DataImport";
import { CommunityData } from "./data-management/CommunityData";
import { DataExport } from "./data-management/DataExport";
import { MacroTrends } from "./data-management/MacroTrends";

export const DataManagement = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          PDS Data Management
        </h1>
        <p className="text-lg text-gray-600">
          Import official government datasets, manage community-contributed data, and analyze macro-level trends
        </p>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Data Import
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Community Data
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Macro Trends
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

        <TabsContent value="trends">
          <MacroTrends />
        </TabsContent>

        <TabsContent value="export">
          <DataExport />
        </TabsContent>
      </Tabs>
    </div>
  );
};
