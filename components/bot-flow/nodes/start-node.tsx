"use client";

// BotChat Pro - Start Node Component
// Entry point for bot flows

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Play } from "lucide-react";

interface StartNodeData {
  label: string;
}

export const StartNode = memo(({ data, selected }: NodeProps<StartNodeData>) => {
  return (
    <div className={`relative bg-white border-2 rounded-lg shadow-sm min-w-[120px] ${
      selected ? "border-blue-500 shadow-blue-200" : "border-green-300"
    }`}>
      {/* Node Header */}
      <div className="bg-green-50 px-3 py-2 border-b border-green-200 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Play className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">Start</span>
        </div>
      </div>

      {/* Node Content */}
      <div className="p-3">
        <p className="text-sm text-gray-600">
          Bot-Einstiegspunkt
        </p>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </div>
  );
});
