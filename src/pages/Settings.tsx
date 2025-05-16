import React, { useState } from 'react';
import { User, Key, Bell, Shield, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User size={18} /> },
    { id: 'security', name: 'Security', icon: <Key size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'api', name: 'API Keys', icon: <Shield size={18} /> }
  ];

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <ul className="divide-y divide-gray-200">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 ${
                      activeTab === tab.id ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{tab.icon}</span>
                      <span>{tab.name}</span>
                    </div>
                    {activeTab === tab.id && <ChevronRight size={16} />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Content */}
        <div className="md:col-span-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            {activeTab === 'profile' && (
              <div>
                <h2 className="mb-6 text-xl font-semibold text-gray-800">Profile Settings</h2>
                
                <div className="mb-8 rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-4 text-lg font-medium text-gray-700">Account Information</h3>
                  
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name || ''}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      defaultValue="Acme Inc."
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-8 rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-4 text-lg font-medium text-gray-700">Preferences</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="email-notifications" className="ml-2 text-sm text-gray-700">
                        Email notifications for workflow execution
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="dark-mode"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="dark-mode" className="ml-2 text-sm text-gray-700">
                        Enable dark mode
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="primary">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h2 className="mb-6 text-xl font-semibold text-gray-800">Security Settings</h2>
                
                <div className="mb-8 rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-4 text-lg font-medium text-gray-700">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
                      <input
                        type="password"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
                      <input
                        type="password"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-8 rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-4 text-lg font-medium text-gray-700">Two-Factor Authentication</h3>
                  
                  <p className="mb-4 text-sm text-gray-500">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  
                  <Button variant="outline">
                    Enable 2FA
                  </Button>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="primary">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="mb-6 text-xl font-semibold text-gray-800">Notification Settings</h2>
                
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-4 text-lg font-medium text-gray-700">Email Notifications</h3>
                  
                  <div className="space-y-3">
                    {['Workflow Execution', 'Error Alerts', 'System Updates', 'New Templates'].map((item) => (
                      <div key={item} className="flex items-center justify-between">
                        <label className="text-sm text-gray-700">{item}</label>
                        <div className="relative">
                          <input
                            type="checkbox"
                            defaultChecked={item !== 'System Updates'}
                            className="peer sr-only"
                            id={`toggle-${item}`}
                          />
                          <label
                            htmlFor={`toggle-${item}`}
                            className="flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-300 p-1 peer-checked:bg-blue-500"
                          >
                            <span className="h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-5"></span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'api' && (
              <div>
                <h2 className="mb-6 text-xl font-semibold text-gray-800">API Keys</h2>
                
                <div className="mb-6 rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-4 text-lg font-medium text-gray-700">Your API Keys</h3>
                  
                  <div className="mb-4 flex items-center space-x-2">
                    <input
                      type="text"
                      value="••••••••••••••••••••••••••••"
                      readOnly
                      className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                    />
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                  </div>
                  
                  <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-600">
                    <p>This API key has full access to your account. Protect it like a password.</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline">
                    Regenerate Key
                  </Button>
                  <Button variant="primary">
                    Create New Key
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;