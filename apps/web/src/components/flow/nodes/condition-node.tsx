import { Handle, Position } from 'reactflow';
import { GitBranch } from 'lucide-react';

export function ConditionNode({ data }: { data: any }) {
  return (
    <div className="bg-orange-500 text-white px-4 py-2 rounded-lg min-w-[150px]">
      <Handle type="target" position={Position.Top} className="!bg-orange-700" />
      <div className="flex items-center gap-2">
        <GitBranch className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label || 'Условие'}</span>
      </div>
      {data.config?.variable && (
        <p className="text-xs mt-1 opacity-80">{data.config.variable} {data.config.operator} {data.config.value}</p>
      )}
      <div className="flex justify-between mt-2">
        <Handle type="source" position={Position.Bottom} id="yes" className="!bg-green-500 !left-[25%]" />
        <Handle type="source" position={Position.Bottom} id="no" className="!bg-red-500 !left-[75%]" />
      </div>
    </div>
  );
}
