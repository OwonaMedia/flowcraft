"use client";

// BotChat Pro - Bot Flow Editor
// Visual flow builder using React Flow

import { useState, useCallback, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { BotFlowEditorWrapper as BotFlowEditor } from "@/components/bot-flow/flow-editor";
import { FlowToolbar } from "@/components/bot-flow/flow-toolbar";
import { FlowSidebar } from "@/components/bot-flow/flow-sidebar";
import { BotTestInterface } from "@/components/bot-testing/bot-test-interface";
import { validateFlow, quickValidate, ValidationResult } from "@/lib/flow-validator";
import { useBot } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Settings,
  Eye,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

// Types
import type { Node, Edge } from "reactflow";

export default function BotEditPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const botId = params.id as string;
  const template = searchParams.get("template");
  
  const { bot, loading, saveFlow } = useBot(botId);
  
  const [botName, setBotName] = useState("");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showTestInterface, setShowTestInterface] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  // Load bot data from API or template
  useEffect(() => {
    if (bot) {
      setBotName(bot.name);
      if (bot.flows && bot.flows.length > 0) {
        const mainFlow = bot.flows[0];
        setNodes(mainFlow.nodes.nodes || []);
        setEdges(mainFlow.nodes.edges || []);
      }
    } else if (template && template !== "blank") {
      loadTemplateData();
    }
  }, [bot, template]);

  const loadTemplateData = () => {
    const templateData = getTemplateData(template!);
    setNodes(templateData.nodes);
    setEdges(templateData.edges);
    setBotName(templateData.name);
  };

  // Validate flow on changes
  useEffect(() => {
    if (nodes.length > 0) {
      const result = validateFlow(nodes, edges);
      setValidationResult(result);
    }
  }, [nodes, edges]);

  const loadBotData = async () => {
    try {
      // In production, this would load from API
      if (template && template !== "blank") {
        const templateData = getTemplateData(template);
        setNodes(templateData.nodes);
        setEdges(templateData.edges);
        setBotName(templateData.name);
      } else {
        // Start with empty flow
        const initialNodes: Node[] = [
          {
            id: "start",
            type: "start", 
            position: { x: 250, y: 100 },
            data: { label: "Start" },
          },
        ];
        setNodes(initialNodes);
        setEdges([]);
        setBotName("Neuer Bot");
      }
    } catch (error) {
      console.error("Failed to load bot data:", error);
    }
  };

  const getTemplateData = (templateId: string) => {
    const templates = {
      "customer-support": {
        name: "Kundenservice Bot",
        nodes: [
          {
            id: "start",
            type: "start",
            position: { x: 100, y: 100 },
            data: { label: "Start" },
          },
          {
            id: "welcome",
            type: "message",
            position: { x: 300, y: 100 },
            data: { 
              message: "Hallo! Ich bin Ihr Kundenservice-Assistent. Wie kann ich Ihnen helfen?",
              quickReplies: ["Bestellung verfolgen", "Rückgabe", "Technischer Support", "Mit Mensch sprechen"]
            },
          },
          {
            id: "menu",
            type: "condition",
            position: { x: 550, y: 100 },
            data: { 
              conditions: [
                { keyword: "bestellung", target: "track-order" },
                { keyword: "rückgabe", target: "return-info" },
                { keyword: "support", target: "tech-support" },
                { keyword: "mensch", target: "human-handoff" }
              ]
            },
          },
          {
            id: "track-order",
            type: "message",
            position: { x: 300, y: 300 },
            data: { 
              message: "Gerne helfe ich Ihnen bei der Sendungsverfolgung. Bitte geben Sie Ihre Bestellnummer ein."
            },
          },
          {
            id: "return-info",
            type: "message", 
            position: { x: 500, y: 300 },
            data: { 
              message: "Für Rückgaben haben Sie 14 Tage Zeit. Weitere Informationen finden Sie hier: [Link zu Rückgaberichtlinien]"
            },
          },
          {
            id: "tech-support",
            type: "message",
            position: { x: 700, y: 300 },
            data: { 
              message: "Ich verbinde Sie mit unserem technischen Support. Bitte beschreiben Sie kurz Ihr Problem."
            },
          },
          {
            id: "human-handoff",
            type: "handoff",
            position: { x: 900, y: 300 },
            data: { 
              message: "Ich verbinde Sie mit einem unserer Mitarbeiter. Bitte haben Sie einen Moment Geduld.",
              department: "customer-service"
            },
          },
        ],
        edges: [
          { id: "e1", source: "start", target: "welcome" },
          { id: "e2", source: "welcome", target: "menu" },
          { id: "e3", source: "menu", target: "track-order", data: { condition: "bestellung" } },
          { id: "e4", source: "menu", target: "return-info", data: { condition: "rückgabe" } },
          { id: "e5", source: "menu", target: "tech-support", data: { condition: "support" } },
          { id: "e6", source: "menu", target: "human-handoff", data: { condition: "mensch" } },
        ],
      },
      "lead-generation": {
        name: "Lead Generation Bot",
        nodes: [
          {
            id: "start",
            type: "start",
            position: { x: 100, y: 100 },
            data: { label: "Start" },
          },
          {
            id: "intro",
            type: "message",
            position: { x: 300, y: 100 },
            data: { 
              message: "👋 Willkommen! Ich helfe Ihnen gerne bei der Auswahl unserer Services. Darf ich fragen, was Sie interessiert?"
            },
          },
          {
            id: "interest",
            type: "collect-input",
            position: { x: 550, y: 100 },
            data: { 
              prompt: "Wofür interessieren Sie sich?",
              variable: "interest",
              inputType: "text"
            },
          },
          {
            id: "qualify",
            type: "message",
            position: { x: 300, y: 300 },
            data: { 
              message: "Perfekt! {{interest}} ist ein wichtiger Bereich. Sind Sie bereits Geschäftsinhaber oder planen Sie zu starten?"
            },
          },
          {
            id: "business-status",
            type: "collect-input",
            position: { x: 550, y: 300 },
            data: { 
              prompt: "Ihr Geschäftsstatus:",
              variable: "business_status",
              inputType: "choice",
              choices: ["Bereits im Geschäft", "Planung/Start", "Nur interessiert"]
            },
          },
          {
            id: "contact-info",
            type: "collect-input",
            position: { x: 800, y: 300 },
            data: { 
              prompt: "Darf ich Ihre E-Mail für weitere Informationen?",
              variable: "email",
              inputType: "email"
            },
          },
          {
            id: "thank-you",
            type: "message",
            position: { x: 1050, y: 300 },
            data: { 
              message: "Vielen Dank! Ich sende Ihnen passende Informationen zu {{interest}}. Ein Berater wird sich in 24h bei Ihnen melden."
            },
          },
        ],
        edges: [
          { id: "e1", source: "start", target: "intro" },
          { id: "e2", source: "intro", target: "interest" },
          { id: "e3", source: "interest", target: "qualify" },
          { id: "e4", source: "qualify", target: "business-status" },
          { id: "e5", source: "business-status", target: "contact-info" },
          { id: "e6", source: "contact-info", target: "thank-you" },
        ],
      },
    };

    return templates[templateId as keyof typeof templates] || {
      name: "Bot",
      nodes: [],
      edges: []
    };
  };

  const getDefaultNodeData = (nodeType: string) => {
    switch (nodeType) {
      case "start":
        return { label: "Start" };
      case "message":
        return { 
          message: "Neue Nachricht eingeben...",
          quickReplies: []
        };
      case "condition":
        return { 
          conditions: [
            { keyword: "ja", target: null },
            { keyword: "nein", target: null }
          ]
        };
      case "collect-input":
        return { 
          prompt: "Bitte geben Sie eine Antwort ein:",
          variable: "user_input",
          inputType: "text"
        };
      case "handoff":
        return { 
          message: "Ich verbinde Sie mit einem Mitarbeiter...",
          department: "general"
        };
      case "end":
        return { label: "Ende" };
      default:
        return {};
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save to API
      await saveFlow(nodes, edges);
      
      // Show success notification (you'd implement toast notification here)
      alert("Bot wurde erfolgreich gespeichert!");
      
    } catch (error) {
      console.error("Failed to save bot:", error);
      alert("Fehler beim Speichern des Bots: " + (error instanceof Error ? error.message : "Unbekannter Fehler"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = () => {
    // Validate before testing
    const quickResult = quickValidate(nodes, edges);
    if (!quickResult.isValid) {
      alert(`Bot kann nicht getestet werden: ${quickResult.errorCount} Fehler gefunden. Bitte beheben Sie die Fehler zuerst.`);
      setShowValidation(true);
      return;
    }
    setShowTestInterface(true);
  };

  const handleValidate = () => {
    setShowValidation(!showValidation);
  };

  const handlePreview = () => {
    // Open preview
    window.open(`/preview/bot/${botId}`, "_blank");
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Bot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push("/dashboard/bots")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
          <div>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            />
            <p className="text-sm text-gray-500">Bot Flow Editor</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Validation Status */}
          {validationResult && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleValidate}
              className={`${
                validationResult.isValid 
                  ? "text-green-700 border-green-300 hover:bg-green-50" 
                  : "text-red-700 border-red-300 hover:bg-red-50"
              }`}
            >
              {validationResult.isValid ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {validationResult.errors.length > 0 ? `${validationResult.errors.length} Fehler` : "Validiert"}
              {validationResult.warnings.length > 0 && `, ${validationResult.warnings.length} Warnungen`}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            Vorschau
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleTest}
          >
            <Play className="h-4 w-4 mr-2" />
            Testen
          </Button>
          <Button 
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Speichern..." : "Speichern"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <FlowToolbar 
        onAddNode={(nodeType) => {
          // Add new node to the center of the canvas
          const newNode: Node = {
            id: `${nodeType}_${Date.now()}`,
            type: nodeType,
            position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 },
            data: getDefaultNodeData(nodeType),
          };
          setNodes(prev => [...prev, newNode]);
        }}
      />

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Flow Editor */}
        <div className="flex-1">
          <BotFlowEditor
            nodes={nodes}
            edges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
            onNodeSelect={setSelectedNodeId}
          />
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <FlowSidebar
            selectedNodeId={selectedNodeId}
            nodes={nodes}
            onNodeUpdate={(nodeId, updates) => {
              setNodes(prev => prev.map(node => 
                node.id === nodeId ? { ...node, ...updates } : node
              ));
            }}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </div>

      {/* Validation Panel */}
      {showValidation && validationResult && (
        <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto z-40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Flow Validation</h3>
            <Button size="sm" variant="outline" onClick={() => setShowValidation(false)}>
              ×
            </Button>
          </div>
          
          {/* Errors */}
          {validationResult.errors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                <XCircle className="h-4 w-4 mr-1" />
                Fehler ({validationResult.errors.length})
              </h4>
              <div className="space-y-2">
                {validationResult.errors.map((error) => (
                  <div key={error.id} className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                    <p className="text-red-800">{error.message}</p>
                    {error.nodeId && (
                      <p className="text-red-600 text-xs mt-1">Node: {error.nodeId}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {validationResult.warnings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-yellow-700 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Warnungen ({validationResult.warnings.length})
              </h4>
              <div className="space-y-2">
                {validationResult.warnings.map((warning) => (
                  <div key={warning.id} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <p className="text-yellow-800">{warning.message}</p>
                    {warning.suggestion && (
                      <p className="text-yellow-600 text-xs mt-1">💡 {warning.suggestion}</p>
                    )}
                    {warning.nodeId && (
                      <p className="text-yellow-600 text-xs mt-1">Node: {warning.nodeId}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {validationResult.isValid && validationResult.warnings.length === 0 && (
            <div className="flex items-center text-green-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Flow ist vollständig validiert!</span>
            </div>
          )}
        </div>
      )}

      {/* Test Interface */}
      <BotTestInterface
        nodes={nodes}
        edges={edges}
        isOpen={showTestInterface}
        onClose={() => setShowTestInterface(false)}
      />
    </div>
  );
}
