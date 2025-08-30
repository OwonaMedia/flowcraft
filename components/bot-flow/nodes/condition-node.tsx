"use client";

// BotChat Pro - Condition Node Component
// Routes users based on keywords or conditions

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { GitBranch } from "lucide-react";

interface ConditionNodeData {
  conditions: Array<{
    keyword: string;
    target: string | null;
  }>;
}

export const ConditionNode = memo(({ data, selected }: NodeProps<ConditionNodeData>) => {
  const { conditions = [] } = data;
  
  return (
    <div className={`relative bg-white border-2 rounded-lg shadow-sm min-w-[180px] max-w-[250px] ${
      selected ? "border-blue-500 shadow-blue-200" : "border-yellow-400"
    }`}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />

      {/* Node Header */}
      <div className="bg-yellow-50 px-3 py-2 border-b border-yellow-200 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <GitBranch className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-700">Bedingung</span>
        </div>
      </div>

      {/* Node Content */}
      <div className="p-3 space-y-2">
        <p className="text-xs text-gray-600 mb-2">
          Weiterleitung basierend auf:
        </p>
        
        {conditions.length > 0 ? (
          <div className="space-y-1">
            {conditions.map((condition, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded border">
                  {condition.keyword}
                </span>
                <span className="text-gray-400">→</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">
            Keine Bedingungen definiert
          </p>
        )}
      </div>

      {/* Multiple Output Handles */}
      {conditions.map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Right}
          id={`output-${index}`}
          className="w-3 h-3 bg-yellow-500 border-2 border-white"
          style={{ 
            top: `${60 + (index * 25)}px`,
            right: "-6px"
          }}
        />
      ))}

      {/* Default output for no matches */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="default"
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  );
});
