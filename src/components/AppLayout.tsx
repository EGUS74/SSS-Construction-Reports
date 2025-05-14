
"use client";

import type { ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Header } from "@/components/Header";
import { SidebarNav } from "@/components/SidebarNav";
import { useAppContext } from "@/contexts/AppContext";
import { Toaster } from "@/components/ui/toaster";
import { Building } from "lucide-react";
import Link from "next/link";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { role } = useAppContext();

  // Do not render full layout if no role (e.g., on initial role selection page)
  if (!role) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar // Sidebar styling is handled by its own CSS variables in globals.css
          collapsible="icon"
          className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
        >
          <SidebarHeader className="p-4 flex items-center justify-between">
             <Link href={role === "foreman" ? "/foreman/dashboard" : "/admin/dashboard"} className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                <Building className="h-6 w-6 text-sidebar-primary" />
                <span className="font-semibold text-lg text-sidebar-primary">QA Daily Report</span>
             </Link>
             {/* Icon for collapsed state was here, now removed */}
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav role={role} />
          </SidebarContent>
          <SidebarFooter>
            {/* Footer content if any */}
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 sm:pl-[var(--sidebar-width-icon)] transition-[padding-left] duration-300 ease-in-out group-data-[state=expanded]/sidebar-wrapper:sm:pl-[var(--sidebar-width)]">
          <Header />
          <main className="flex-1 p-4 sm:px-6 md:gap-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
