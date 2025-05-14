"use client";

import { useEffect, useState } from "react";
import { ReportCard } from "@/components/ReportCard";
import type { DailyReport } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PackageOpen } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";


// Mock data - in a real app, this would come from a database/API
const mockReports: DailyReport[] = [
  {
    id: "REP-1678886400000",
    projectId: "PJ-1023",
    gpsLocation: "Site A",
    date: "2023-03-15T00:00:00.000Z",
    weather: "Sunny, 20°C",
    manpower: "1 Foreman, 5 Laborers",
    equipmentHours: "Excavator: 8hrs",
    materialsUsed: "Pipes: 10 units",
    progressUpdates: "Laid 50m of pipe. Completed initial welding for section 1. Site clearing ongoing for section 2.",
    risksIssues: "None reported.",
    digitalSignature: "John Doe",
    timestamp: "2023-03-15T17:00:00.000Z",
    status: "Approved",
    foremanName: "John Doe",
  },
  {
    id: "REP-1678972800000",
    projectId: "PJ-1024",
    gpsLocation: "Site B",
    date: "2023-03-16T00:00:00.000Z",
    weather: "Cloudy, 18°C",
    manpower: "1 Foreman, 4 Laborers",
    equipmentHours: "Backhoe: 6hrs",
    materialsUsed: "Valves: 2 units",
    progressUpdates: "Installed 2 valves. Hydrotesting preparation for pipeline segment Alpha. Some delays due to muddy conditions.",
    risksIssues: "Minor delay due to weather.",
    digitalSignature: "John Doe",
    timestamp: "2023-03-16T18:00:00.000Z",
    status: "Reviewed",
    foremanName: "John Doe",
  },
  {
    id: "REP-1679059200000",
    projectId: "PJ-1023",
    gpsLocation: "Site A",
    date: "2023-03-17T00:00:00.000Z",
    weather: "Rainy, 15°C",
    manpower: "1 Foreman, 3 Laborers",
    equipmentHours: "Pump: 4hrs",
    materialsUsed: "Sandbags: 50",
    progressUpdates: "Site secured due to heavy rain. Minimal work on trench dewatering. All equipment stored safely.",
    risksIssues: "Work stopped due to heavy rain.",
    digitalSignature: "John Doe",
    timestamp: "2023-03-17T16:30:00.000Z",
    status: "Submitted",
    foremanName: "John Doe",
  },
];

export default function MyReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { role } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (role && role !== "foreman") {
      router.push("/"); // Redirect if not a foreman
    }
  }, [role, router]);

  const filteredReports = reports
    .filter(report => 
      report.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(report => statusFilter === "all" || report.status.toLowerCase() === statusFilter);

  if (role !== "foreman") return null;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Daily Reports</h1>
        <p className="text-muted-foreground">View and manage your submitted reports.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by Report ID or Project ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredReports.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} baseLinkPath="/foreman/my-reports" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <PackageOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" 
              ? "No reports match your current filters. Try adjusting your search or filter."
              : "You haven't submitted any reports yet, or no reports match the current criteria."
            }
          </p>
        </div>
      )}
    </div>
  );
}
