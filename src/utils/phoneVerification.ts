import { User, PhoneVerification } from '../types';
import { validatePhoneNumber, formatPhoneNumber, sendMessage } from './telnyx';

// In a real app, these would be environment variables
const MAX_VERIFICATION_ATTEMPTS = 3;
const VERIFICATION_CODE_LENGTH = 6;
const VERIFICATION_EXPIRY_MINUTES = 10;

export function generateVerificationCode(): string {
  return Math.random().toString().substring(2, 2 + VERIFICATION_CODE_LENGTH);
}

export function isVerificationExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}

export function createVerification(userId: string, phoneNumber: string): PhoneVerification {
  return {
    userId,
    phoneNumber: formatPhoneNumber(phoneNumber),
    verificationCode: generateVerificationCode(),
    attempts: 0,
    expiresAt: new Date(Date.now() + VERIFICATION_EXPIRY_MINUTES * 60000),
    verified: false,
  };
}

export async function sendVerificationCode(
  telnyxApiKey: string,
  fromNumber: string,
  verification: PhoneVerification
): Promise<boolean> {
  const message = `Your verification code is: ${verification.verificationCode}. It will expire in ${VERIFICATION_EXPIRY_MINUTES} minutes.`;
  
  const result = await sendMessage(
    telnyxApiKey,
    fromNumber,
    verification.phoneNumber,
    message
  );

  return result.success;
}

export function verifyCode(
  verification: PhoneVerification,
  code: string
): { success: boolean; error?: string } {
  if (verification.verified) {
    return { success: false, error: 'Phone number already verified' };
  }

  if (isVerificationExpired(verification.expiresAt)) {
    return { success: false, error: 'Verification code expired' };
  }

  if (verification.attempts >= MAX_VERIFICATION_ATTEMPTS) {
    return { success: false, error: 'Too many verification attempts' };
  }

  if (verification.verificationCode !== code) {
    verification.attempts++;
    return { success: false, error: 'Invalid verification code' };
  }

  verification.verified = true;
  return { success: true };
}