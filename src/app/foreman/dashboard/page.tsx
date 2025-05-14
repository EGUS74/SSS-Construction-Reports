
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2, ListChecks, CheckCircle, AlertTriangle, Timer } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Mock data for summary
const summaryData = {
  reportsToday: 1,
  pendingSync: 0,
  lastReportStatus: "Submitted",
};

export default function ForemanDashboard() {
  const { role } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (role && role !== "foreman") {
      router.push("/"); // Redirect if not a foreman
    }
  }, [role, router]);
  
  if (role !== "foreman") return null; // Or a loading/access denied component

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Foreman!</h1>
        <p className="text-muted-foreground">Here's an overview of your daily reporting activity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Submitted Today</CardTitle>
            <FilePlus2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.reportsToday}</div>
            <p className="text-xs text-muted-foreground">Keep up the great work!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sync</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.pendingSync}</div>
            <p className="text-xs text-muted-foreground">Ensure you sync when online.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Report Status</CardTitle>
            {summaryData.lastReportStatus === "Submitted" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.lastReportStatus}</div>
            <p className="text-xs text-muted-foreground">Check 'My Reports' for details.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col items-center justify-center p-6 text-center hover:shadow-lg transition-shadow">
            <FilePlus2 className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="mb-2 text-xl">Create Daily Log</CardTitle>
            <CardDescription className="mb-4">Start a new daily log for your project.</CardDescription>
            <Button asChild size="lg">
              <Link href="/foreman/new-report">New Daily Log</Link>
            </Button>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 text-center hover:shadow-lg transition-shadow">
            <ListChecks className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="mb-2 text-xl">View My Reports</CardTitle>
            <CardDescription className="mb-4">Review your past submissions and their status.</CardDescription>
            <Button asChild variant="outline" size="lg">
              <Link href="/foreman/my-reports">My Reports</Link>
            </Button>
        </Card>
      </div>
    </div>
  );
}
