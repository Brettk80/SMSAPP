import React, { useState } from 'react';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { validatePhoneNumber, formatPhoneNumber } from '../utils/telnyx';

type NewChatDialogProps = {
  onNewChat: (name: string, phoneNumber: string) => void;
};

export function NewChatDialog({ onNewChat }: NewChatDialogProps) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      if (!validatePhoneNumber(formattedPhone)) {
        setError('Please enter a valid US/Canada phone number');
        return;
      }

      onNewChat(name.trim(), formattedPhone);
      setName('');
      setPhoneNumber('');
      document.getElementById('new-chat-modal')?.close();
    } catch (err) {
      setError('Invalid phone number format');
    }
  };

  return (
    <div className="relative inline-block">
      <button 
        onClick={() => document.getElementById('new-chat-modal')?.showModal()}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <PlusCircle className="h-5 w-5 text-gray-600" />
      </button>
      <dialog id="new-chat-modal" className="modal p-6 rounded-lg shadow-xl backdrop:bg-black/50">
        <h3 className="text-xl font-semibold mb-4">Start New Chat</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contact name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 555-5555"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a US or Canada phone number
            </p>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => document.getElementById('new-chat-modal')?.close()}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Chat
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}