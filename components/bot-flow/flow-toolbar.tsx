"use client";

// BotChat Pro - Flow Editor Toolbar
// Node palette and editor tools

import { useState } from "react";
import { 
  MessageSquare, 
  GitBranch, 
  Edit3, 
  UserCheck, 
  Play, 
  Square,
  Zap,
  Plus,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  Upload
} from "lucide-react";

interface FlowToolbarProps {
  onAddNode: (nodeType: string) => void;
}

const nodeTypes = [
  {
    type: "message",
    label: "Nachricht",
    icon: MessageSquare,
    description: "Sendet eine Textnachricht",
    color: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
  },
  {
    type: "condition",
    label: "Bedingung",
    icon: GitBranch,
    description: "Verzweigt basierend auf Benutzerantwort",
    color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700"
  },
  {
    type: "collect-input",
    label: "Eingabe",
    icon: Edit3,
    description: "Sammelt Benutzereingaben",
    color: "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
  },
  {
    type: "handoff",
    label: "An Mensch",
    icon: UserCheck,
    description: "Weiterleitung an menschlichen Agent",
    color: "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
  },
  {
    type: "end",
    label: "Ende",
    icon: Square,
    description: "Beendet die Konversation",
    color: "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
  },
];

export function FlowToolbar({ onAddNode }: FlowToolbarProps) {
  const [expandedNodes, setExpandedNodes] = useState(false);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Node Palette */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Bot Bausteine</span>
            </div>
            
            {/* Node Types */}
            <div className="flex items-center space-x-2">
              {nodeTypes.slice(0, expandedNodes ? nodeTypes.length : 3).map((nodeType) => {
                const Icon = nodeType.icon;
                return (
                  <div
                    key={nodeType.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, nodeType.type)}
                    onClick={() => onAddNode(nodeType.type)}
                    className={`flex items-center space-x-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${nodeType.color}`}
                    title={nodeType.description}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{nodeType.label}</span>
                  </div>
                );
              })}
              
              {!expandedNodes && nodeTypes.length > 3 && (
                <button
                  onClick={() => setExpandedNodes(true)}
                  className="flex items-center space-x-1 px-2 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">+{nodeTypes.length - 3}</span>
                </button>
              )}
            </div>
          </div>

          {/* Editor Actions */}
          <div className="flex items-center space-x-2">
            {/* Undo/Redo */}
            <div className="flex items-center border rounded-lg">
              <button className="p-2 hover:bg-gray-50 transition-colors border-r" title="Rückgängig">
                <Undo className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-50 transition-colors" title="Wiederholen">
                <Redo className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center border rounded-lg">
              <button className="p-2 hover:bg-gray-50 transition-colors border-r" title="Vergrößern">
                <ZoomIn className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-50 transition-colors border-r" title="Verkleinern">
                <ZoomOut className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-50 transition-colors" title="An Fenster anpassen">
                <Maximize className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Import/Export */}
            <div className="flex items-center border rounded-lg">
              <button className="p-2 hover:bg-gray-50 transition-colors border-r" title="Flow importieren">
                <Upload className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-50 transition-colors" title="Flow exportieren">
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Node Palette */}
        {expandedNodes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-5 gap-3">
              {nodeTypes.map((nodeType) => {
                const Icon = nodeType.icon;
                return (
                  <div
                    key={nodeType.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, nodeType.type)}
                    onClick={() => onAddNode(nodeType.type)}
                    className={`flex flex-col items-center space-y-2 p-3 border rounded-lg cursor-pointer transition-colors ${nodeType.color}`}
                  >
                    <Icon className="h-6 w-6" />
                    <div className="text-center">
                      <p className="text-sm font-medium">{nodeType.label}</p>
                      <p className="text-xs opacity-75">{nodeType.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setExpandedNodes(false)}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700"
            >
              Weniger anzeigen
            </button>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="px-6 py-2 bg-blue-50 border-t border-blue-100">
        <p className="text-sm text-blue-700">
          💡 <strong>Tipp:</strong> Ziehen Sie Bausteine auf die Leinwand oder klicken Sie, um sie hinzuzufügen. 
          Verbinden Sie Nodes mit den Griffen an den Seiten.
        </p>
      </div>
    </div>
  );
}
