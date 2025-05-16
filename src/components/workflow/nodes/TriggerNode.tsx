import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Zap } from 'lucide-react';

const TriggerNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`flex min-w-64 flex-col rounded-lg border-2 border-purple-700 bg-purple-50 shadow-sm transition-shadow ${
        selected ? 'shadow-md ring-2 ring-purple-300' : ''
      }`}
    >
      <div className="rounded-t-lg border-b border-purple-200 bg-purple-100 px-4 py-2">
        <div className="flex items-center">
          <Zap size={16} className="mr-2 text-purple-700" />
          <span className="font-medium text-purple-900">Trigger</span>
        </div>
      </div>
      
      <div className="p-3">
        <div className="mb-1 font-medium text-gray-800">{data.name}</div>
        <div className="text-xs text-gray-500">{data.triggerType}</div>
      </div>
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !rounded-full !border-2 !border-purple-700 !bg-white"
      />
    </div>
  );
};

export default memo(TriggerNode);