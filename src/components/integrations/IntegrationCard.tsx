import React, { useState } from 'react';
import { CheckCircle, Settings, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import IntegrationModal from './IntegrationModal';
import { Integration } from '../../types/integrations';

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (integration: Integration) => void;
  onDisconnect: (integration: Integration) => void;
  onTest: (integration: Integration) => void;
  onSettings: (integration: Integration) => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConnect,
  onDisconnect,
  onTest,
  onSettings,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  const handleTest = async () => {
    setIsTestingConnection(true);
    try {
      await onTest(integration);
    } finally {
      setIsTestingConnection(false);
    }
  };
  
  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={integration.icon}
                alt={integration.name}
                className="h-16 w-16 rounded-lg object-contain p-2"
                style={{
                  backgroundColor: integration.brandColor || '#fff',
                }}
              />
              <div>
                <h3 className="font-medium text-gray-900">{integration.name}</h3>
                <p className="text-sm text-gray-500">{integration.category}</p>
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center">
              {integration.connected ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-1" />
                  <span className="text-sm">Connected</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-400">
                  <AlertTriangle size={16} className="mr-1" />
                  <span className="text-sm">Not Connected</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">{integration.description}</p>
          </div>
          
          {/* Features */}
          <div className="mb-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Key Features:</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              {integration.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          {integration.connected && (
            <>
              {/* Connection Info */}
              <div className="mb-4 rounded-md bg-gray-50 p-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account:</span>
                    <span className="font-medium text-gray-900">
                      {integration.connectedAccount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Synced:</span>
                    <span className="text-gray-900">
                      {new Date(integration.lastSynced).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600">Active</span>
                  </div>
                </div>
              </div>
              
              {/* Permissions */}
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Granted Permissions:
                </h4>
                <div className="space-y-1">
                  {integration.permissions?.map((permission, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <CheckCircle size={14} className="mr-2 text-green-500" />
                      {permission}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Actions */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex space-x-2">
            {integration.connected ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Settings size={14} />}
                  onClick={() => onSettings(integration)}
                >
                  Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<RefreshCw size={14} />}
                  onClick={handleTest}
                  isLoading={isTestingConnection}
                >
                  Test
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => onDisconnect(integration)}
                >
                  Remove
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => setIsModalOpen(true)}
              >
                Connect
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Connection Modal */}
      <IntegrationModal
        integration={integration}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={onConnect}
      />
    </>
  );
};

export default IntegrationCard;