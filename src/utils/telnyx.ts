import { Message } from '../types';

const TELNYX_API_URL = 'https://api.telnyx.com/v2';

export async function sendMessage(
  apiKey: string,
  from: string,
  to: string,
  text: string,
  mediaUrl?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!validatePhoneNumber(from) || !validatePhoneNumber(to)) {
      throw new Error('Invalid phone number format');
    }

    const payload: any = {
      from,
      to,
      text,
    };

    if (mediaUrl) {
      payload.media_urls = [mediaUrl];
    }

    const response = await fetch(`${TELNYX_API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Failed to send message');
    }

    return {
      success: true,
      messageId: data.data.id,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add + prefix if not present and ensure E.164 format for US/Canada
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  throw new Error('Invalid phone number format');
}

export function validatePhoneNumber(phone: string): boolean {
  // E.164 validation for US/Canada numbers
  const regex = /^\+1[2-9]\d{9}$/;
  return regex.test(phone);
}

export function maskPhoneNumber(phone: string): string {
  if (!validatePhoneNumber(phone)) return phone;
  return phone.replace(/(\+1)(\d{3})(\d{3})(\d{4})/, '$1 ($2) ***-$4');
}