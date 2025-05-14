"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, ShieldCheck, UserCheck } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

export default function RoleSelectionPage() {
  const { role, setRole } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (role === "foreman") {
      router.replace("/foreman/dashboard");
    } else if (role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [role, router]);

  const handleSelectRole = (selectedRole: "foreman" | "admin") => {
    setRole(selectedRole);
  };

  if (role) {
    // Prevent flash of content if role is already set and redirecting
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Building className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">PipeLine Daily</CardTitle>
          <CardDescription className="text-md">
            Select your role to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <Button
            onClick={() => handleSelectRole("foreman")}
            className="w-full text-lg py-6 bg-primary hover:bg-primary/90"
            size="lg"
          >
            <UserCheck className="mr-2 h-6 w-6" />
            Login as Foreman
          </Button>
          <Button
            onClick={() => handleSelectRole("admin")}
            className="w-full text-lg py-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            size="lg"
          >
            <ShieldCheck className="mr-2 h-6 w-6" />
            Login as Admin / PM
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
