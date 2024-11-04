import React from 'react';
import { Message } from '../types';

type ChatMessageProps = {
  message: Message;
  isOwn: boolean;
};

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] rounded-2xl p-3 ${
        isOwn 
          ? 'bg-blue-600 text-white ml-12' 
          : 'bg-gray-100 text-gray-900 mr-12'
      }`}>
        <p className="text-sm">{message.content}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.status && isOwn && (
            <span className="text-xs text-blue-100">{message.status}</span>
          )}
        </div>
      </div>
    </div>
  );
}