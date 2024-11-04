import express from 'express';
import cors from 'cors';
import { verifyTelnyxSignature, handleIncomingMessage } from '../src/utils/webhookHandler';

const app = express();
app.use(express.json());
app.use(cors());

// Webhook endpoint for Telnyx
app.post('/webhook/telnyx', async (req, res) => {
  const signature = req.header('telnyx-signature-ed25519');
  const timestamp = req.header('telnyx-timestamp');

  if (!signature || !timestamp) {
    return res.status(400).json({ error: 'Missing required headers' });
  }

  // Verify webhook signature
  const isValid = verifyTelnyxSignature(signature, timestamp, JSON.stringify(req.body));
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  try {
    await handleIncomingMessage(req.body);
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});