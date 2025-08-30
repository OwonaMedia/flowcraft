"use client";

// BotChat Pro - Handoff Node Component
// Transfers conversation to human agent

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { UserCheck } from "lucide-react";

interface HandoffNodeData {
  message: string;
  department: string;
}

export const HandoffNode = memo(({ data, selected }: NodeProps<HandoffNodeData>) => {
  const { message, department } = data;
  
  const getDepartmentLabel = (dept: string) => {
    const departments = {
      'general': 'Allgemein',
      'customer-service': 'Kundenservice',
      'technical': 'Technischer Support',
      'sales': 'Vertrieb',
      'billing': 'Rechnungswesen',
    };
    return departments[dept as keyof typeof departments] || dept;
  };

  const getDepartmentColor = (dept: string) => {
    const colors = {
      'general': 'bg-gray-100 text-gray-700 border-gray-200',
      'customer-service': 'bg-blue-100 text-blue-700 border-blue-200',
      'technical': 'bg-orange-100 text-orange-700 border-orange-200',
      'sales': 'bg-green-100 text-green-700 border-green-200',
      'billing': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };
    return colors[dept as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };
  
  return (
    <div className={`relative bg-white border-2 rounded-lg shadow-sm min-w-[200px] max-w-[280px] ${
      selected ? "border-blue-500 shadow-blue-200" : "border-red-300"
    }`}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-red-500 border-2 border-white"
      />

      {/* Node Header */}
      <div className="bg-red-50 px-3 py-2 border-b border-red-200 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <UserCheck className="h-4 w-4 text-red-600" />
          <span className="text-sm font-medium text-red-700">An Mensch weiterleiten</span>
        </div>
      </div>

      {/* Node Content */}
      <div className="p-3 space-y-3">
        {/* Handoff Message */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Nachricht:</p>
          <div className="bg-gray-50 rounded p-2 border">
            <p className="text-sm text-gray-800">
              {message || "Ich verbinde Sie mit einem Mitarbeiter..."}
            </p>
          </div>
        </div>

        {/* Department */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Abteilung:</span>
          <span className={`px-2 py-1 text-xs rounded border ${getDepartmentColor(department || 'general')}`}>
            {getDepartmentLabel(department || 'general')}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span>Beendet Bot-Konversation</span>
        </div>
      </div>

      {/* No output handle since this ends the bot flow */}
    </div>
  );
});
