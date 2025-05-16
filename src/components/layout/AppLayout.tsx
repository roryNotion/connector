import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/workflows/new')) return 'New Workflow';
    if (path.includes('/workflows/')) return 'Edit Workflow';
    if (path.includes('/workflows')) return 'Workflows';
    if (path.includes('/templates')) return 'Templates';
    if (path.includes('/marketplace')) return 'Marketplace';
    if (path.includes('/settings')) return 'Settings';
    return 'Connector Platform';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar closeMobileSidebar={closeSidebar} />
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={getPageTitle()}>
          <button 
            onClick={toggleSidebar}
            className="block rounded p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        </Header>
        
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;