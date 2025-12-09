'use client';

import { MessageSquare, GitBranch, Zap, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  onAddNode: (type: string, nodeType: string, label: string) => void;
}

const nodeCategories = [
  {
    title: 'Сообщения',
    nodes: [
      { type: 'message', nodeType: 'SEND_MESSAGE', label: 'Текст', icon: MessageSquare },
      { type: 'message', nodeType: 'SEND_BUTTONS', label: 'Кнопки', icon: MessageSquare },
    ],
  },
  {
    title: 'Логика',
    nodes: [
      { type: 'condition', nodeType: 'CONDITION', label: 'Условие', icon: GitBranch },
    ],
  },
  {
    title: 'Действия',
    nodes: [
      { type: 'action', nodeType: 'ADD_TAG', label: 'Добавить тег', icon: Zap },
      { type: 'action', nodeType: 'ADD_POINTS', label: 'Добавить баллы', icon: Zap },
      { type: 'action', nodeType: 'DELAY', label: 'Задержка', icon: Zap },
    ],
  },
  {
    title: 'AI',
    nodes: [
      { type: 'ai', nodeType: 'AI_RESPONSE', label: 'AI Ответ', icon: Sparkles },
    ],
  },
];

export function NodePanel({ onAddNode }: Props) {
  return (
    <Card className="w-64 overflow-auto">
      <CardHeader className="py-3">
        <CardTitle className="text-sm">Блоки</CardTitle>
      </CardHeader>
      <CardContent className="p-2 space-y-4">
        {nodeCategories.map((category) => (
          <div key={category.title}>
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">{category.title}</p>
            <div className="space-y-1">
              {category.nodes.map((node) => (
                <button
                  key={node.nodeType}
                  onClick={() => onAddNode(node.type, node.nodeType, node.label)}
                  className="w-full flex items-center gap-2 p-2 text-sm hover:bg-muted rounded-md transition-colors"
                >
                  <node.icon className="w-4 h-4 text-primary" />
                  {node.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
