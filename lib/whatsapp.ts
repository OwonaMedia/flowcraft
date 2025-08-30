// BotChat Pro - WhatsApp Business API Integration
// 360dialog EU BSP für DSGVO-konforme WhatsApp Kommunikation

interface WhatsAppMessage {
  to: string;
  type: "text" | "template" | "image" | "document";
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: any[];
  };
  image?: {
    link: string;
    caption?: string;
  };
  document?: {
    link: string;
    filename: string;
    caption?: string;
  };
}

interface WhatsAppWebhookMessage {
  id: string;
  from: string;
  timestamp: string;
  type: "text" | "image" | "document" | "audio" | "video";
  text?: {
    body: string;
  };
  image?: {
    id: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
  document?: {
    id: string;
    filename: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
}

class WhatsAppAPI {
  private apiUrl: string;
  private accessToken: string;

  constructor(apiUrl: string = process.env.WHATSAPP_API_URL!, accessToken: string = process.env.WHATSAPP_API_TOKEN!) {
    this.apiUrl = apiUrl;
    this.accessToken = accessToken;
  }

  /**
   * Send a WhatsApp message
   */
  async sendMessage(phoneNumberId: string, message: WhatsAppMessage): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'D360-API-KEY': this.accessToken, // 360dialog specific header
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          ...message,
        }),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      throw error;
    }
  }

  /**
   * Send a simple text message
   */
  async sendTextMessage(phoneNumberId: string, to: string, text: string): Promise<any> {
    return this.sendMessage(phoneNumberId, {
      to,
      type: "text",
      text: { body: text },
    });
  }

  /**
   * Send a template message
   */
  async sendTemplateMessage(
    phoneNumberId: string,
    to: string,
    templateName: string,
    languageCode: string = "de",
    components?: any[]
  ): Promise<any> {
    return this.sendMessage(phoneNumberId, {
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components,
      },
    });
  }

  /**
   * Download media from WhatsApp
   */
  async downloadMedia(mediaId: string): Promise<Buffer> {
    try {
      // First, get the media URL
      const mediaResponse = await fetch(`${this.apiUrl}/v1/media/${mediaId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'D360-API-KEY': this.accessToken,
        },
      });

      if (!mediaResponse.ok) {
        throw new Error(`Failed to get media URL: ${mediaResponse.status}`);
      }

      const { url } = await mediaResponse.json();

      // Then download the actual media
      const downloadResponse = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'D360-API-KEY': this.accessToken,
        },
      });

      if (!downloadResponse.ok) {
        throw new Error(`Failed to download media: ${downloadResponse.status}`);
      }

      return Buffer.from(await downloadResponse.arrayBuffer());
    } catch (error) {
      console.error('Failed to download WhatsApp media:', error);
      throw error;
    }
  }

  /**
   * Upload media to WhatsApp
   */
  async uploadMedia(phoneNumberId: string, media: Buffer, type: string, filename?: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('messaging_product', 'whatsapp');
      formData.append('file', new Blob([new Uint8Array(media)], { type }), filename || 'file');
      formData.append('type', type);

      const response = await fetch(`${this.apiUrl}/v1/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'D360-API-KEY': this.accessToken,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload media: ${response.status}`);
      }

      const { id } = await response.json();
      return id;
    } catch (error) {
      console.error('Failed to upload WhatsApp media:', error);
      throw error;
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(phoneNumberId: string, messageId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'D360-API-KEY': this.accessToken,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      return false;
    }
  }
}

/**
 * Validate WhatsApp webhook signature (for security)
 */
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string = process.env.WHATSAPP_WEBHOOK_SECRET!
): boolean {
  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  } catch (error) {
    console.error('Failed to validate webhook signature:', error);
    return false;
  }
}

/**
 * Extract phone number from WhatsApp format (+49123456789 -> 49123456789)
 */
export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/^\+/, '').replace(/\D/g, '');
}

/**
 * Format phone number for display (+49123456789)
 */
export function formatPhoneNumber(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  return `+${normalized}`;
}

// Export singleton instance
export const whatsapp = new WhatsAppAPI();

// Export types
export type { WhatsAppMessage, WhatsAppWebhookMessage };
