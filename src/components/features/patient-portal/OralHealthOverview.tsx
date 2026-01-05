
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useOralHealthMetrics } from "@/hooks/use-supabase-data";
import { Skeleton } from "@/components/ui/skeleton";

const OralHealthOverview = () => {
  const { metrics, loading } = useOralHealthMetrics();

  const getMetricConfig = (type: string, value: string) => {
    const configs: Record<string, Record<string, { color: string; width: string; label: string }>> = {
      cavity_risk: {
        low: { color: 'text-green-600', width: 'w-1/4', label: 'Low' },
        medium: { color: 'text-amber-600', width: 'w-1/2', label: 'Medium' },
        high: { color: 'text-red-600', width: 'w-3/4', label: 'High' }
      },
      gum_health: {
        poor: { color: 'text-red-600', width: 'w-1/4', label: 'Poor' },
        fair: { color: 'text-amber-600', width: 'w-1/2', label: 'Fair' },
        good: { color: 'text-green-600', width: 'w-3/4', label: 'Good' },
        excellent: { color: 'text-green-600', width: 'w-full', label: 'Excellent' }
      },
      plaque_level: {
        low: { color: 'text-green-600', width: 'w-1/4', label: 'Low' },
        medium: { color: 'text-amber-600', width: 'w-1/2', label: 'Medium' },
        high: { color: 'text-red-600', width: 'w-3/4', label: 'High' }
      }
    };
    return configs[type]?.[value] || { color: 'text-muted-foreground', width: 'w-0', label: 'N/A' };
  };

  const cavityConfig = getMetricConfig('cavity_risk', metrics?.cavity_risk);
  const gumConfig = getMetricConfig('gum_health', metrics?.gum_health);
  const plaqueConfig = getMetricConfig('plaque_level', metrics?.plaque_level);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Oral Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Oral Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No health metrics available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Oral Health Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Cavity Risk</span>
              <span className={`font-medium ${cavityConfig.color}`}>{cavityConfig.label}</span>
            </div>
            <div className="h-2 bg-muted rounded overflow-hidden">
              <div className={`h-full bg-amber-500 ${cavityConfig.width}`} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Gum Health</span>
              <span className={`font-medium ${gumConfig.color}`}>{gumConfig.label}</span>
            </div>
            <div className="h-2 bg-muted rounded overflow-hidden">
              <div className={`h-full bg-green-500 ${gumConfig.width}`} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Plaque Level</span>
              <span className={`font-medium ${plaqueConfig.color}`}>{plaqueConfig.label}</span>
            </div>
            <div className="h-2 bg-muted rounded overflow-hidden">
              <div className={`h-full bg-green-500 ${plaqueConfig.width}`} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OralHealthOverview;
