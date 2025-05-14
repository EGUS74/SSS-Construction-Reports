"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Construction, GanttChartSquare } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProjectManagementPage() {
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
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <Briefcase className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Project Management</CardTitle>
          <CardDescription className="text-md">
            This section is under development.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4 py-8">
          <Construction className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-lg text-muted-foreground">
            Future features will include project creation, resource allocation, timeline tracking, and budget management.
          </p>
          <GanttChartSquare className="mx-auto h-10 w-10 text-accent" />
        </CardContent>
      </Card>
    </div>
  );
}
