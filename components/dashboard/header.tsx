"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Search */}
      <div className="flex flex-1 items-center space-x-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Workflows, Nachrichten, Automation suchen..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            3
          </span>
        </button>

        {/* User Menu */}
        {status === "loading" ? (
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
        ) : session?.user ? (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {session.user.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {session.user.subscriptionTier || "Free"} Plan
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div className="flex flex-col space-y-1">
                <button className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                  <Settings className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => signOut()}
                  className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Button variant="outline" size="sm">
            Anmelden
          </Button>
        )}
      </div>
    </header>
  );
}
