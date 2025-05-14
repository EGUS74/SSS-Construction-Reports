
"use client";

import Link from "next/link";
import { Building, UserCircle, Wifi, WifiOff, LogOut, Loader2, Lock, Clock, PanelLeft, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/contexts/AppContext";
import type { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  const { role, setRole, isOffline, isLoading } = useAppContext();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // For "Last Synced" - using current time as a placeholder
    const updateTime = () => setCurrentTime(format(new Date(), "h:mm a"));
    updateTime(); // Set initial time immediately
    const timer = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);


  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === "foreman") {
      router.push("/foreman/dashboard");
    } else if (newRole === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  const handleLogout = () => {
    setRole(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <SidebarTrigger className="h-8 w-8 md:h-9 md:w-9" />
      <Link href={role === "foreman" ? "/foreman/dashboard" : role === "admin" ? "/admin/dashboard" : "/"} className="flex items-center gap-2 text-lg font-semibold md:text-base flex-shrink-0">
        <Building className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg md:text-xl text-primary truncate hidden sm:inline">PipeLine Daily</span>
        <span className="font-bold text-lg text-primary truncate sm:hidden">PLD</span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {isLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground" title="Last synced with server">
          <Clock className="h-4 w-4" />
          <span>{currentTime || "Loading..."}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 text-green-500" title="Secure Connection" />
          <div className="flex items-center gap-1" title={isOffline ? "Offline Mode" : "Online Mode"}>
            {isOffline ? <WifiOff className="h-5 w-5 text-destructive" /> : <Wifi className="h-5 w-5 text-green-500" />}
            <span>{isOffline ? "Offline" : "Online"}</span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="User account menu">
              <Avatar>
                {/* <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" /> */}
                <AvatarFallback>
                  <CircleUserRound className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account ({role || "Not Logged In"})</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleRoleChange("foreman")} disabled={role === "foreman"}>
              Login as Foreman
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleChange("admin")} disabled={role === "admin"}>
              Login as Admin/PM
            </DropdownMenuItem>
            {role && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
