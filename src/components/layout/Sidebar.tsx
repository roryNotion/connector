import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  Package, 
  Store, 
  Settings as SettingsIcon, 
  LogOut,
  LayoutDashboard,
  Zap,
  Workflow
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  closeMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeMobileSidebar }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/workflows', icon: <Activity size={20} />, label: 'Workflows' },
    { to: '/templates', icon: <Package size={20} />, label: 'Templates' },
    { to: '/marketplace', icon: <Store size={20} />, label: 'Marketplace' },
    { to: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings' }
  ];

  return (
    <div className="flex h-full flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center border-b border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <div className="rounded-md bg-blue-500 p-1">
            <Workflow className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-800">Connector</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={closeMobileSidebar}
            className={({ isActive }) =>
              `flex items-center space-x-3 rounded-md px-3 py-2 transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'guest@example.com'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-4 flex w-full items-center justify-center space-x-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;