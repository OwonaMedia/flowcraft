"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check for demo mode or redirect to demo page if not authenticated
  if (status === "unauthenticated") {
    // Check if this is demo mode
    if (typeof window !== "undefined") {
      const isDemoMode = window.location.search.includes("demo=true") || 
                        window.location.pathname.startsWith("/demo") ||
                        localStorage.getItem("demo-mode") === "true";
      
      if (!isDemoMode) {
        redirect("/demo");
        return null;
      }
    } else {
      redirect("/demo");
      return null;
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
