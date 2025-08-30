"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Wrench, 
  BarChart3, 
  Settings, 
  MessageSquare, 
  Users, 
  CreditCard,
  HelpCircle,
  Zap
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Meine Workflows",
    href: "/dashboard/bots",
    icon: Wrench,
  },
  {
    title: "Nachrichten",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Kontakte",
    href: "/dashboard/contacts",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Einstellungen",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Hilfe",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">FlowCraft</span>
            <span className="text-xs text-gray-500">Studio</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-amber-50 text-amber-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "text-amber-700" : "text-gray-400"
              )} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      <div className="m-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              Upgrade auf Meister
            </p>
            <p className="text-xs text-white/80">
              Unbegrenzte Workflows & AI
            </p>
          </div>
        </div>
        <button className="mt-2 w-full rounded-md bg-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/30 transition-colors">
          Jetzt upgraden
        </button>
      </div>
    </div>
  );
}
