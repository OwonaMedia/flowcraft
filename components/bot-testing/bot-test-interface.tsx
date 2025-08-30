"use client";

// BotChat Pro - Bot Test Interface
// Interactive testing interface for bot flows

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Square, 
  RotateCcw, 
  Send, 
  Bot, 
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import type { Node, Edge } from "reactflow";

interface TestMessage {
  id: string;
  type: "user" | "bot" | "system";
  content: string;
  timestamp: Date;
  nodeId?: string;
  status?: "sent" | "delivered" | "error";
}

interface BotTestInterfaceProps {
  nodes: Node[];
  edges: Edge[];
  isOpen: boolean;
  onClose: () => void;
}

export function BotTestInterface({ nodes, edges, isOpen, onClose }: BotTestInterfaceProps) {
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [testStats, setTestStats] = useState({
    messagesExchanged: 0,
    flowsTriggered: 0,
    errorsEncountered: 0,
    testDuration: 0
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const testStartTime = useRef<Date | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startTest = () => {
    setMessages([]);
    setVariables({});
    setIsRunning(true);
    setCurrentNodeId(null);
    testStartTime.current = new Date();
    
    // Find start node and begin flow
    const startNode = nodes.find(node => node.type === "start");
    if (startNode) {
      setCurrentNodeId(startNode.id);
      addSystemMessage("Bot-Test gestartet");
      executeNode(startNode);
    } else {
      addSystemMessage("Fehler: Kein Start-Node gefunden", "error");
    }
  };

  const stopTest = () => {
    setIsRunning(false);
    setCurrentNodeId(null);
    if (testStartTime.current) {
      const duration = Math.round((Date.now() - testStartTime.current.getTime()) / 1000);
      setTestStats(prev => ({ ...prev, testDuration: duration }));
    }
    addSystemMessage("Bot-Test beendet");
  };

  const resetTest = () => {
    setMessages([]);
    setVariables({});
    setIsRunning(false);
    setCurrentNodeId(null);
    setTestStats({
      messagesExchanged: 0,
      flowsTriggered: 0,
      errorsEncountered: 0,
      testDuration: 0
    });
    testStartTime.current = null;
  };

  const addMessage = (type: "user" | "bot" | "system", content: string, nodeId?: string, status: "sent" | "delivered" | "error" = "delivered") => {
    const message: TestMessage = {
      id: `msg_${Date.now()}`,
      type,
      content,
      timestamp: new Date(),
      nodeId,
      status
    };
    
    setMessages(prev => [...prev, message]);
    
    if (type !== "system") {
      setTestStats(prev => ({ 
        ...prev, 
        messagesExchanged: prev.messagesExchanged + 1 
      }));
    }
    
    if (status === "error") {
      setTestStats(prev => ({ 
        ...prev, 
        errorsEncountered: prev.errorsEncountered + 1 
      }));
    }
  };

  const addSystemMessage = (content: string, type: "info" | "error" | "success" = "info") => {
    addMessage("system", content);
  };

  const sendUserMessage = () => {
    if (!userInput.trim() || !isRunning) return;

    addMessage("user", userInput);
    processUserInput(userInput);
    setUserInput("");
  };

  const processUserInput = (input: string) => {
    if (!currentNodeId) return;

    const currentNode = nodes.find(node => node.id === currentNodeId);
    if (!currentNode) return;

    // Process based on current node type
    switch (currentNode.type) {
      case "condition":
        handleConditionInput(input, currentNode);
        break;
      case "collect-input":
        handleCollectInput(input, currentNode);
        break;
      default:
        // For other node types, just continue to next node
        continueToNextNode(currentNode);
        break;
    }
  };

  const handleConditionInput = (input: string, node: Node) => {
    const { conditions = [] } = node.data || {};
    const inputLower = input.toLowerCase().trim();

    // Find matching condition
    const matchedCondition = conditions.find((condition: any) => 
      inputLower.includes(condition.keyword?.toLowerCase())
    );

    if (matchedCondition) {
      addSystemMessage(`Bedingung erfüllt: "${matchedCondition.keyword}"`);
      // Find target node for this condition
      const targetEdge = edges.find(edge => 
        edge.source === node.id && edge.data?.condition === matchedCondition.keyword
      );
      
      if (targetEdge) {
        const targetNode = nodes.find(n => n.id === targetEdge.target);
        if (targetNode) {
          setCurrentNodeId(targetNode.id);
          executeNode(targetNode);
        }
      }
    } else {
      // No condition matched, use default path
      const defaultEdge = edges.find(edge => 
        edge.source === node.id && edge.sourceHandle === "default"
      );
      
      if (defaultEdge) {
        const targetNode = nodes.find(n => n.id === defaultEdge.target);
        if (targetNode) {
          addSystemMessage("Keine Bedingung erfüllt, verwende Standard-Pfad");
          setCurrentNodeId(targetNode.id);
          executeNode(targetNode);
        }
      } else {
        addSystemMessage("Eingabe nicht verstanden und kein Standard-Pfad definiert", "error");
      }
    }
  };

  const handleCollectInput = (input: string, node: Node) => {
    const { variable, inputType, choices = [] } = node.data || {};

    // Validate input based on type
    let isValid = true;
    let processedValue = input;

    switch (inputType) {
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
        break;
      case "phone":
        isValid = /^[\+]?[1-9][\d]{0,15}$/.test(input.replace(/\s/g, ""));
        break;
      case "number":
        isValid = !isNaN(Number(input));
        processedValue = Number(input).toString();
        break;
      case "choice":
        isValid = choices.some((choice: string) => 
          choice.toLowerCase() === input.toLowerCase()
        );
        break;
    }

    if (isValid) {
      // Store variable
      setVariables(prev => ({ ...prev, [variable]: processedValue }));
      addSystemMessage(`Variable "${variable}" gesetzt: ${processedValue}`);
      continueToNextNode(node);
    } else {
      addMessage("bot", `Ungültige Eingabe für ${inputType}. Bitte versuchen Sie es erneut.`, node.id, "error");
    }
  };

  const executeNode = (node: Node) => {
    setTestStats(prev => ({ 
      ...prev, 
      flowsTriggered: prev.flowsTriggered + 1 
    }));

    switch (node.type) {
      case "message":
        handleMessageNode(node);
        break;
      case "condition":
        handleConditionNode(node);
        break;
      case "collect-input":
        handleCollectInputNode(node);
        break;
      case "handoff":
        handleHandoffNode(node);
        break;
      case "end":
        handleEndNode(node);
        break;
    }
  };

  const handleMessageNode = (node: Node) => {
    const { message, quickReplies = [] } = node.data || {};
    
    // Replace variables in message
    const processedMessage = replaceVariables(message || "", variables);
    
    addMessage("bot", processedMessage, node.id);

    // Auto-continue to next node after message
    setTimeout(() => {
      continueToNextNode(node);
    }, 500);
  };

  const handleConditionNode = (node: Node) => {
    addSystemMessage(`Warte auf Benutzereingabe für Bedingung...`);
    // Node stays current, waiting for user input
  };

  const handleCollectInputNode = (node: Node) => {
    const { prompt, inputType, choices = [] } = node.data || {};
    
    let processedPrompt = replaceVariables(prompt || "", variables);
    
    if (inputType === "choice" && choices.length > 0) {
      processedPrompt += "\n\nOptionen:\n" + choices.map((choice: string, index: number) => 
        `${index + 1}. ${choice}`
      ).join("\n");
    }
    
    addMessage("bot", processedPrompt, node.id);
    addSystemMessage(`Sammle ${inputType}-Eingabe für Variable "${node.data?.variable}"`);
    // Node stays current, waiting for user input
  };

  const handleHandoffNode = (node: Node) => {
    const { message, department } = node.data || {};
    const processedMessage = replaceVariables(message || "Ich verbinde Sie mit einem Mitarbeiter...", variables);
    
    addMessage("bot", processedMessage, node.id);
    addSystemMessage(`Weiterleitung an Abteilung: ${department || "Allgemein"}`);
    stopTest();
  };

  const handleEndNode = (node: Node) => {
    const { message } = node.data || {};
    
    if (message) {
      const processedMessage = replaceVariables(message, variables);
      addMessage("bot", processedMessage, node.id);
    }
    
    addSystemMessage("Bot-Flow beendet");
    stopTest();
  };

  const continueToNextNode = (node: Node) => {
    const nextEdge = edges.find(edge => edge.source === node.id);
    if (nextEdge) {
      const nextNode = nodes.find(n => n.id === nextEdge.target);
      if (nextNode) {
        setCurrentNodeId(nextNode.id);
        setTimeout(() => executeNode(nextNode), 300);
      }
    } else {
      addSystemMessage("Kein nächster Node gefunden - Flow beendet", "error");
      stopTest();
    }
  };

  const replaceVariables = (text: string, vars: Record<string, any>): string => {
    return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return vars[varName] !== undefined ? String(vars[varName]) : match;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Bot className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Bot Test Interface</h2>
            {currentNodeId && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                Aktueller Node: {currentNodeId}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={startTest}
              disabled={isRunning}
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={stopTest}
              disabled={!isRunning}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={resetTest}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              Schließen
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : message.type === "bot"
                        ? "bg-gray-100 text-gray-900"
                        : "bg-yellow-50 text-yellow-800 text-sm"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === "user" ? (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      ) : message.type === "bot" ? (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-75">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.status && message.type !== "system" && (
                            <div className="flex items-center space-x-1">
                              {message.status === "delivered" && (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              )}
                              {message.status === "error" && (
                                <XCircle className="h-3 w-3 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendUserMessage()}
                  placeholder={isRunning ? "Ihre Nachricht..." : "Test starten um zu chatten"}
                  disabled={!isRunning}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
                <Button
                  onClick={sendUserMessage}
                  disabled={!isRunning || !userInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar with Stats and Variables */}
          <div className="w-80 border-l border-gray-200 p-4 space-y-6">
            {/* Test Statistics */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Test Statistiken</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nachrichten:</span>
                  <span className="font-medium">{testStats.messagesExchanged}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flows ausgeführt:</span>
                  <span className="font-medium">{testStats.flowsTriggered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fehler:</span>
                  <span className="font-medium text-red-600">{testStats.errorsEncountered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dauer:</span>
                  <span className="font-medium">{testStats.testDuration}s</span>
                </div>
              </div>
            </div>

            {/* Variables */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Variablen</h3>
              {Object.keys(variables).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(variables).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-2 rounded text-sm">
                      <div className="font-medium text-gray-700">{key}</div>
                      <div className="text-gray-600 truncate">{String(value)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Keine Variablen gesetzt</p>
              )}
            </div>

            {/* Current Flow Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Flow Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  {isRunning ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  )}
                  <span className={isRunning ? "text-green-700" : "text-gray-500"}>
                    {isRunning ? "Läuft" : "Gestoppt"}
                  </span>
                </div>
                {currentNodeId && (
                  <div className="text-xs text-gray-600">
                    Aktueller Node: {currentNodeId}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
