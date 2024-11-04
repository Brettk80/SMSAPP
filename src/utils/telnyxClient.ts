import { env } from './env';

export class TelnyxClient {
  private static instance: TelnyxClient;
  private readonly apiKey: string;
  private readonly messagingProfileId: string;

  private constructor() {
    if (!env.isConfigured) {
      throw new Error('Telnyx environment variables not properly configured');
    }
    this.apiKey = env.TELNYX_API_KEY;
    this.messagingProfileId = env.TELNYX_MESSAGING_PROFILE_ID;
  }

  public static getInstance(): TelnyxClient {
    if (!TelnyxClient.instance) {
      TelnyxClient.instance = new TelnyxClient();
    }
    return TelnyxClient.instance;
  }

  public async sendMessage(to: string, text: string, mediaUrls?: string[]) {
    const response = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        to,
        text,
        messaging_profile_id: this.messagingProfileId,
        ...(mediaUrls && { media_urls: mediaUrls }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.detail || 'Failed to send message');
    }

    return response.json();
  }

  public async getMessageStatus(messageId: string) {
    const response = await fetch(`https://api.telnyx.com/v2/messages/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get message status');
    }

    return response.json();
  }
}