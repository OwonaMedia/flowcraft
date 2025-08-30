"use client";

// BotChat Pro - Collect Input Node Component
// Collects user input and stores in variables

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Edit3 } from "lucide-react";

interface CollectInputNodeData {
  prompt: string;
  variable: string;
  inputType: "text" | "email" | "phone" | "number" | "choice";
  choices?: string[];
  required?: boolean;
}

export const CollectInputNode = memo(({ data, selected }: NodeProps<CollectInputNodeData>) => {
  const { prompt, variable, inputType, choices = [], required = true } = data;
  
  const getInputTypeLabel = (type: string) => {
    const labels = {
      text: "Text",
      email: "E-Mail",
      phone: "Telefon",
      number: "Zahl", 
      choice: "Auswahl"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getInputTypeColor = (type: string) => {
    const colors = {
      text: "bg-purple-100 text-purple-700 border-purple-200",
      email: "bg-blue-100 text-blue-700 border-blue-200",
      phone: "bg-green-100 text-green-700 border-green-200",
      number: "bg-orange-100 text-orange-700 border-orange-200",
      choice: "bg-pink-100 text-pink-700 border-pink-200"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };
  
  return (
    <div className={`relative bg-white border-2 rounded-lg shadow-sm min-w-[200px] max-w-[280px] ${
      selected ? "border-blue-500 shadow-blue-200" : "border-purple-300"
    }`}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />

      {/* Node Header */}
      <div className="bg-purple-50 px-3 py-2 border-b border-purple-200 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Edit3 className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Eingabe sammeln</span>
          </div>
          {required && (
            <span className="text-xs text-red-500">*</span>
          )}
        </div>
      </div>

      {/* Node Content */}
      <div className="p-3 space-y-3">
        {/* Prompt */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Eingabeaufforderung:</p>
          <div className="bg-gray-50 rounded p-2 border">
            <p className="text-sm text-gray-800">
              {prompt || "Bitte geben Sie eine Antwort ein:"}
            </p>
          </div>
        </div>

        {/* Input Type */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Typ:</span>
          <span className={`px-2 py-1 text-xs rounded border ${getInputTypeColor(inputType)}`}>
            {getInputTypeLabel(inputType)}
          </span>
        </div>

        {/* Variable Name */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Variable:</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded border font-mono">
            {variable || "variable_name"}
          </code>
        </div>

        {/* Choices for choice type */}
        {inputType === "choice" && choices.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Auswahlmöglichkeiten:</p>
            <div className="space-y-1">
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center text-xs">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2" />
                  <span className="text-gray-700">{choice}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
    </div>
  );
});
