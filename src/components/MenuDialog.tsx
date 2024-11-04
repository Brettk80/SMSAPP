import React, { useState } from 'react';
import { Menu, Settings, LogOut } from 'lucide-react';
import { User } from '../types';
import { SecuritySettings } from './SecuritySettings';

type MenuDialogProps = {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
};

export function MenuDialog({ user, onUpdateUser, onLogout }: MenuDialogProps) {
  const [activeTab, setActiveTab] = useState('profile');

  const handleChangePassword = (currentPassword: string, newPassword: string) => {
    // Implement password change logic here
    console.log('Changing password:', { currentPassword, newPassword });
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => document.getElementById('menu-modal')?.showModal()}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>
      <dialog id="menu-modal" className="modal p-6 rounded-lg shadow-xl backdrop:bg-black/50">
        <div className="w-[480px]">
          <div className="px-4 py-3 border-b">
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <div className="mt-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`${
                    activeTab === 'security'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Security
                </button>
              </nav>
            </div>

            <div className="mt-4">
              {activeTab === 'profile' ? (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => onUpdateUser({ ...user, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => onUpdateUser({ ...user, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discord Username</label>
                    <input
                      type="text"
                      value={user.discordUsername}
                      onChange={(e) => onUpdateUser({ ...user, discordUsername: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </form>
              ) : (
                <SecuritySettings
                  user={user}
                  onUpdateUser={onUpdateUser}
                  onChangePassword={handleChangePassword}
                />
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => document.getElementById('menu-modal')?.close()}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Close
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}