import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Play } from 'lucide-react';

const ActionNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`flex min-w-64 flex-col rounded-lg border-2 border-blue-700 bg-blue-50 shadow-sm transition-shadow ${
        selected ? 'shadow-md ring-2 ring-blue-300' : ''
      }`}
    >
      <div className="rounded-t-lg border-b border-blue-200 bg-blue-100 px-4 py-2">
        <div className="flex items-center">
          <Play size={16} className="mr-2 text-blue-700" />
          <span className="font-medium text-blue-900">Action</span>
        </div>
      </div>
      
      <div className="p-3">
        <div className="mb-1 font-medium text-gray-800">{data.name}</div>
        <div className="text-xs text-gray-500">{data.actionType}</div>
      </div>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !rounded-full !border-2 !border-blue-700 !bg-white"
      />
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !rounded-full !border-2 !border-blue-700 !bg-white"
      />
    </div>
  );
};

export default memo(ActionNode);