
"use client";

import Link from "next/link";
import { Building, Wifi, WifiOff, LogOut, Loader2, Lock, Clock, CircleUserRound, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppContext } from "@/contexts/AppContext";
import type { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export function Header() {
  const { role, setRole, isOffline, isLoading } = useAppContext();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [lastSynced, setLastSynced] = useState<string>("Just now"); // Mocked

  useEffect(() => {
    const updateTime = () => setCurrentTime(format(new Date(), "h:mm a"));
    updateTime(); 
    const timer = setInterval(updateTime, 60000); 
    // Mock last synced time update
    const syncTimer = setInterval(() => setLastSynced(format(new Date(), "h:mm:ss a")), 300000); // Sync every 5 mins
    return () => {
      clearInterval(timer);
      clearInterval(syncTimer);
    };
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
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
      
      <Link 
        href={role === "foreman" ? "/foreman/dashboard" : role === "admin" ? "/admin/dashboard" : "/"} 
        className="flex items-center gap-2 text-lg font-semibold md:text-base flex-shrink-0"
        aria-label="Go to dashboard"
      >
        <Building className="h-6 w-6 text-primary" />
        <span className="font-bold text-primary truncate hidden md:inline text-lg md:text-xl">QA Daily Report</span>
        <span className="font-bold text-primary truncate md:hidden text-lg">QADR</span>
      </Link>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        {isLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        
        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground" title="Current time">
          <Clock className="h-4 w-4" />
          <span>{currentTime || "Loading..."}</span>
        </div>

        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground" title={`Last synced: ${lastSynced}`}>
           {/* Could add a sync icon here if needed */}
           <span>Synced: {lastSynced}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <Lock className="h-4 w-4 text-green-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Secure Connection</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                {isOffline ? <WifiOff className="h-5 w-5 text-destructive" /> : <Wifi className="h-5 w-5 text-green-500" />}
                <span className="hidden sm:inline">{isOffline ? "Offline" : "Online"}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isOffline ? "Offline Mode" : "Online Mode"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="User account menu">
              <Avatar className="h-8 w-8 md:h-9 md:w-9">
                <AvatarFallback>
                  <CircleUserRound className="h-5 w-5 md:h-6 md:h-6" />
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
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
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
