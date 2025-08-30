/**
 * Analytics Dashboard Component
 * DSGVO-konforme Analytics Visualisierung für FlowCraft
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsData {
  summary: {
    totalEvents: number;
    messagesSent: number;
    messagesReceived: number;
    botsCreated: number;
    flowsCompleted: number;
    errors: number;
    period: number;
  };
  dailyStats: Array<{
    date: string;
    events: number;
    messages_sent: number;
    messages_received: number;
  }>;
  topBots: Array<{
    botId: string;
    activity_count: number;
    messages_sent: number;
  }>;
}

interface AnalyticsDashboardProps {
  userId?: string;
  days?: number;
}

export default function AnalyticsDashboard({ 
  userId, 
  days = 30 
}: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?type=dashboard&days=${days}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError('Fehler beim Laden der Analytics-Daten');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-red-600 text-center">
            <p className="font-medium">Analytics nicht verfügbar</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={fetchAnalytics}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Erneut versuchen
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return null;
  }

  const { summary, dailyStats, topBots } = analytics;

  // Calculate trends (simple comparison with previous period)
  const getGrowthIndicator = (current: number, period: number) => {
    // This is a simplified trend indicator
    // In a real implementation, you'd compare with previous period
    const dailyAverage = current / period;
    return dailyAverage > 10 ? '📈' : dailyAverage > 5 ? '📊' : '📉';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nachrichten gesendet
            </CardTitle>
            <span className="text-2xl">📤</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.messagesSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {getGrowthIndicator(summary.messagesSent, summary.period)} Letzte {summary.period} Tage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nachrichten erhalten
            </CardTitle>
            <span className="text-2xl">📥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.messagesReceived.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {getGrowthIndicator(summary.messagesReceived, summary.period)} Letzte {summary.period} Tage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Flows abgeschlossen
            </CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.flowsCompleted.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {getGrowthIndicator(summary.flowsCompleted, summary.period)} Conversion Rate: {
                summary.messagesReceived > 0 
                  ? ((summary.flowsCompleted / summary.messagesReceived) * 100).toFixed(1)
                  : 0
              }%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bots erstellt
            </CardTitle>
            <span className="text-2xl">🤖</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.botsCreated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.errors > 0 ? '⚠️' : '✅'} {summary.errors} Fehler
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tägliche Aktivität</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyStats.slice(0, 7).map((day, index) => (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('de-DE', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((day.messages_sent / Math.max(...dailyStats.map(d => d.messages_sent))) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm">
                      📤 {day.messages_sent} gesendet
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((day.messages_received / Math.max(...dailyStats.map(d => d.messages_received))) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm">
                      📥 {day.messages_received} erhalten
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Bots */}
      {topBots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Bots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBots.map((bot, index) => (
                <div key={bot.botId} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-sm font-bold text-amber-800">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Bot {bot.botId.slice(0, 8)}...</div>
                    <div className="text-sm text-gray-600">
                      {bot.activity_count} Aktivitäten • {bot.messages_sent} Nachrichten
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {((bot.activity_count / summary.totalEvents) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Anteil</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* DSGVO Compliance Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <span>🔒</span>
            <div>
              <div className="font-medium">DSGVO-konforme Analytics</div>
              <div className="text-sm">
                Alle Daten werden anonymisiert auf deutschen Servern gespeichert. 
                IP-Adressen werden gekürzt, keine Tracking-Cookies verwendet.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          🔄 Daten aktualisieren
        </button>
      </div>
    </div>
  );
}

