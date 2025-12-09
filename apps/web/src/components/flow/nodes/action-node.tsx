import { Handle, Position } from 'reactflow';
import { Zap } from 'lucide-react';

export function ActionNode({ data }: { data: any }) {
  return (
    <div className="bg-purple-500 text-white px-4 py-2 rounded-lg min-w-[150px]">
      <Handle type="target" position={Position.Top} className="!bg-purple-700" />
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label || 'Действие'}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-700" />
    </div>
  );
}
