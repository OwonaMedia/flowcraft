"use client";

// BotChat Pro - End Node Component
// Marks the end of a bot flow

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Square } from "lucide-react";

interface EndNodeData {
  label: string;
  message?: string;
}

export const EndNode = memo(({ data, selected }: NodeProps<EndNodeData>) => {
  const { label, message } = data;
  
  return (
    <div className={`relative bg-white border-2 rounded-lg shadow-sm min-w-[120px] max-w-[200px] ${
      selected ? "border-blue-500 shadow-blue-200" : "border-gray-400"
    }`}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-500 border-2 border-white"
      />

      {/* Node Header */}
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Square className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Ende</span>
        </div>
      </div>

      {/* Node Content */}
      <div className="p-3">
        {message ? (
          <div className="space-y-2">
            <div className="bg-gray-50 rounded p-2 border">
              <p className="text-sm text-gray-800">
                {message}
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Konversation beendet
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Konversation beendet
          </p>
        )}
      </div>
    </div>
  );
});
