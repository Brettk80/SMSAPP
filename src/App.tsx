import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, Paperclip, Send, Smile, MessageCircle } from 'lucide-react';
import { NewChatDialog } from './components/NewChatDialog';
import { ChatMessage } from './components/ChatMessage';
import { ContactItem } from './components/ContactItem';
import { MenuDialog } from './components/MenuDialog';
import { Contact, Message, User } from './types';

export default function ChatInterface() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      phoneNumber: '+1234567890',
      avatar: 'https://source.unsplash.com/100x100/?portrait&1',
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '10:30 AM',
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Jane Smith',
      phoneNumber: '+1987654321',
      avatar: 'https://source.unsplash.com/100x100/?portrait&2',
      lastMessage: 'See you tomorrow!',
      lastMessageTime: '2:45 PM',
      unreadCount: 0
    },
  ]);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messagesByContact, setMessagesByContact] = useState<Record<string, Message[]>>({});
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<User>({
    name: 'User Name',
    email: 'user@example.com',
    discordUsername: 'user#1234',
    is2FAEnabled: false
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedContact) {
      scrollToBottom();
    }
  }, [messagesByContact, selectedContact]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (contacts.length > 0) {
        const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
        const updatedContacts = contacts.map(contact => 
          contact.id === randomContact.id 
            ? { ...contact, unreadCount: contact.unreadCount + 1 }
            : contact
        );
        setContacts(updatedContacts);
        if (audioRef.current) {
          audioRef.current.play().catch(error => console.error('Error playing audio:', error));
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [contacts]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      sender: 'You',
      senderPhone: 'your-number',
      status: 'sent',
      contactId: selectedContact.id
    };

    const updatedMessages = {
      ...messagesByContact,
      [selectedContact.id]: [...(messagesByContact[selectedContact.id] || []), message]
    };

    setMessagesByContact(updatedMessages);
    setNewMessage('');

    // Update last message in contacts
    setContacts(contacts.map(contact => 
      contact.id === selectedContact.id
        ? {
            ...contact,
            lastMessage: newMessage,
            lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        : contact
    ));
  };

  const startNewChat = (name: string, phoneNumber: string) => {
    const existingContact = contacts.find(contact => contact.phoneNumber === phoneNumber);
    
    if (existingContact) {
      setSelectedContact(existingContact);
    } else {
      const newContact: Contact = {
        id: Date.now().toString(),
        name,
        phoneNumber,
        avatar: `https://source.unsplash.com/100x100/?portrait&${Date.now()}`,
        unreadCount: 0
      };
      setContacts([...contacts, newContact]);
      setSelectedContact(newContact);
      setMessagesByContact({ ...messagesByContact, [newContact.id]: [] });
    }
  };

  const deleteChat = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact(null);
    }
    const updatedMessages = { ...messagesByContact };
    delete updatedMessages[contactId];
    setMessagesByContact(updatedMessages);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('User logged out');
  };

  const currentMessages = selectedContact ? messagesByContact[selectedContact.id] || [] : [];

  return (
    <div className="flex h-screen bg-white">
      <audio ref={audioRef} src="https://vz.weagree.org/audio/wake.mp3" />
      
      {/* Left Sidebar */}
      <div className="w-96 border-r flex flex-col bg-white">
        <div className="p-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <MenuDialog user={user} onUpdateUser={setUser} onLogout={handleLogout} />
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          </div>
          <NewChatDialog onNewChat={startNewChat} />
        </div>
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {contacts.map(contact => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isSelected={selectedContact?.id === contact.id}
              onClick={() => {
                setSelectedContact(contact);
                setContacts(contacts.map(c => 
                  c.id === contact.id ? { ...c, unreadCount: 0 } : c
                ));
              }}
              onDelete={() => deleteChat(contact.id)}
            />
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedContact ? (
          <>
            <div className="p-4 border-b flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <img
                  src={selectedContact.avatar}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h2 className="font-medium text-gray-900">{selectedContact.name}</h2>
                  <p className="text-sm text-gray-500">{selectedContact.phoneNumber}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Phone className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-white">
              {currentMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwn={message.sender === 'You'}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Smile className="h-5 w-5 text-gray-600" />
                </button>
                <button 
                  onClick={sendMessage}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                >
                  <Send className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageCircle className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}