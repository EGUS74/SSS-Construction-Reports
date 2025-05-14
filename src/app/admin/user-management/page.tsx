"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, UserCog, ShieldCheck } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserManagementPage() {
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
          <Users className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">User Management</CardTitle>
          <CardDescription className="text-md">
            This section is under development.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4 py-8">
          <UserCog className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-lg text-muted-foreground">
            Future functionality will allow adding new users, assigning roles (Foreman, Admin/PM), and managing permissions.
          </p>
          <div className="flex justify-center gap-4">
            <UserPlus className="h-10 w-10 text-accent" />
            <ShieldCheck className="h-10 w-10 text-accent" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
