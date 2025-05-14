
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus2,
  ListChecks,
  Briefcase,
  Users,
  Settings,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserRole } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { href: "/foreman/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["foreman"] },
  { href: "/foreman/new-report", label: "Daily Log", icon: FilePlus2, roles: ["foreman"] },
  { href: "/foreman/my-reports", label: "My Reports", icon: ListChecks, roles: ["foreman"] },
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["admin"] },
  { href: "/admin/all-reports", label: "All Reports", icon: ListChecks, roles: ["admin"] },
  { href: "/admin/project-management", label: "Project Mgmt", icon: Briefcase, roles: ["admin"] },
  { href: "/admin/user-management", label: "User Mgmt", icon: Users, roles: ["admin"] },
];

interface SidebarNavProps {
  role: UserRole;
  className?: string;
}

export function SidebarNav({ role, className }: SidebarNavProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  if (!role) {
    return null; // Don't render sidebar if no role is set (e.g. on login page)
  }

  return (
    <ScrollArea className={cn("h-full", className)}>
      <nav className="flex flex-col gap-2 p-4">
        {filteredNavItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="mt-auto p-4">
         <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-5 w-5" />
            Settings
        </Button>
      </div>
    </ScrollArea>
  );
}
