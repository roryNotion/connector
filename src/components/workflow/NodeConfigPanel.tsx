import React, { useEffect, useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { X, ChevronRight, Settings } from 'lucide-react';
import Button from '../ui/Button';

interface NodeConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string | null;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ isOpen, onClose, nodeId }) => {
  const { currentWorkflow, updateNode } = useWorkflowStore();
  const [node, setNode] = useState<any>(null);
  const [nodeName, setNodeName] = useState('');
  const [configData, setConfigData] = useState<any>({});
  
  useEffect(() => {
    if (nodeId && currentWorkflow) {
      const foundNode = currentWorkflow.nodes.find(n => n.id === nodeId);
      if (foundNode) {
        setNode(foundNode);
        setNodeName(foundNode.data.name);
        
        // Initialize config based on node type
        if (foundNode.type === 'trigger') {
          setConfigData({
            triggerType: foundNode.data.triggerType || 'webhook',
            config: { ...foundNode.data.config }
          });
        } else if (foundNode.type === 'action') {
          setConfigData({
            actionType: foundNode.data.actionType || 'http',
            config: { ...foundNode.data.config }
          });
        } else if (foundNode.type === 'condition') {
          setConfigData({
            condition: {
              left: foundNode.data.condition?.left || '',
              operator: foundNode.data.condition?.operator || 'equals',
              right: foundNode.data.condition?.right || ''
            }
          });
        }
      }
    }
  }, [nodeId, currentWorkflow]);
  
  if (!isOpen || !nodeId || !node) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nodeId) return;
    
    updateNode(nodeId, {
      ...node.data,
      name: nodeName,
      ...configData
    });
    
    onClose();
  };
  
  // Handle input change for config fields
  const handleConfigChange = (configKey: string, value: any) => {
    const newConfig = { ...configData.config, [configKey]: value };
    setConfigData({ ...configData, config: newConfig });
  };
  
  // Handle input change for condition fields
  const handleConditionChange = (field: string, value: string) => {
    const newCondition = { ...configData.condition, [field]: value };
    setConfigData({ ...configData, condition: newCondition });
  };
  
  // Render different configuration fields based on node type
  const renderConfigFields = () => {
    switch (node.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Trigger Type</label>
              <select 
                value={configData.triggerType}
                onChange={(e) => setConfigData({ ...configData, triggerType: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="webhook">Webhook</option>
                <option value="schedule">Schedule</option>
                <option value="event">Event</option>
              </select>
            </div>
            
            {configData.triggerType === 'webhook' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Webhook Path</label>
                <input 
                  type="text"
                  value={configData.config.path || ''}
                  onChange={(e) => handleConfigChange('path', e.target.value)}
                  placeholder="/webhook-path"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
            
            {configData.triggerType === 'schedule' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Cron Expression</label>
                <input 
                  type="text"
                  value={configData.config.cron || ''}
                  onChange={(e) => handleConfigChange('cron', e.target.value)}
                  placeholder="* * * * *"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Format: minute hour day month weekday</p>
              </div>
            )}
            
            {configData.triggerType === 'event' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Event Name</label>
                <input 
                  type="text"
                  value={configData.config.eventName || ''}
                  onChange={(e) => handleConfigChange('eventName', e.target.value)}
                  placeholder="event.name"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        );
        
      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Action Type</label>
              <select 
                value={configData.actionType}
                onChange={(e) => setConfigData({ ...configData, actionType: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="http">HTTP Request</option>
                <option value="email">Send Email</option>
                <option value="database">Database Operation</option>
              </select>
            </div>
            
            {configData.actionType === 'http' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">URL</label>
                  <input 
                    type="text"
                    value={configData.config.url || ''}
                    onChange={(e) => handleConfigChange('url', e.target.value)}
                    placeholder="https://api.example.com"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Method</label>
                  <select 
                    value={configData.config.method || 'GET'}
                    onChange={(e) => handleConfigChange('method', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </>
            )}
            
            {configData.actionType === 'email' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">To</label>
                  <input 
                    type="email"
                    value={configData.config.to || ''}
                    onChange={(e) => handleConfigChange('to', e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Subject</label>
                  <input 
                    type="text"
                    value={configData.config.subject || ''}
                    onChange={(e) => handleConfigChange('subject', e.target.value)}
                    placeholder="Email Subject"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
            
            {configData.actionType === 'database' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Operation</label>
                  <select 
                    value={configData.config.operation || 'select'}
                    onChange={(e) => handleConfigChange('operation', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="select">Select</option>
                    <option value="insert">Insert</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Table Name</label>
                  <input 
                    type="text"
                    value={configData.config.table || ''}
                    onChange={(e) => handleConfigChange('table', e.target.value)}
                    placeholder="users"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        );
        
      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Left Operand</label>
              <input 
                type="text"
                value={configData.condition.left || ''}
                onChange={(e) => handleConditionChange('left', e.target.value)}
                placeholder="data.value"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Operator</label>
              <select 
                value={configData.condition.operator || 'equals'}
                onChange={(e) => handleConditionChange('operator', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="equals">Equals</option>
                <option value="not-equals">Not Equals</option>
                <option value="greater-than">Greater Than</option>
                <option value="less-than">Less Than</option>
                <option value="contains">Contains</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Right Operand</label>
              <input 
                type="text"
                value={configData.condition.right || ''}
                onChange={(e) => handleConditionChange('right', e.target.value)}
                placeholder="true"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        );
        
      default:
        return <p>Unknown node type</p>;
    }
  };
  
  return (
    <div className="absolute right-0 top-0 z-10 h-full w-96 border-l border-gray-200 bg-white shadow-xl">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center text-lg font-medium">
            <Settings size={18} className="mr-2 text-gray-500" />
            Node Configuration
          </h3>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100"
            aria-label="Close configuration panel"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Node Name</label>
          <input 
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4 rounded-md border border-gray-200 p-4">
          {renderConfigFields()}
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NodeConfigPanel;