#!/usr/bin/env node

/**
 * 🤖 FlowCraft MCP Server
 * Model Context Protocol Server für WhatsApp Bot Management
 * 
 * Features:
 * - Bot Flow Management
 * - Supabase Integration
 * - GDPR-compliant Data Handling
 * - Real-time Chat Integration
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Environment Variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const FLOWCRAFT_BASE_URL = process.env.FLOWCRAFT_BASE_URL || 'http://91.99.232.126:3001';

// Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Schemas für Tool Validation
const CreateBotFlowSchema = z.object({
  name: z.string().min(1, "Bot name ist erforderlich"),
  description: z.string().optional(),
  triggerKeywords: z.array(z.string()).min(1, "Mindestens ein Trigger-Keyword erforderlich"),
  flows: z.array(z.object({
    id: z.string(),
    type: z.enum(['message', 'condition', 'input', 'handoff']),
    content: z.record(z.any()),
    nextNodes: z.array(z.string()).optional()
  })).min(1, "Mindestens ein Flow-Node erforderlich"),
  isActive: z.boolean().default(true)
});

const GetUserBotsSchema = z.object({
  userId: z.string().uuid("Gültige User ID erforderlich"),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0)
});

const UpdateBotStatusSchema = z.object({
  botId: z.string().uuid("Gültige Bot ID erforderlich"),
  isActive: z.boolean(),
  userId: z.string().uuid("Gültige User ID erforderlich")
});

const GetBotAnalyticsSchema = z.object({
  botId: z.string().uuid("Gültige Bot ID erforderlich"),
  timeframe: z.enum(['24h', '7d', '30d', '90d']).default('7d'),
  metrics: z.array(z.enum(['messages', 'users', 'conversions', 'errors'])).default(['messages', 'users'])
});

class FlowCraftMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "flowcraft-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    // Tool: Bot Flow erstellen
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "create_bot_flow",
            description: "Erstellt einen neuen WhatsApp Bot mit Flows und Triggern",
            inputSchema: {
              type: "object",
              properties: {
                name: { type: "string", description: "Name des Bots" },
                description: { type: "string", description: "Beschreibung des Bots" },
                triggerKeywords: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "Keywords die den Bot triggern" 
                },
                flows: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      type: { type: "string", enum: ["message", "condition", "input", "handoff"] },
                      content: { type: "object" },
                      nextNodes: { type: "array", items: { type: "string" } }
                    }
                  },
                  description: "Flow-Konfiguration"
                },
                isActive: { type: "boolean", description: "Bot aktiv/inaktiv" }
              },
              required: ["name", "triggerKeywords", "flows"]
            }
          },
          {
            name: "get_user_bots",
            description: "Holt alle Bots eines Users mit Pagination",
            inputSchema: {
              type: "object",
              properties: {
                userId: { type: "string", format: "uuid", description: "User ID" },
                limit: { type: "number", minimum: 1, maximum: 100, description: "Anzahl Bots" },
                offset: { type: "number", minimum: 0, description: "Offset für Pagination" }
              },
              required: ["userId"]
            }
          },
          {
            name: "update_bot_status",
            description: "Aktiviert/Deaktiviert einen Bot",
            inputSchema: {
              type: "object",
              properties: {
                botId: { type: "string", format: "uuid", description: "Bot ID" },
                isActive: { type: "boolean", description: "Neuer Status" },
                userId: { type: "string", format: "uuid", description: "User ID für Berechtigung" }
              },
              required: ["botId", "isActive", "userId"]
            }
          },
          {
            name: "get_bot_analytics",
            description: "Holt Analytics für einen Bot (GDPR-konform)",
            inputSchema: {
              type: "object",
              properties: {
                botId: { type: "string", format: "uuid", description: "Bot ID" },
                timeframe: { 
                  type: "string", 
                  enum: ["24h", "7d", "30d", "90d"],
                  description: "Zeitraum für Analytics" 
                },
                metrics: {
                  type: "array",
                  items: { type: "string", enum: ["messages", "users", "conversions", "errors"] },
                  description: "Gewünschte Metriken"
                }
              },
              required: ["botId"]
            }
          },
          {
            name: "test_whatsapp_connection",
            description: "Testet die WhatsApp Business API Verbindung",
            inputSchema: {
              type: "object",
              properties: {
                phoneNumber: { type: "string", description: "Test-Telefonnummer" },
                message: { type: "string", description: "Test-Nachricht" }
              },
              required: ["phoneNumber", "message"]
            }
          },
          {
            name: "validate_flow_syntax",
            description: "Validiert Flow-Syntax vor dem Speichern",
            inputSchema: {
              type: "object",
              properties: {
                flows: {
                  type: "array",
                  items: { type: "object" },
                  description: "Flow-Konfiguration zur Validierung"
                }
              },
              required: ["flows"]
            }
          }
        ]
      };
    });

    // Tool Handler: Bot Flow erstellen
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "create_bot_flow":
            return await this.createBotFlow(args);
          
          case "get_user_bots":
            return await this.getUserBots(args);
          
          case "update_bot_status":
            return await this.updateBotStatus(args);
          
          case "get_bot_analytics":
            return await this.getBotAnalytics(args);
          
          case "test_whatsapp_connection":
            return await this.testWhatsAppConnection(args);
          
          case "validate_flow_syntax":
            return await this.validateFlowSyntax(args);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Tool "${name}" nicht gefunden`
            );
        }
      } catch (error) {
        console.error(`Error in tool ${name}:`, error);
        
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Fehler bei Tool "${name}": ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async createBotFlow(args: any) {
    const validatedArgs = CreateBotFlowSchema.parse(args);
    
    try {
      // Bot in Supabase erstellen
      const { data: bot, error: botError } = await supabase
        .from('bots')
        .insert({
          name: validatedArgs.name,
          description: validatedArgs.description,
          trigger_keywords: validatedArgs.triggerKeywords,
          is_active: validatedArgs.isActive,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (botError) {
        throw new Error(`Supabase Bot Error: ${botError.message}`);
      }

      // Flow-Konfiguration speichern
      const { data: flowConfig, error: flowError } = await supabase
        .from('bot_flows')
        .insert({
          bot_id: bot.id,
          flow_config: validatedArgs.flows,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (flowError) {
        // Rollback: Bot löschen falls Flow-Erstellung fehlschlägt
        await supabase.from('bots').delete().eq('id', bot.id);
        throw new Error(`Supabase Flow Error: ${flowError.message}`);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: `Bot "${validatedArgs.name}" erfolgreich erstellt`,
              data: {
                bot: {
                  id: bot.id,
                  name: bot.name,
                  isActive: bot.is_active,
                  triggerKeywords: bot.trigger_keywords
                },
                flowConfig: {
                  id: flowConfig.id,
                  nodeCount: validatedArgs.flows.length
                },
                urls: {
                  edit: `${FLOWCRAFT_BASE_URL}/dashboard/bots/${bot.id}/edit`,
                  preview: `${FLOWCRAFT_BASE_URL}/dashboard/bots/${bot.id}/preview`
                }
              }
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Create Bot Flow Error:', error);
      throw new McpError(
        ErrorCode.InternalError,
        `Bot-Erstellung fehlgeschlagen: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async getUserBots(args: any) {
    const validatedArgs = GetUserBotsSchema.parse(args);
    
    try {
      const { data: bots, error } = await supabase
        .from('bots')
        .select(`
          id,
          name,
          description,
          trigger_keywords,
          is_active,
          created_at,
          bot_flows!inner(
            id,
            flow_config
          )
        `)
        .eq('user_id', validatedArgs.userId)
        .range(validatedArgs.offset, validatedArgs.offset + validatedArgs.limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Supabase Error: ${error.message}`);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              data: {
                bots: bots.map(bot => ({
                  id: bot.id,
                  name: bot.name,
                  description: bot.description,
                  triggerKeywords: bot.trigger_keywords,
                  isActive: bot.is_active,
                  createdAt: bot.created_at,
                  flowNodeCount: bot.bot_flows?.[0]?.flow_config?.length || 0
                })),
                pagination: {
                  offset: validatedArgs.offset,
                  limit: validatedArgs.limit,
                  total: bots.length
                }
              }
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Bot-Abruf fehlgeschlagen: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async updateBotStatus(args: any) {
    const validatedArgs = UpdateBotStatusSchema.parse(args);
    
    try {
      // Berechtigung prüfen
      const { data: bot, error: checkError } = await supabase
        .from('bots')
        .select('id, user_id, name')
        .eq('id', validatedArgs.botId)
        .eq('user_id', validatedArgs.userId)
        .single();

      if (checkError || !bot) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          "Bot nicht gefunden oder keine Berechtigung"
        );
      }

      // Status aktualisieren
      const { error: updateError } = await supabase
        .from('bots')
        .update({ 
          is_active: validatedArgs.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', validatedArgs.botId);

      if (updateError) {
        throw new Error(`Update Error: ${updateError.message}`);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: `Bot "${bot.name}" ${validatedArgs.isActive ? 'aktiviert' : 'deaktiviert'}`,
              data: {
                botId: validatedArgs.botId,
                isActive: validatedArgs.isActive,
                updatedAt: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InternalError,
        `Status-Update fehlgeschlagen: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async getBotAnalytics(args: any) {
    const validatedArgs = GetBotAnalyticsSchema.parse(args);
    
    // GDPR-konforme Analytics - nur aggregierte, anonymisierte Daten
    try {
      const { data: analytics, error } = await supabase
        .from('bot_analytics')
        .select('metric_type, metric_value, recorded_at')
        .eq('bot_id', validatedArgs.botId)
        .gte('recorded_at', this.getTimeframeDate(validatedArgs.timeframe))
        .in('metric_type', validatedArgs.metrics);

      if (error) {
        throw new Error(`Analytics Error: ${error.message}`);
      }

      // Daten aggregieren
      const aggregatedData = this.aggregateAnalytics(analytics || [], validatedArgs.metrics);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              data: {
                botId: validatedArgs.botId,
                timeframe: validatedArgs.timeframe,
                metrics: aggregatedData,
                gdprNote: "Alle Daten anonymisiert und GDPR-konform",
                generatedAt: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Analytics-Abruf fehlgeschlagen: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async testWhatsAppConnection(args: any) {
    // Simulation der WhatsApp API Verbindung
    try {
      const response = await fetch(`${FLOWCRAFT_BASE_URL}/api/whatsapp/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: args.phoneNumber,
          message: args.message || "FlowCraft Test - Verbindung erfolgreich! 🤖"
        })
      });

      const result = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: response.ok,
              message: response.ok ? "WhatsApp Verbindung erfolgreich getestet" : "WhatsApp Verbindungstest fehlgeschlagen",
              data: {
                statusCode: response.status,
                testNumber: args.phoneNumber,
                response: result,
                timestamp: new Date().toISOString()
              }
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              message: "WhatsApp API nicht erreichbar",
              error: error instanceof Error ? error.message : String(error),
              recommendation: "Prüfen Sie die 360dialog Konfiguration und API-Keys"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async validateFlowSyntax(args: any) {
    try {
      const flows = args.flows;
      const errors: string[] = [];
      const warnings: string[] = [];

      // Flow-Validierung
      flows.forEach((flow: any, index: number) => {
        if (!flow.id) {
          errors.push(`Flow ${index}: ID fehlt`);
        }
        
        if (!['message', 'condition', 'input', 'handoff'].includes(flow.type)) {
          errors.push(`Flow ${index}: Ungültiger Type "${flow.type}"`);
        }
        
        if (!flow.content) {
          errors.push(`Flow ${index}: Content fehlt`);
        }
        
        // Type-spezifische Validierung
        if (flow.type === 'message' && !flow.content?.text) {
          errors.push(`Flow ${index}: Message-Node benötigt Text`);
        }
        
        if (flow.type === 'condition' && !flow.content?.condition) {
          warnings.push(`Flow ${index}: Condition-Node sollte Bedingung haben`);
        }
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              valid: errors.length === 0,
              errors,
              warnings,
              flowCount: flows.length,
              message: errors.length === 0 ? "Flow-Syntax ist gültig" : "Flow-Syntax hat Fehler",
              validatedAt: new Date().toISOString()
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Flow-Validierung fehlgeschlagen: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private getTimeframeDate(timeframe: string): string {
    const now = new Date();
    switch (timeframe) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  private aggregateAnalytics(analytics: any[], metrics: string[]) {
    const result: Record<string, any> = {};
    
    metrics.forEach(metric => {
      const metricData = analytics.filter(a => a.metric_type === metric);
      result[metric] = {
        total: metricData.reduce((sum, item) => sum + (item.metric_value || 0), 0),
        average: metricData.length > 0 ? metricData.reduce((sum, item) => sum + (item.metric_value || 0), 0) / metricData.length : 0,
        count: metricData.length
      };
    });
    
    return result;
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("🤖 FlowCraft MCP Server läuft auf stdio");
  }
}

// Server starten
const server = new FlowCraftMCPServer();
server.run().catch((error) => {
  console.error("Fehler beim Starten des MCP Servers:", error);
  process.exit(1);
});
