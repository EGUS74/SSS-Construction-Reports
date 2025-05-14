
"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { useAppContext } from "@/contexts/AppContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip"; // Added for settings icon tooltip

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
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-4 sm:px-6 md:gap-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
