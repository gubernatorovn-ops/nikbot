import { Handle, Position } from 'reactflow';
import { Play } from 'lucide-react';

export function TriggerNode({ data }: { data: any }) {
  return (
    <div className="bg-green-500 text-white px-4 py-2 rounded-lg min-w-[150px]">
      <div className="flex items-center gap-2">
        <Play className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label || 'Старт'}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-green-700" />
    </div>
  );
}
