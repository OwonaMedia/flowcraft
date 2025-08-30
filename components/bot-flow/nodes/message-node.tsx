"use client";

// BotChat Pro - Message Node Component
// Sends text messages to users

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { MessageSquare } from "lucide-react";

interface MessageNodeData {
  message: string;
  quickReplies?: string[];
}

export const MessageNode = memo(({ data, selected }: NodeProps<MessageNodeData>) => {
  const { message, quickReplies = [] } = data;
  
  return (
    <div className={`relative bg-white border-2 rounded-lg shadow-sm min-w-[200px] max-w-[300px] ${
      selected ? "border-blue-500 shadow-blue-200" : "border-blue-300"
    }`}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />

      {/* Node Header */}
      <div className="bg-blue-50 px-3 py-2 border-b border-blue-200 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Nachricht</span>
        </div>
      </div>

      {/* Node Content */}
      <div className="p-3 space-y-3">
        {/* Message Text */}
        <div className="bg-gray-50 rounded-lg p-3 border">
          <p className="text-sm text-gray-800 leading-relaxed">
            {message || "Nachricht eingeben..."}
          </p>
        </div>

        {/* Quick Replies */}
        {quickReplies.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600">Schnellantworten:</p>
            <div className="flex flex-wrap gap-1">
              {quickReplies.map((reply, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full border"
                >
                  {reply}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  );
});
