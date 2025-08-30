"use client";

// BotChat Pro - Flow Editor Sidebar
// Node properties and configuration panel

import { useState, useEffect } from "react";
import { Node } from "reactflow";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Settings, 
  MessageSquare, 
  GitBranch, 
  Edit3, 
  UserCheck, 
  Square,
  Play,
  Plus,
  Trash2
} from "lucide-react";

interface FlowSidebarProps {
  selectedNodeId: string | null;
  nodes: Node[];
  onNodeUpdate: (nodeId: string, updates: Partial<Node>) => void;
  onClose: () => void;
}

export function FlowSidebar({ selectedNodeId, nodes, onNodeUpdate, onClose }: FlowSidebarProps) {
  const [formData, setFormData] = useState<any>({});
  
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;

  useEffect(() => {
    if (selectedNode) {
      setFormData(selectedNode.data || {});
    } else {
      setFormData({});
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, {
        data: { ...selectedNode.data, ...formData }
      });
    }
  };

  const getNodeIcon = (nodeType: string) => {
    const icons = {
      start: Play,
      message: MessageSquare,
      condition: GitBranch,
      "collect-input": Edit3,
      handoff: UserCheck,
      end: Square,
    };
    return icons[nodeType as keyof typeof icons] || Settings;
  };

  const getNodeTitle = (nodeType: string) => {
    const titles = {
      start: "Start Node",
      message: "Nachricht Node",
      condition: "Bedingung Node",
      "collect-input": "Eingabe Node",
      handoff: "Weiterleitung Node",
      end: "Ende Node",
    };
    return titles[nodeType as keyof typeof titles] || "Node";
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Eigenschaften</h3>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-center text-gray-500 py-12">
          <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm">
            Wählen Sie einen Node aus, um seine Eigenschaften zu bearbeiten.
          </p>
        </div>
      </div>
    );
  }

  const NodeIcon = getNodeIcon(selectedNode.type!);

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <NodeIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {getNodeTitle(selectedNode.type!)}
          </h3>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* General Properties */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Allgemein</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Node ID
              </label>
              <input
                type="text"
                value={selectedNode.id}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Node-specific Properties */}
        {selectedNode.type === "message" && (
          <MessageNodeProperties formData={formData} setFormData={setFormData} />
        )}

        {selectedNode.type === "condition" && (
          <ConditionNodeProperties formData={formData} setFormData={setFormData} />
        )}

        {selectedNode.type === "collect-input" && (
          <CollectInputNodeProperties formData={formData} setFormData={setFormData} />
        )}

        {selectedNode.type === "handoff" && (
          <HandoffNodeProperties formData={formData} setFormData={setFormData} />
        )}

        {selectedNode.type === "end" && (
          <EndNodeProperties formData={formData} setFormData={setFormData} />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <Button onClick={handleSave} className="flex-1">
            Änderungen speichern
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Node-specific property components
function MessageNodeProperties({ formData, setFormData }: { formData: any; setFormData: (data: any) => void }) {
  const [quickReplies, setQuickReplies] = useState<string[]>(formData.quickReplies || []);

  const addQuickReply = () => {
    const newReplies = [...quickReplies, ""];
    setQuickReplies(newReplies);
    setFormData({ ...formData, quickReplies: newReplies });
  };

  const updateQuickReply = (index: number, value: string) => {
    const newReplies = [...quickReplies];
    newReplies[index] = value;
    setQuickReplies(newReplies);
    setFormData({ ...formData, quickReplies: newReplies });
  };

  const removeQuickReply = (index: number) => {
    const newReplies = quickReplies.filter((_, i) => i !== index);
    setQuickReplies(newReplies);
    setFormData({ ...formData, quickReplies: newReplies });
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Nachricht</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nachrichtentext *
          </label>
          <textarea
            value={formData.message || ""}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Ihre Nachricht an den Benutzer..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Schnellantworten (optional)
            </label>
            <Button size="sm" variant="outline" onClick={addQuickReply}>
              <Plus className="h-3 w-3 mr-1" />
              Hinzufügen
            </Button>
          </div>
          <div className="space-y-2">
            {quickReplies.map((reply, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => updateQuickReply(index, e.target.value)}
                  placeholder="Schnellantwort..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => removeQuickReply(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConditionNodeProperties({ formData, setFormData }: { formData: any; setFormData: (data: any) => void }) {
  const [conditions, setConditions] = useState(formData.conditions || []);

  const addCondition = () => {
    const newConditions = [...conditions, { keyword: "", target: null }];
    setConditions(newConditions);
    setFormData({ ...formData, conditions: newConditions });
  };

  const updateCondition = (index: number, field: string, value: string) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
    setFormData({ ...formData, conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_: any, i: number) => i !== index);
    setConditions(newConditions);
    setFormData({ ...formData, conditions: newConditions });
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Bedingungen</h4>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Wenn Benutzer schreibt...
            </label>
            <Button size="sm" variant="outline" onClick={addCondition}>
              <Plus className="h-3 w-3 mr-1" />
              Bedingung
            </Button>
          </div>
          <div className="space-y-3">
            {conditions.map((condition: any, index: number) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Schlüsselwort</label>
                    <input
                      type="text"
                      value={condition.keyword}
                      onChange={(e) => updateCondition(index, "keyword", e.target.value)}
                      placeholder="z.B. ja, nein, hilfe..."
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => removeCondition(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectInputNodeProperties({ formData, setFormData }: { formData: any; setFormData: (data: any) => void }) {
  const [choices, setChoices] = useState<string[]>(formData.choices || []);

  const addChoice = () => {
    const newChoices = [...choices, ""];
    setChoices(newChoices);
    setFormData({ ...formData, choices: newChoices });
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Eingabe sammeln</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Eingabeaufforderung *
          </label>
          <textarea
            value={formData.prompt || ""}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            placeholder="Bitte geben Sie..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Variable Name *
          </label>
          <input
            type="text"
            value={formData.variable || ""}
            onChange={(e) => setFormData({ ...formData, variable: e.target.value })}
            placeholder="z.B. user_name, email, phone..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Eingabetyp
          </label>
          <select
            value={formData.inputType || "text"}
            onChange={(e) => setFormData({ ...formData, inputType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="text">Text</option>
            <option value="email">E-Mail</option>
            <option value="phone">Telefon</option>
            <option value="number">Zahl</option>
            <option value="choice">Auswahl</option>
          </select>
        </div>

        {formData.inputType === "choice" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Auswahlmöglichkeiten
              </label>
              <Button size="sm" variant="outline" onClick={addChoice}>
                <Plus className="h-3 w-3 mr-1" />
                Option
              </Button>
            </div>
            <div className="space-y-2">
              {choices.map((choice, index) => (
                <input
                  key={index}
                  type="text"
                  value={choice}
                  onChange={(e) => {
                    const newChoices = [...choices];
                    newChoices[index] = e.target.value;
                    setChoices(newChoices);
                    setFormData({ ...formData, choices: newChoices });
                  }}
                  placeholder="Option..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HandoffNodeProperties({ formData, setFormData }: { formData: any; setFormData: (data: any) => void }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Weiterleitung</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nachricht an Benutzer
          </label>
          <textarea
            value={formData.message || ""}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Ich verbinde Sie mit einem Mitarbeiter..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Abteilung
          </label>
          <select
            value={formData.department || "general"}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="general">Allgemein</option>
            <option value="customer-service">Kundenservice</option>
            <option value="technical">Technischer Support</option>
            <option value="sales">Vertrieb</option>
            <option value="billing">Rechnungswesen</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function EndNodeProperties({ formData, setFormData }: { formData: any; setFormData: (data: any) => void }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Konversation beenden</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Abschlussnachricht (optional)
          </label>
          <textarea
            value={formData.message || ""}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Vielen Dank für Ihr Gespräch..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  );
}
