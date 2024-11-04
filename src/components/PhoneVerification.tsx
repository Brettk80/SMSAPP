import React, { useState } from 'react';
import { Phone, Shield, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { validatePhoneNumber, formatPhoneNumber } from '../utils/telnyx';
import { sendVerificationCode, verifyCode } from '../utils/phoneVerification';

interface PhoneVerificationProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export function PhoneVerification({ user, onUpdateUser }: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async () => {
    try {
      setError('');
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      if (!validatePhoneNumber(formattedPhone)) {
        setError('Please enter a valid US/Canada phone number');
        return;
      }

      if (!user.telnyxApiKey) {
        setError('Telnyx API key not configured');
        return;
      }

      // In a real app, this would call your backend API
      const verification = await sendVerificationCode(
        user.telnyxApiKey,
        user.phoneNumber,
        {
          userId: user.id,
          phoneNumber: formattedPhone,
          verificationCode: '',
          attempts: 0,
          expiresAt: new Date(),
          verified: false
        }
      );

      if (verification) {
        setCodeSent(true);
        setIsVerifying(true);
      } else {
        setError('Failed to send verification code');
      }
    } catch (err) {
      setError('An error occurred while sending the verification code');
    }
  };

  const handleVerifyCode = async () => {
    try {
      setError('');

      // In a real app, this would call your backend API
      const result = verifyCode({
        userId: user.id,
        phoneNumber: formatPhoneNumber(phoneNumber),
        verificationCode,
        attempts: 0,
        expiresAt: new Date(),
        verified: false
      }, verificationCode);

      if (result.success) {
        onUpdateUser({
          ...user,
          phoneNumber: formatPhoneNumber(phoneNumber),
          phoneVerified: true
        });
        setIsVerifying(false);
      } else {
        setError(result.error || 'Verification failed');
      }
    } catch (err) {
      setError('An error occurred during verification');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex items-center gap-2 mb-4">
        <Phone className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-medium">Phone Verification</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (E.164 format)
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              disabled={isVerifying}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {!isVerifying && (
              <button
                onClick={handleSendCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Code
              </button>
            )}
          </div>
        </div>

        {isVerifying && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleVerifyCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Verify
              </button>
            </div>
            {codeSent && (
              <p className="mt-2 text-sm text-gray-500">
                A verification code has been sent to your phone
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {user.phoneVerified && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Shield className="h-4 w-4" />
            <span>Phone number verified</span>
          </div>
        )}
      </div>
    </div>
  );
}