"use client";

// FlowCraft - Workflow Management Page
// Overview of all user workflows with creation and management options

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useBots } from "@/lib/api-client";
import { 
  Wrench, 
  Plus, 
  Edit, 
  Play, 
  Pause, 
  Trash2, 
  MessageSquare,
  Users,
  BarChart3,
  Copy,
  Settings
} from "lucide-react";

// Mock data - later from real API
const mockWorkflows = [
  {
    id: "1",
    name: "Kundenservice Workflow",
    description: "Automatisierte Bearbeitung häufiger Kundenanfragen",
    isActive: true,
    isPublished: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    stats: {
      messages: 127,
      contacts: 45,
      conversions: 12,
    },
    category: "support",
  },
  {
    id: "2", 
    name: "Lead Generation Workflow",
    description: "Automatisierte Qualifizierung und Terminkoordination",
    isActive: false,
    isPublished: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    stats: {
      messages: 89,
      contacts: 23,
      conversions: 8,
    },
    category: "lead-gen",
  },
  {
    id: "3",
    name: "E-Commerce Automation", 
    description: "Vollautomatisierte Bestell- und Versandabwicklung",
    isActive: true,
    isPublished: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22"),
    stats: {
      messages: 234,
      contacts: 67,
      conversions: 34,
    },
    category: "e-commerce",
  },
];

export default function WorkflowsPage() {
  const { data: session } = useSession();
  const { bots: workflows, loading, error, toggleBotStatus: toggleWorkflowStatus, deleteBot: deleteWorkflowApi } = useBots();

  const handleToggleWorkflow = async (workflowId: string) => {
    try {
      const workflow = workflows.find(w => w.id === workflowId);
      if (workflow) {
        await toggleWorkflowStatus(workflowId, !workflow.isActive);
      }
    } catch (err) {
      alert("Fehler beim Ändern des Workflow-Status: " + (err instanceof Error ? err.message : "Unbekannter Fehler"));
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (confirm("Sind Sie sicher, dass Sie diesen Workflow löschen möchten?")) {
      try {
        await deleteWorkflowApi(workflowId);
      } catch (err) {
        alert("Fehler beim Löschen des Workflows: " + (err instanceof Error ? err.message : "Unbekannter Fehler"));
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'support': 'bg-blue-50 text-blue-700 border-blue-200',
      'lead-gen': 'bg-green-50 text-green-700 border-green-200', 
      'e-commerce': 'bg-purple-50 text-purple-700 border-purple-200',
      'appointment': 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Handle loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Lade Workflows...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Fehler beim Laden der Workflows: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Erneut versuchen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meine Workflows</h1>
          <p className="text-gray-600">
            Verwalten Sie Ihre intelligenten Workflows und deren Performance
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Workflow importieren
          </Button>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/dashboard/bots/new">
              <Plus className="mr-2 h-4 w-4" />
              Neuen Workflow erstellen
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-2">
            <Wrench className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-gray-600">Aktive Workflows</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {workflows.filter(workflow => workflow.isActive).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Nachrichten heute</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {workflows.reduce((sum, workflow) => sum + (workflow.stats?.messages || 0), 0)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Kontakte</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {workflows.reduce((sum, workflow) => sum + (workflow.stats?.contacts || 0), 0)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Conversions</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {workflows.reduce((sum, workflow) => sum + (workflow.stats?.conversions || 0), 0)}
          </p>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Workflow Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  workflow.isActive ? 'bg-amber-50' : 'bg-gray-50'
                }`}>
                  <Wrench className={`h-5 w-5 ${
                    workflow.isActive ? 'text-amber-600' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                    Workflow
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`h-2 w-2 rounded-full ${
                  workflow.isActive ? 'bg-amber-500' : 'bg-gray-300'
                }`} />
                <span className="text-xs text-gray-500">
                  {workflow.isActive ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
            </div>

            {/* Workflow Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {workflow.description}
            </p>

            {/* Workflow Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900">{workflow.stats?.messages || 0}</p>
                <p className="text-xs text-gray-500">Nachrichten</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{workflow.stats?.contacts || 0}</p>
                <p className="text-xs text-gray-500">Kontakte</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{workflow.stats?.conversions || 0}</p>
                <p className="text-xs text-gray-500">Conversions</p>
              </div>
            </div>

            {/* Workflow Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleToggleWorkflow(workflow.id)}
                  className="flex items-center space-x-1"
                >
                  {workflow.isActive ? (
                    <>
                      <Pause className="h-3 w-3" />
                      <span>Pausieren</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" />
                      <span>Starten</span>
                    </>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  asChild
                >
                  <Link href={`/dashboard/bots/${workflow.id}/edit`}>
                    <Edit className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  asChild
                >
                  <Link href={`/dashboard/bots/${workflow.id}/analytics`}>
                    <BarChart3 className="h-3 w-3" />
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDeleteWorkflow(workflow.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-3 text-xs text-gray-400">
              Zuletzt bearbeitet: {new Date(workflow.updatedAt).toLocaleDateString('de-DE')}
            </div>
          </div>
        ))}

        {/* Create New Workflow Card */}
        <Link 
          href="/dashboard/bots/new"
          className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:border-amber-400 hover:bg-amber-50 transition-colors"
        >
          <div className="text-center">
            <Plus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Neuen Workflow erstellen
            </h3>
            <p className="text-sm text-gray-600">
              Erschaffen Sie mit einer Vorlage oder von Grund auf neu
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
