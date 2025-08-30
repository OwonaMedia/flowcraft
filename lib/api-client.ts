// BotChat Pro - API Client
// Client-side API functions for bot management

import { useState, useEffect } from 'react';
import type { Node, Edge } from "reactflow";

export interface Bot {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  welcomeMessage?: string;
  fallbackMessage: string;
  whatsappPhoneId?: string;
  isConnected: boolean;
  stats?: {
    messages: number;
    contacts: number;
    conversions: number;
  };
  flows?: BotFlow[];
}

export interface BotFlow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  nodes: {
    nodes: Node[];
    edges: Edge[];
  };
  triggerType: string;
  triggerValue?: string;
}

export interface CreateBotRequest {
  name: string;
  description?: string;
  welcomeMessage?: string;
  fallbackMessage?: string;
}

export interface UpdateBotRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
  isPublished?: boolean;
  welcomeMessage?: string;
  fallbackMessage?: string;
  flows?: {
    nodes: Node[];
    edges: Edge[];
  };
  whatsappPhoneId?: string;
  whatsappToken?: string;
}

class ApiClient {
  private baseUrl = '/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Bot CRUD operations
  async getBots(): Promise<{ bots: Bot[] }> {
    return this.request('/bots');
  }

  async getBot(id: string): Promise<{ bot: Bot }> {
    return this.request(`/bots/${id}`);
  }

  async createBot(data: CreateBotRequest): Promise<{ bot: Bot }> {
    return this.request('/bots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBot(id: string, data: UpdateBotRequest): Promise<{ bot: Bot }> {
    return this.request(`/bots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBot(id: string): Promise<{ success: boolean }> {
    return this.request(`/bots/${id}`, {
      method: 'DELETE',
    });
  }

  // Bot Flow operations
  async saveBotFlow(botId: string, nodes: Node[], edges: Edge[]): Promise<{ bot: Bot }> {
    return this.updateBot(botId, {
      flows: { nodes, edges },
    });
  }

  async toggleBotStatus(id: string, isActive: boolean): Promise<{ bot: Bot }> {
    return this.updateBot(id, { isActive });
  }

  async publishBot(id: string, isPublished: boolean): Promise<{ bot: Bot }> {
    return this.updateBot(id, { isPublished });
  }

  // WhatsApp integration
  async connectWhatsApp(botId: string, phoneId: string, token: string): Promise<{ bot: Bot }> {
    return this.updateBot(botId, {
      whatsappPhoneId: phoneId,
      whatsappToken: token,
    });
  }

  async testWhatsAppConnection(phoneId: string, token: string): Promise<{ success: boolean; message: string }> {
    return this.request('/whatsapp/test', {
      method: 'POST',
      body: JSON.stringify({ phoneId, token }),
    });
  }

  // Analytics
  async getBotAnalytics(botId: string, days: number = 7): Promise<any> {
    return this.request(`/bots/${botId}/analytics?days=${days}`);
  }

  // Templates
  async getBotTemplates(): Promise<{ templates: any[] }> {
    return this.request('/templates');
  }

  async createBotFromTemplate(templateId: string, botName: string): Promise<{ bot: Bot }> {
    return this.request('/bots/from-template', {
      method: 'POST',
      body: JSON.stringify({ templateId, name: botName }),
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// React hooks for API operations
export function useBots() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBots = async () => {
    try {
      setLoading(true);
      setError(null);
      const { bots } = await apiClient.getBots();
      setBots(bots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bots');
    } finally {
      setLoading(false);
    }
  };

  const createBot = async (data: CreateBotRequest): Promise<Bot> => {
    const { bot } = await apiClient.createBot(data);
    setBots(prev => [bot, ...prev]);
    return bot;
  };

  const updateBot = async (id: string, data: UpdateBotRequest): Promise<Bot> => {
    const { bot } = await apiClient.updateBot(id, data);
    setBots(prev => prev.map(b => b.id === id ? bot : b));
    return bot;
  };

  const deleteBot = async (id: string): Promise<void> => {
    await apiClient.deleteBot(id);
    setBots(prev => prev.filter(b => b.id !== id));
  };

  const toggleBotStatus = async (id: string, isActive: boolean): Promise<void> => {
    await updateBot(id, { isActive });
  };

  useEffect(() => {
    fetchBots();
  }, []);

  return {
    bots,
    loading,
    error,
    refetch: fetchBots,
    createBot,
    updateBot,
    deleteBot,
    toggleBotStatus,
  };
}

export function useBot(id: string) {
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBot = async () => {
    try {
      setLoading(true);
      setError(null);
      const { bot } = await apiClient.getBot(id);
      setBot(bot);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bot');
    } finally {
      setLoading(false);
    }
  };

  const updateBot = async (data: UpdateBotRequest): Promise<Bot> => {
    const { bot: updatedBot } = await apiClient.updateBot(id, data);
    setBot(updatedBot);
    return updatedBot;
  };

  const saveFlow = async (nodes: Node[], edges: Edge[]): Promise<Bot> => {
    const { bot: updatedBot } = await apiClient.saveBotFlow(id, nodes, edges);
    setBot(updatedBot);
    return updatedBot;
  };

  useEffect(() => {
    if (id) {
      fetchBot();
    }
  }, [id]);

  return {
    bot,
    loading,
    error,
    refetch: fetchBot,
    updateBot,
    saveFlow,
  };
}


