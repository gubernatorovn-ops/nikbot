import { Handle, Position } from 'reactflow';
import { Sparkles } from 'lucide-react';

export function AiNode({ data }: { data: any }) {
  return (
    <div className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-4 py-2 rounded-lg min-w-[150px]">
      <Handle type="target" position={Position.Top} className="!bg-pink-700" />
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label || 'AI Ответ'}</span>
      </div>
      {data.config?.model && (
        <p className="text-xs mt-1 opacity-80">{data.config.model}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-violet-700" />
    </div>
  );
}
