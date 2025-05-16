import React, { useState } from 'react';
import { X, ChevronRight, Shield, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import { Integration } from '../../types/integrations';

interface IntegrationModalProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (integration: Integration) => void;
}

const IntegrationModal: React.FC<IntegrationModalProps> = ({
  integration,
  isOpen,
  onClose,
  onConnect,
}) => {
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      onConnect(integration);
      onClose();
    } catch (err) {
      setError('Failed to connect. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <img
                src={integration.icon}
                alt={integration.name}
                className="mx-auto mb-4 h-16 w-16 rounded-lg"
              />
              <h3 className="text-lg font-medium">Connect to {integration.name}</h3>
              <p className="text-sm text-gray-500">
                Connect your {integration.name} account to enable automation
              </p>
            </div>
            
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="mb-2 font-medium">Required Permissions</h4>
              <ul className="space-y-2">
                {integration.permissions?.map((permission, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <Shield size={16} className="mr-2 mt-0.5 text-blue-500" />
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
            
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="mb-2 font-medium">Configuration</h4>
              {integration.configFields?.map((field, index) => (
                <div key={index} className="mb-4">
                  <label className="mb-1 block text-sm font-medium">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleConnect}
                isLoading={isConnecting}
              >
                Connect
              </Button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Successfully Connected!</h3>
            <p className="mb-4 text-sm text-gray-500">
              Your {integration.name} account has been connected successfully.
            </p>
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Step {step} of 3</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
};

export default IntegrationModal;