"use client";

// BotChat Pro - Analytics Dashboard
// Comprehensive analytics and reporting for bot performance

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useBots } from "@/lib/api-client";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Bot,
  Clock,
  Target,
  Activity
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalBots: number;
    activeBots: number;
    totalMessages: number;
    totalContacts: number;
    averageResponseTime: number;
    conversionRate: number;
  };
  dailyStats: Array<{
    date: string;
    messages: number;
    contacts: number;
    conversions: number;
  }>;
  topBots: Array<{
    id: string;
    name: string;
    messages: number;
    contacts: number;
    responseRate: number;
  }>;
  messageTypes: {
    text: number;
    media: number;
    interactive: number;
  };
}

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const { bots, loading } = useBots();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState("7d");
  const [selectedBotId, setSelectedBotId] = useState<string>("all");

  useEffect(() => {
    if (bots.length > 0) {
      generateMockAnalytics();
    }
  }, [bots, dateRange, selectedBotId]);

  const generateMockAnalytics = () => {
    // Generate mock analytics data based on actual bots
    const totalBots = bots.length;
    const activeBots = bots.filter(bot => bot.isActive).length;
    
    // Calculate totals from bot stats
    const totalMessages = bots.reduce((sum, bot) => sum + (bot.stats?.messages || 0), 0);
    const totalContacts = bots.reduce((sum, bot) => sum + (bot.stats?.contacts || 0), 0);
    
    // Generate daily stats for the last 7 days
    const dailyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        messages: Math.floor(Math.random() * 50) + 20,
        contacts: Math.floor(Math.random() * 20) + 5,
        conversions: Math.floor(Math.random() * 10) + 2,
      };
    });

    // Generate top bots data
    const topBots = bots.slice(0, 3).map(bot => ({
      id: bot.id,
      name: bot.name,
      messages: bot.stats?.messages || Math.floor(Math.random() * 100) + 20,
      contacts: bot.stats?.contacts || Math.floor(Math.random() * 50) + 10,
      responseRate: Math.floor(Math.random() * 30) + 70,
    }));

    setAnalyticsData({
      overview: {
        totalBots,
        activeBots,
        totalMessages,
        totalContacts,
        averageResponseTime: 2.3,
        conversionRate: 24.5,
      },
      dailyStats,
      topBots,
      messageTypes: {
        text: 75,
        media: 20,
        interactive: 5,
      },
    });
  };

  const handleExportData = () => {
    if (!analyticsData) return;
    
    const csvData = [
      ['Datum', 'Nachrichten', 'Kontakte', 'Conversions'],
      ...analyticsData.dailyStats.map(day => [
        day.date, day.messages.toString(), day.contacts.toString(), day.conversions.toString()
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `botchat-analytics-${dateRange}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Lade Analytics...</span>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Daten verfügbar</h3>
        <p className="text-gray-600">Erstellen Sie zunächst einen Bot, um Analytics zu sehen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">
            Bot Performance und Benutzer-Insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1d">Letzter Tag</option>
            <option value="7d">Letzte 7 Tage</option>
            <option value="30d">Letzter Monat</option>
            <option value="90d">Letzte 3 Monate</option>
          </select>

          {/* Bot Filter */}
          <select
            value={selectedBotId}
            onChange={(e) => setSelectedBotId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Alle Bots</option>
            {bots.map(bot => (
              <option key={bot.id} value={bot.id}>{bot.name}</option>
            ))}
          </select>

          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Aktive Bots"
          value={analyticsData.overview.activeBots}
          change={`${analyticsData.overview.totalBots} insgesamt`}
          changeType="neutral"
          icon={Bot}
          description="Bots in Betrieb"
        />
        <StatsCard
          title="Nachrichten heute"
          value={analyticsData.overview.totalMessages}
          change="+23%"
          changeType="positive"
          icon={MessageSquare}
          description="Gesendete & empfangene"
        />
        <StatsCard
          title="Eindeutige Kontakte"
          value={analyticsData.overview.totalContacts}
          change="+12 diese Woche"
          changeType="positive"
          icon={Users}
          description="WhatsApp Kontakte"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${analyticsData.overview.conversionRate}%`}
          change="+5.2%"
          changeType="positive"
          icon={Target}
          description="Lead zu Kunde"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <StatsCard
          title="Ø Antwortzeit"
          value={`${analyticsData.overview.averageResponseTime}s`}
          change="-0.5s"
          changeType="positive"
          icon={Clock}
          description="Durchschnittliche Bot-Antwortzeit"
        />
        <StatsCard
          title="Bot Verfügbarkeit"
          value="99.8%"
          change="+0.2%"
          changeType="positive"
          icon={Activity}
          description="Uptime der letzten 30 Tage"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tägliche Aktivität</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Letzte 7 Tage</span>
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {analyticsData.dailyStats.map((day, index) => (
              <div key={day.date} className="flex items-center space-x-3">
                <div className="w-16 text-xs text-gray-500">
                  {new Date(day.date).toLocaleDateString('de-DE', { weekday: 'short' })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(day.messages / 100) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{day.messages}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Bots */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Bots</h3>
          <div className="space-y-4">
            {analyticsData.topBots.map((bot, index) => (
              <div key={bot.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-sm font-medium text-blue-700">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{bot.name}</p>
                    <p className="text-sm text-gray-500">{bot.messages} Nachrichten</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{bot.responseRate}%</p>
                  <p className="text-xs text-gray-500">Antwortrate</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Types Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nachrichtentypen</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 rounded-lg bg-blue-50">
            <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{analyticsData.messageTypes.text}%</p>
            <p className="text-sm text-blue-700">Text Nachrichten</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-50">
            <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{analyticsData.messageTypes.media}%</p>
            <p className="text-sm text-green-700">Media Nachrichten</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-50">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{analyticsData.messageTypes.interactive}%</p>
            <p className="text-sm text-purple-700">Interaktive Buttons</p>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg border border-green-200 bg-green-50">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900">Top Performance</span>
            </div>
            <p className="text-sm text-green-800">
              Ihre Bots haben eine überdurchschnittliche Antwortrate von 85%. 
              Besonders der Kundenservice Bot performt sehr gut.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Optimierungsvorschlag</span>
            </div>
            <p className="text-sm text-yellow-800">
              Aktivitätsspitzen zwischen 10-12 Uhr und 14-16 Uhr. 
              Erwägen Sie zusätzliche Bot-Kapazitäten in diesen Zeiten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
