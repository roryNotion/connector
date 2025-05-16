import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useIntegrationStore } from '../../store/integrationStore';
import { Integration, IntegrationAction } from '../../types/integrations';
import { NodeType } from '../../types/workflow';
import Button from '../ui/Button';

interface ToolPickerProps {
  isOpen: boolean;
  onClose: () => void;
  nodeType: NodeType;
  onSelectAction: (integration: Integration, action: IntegrationAction) => void;
}

const ToolPicker: React.FC<ToolPickerProps> = ({
  isOpen,
  onClose,
  nodeType,
  onSelectAction,
}) => {
  const { integrations } = useIntegrationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  // Get unique categories
  const categories = Array.from(
    new Set(integrations.map((integration) => integration.category))
  );
  
  // Filter integrations based on search and category
  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Get relevant actions based on node type
  const getRelevantActions = (integration: Integration) => {
    if (nodeType === 'trigger') return integration.triggers;
    if (nodeType === 'action') return integration.actions;
    return [];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-3xl rounded-lg bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Select a {nodeType === 'trigger' ? 'Trigger' : 'Action'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4 flex space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          {/* Category filter */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-md px-3 py-1 text-sm ${
                selectedCategory === null
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-md px-3 py-1 text-sm ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => {
            const actions = getRelevantActions(integration);
            if (actions.length === 0) return null;
            
            return (
              <div
                key={integration.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-b border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={integration.icon}
                      alt={integration.name}
                      className="h-8 w-8 rounded-md"
                    />
                    <div>
                      <h3 className="font-medium">{integration.name}</h3>
                      <p className="text-xs text-gray-500">{integration.category}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2">
                    {actions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => onSelectAction(integration, action)}
                        className="flex w-full items-center justify-between rounded-md border border-gray-200 p-2 text-left hover:bg-gray-50"
                      >
                        <div>
                          <div className="font-medium">{action.label}</div>
                          <div className="text-xs text-gray-500">
                            {action.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {!integration.connected && integration.authType !== 'none' && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        // TODO: Implement connection flow
                        console.log('Connect to', integration.name);
                      }}
                    >
                      Connect to {integration.name}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ToolPicker;