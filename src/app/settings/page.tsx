
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Palette, Bell, Save } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { role } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  // Local state for settings - in a real app, this would come from user preferences/context
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    if (!role) {
      router.push("/"); // Redirect if not logged in
    }
    // In a real app, load saved settings here
    // For now, check if the body has 'dark' class for a simple dark mode check
    if (typeof window !== "undefined") {
        setIsDarkMode(document.body.classList.contains('dark'));
    }
  }, [role, router]);

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    // Basic theme toggling - for full effect, next-themes or similar provider is needed
    if (typeof window !== "undefined") {
        document.body.classList.toggle('dark', checked);
        localStorage.setItem('theme', checked ? 'dark' : 'light');
         toast({
          title: "Theme Changed",
          description: `Switched to ${checked ? 'Dark' : 'Light'} mode. Full theme persistence requires a theme provider.`,
        });
    }
  };

  const handleNotificationChange = (checked: boolean) => {
    setEmailNotifications(checked);
  };

  const handleSaveChanges = () => {
    // In a real app, save settings to a backend or localStorage
    toast({
      title: "Settings Saved (Simulated)",
      description: "Your preferences have been updated.",
    });
  };

  if (!role) return null;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Settings className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-center">Application Settings</CardTitle>
          <CardDescription className="text-md text-center">
            Manage your application preferences and settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          {/* Appearance Settings */}
          <div className="space-y-4 p-4 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold flex items-center">
              <Palette className="mr-2 h-5 w-5 text-primary" />
              Appearance
            </h3>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="theme-mode" className="text-base">
                Dark Mode
              </Label>
              <Switch
                id="theme-mode"
                checked={isDarkMode}
                onCheckedChange={handleThemeChange}
                aria-label="Toggle dark mode"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Toggle between light and dark themes for the application. (Note: Full theme persistence requires a dedicated theme provider setup.)
            </p>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4 p-4 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              Notifications
            </h3>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="email-notifications" className="text-base">
                Enable Email Notifications
              </Label>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={handleNotificationChange}
                aria-label="Toggle email notifications"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Receive email updates for important events (e.g., report status changes). (This is a placeholder setting).
            </p>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveChanges} size="lg">
              <Save className="mr-2 h-5 w-5" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
