// Environment variable validation and access
export const env = {
  TELNYX_API_KEY: process.env.TELNYX_API_KEY || '',
  TELNYX_PUBLIC_KEY: process.env.TELNYX_PUBLIC_KEY || '', // For webhook verification
  TELNYX_MESSAGING_PROFILE_ID: process.env.TELNYX_MESSAGING_PROFILE_ID || '',
  WEBHOOK_SIGNING_SECRET: process.env.WEBHOOK_SIGNING_SECRET || '',
  get isConfigured() {
    return !!(
      this.TELNYX_API_KEY &&
      this.TELNYX_PUBLIC_KEY &&
      this.TELNYX_MESSAGING_PROFILE_ID &&
      this.WEBHOOK_SIGNING_SECRET
    );
  }
};