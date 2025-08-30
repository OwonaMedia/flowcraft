"use client";

// BotChat Pro - React Flow Editor Component
// Main visual flow editor with custom node types

import { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";

// Import React Flow styles
import "reactflow/dist/style.css";

// Custom node types
import { StartNode } from "./nodes/start-node";
import { MessageNode } from "./nodes/message-node";
import { ConditionNode } from "./nodes/condition-node";
import { CollectInputNode } from "./nodes/collect-input-node";
import { HandoffNode } from "./nodes/handoff-node";
import { EndNode } from "./nodes/end-node";

interface FlowEditorProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  onNodeSelect: (nodeId: string | null) => void;
}

const nodeTypes = {
  start: StartNode,
  message: MessageNode,
  condition: ConditionNode,
  "collect-input": CollectInputNode,
  handoff: HandoffNode,
  end: EndNode,
};

const defaultEdgeOptions = {
  style: { strokeWidth: 2 },
  type: "smoothstep",
};

export function BotFlowEditor({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange,
  onEdgesChange,
  onNodeSelect,
}: FlowEditorProps) {
  const [nodes, setNodes, onNodesChangeFlow] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeFlow] = useEdgesState(initialEdges);

  // Sync with parent component
  const handleNodesChange = useCallback((changes: any) => {
    onNodesChangeFlow(changes);
    const updatedNodes = changes.length > 0 ? 
      nodes.map((node: Node) => {
        const change = changes.find((c: any) => c.id === node.id);
        return change ? { ...node, ...change } : node;
      }) : nodes;
    onNodesChange(updatedNodes);
  }, [nodes, onNodesChange, onNodesChangeFlow]);

  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChangeFlow(changes);
    const updatedEdges = changes.length > 0 ?
      edges.map((edge: Edge) => {
        const change = changes.find((c: any) => c.id === edge.id);
        return change ? { ...edge, ...change } : edge;
      }) : edges;
    onEdgesChange(updatedEdges);
  }, [edges, onEdgesChange, onEdgesChangeFlow]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = addEdge(params, edges);
      setEdges(newEdge);
      onEdgesChange(newEdge);
    },
    [edges, setEdges, onEdgesChange]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeSelect(node.id);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = {
        x: event.clientX - 200,
        y: event.clientY - 40,
      };

      const newNode: Node = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: getDefaultNodeData(type),
      };

      const updatedNodes = [...nodes, newNode];
      setNodes(updatedNodes);
      onNodesChange(updatedNodes);
    },
    [nodes, setNodes, onNodesChange]
  );

  // Minimap node color based on type
  const nodeColor = (node: Node) => {
    switch (node.type) {
      case "start":
        return "#10b981"; // green
      case "message":
        return "#3b82f6"; // blue
      case "condition":
        return "#f59e0b"; // yellow
      case "collect-input":
        return "#8b5cf6"; // purple
      case "handoff":
        return "#ef4444"; // red
      case "end":
        return "#6b7280"; // gray
      default:
        return "#9ca3af";
    }
  };

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineStyle={{ strokeWidth: 2 }}
        connectionLineType={"smoothstep" as any}
        fitView
        className="bg-gray-50"
      >
        {/* Controls */}
        <Controls className="bg-white border border-gray-200 rounded-lg shadow-sm" />
        
        {/* Background */}
        <Background 
          color="#e5e7eb" 
          gap={20} 
          size={1}
          variant={"dots" as any}
        />
        
        {/* Minimap */}
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={3}
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}

function getDefaultNodeData(nodeType: string) {
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
}

// Wrapper component with ReactFlowProvider
export function BotFlowEditorWrapper(props: FlowEditorProps) {
  return (
    <ReactFlowProvider>
      <BotFlowEditor {...props} />
    </ReactFlowProvider>
  );
}
