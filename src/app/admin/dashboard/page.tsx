"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Bell, Briefcase, Users, PieChart, AlertCircle } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


// Mock data
const overviewData = {
  pendingReview: 5,
  approvedToday: 2,
  totalProjects: 12,
  activeForemen: 8,
};

const reportStatusData = [
  { name: "Submitted", count: 5, fill: "hsl(var(--chart-1))" },
  { name: "Reviewed", count: 3, fill: "hsl(var(--chart-2))"  },
  { name: "Approved", count: 15, fill: "hsl(var(--chart-3))"  },
  { name: "Rejected", count: 1, fill: "hsl(var(--chart-4))"  },
];

const criticalIssuesData = [
    { id: "REP-123", project: "PJ-ALPHA", issue: "Safety concern: unstable trench wall" },
    { id: "REP-456", project: "PJ-BETA", issue: "Major equipment failure, ETA for fix 2 days" },
];


export default function AdminDashboard() {
  const { role } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (role && role !== "admin") {
      router.push("/"); // Redirect if not admin
    }
  }, [role, router]);

  if (role !== "admin") return null;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of all project reporting activities.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Pending Review</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{overviewData.pendingReview}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.approvedToday}</div>
            <p className="text-xs text-muted-foreground">Productivity on track.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.totalProjects}</div>
            <p className="text-xs text-muted-foreground">Across all sites.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Foremen</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.activeForemen}</div>
            <p className="text-xs text-muted-foreground">Currently submitting reports.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><PieChart className="h-5 w-5 mr-2 text-primary" /> Report Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportStatusData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-destructive"><AlertCircle className="h-5 w-5 mr-2" /> Critical Issues Overview</CardTitle>
            <CardDescription>Recent high-priority risks or issues reported.</CardDescription>
          </CardHeader>
          <CardContent>
            {criticalIssuesData.length > 0 ? (
                <ul className="space-y-3">
                {criticalIssuesData.map(issue => (
                    <li key={issue.id} className="p-3 border rounded-md bg-destructive/10">
                        <p className="font-semibold text-destructive">{issue.project}: <span className="font-normal text-foreground">{issue.issue}</span></p>
                        <Link href={`/admin/all-reports/${issue.id}`} className="text-xs text-primary hover:underline">View Report {issue.id}</Link>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-muted-foreground">No critical issues reported recently.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="flex flex-col items-center justify-center p-6 text-center hover:shadow-lg transition-shadow">
            <ListChecks className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="mb-2 text-xl">Review All Reports</CardTitle>
            <CardDescription className="mb-4">Access and manage all submitted daily reports.</CardDescription>
            <Button asChild size="lg">
              <Link href="/admin/all-reports">All Reports</Link>
            </Button>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 text-center hover:shadow-lg transition-shadow">
            <Briefcase className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="mb-2 text-xl">Project Management</CardTitle>
            <CardDescription className="mb-4">Oversee projects, timelines, and resources.</CardDescription>
            <Button asChild variant="outline" size="lg">
              <Link href="/admin/project-management">Manage Projects</Link>
            </Button>
        </Card>
         <Card className="flex flex-col items-center justify-center p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="mb-2 text-xl">User Management</CardTitle>
            <CardDescription className="mb-4">Manage foreman and admin accounts.</CardDescription>
            <Button asChild variant="outline" size="lg">
              <Link href="/admin/user-management">Manage Users</Link>
            </Button>
        </Card>
      </div>
    </div>
  );
}

// Helper component for check mark, not used in current shadcn bar chart
const CheckCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);
