import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { GitBranch } from 'lucide-react';

const ConditionNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`flex min-w-64 flex-col rounded-lg border-2 border-amber-700 bg-amber-50 shadow-sm transition-shadow ${
        selected ? 'shadow-md ring-2 ring-amber-300' : ''
      }`}
    >
      <div className="rounded-t-lg border-b border-amber-200 bg-amber-100 px-4 py-2">
        <div className="flex items-center">
          <GitBranch size={16} className="mr-2 text-amber-700" />
          <span className="font-medium text-amber-900">Condition</span>
        </div>
      </div>
      
      <div className="p-3">
        <div className="mb-1 font-medium text-gray-800">{data.name}</div>
        {data.condition && (
          <div className="text-xs text-gray-500">
            {data.condition.left} {data.condition.operator} {data.condition.right}
          </div>
        )}
      </div>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !rounded-full !border-2 !border-amber-700 !bg-white"
      />
      
      {/* Output handle - True */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="!h-3 !w-3 !rounded-full !border-2 !border-green-700 !bg-white"
      />
      
      {/* Output handle - False */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="!h-3 !w-3 !rounded-full !border-2 !border-red-700 !bg-white"
      />
    </div>
  );
};

export default memo(ConditionNode);