"use client";

import { useSession } from "next-auth/react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Plus,
  Zap
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  // Demo data - later from real API/Database
  const stats = [
    {
      title: "Aktive Workflows",
      value: 3,
      change: "+2 diese Woche",
      changeType: "positive" as const,
      icon: Wrench,
      description: "Automatisierte Workflows aktiv"
    },
    {
      title: "Nachrichten heute",
      value: 127,
      change: "+23%",
      changeType: "positive" as const,
      icon: MessageSquare,
      description: "Gesendete & empfangene Nachrichten"
    },
    {
      title: "Kontakte",
      value: 89,
      change: "+12 diese Woche",
      changeType: "positive" as const,
      icon: Users,
      description: "Eindeutige WhatsApp Kontakte"
    },
    {
      title: "Conversion Rate",
      value: "24%",
      change: "+5.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Lead zu Kunde Conversion"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Willkommen zurück, {session?.user?.name?.split(' ')[0] || 'Meister'}! 👋
          </h1>
          <p className="text-gray-600">
            Hier ist dein FlowCraft Studio Dashboard für heute.
          </p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700">
          <Plus className="mr-2 h-4 w-4" />
          Neuen Workflow erstellen
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Bot Builder */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Wrench className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Flow Builder</h3>
              <p className="text-sm text-gray-600">Visual Workflow Editor</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Erschaffe deinen ersten Workflow in unter 5 Minuten.
          </p>
          <Button variant="outline" className="mt-4 w-full">
            Flow Builder öffnen
          </Button>
        </div>

        {/* Templates */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Vorlagen</h3>
              <p className="text-sm text-gray-600">50+ Branchen Templates</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Starte mit meisterhaften Workflow-Vorlagen für deine Branche.
          </p>
          <Button variant="outline" className="mt-4 w-full">
            Vorlagen durchsuchen
          </Button>
        </div>

        {/* Analytics */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">Real-time Insights</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Verfolge Performance und optimiere deine Workflows.
          </p>
          <Button variant="outline" className="mt-4 w-full">
            Analytics anzeigen
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Letzte Aktivität</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                action: "Neuen Workflow 'Kundenservice' erschaffen",
                time: "vor 2 Stunden",
                status: "success"
              },
              {
                action: "127 Nachrichten versendet",
                time: "vor 4 Stunden", 
                status: "info"
              },
              {
                action: "Multi-Channel API verbunden",
                time: "vor 1 Tag",
                status: "success"
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`h-2 w-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
