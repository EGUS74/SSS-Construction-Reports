
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Construction } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const { role } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!role) {
      router.push("/"); // Redirect if not logged in
    }
  }, [role, router]);

  if (!role) return null;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <Settings className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Application Settings</CardTitle>
          <CardDescription className="text-md">
            Manage your application preferences and settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6 py-10">
          <Construction className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-lg text-muted-foreground">
            This settings page is currently under construction.
          </p>
          <p className="text-sm text-muted-foreground">
            Future options might include theme selection, notification preferences, data synchronization settings, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
