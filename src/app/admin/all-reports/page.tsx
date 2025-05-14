"use client";

import { useEffect, useState } from "react";
import { ReportCard } from "@/components/ReportCard";
import type { DailyReport } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PackageOpen, Users } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";

// Mock data - in a real app, this would come from a database/API
const mockReports: DailyReport[] = [
  {
    id: "REP-1678886400000", projectId: "PJ-1023", gpsLocation: "Site A", date: "2023-03-15T00:00:00.000Z", weather: "Sunny, 20°C", manpower: "1 Foreman, 5 Laborers", equipmentHours: "Excavator: 8hrs", materialsUsed: "Pipes: 10 units", progressUpdates: "Laid 50m of pipe.", risksIssues: "None reported.", digitalSignature: "John Doe", timestamp: "2023-03-15T17:00:00.000Z", status: "Approved", foremanName: "John Doe",
  },
  {
    id: "REP-1678972800000", projectId: "PJ-1024", gpsLocation: "Site B", date: "2023-03-16T00:00:00.000Z", weather: "Cloudy, 18°C", manpower: "1 Foreman, 4 Laborers", equipmentHours: "Backhoe: 6hrs", materialsUsed: "Valves: 2 units", progressUpdates: "Installed 2 valves.", risksIssues: "Minor delay due to weather.", digitalSignature: "John Doe", timestamp: "2023-03-16T18:00:00.000Z", status: "Reviewed", foremanName: "John Doe",
  },
  {
    id: "REP-1679059200000", projectId: "PJ-1023", gpsLocation: "Site A", date: "2023-03-17T00:00:00.000Z", weather: "Rainy, 15°C", manpower: "1 Foreman, 3 Laborers", equipmentHours: "Pump: 4hrs", materialsUsed: "Sandbags: 50", progressUpdates: "Work stopped due to heavy rain.", risksIssues: "Work stopped due to heavy rain.", digitalSignature: "Jane Smith", timestamp: "2023-03-17T16:30:00.000Z", status: "Submitted", foremanName: "Jane Smith",
  },
   {
    id: "REP-1679145600000", projectId: "PJ-1025", gpsLocation: "Site C", date: "2023-03-18T00:00:00.000Z", weather: "Sunny, 22°C", manpower: "1 Foreman, 6 Laborers", equipmentHours: "Bulldozer: 7hrs", materialsUsed: "Geotextile: 100sqm", progressUpdates: "Site grading completed for staging area.", risksIssues: "None reported.", digitalSignature: "Mike Brown", timestamp: "2023-03-18T17:45:00.000Z", status: "Submitted", foremanName: "Mike Brown",
  },
];

const MOCK_FOREMEN = ["John Doe", "Jane Smith", "Mike Brown", "All Foremen"];

export default function AllReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [foremanFilter, setForemanFilter] = useState("All Foremen");
  const { role } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (role && role !== "admin") {
      router.push("/"); // Redirect if not admin
    }
  }, [role, router]);

  const filteredReports = reports
    .filter(report => 
      report.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.foremanName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(report => statusFilter === "all" || report.status.toLowerCase() === statusFilter)
    .filter(report => foremanFilter === "All Foremen" || report.foremanName === foremanFilter);
  
  if (role !== "admin") return null;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Daily Reports</h1>
        <p className="text-muted-foreground">Review and manage reports from all foremen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Search by ID, Project, Foreman..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:col-span-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
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
        <Select value={foremanFilter} onValueChange={setForemanFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by foreman" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_FOREMEN.map(name => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredReports.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} baseLinkPath="/admin/all-reports" />
          ))}
        </div>
      ) : (
         <div className="text-center py-12">
          <PackageOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" || foremanFilter !== "All Foremen"
              ? "No reports match your current filters. Try adjusting your search or filters."
              : "There are no reports in the system yet, or no reports match the current criteria."
            }
          </p>
        </div>
      )}
    </div>
  );
}
