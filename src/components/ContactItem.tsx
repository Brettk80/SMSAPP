import React from 'react';
import { Trash2 } from 'lucide-react';
import { Contact } from '../types';

type ContactItemProps = {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
};

export function ContactItem({ contact, isSelected, onClick, onDelete }: ContactItemProps) {
  return (
    <div 
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? 'bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={contact.avatar}
            alt=""
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
          {contact.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {contact.unreadCount}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <p className="font-medium text-gray-900 truncate">{contact.name}</p>
            {contact.lastMessageTime && (
              <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
            )}
          </div>
          {contact.lastMessage && (
            <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
          )}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
        </button>
      </div>
    </div>
  );
}