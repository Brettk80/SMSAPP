import { createHmac } from 'crypto';
import { env } from './env';

interface TelnyxWebhookPayload {
  data: {
    event_type: string;
    id: string;
    occurred_at: string;
    payload: {
      from: { phone_number: string };
      to: { phone_number: string };
      text: string;
      media_urls?: string[];
    };
  };
}

export function verifyTelnyxSignature(
  signature: string,
  timestamp: string,
  body: string
): boolean {
  const toSign = `${timestamp}|${body}`;
  const hmac = createHmac('sha256', env.WEBHOOK_SIGNING_SECRET);
  const expectedSignature = hmac.update(toSign).digest('hex');
  return signature === expectedSignature;
}

export async function handleIncomingMessage(payload: TelnyxWebhookPayload) {
  const { data } = payload;
  
  if (data.event_type !== 'message.received') {
    return;
  }

  const message = {
    id: data.id,
    from: data.payload.from.phone_number,
    to: data.payload.to.phone_number,
    text: data.payload.text,
    mediaUrls: data.payload.media_urls,
    timestamp: new Date(data.occurred_at)
  };

  // Store the message in your database
  await storeMessage(message);

  // Emit event for real-time updates
  emitNewMessage(message);
}

async function storeMessage(message: any) {
  // Implement your database storage logic here
  console.log('Storing message:', message);
}

function emitNewMessage(message: any) {
  // Implement your real-time update logic here
  console.log('Emitting message:', message);
}