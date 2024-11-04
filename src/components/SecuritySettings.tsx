import React, { useState } from 'react';
import { User } from '../types';
import { QrCode, Lock, Shield, Phone } from 'lucide-react';
import { validatePhoneNumber, formatPhoneNumber } from '../utils/telnyx';

interface SecuritySettingsProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onChangePassword: (currentPassword: string, newPassword: string) => void;
}

export function SecuritySettings({ user, onUpdateUser, onChangePassword }: SecuritySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    onChangePassword(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium">Change Password</h3>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* 2FA Section */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">2FA Status</p>
              <p className="text-sm text-gray-500">
                {user.is2FAEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <button
              onClick={() => onUpdateUser({ ...user, is2FAEnabled: !user.is2FAEnabled })}
              className={`px-4 py-2 rounded-md transition-colors ${
                user.is2FAEnabled
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {user.is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
          {user.is2FAEnabled && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <QrCode className="h-5 w-5 text-gray-600" />
                <p className="font-medium">Scan QR Code</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-dashed">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Example:user@example.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=Example"
                  alt="2FA QR Code"
                  className="mx-auto"
                  width={200}
                  height={200}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messaging Settings */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium">Messaging Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Phone Number (E.164 format)
            </label>
            <input
              type="tel"
              value={user.phoneNumber || ''}
              onChange={(e) => {
                try {
                  const formatted = formatPhoneNumber(e.target.value);
                  if (validatePhoneNumber(formatted)) {
                    onUpdateUser({ ...user, phoneNumber: formatted });
                  }
                } catch (err) {
                  // Handle invalid input silently
                }
              }}
              placeholder="+1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              This is the number that will be used for sending messages
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telnyx API Key
            </label>
            <input
              type="password"
              value={user.telnyxApiKey || ''}
              onChange={(e) => onUpdateUser({ ...user, telnyxApiKey: e.target.value })}
              placeholder="Enter your Telnyx API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Messaging Profile ID
            </label>
            <input
              type="text"
              value={user.messagingProfileId || ''}
              onChange={(e) => onUpdateUser({ ...user, messagingProfileId: e.target.value })}
              placeholder="Enter your Messaging Profile ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}