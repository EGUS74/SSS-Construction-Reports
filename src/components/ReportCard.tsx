"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ListChecks, User, Tag, CheckCircle, AlertTriangle, Timer, Eye } from "lucide-react";
import type { DailyReport } from "@/types";
import { format, parseISO } from "date-fns";

interface ReportCardProps {
  report: DailyReport;
  baseLinkPath: string; // e.g., "/foreman/my-reports" or "/admin/all-reports"
}

export function ReportCard({ report, baseLinkPath }: ReportCardProps) {
  const getStatusIcon = (status: DailyReport["status"]) => {
    switch (status) {
      case "Submitted":
        return <Timer className="h-4 w-4 text-yellow-500" />;
      case "Reviewed":
        return <Eye className="h-4 w-4 text-blue-500" />;
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Rejected":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <ListChecks className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">Report: {report.id.substring(0,8)}...</CardTitle>
          <div className="flex items-center gap-2 text-sm px-2 py-1 rounded-full bg-muted">
            {getStatusIcon(report.status)}
            <span>{report.status}</span>
          </div>
        </div>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Tag className="h-4 w-4" /> Project ID: {report.projectId}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>Date: {format(parseISO(report.date), "PPP")}</span>
        </div>
        {report.foremanName && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span>Foreman: {report.foremanName}</span>
          </div>
        )}
        <p className="text-muted-foreground truncate">
          Progress: {report.progressUpdates.substring(0, 100)}{report.progressUpdates.length > 100 ? "..." : ""}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`${baseLinkPath}/${report.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
