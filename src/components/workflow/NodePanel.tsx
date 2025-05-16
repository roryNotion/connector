import React, { useState } from 'react';
import { Zap, Play, GitBranch, X } from 'lucide-react';
import { NodeType } from '../../types/workflow';
import { Integration, IntegrationAction } from '../../types/integrations';

interface NodePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (type: NodeType, integration?: Integration, action?: IntegrationAction) => void;
}

const NodePanel: React.FC<NodePanelProps> = ({ isOpen, onClose, onAddNode }) => {
  const [selectedType, setSelectedType] = useState<NodeType | null>(null);
  
  if (!isOpen) return null;
  
  const nodeTypes = [
    {
      type: 'trigger' as NodeType,
      name: 'Trigger',
      description: 'Start your workflow with an event',
      icon: <Zap size={24} className="text-purple-600" />,
      color: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
    },
    {
      type: 'action' as NodeType,
      name: 'Action',
      description: 'Perform operations and tasks',
      icon: <Play size={24} className="text-blue-600" />,
      color: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
    },
    {
      type: 'condition' as NodeType,
      name: 'Condition',
      description: 'Add branching logic',
      icon: <GitBranch size={24} className="text-amber-600" />,
      color: 'border-amber-200 bg-amber-50 hover:bg-amber-100',
    },
  ];
  
  const handleNodeTypeSelect = (type: NodeType) => {
    onAddNode(type);
    onClose();
  };

  return (
    <div className="absolute left-4 top-4 z-10 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-md">
      <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="text-sm font-medium">Add Node</h3>
        <button 
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100"
          aria-label="Close node panel"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <button
            key={node.type}
            className={`flex w-full cursor-pointer items-center rounded-md border p-3 transition-colors ${node.color}`}
            onClick={() => handleNodeTypeSelect(node.type)}
            aria-label={`Add ${node.name} node`}
          >
            <div className="mr-3 rounded-md bg-white p-2 shadow-sm">
              {node.icon}
            </div>
            <div className="text-left">
              <div className="font-medium">{node.name}</div>
              <div className="text-xs text-gray-500">{node.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NodePanel;