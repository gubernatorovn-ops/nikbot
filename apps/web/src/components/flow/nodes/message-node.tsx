import { Handle, Position } from 'reactflow';
import { MessageSquare } from 'lucide-react';

export function MessageNode({ data }: { data: any }) {
  return (
    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg min-w-[150px]">
      <Handle type="target" position={Position.Top} className="!bg-blue-700" />
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label || 'Сообщение'}</span>
      </div>
      {data.config?.text && (
        <p className="text-xs mt-1 opacity-80 truncate max-w-[140px]">{data.config.text}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-blue-700" />
    </div>
  );
}
