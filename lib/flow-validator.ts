// BotChat Pro - Flow Validation System
// Validates bot flows for completeness and logical consistency

import type { Node, Edge } from "reactflow";

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  id: string;
  type: "error";
  nodeId?: string;
  message: string;
  severity: "critical" | "high" | "medium";
}

export interface ValidationWarning {
  id: string;
  type: "warning";
  nodeId?: string;
  message: string;
  suggestion?: string;
}

/**
 * Main flow validation function
 */
export function validateFlow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Basic structure validation
  const structureResult = validateFlowStructure(nodes, edges);
  errors.push(...structureResult.errors);
  warnings.push(...structureResult.warnings);

  // Node-specific validation
  const nodeResult = validateNodes(nodes);
  errors.push(...nodeResult.errors);
  warnings.push(...nodeResult.warnings);

  // Connection validation
  const connectionResult = validateConnections(nodes, edges);
  errors.push(...connectionResult.errors);
  warnings.push(...connectionResult.warnings);

  // Flow logic validation
  const logicResult = validateFlowLogic(nodes, edges);
  errors.push(...logicResult.errors);
  warnings.push(...logicResult.warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate basic flow structure
 */
function validateFlowStructure(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Must have at least one start node
  const startNodes = nodes.filter(node => node.type === "start");
  if (startNodes.length === 0) {
    errors.push({
      id: "no-start-node",
      type: "error",
      message: "Flow muss mindestens einen Start-Node haben",
      severity: "critical"
    });
  } else if (startNodes.length > 1) {
    warnings.push({
      id: "multiple-start-nodes",
      type: "warning",
      message: `${startNodes.length} Start-Nodes gefunden. Nur der erste wird verwendet.`,
      suggestion: "Verwenden Sie nur einen Start-Node pro Flow"
    });
  }

  // Must have at least one node
  if (nodes.length === 0) {
    errors.push({
      id: "empty-flow",
      type: "error",
      message: "Flow ist leer",
      severity: "critical"
    });
  }

  // Check for isolated nodes (no connections)
  const connectedNodeIds = new Set([
    ...edges.map(edge => edge.source),
    ...edges.map(edge => edge.target)
  ]);

  const isolatedNodes = nodes.filter(node => 
    node.type !== "start" && !connectedNodeIds.has(node.id)
  );

  isolatedNodes.forEach(node => {
    warnings.push({
      id: `isolated-node-${node.id}`,
      type: "warning",
      nodeId: node.id,
      message: `Node "${node.data?.label || node.id}" ist nicht verbunden`,
      suggestion: "Verbinden Sie den Node mit dem Flow oder entfernen Sie ihn"
    });
  });

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Validate individual nodes
 */
function validateNodes(nodes: Node[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  nodes.forEach(node => {
    const nodeResult = validateSingleNode(node);
    errors.push(...nodeResult.errors);
    warnings.push(...nodeResult.warnings);
  });

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Validate a single node
 */
function validateSingleNode(node: Node): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  switch (node.type) {
    case "message":
      return validateMessageNode(node);
    case "condition":
      return validateConditionNode(node);
    case "collect-input":
      return validateCollectInputNode(node);
    case "handoff":
      return validateHandoffNode(node);
    default:
      return { isValid: true, errors: [], warnings: [] };
  }
}

/**
 * Validate message node
 */
function validateMessageNode(node: Node): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const { message, quickReplies = [] } = node.data || {};

  // Message is required
  if (!message || message.trim() === "") {
    errors.push({
      id: `message-empty-${node.id}`,
      type: "error",
      nodeId: node.id,
      message: "Nachrichtentext ist erforderlich",
      severity: "high"
    });
  } else {
    // Check message length
    if (message.length > 4096) {
      errors.push({
        id: `message-too-long-${node.id}`,
        type: "error",
        nodeId: node.id,
        message: "Nachricht zu lang (max. 4096 Zeichen)",
        severity: "medium"
      });
    }

    // Check for variables
    const variables = message.match(/\{\{(\w+)\}\}/g);
    if (variables) {
      warnings.push({
        id: `message-variables-${node.id}`,
        type: "warning",
        nodeId: node.id,
        message: `Variablen gefunden: ${variables.join(", ")}`,
        suggestion: "Stellen Sie sicher, dass diese Variablen definiert werden"
      });
    }
  }

  // Validate quick replies
  if (quickReplies.length > 13) {
    warnings.push({
      id: `too-many-quick-replies-${node.id}`,
      type: "warning",
      nodeId: node.id,
      message: "Mehr als 13 Schnellantworten (WhatsApp Limit)",
      suggestion: "Reduzieren Sie auf maximal 13 Schnellantworten"
    });
  }

  quickReplies.forEach((reply: string, index: number) => {
    if (reply.length > 20) {
      warnings.push({
        id: `quick-reply-too-long-${node.id}-${index}`,
        type: "warning",
        nodeId: node.id,
        message: `Schnellantwort "${reply}" zu lang (max. 20 Zeichen)`,
        suggestion: "Kürzen Sie die Schnellantwort"
      });
    }
  });

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Validate condition node
 */
function validateConditionNode(node: Node): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const { conditions = [] } = node.data || {};

  // Must have at least one condition
  if (conditions.length === 0) {
    errors.push({
      id: `condition-no-conditions-${node.id}`,
      type: "error",
      nodeId: node.id,
      message: "Mindestens eine Bedingung erforderlich",
      severity: "high"
    });
  }

  // Validate each condition
  conditions.forEach((condition: any, index: number) => {
    if (!condition.keyword || condition.keyword.trim() === "") {
      errors.push({
        id: `condition-empty-keyword-${node.id}-${index}`,
        type: "error",
        nodeId: node.id,
        message: `Bedingung ${index + 1}: Schlüsselwort ist erforderlich`,
        severity: "medium"
      });
    }
  });

  // Check for duplicate keywords
  const keywords = conditions.map((c: any) => c.keyword?.toLowerCase()).filter(Boolean);
  const duplicates = keywords.filter((keyword: any, index: number) => keywords.indexOf(keyword) !== index);
  
  if (duplicates.length > 0) {
    warnings.push({
      id: `condition-duplicate-keywords-${node.id}`,
      type: "warning",
      nodeId: node.id,
      message: `Doppelte Schlüsselwörter: ${[...new Set(duplicates)].join(", ")}`,
      suggestion: "Verwenden Sie eindeutige Schlüsselwörter"
    });
  }

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Validate collect input node
 */
function validateCollectInputNode(node: Node): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const { prompt, variable, inputType, choices = [] } = node.data || {};

  // Prompt is required
  if (!prompt || prompt.trim() === "") {
    errors.push({
      id: `input-no-prompt-${node.id}`,
      type: "error",
      nodeId: node.id,
      message: "Eingabeaufforderung ist erforderlich",
      severity: "high"
    });
  }

  // Variable name is required
  if (!variable || variable.trim() === "") {
    errors.push({
      id: `input-no-variable-${node.id}`,
      type: "error",
      nodeId: node.id,
      message: "Variablenname ist erforderlich",
      severity: "high"
    });
  } else {
    // Check variable name format
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variable)) {
      errors.push({
        id: `input-invalid-variable-${node.id}`,
        type: "error",
        nodeId: node.id,
        message: "Ungültiger Variablenname (nur Buchstaben, Zahlen und _)",
        severity: "medium"
      });
    }
  }

  // Validate choices for choice type
  if (inputType === "choice") {
    if (choices.length === 0) {
      errors.push({
        id: `input-no-choices-${node.id}`,
        type: "error",
        nodeId: node.id,
        message: "Auswahlmöglichkeiten sind für Auswahltyp erforderlich",
        severity: "high"
      });
    } else if (choices.length > 10) {
      warnings.push({
        id: `input-too-many-choices-${node.id}`,
        type: "warning",
        nodeId: node.id,
        message: "Mehr als 10 Auswahlmöglichkeiten können unübersichtlich sein",
        suggestion: "Reduzieren Sie auf maximal 10 Optionen"
      });
    }
  }

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Validate handoff node
 */
function validateHandoffNode(node: Node): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const { message, department } = node.data || {};

  // Message is optional but should be meaningful if provided
  if (message && message.length > 1000) {
    warnings.push({
      id: `handoff-long-message-${node.id}`,
      type: "warning",
      nodeId: node.id,
      message: "Sehr lange Weiterleitung-Nachricht",
      suggestion: "Halten Sie die Nachricht kurz und prägnant"
    });
  }

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Validate flow connections
 */
function validateConnections(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check for cycles (infinite loops)
  const cycles = detectCycles(nodes, edges);
  cycles.forEach(cycle => {
    warnings.push({
      id: `cycle-detected-${cycle.join("-")}`,
      type: "warning",
      message: `Mögliche Endlosschleife erkannt: ${cycle.join(" → ")}`,
      suggestion: "Fügen Sie eine Ausstiegsbedingung hinzu"
    });
  });

  // Check for unreachable nodes
  const reachableNodes = findReachableNodes(nodes, edges);
  const unreachableNodes = nodes.filter(node => 
    node.type !== "start" && !reachableNodes.has(node.id)
  );

  unreachableNodes.forEach(node => {
    warnings.push({
      id: `unreachable-node-${node.id}`,
      type: "warning",
      nodeId: node.id,
      message: `Node "${node.data?.label || node.id}" ist nicht erreichbar`,
      suggestion: "Verbinden Sie den Node mit dem Hauptflow"
    });
  });

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Validate flow logic
 */
function validateFlowLogic(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check for missing end points
  const nodesWithoutOutgoing = nodes.filter(node => {
    const hasOutgoing = edges.some(edge => edge.source === node.id);
    return !hasOutgoing && node.type !== "end" && node.type !== "handoff";
  });

  nodesWithoutOutgoing.forEach(node => {
    warnings.push({
      id: `no-outgoing-${node.id}`,
      type: "warning",
      nodeId: node.id,
      message: `Node "${node.data?.label || node.id}" hat keine Ausgangsverbindung`,
      suggestion: "Fügen Sie eine Verbindung hinzu oder beenden Sie mit einem End-Node"
    });
  });

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Detect cycles in the flow
 */
function detectCycles(nodes: Node[], edges: Edge[]): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const adjacencyList = new Map<string, string[]>();
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    const targets = adjacencyList.get(edge.source) || [];
    targets.push(edge.target);
    adjacencyList.set(edge.source, targets);
  });

  function dfs(nodeId: string, path: string[]): void {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, path);
      } else if (recursionStack.has(neighbor)) {
        const cycleStart = path.indexOf(neighbor);
        cycles.push(path.slice(cycleStart));
      }
    }

    recursionStack.delete(nodeId);
    path.pop();
  }

  const startNodes = nodes.filter(node => node.type === "start");
  startNodes.forEach(startNode => {
    if (!visited.has(startNode.id)) {
      dfs(startNode.id, []);
    }
  });

  return cycles;
}

/**
 * Find all reachable nodes from start nodes
 */
function findReachableNodes(nodes: Node[], edges: Edge[]): Set<string> {
  const reachable = new Set<string>();
  const startNodes = nodes.filter(node => node.type === "start");

  const adjacencyList = new Map<string, string[]>();
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    const targets = adjacencyList.get(edge.source) || [];
    targets.push(edge.target);
    adjacencyList.set(edge.source, targets);
  });

  function dfs(nodeId: string): void {
    if (reachable.has(nodeId)) return;
    reachable.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    neighbors.forEach(neighbor => dfs(neighbor));
  }

  startNodes.forEach(startNode => dfs(startNode.id));

  return reachable;
}

/**
 * Quick validation for UI feedback
 */
export function quickValidate(nodes: Node[], edges: Edge[]): { isValid: boolean; errorCount: number; warningCount: number } {
  const result = validateFlow(nodes, edges);
  return {
    isValid: result.isValid,
    errorCount: result.errors.length,
    warningCount: result.warnings.length
  };
}
