'use client';

import { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
  onClose: () => void;
}

export function NodeEditor({ node, onUpdate, onClose }: Props) {
  const [label, setLabel] = useState(node.data.label || '');
  const [config, setConfig] = useState(node.data.config || {});

  useEffect(() => {
    setLabel(node.data.label || '');
    setConfig(node.data.config || {});
  }, [node]);

  const handleSave = () => {
    onUpdate(node.id, { label, config });
  };

  const updateConfig = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  const renderConfigFields = () => {
    switch (node.data.nodeType) {
      case 'SEND_MESSAGE':
        return (
          <div>
            <label className="text-sm font-medium">Текст сообщения</label>
            <textarea
              className="w-full h-24 mt-1 p-2 border rounded-md text-sm"
              placeholder="Привет! Как дела?"
              value={config.text || ''}
              onChange={(e) => updateConfig('text', e.target.value)}
            />
          </div>
        );

      case 'SEND_BUTTONS':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Текст</label>
              <Input
                value={config.text || ''}
                onChange={(e) => updateConfig('text', e.target.value)}
                placeholder="Выберите вариант:"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Кнопки (по одной на строку)</label>
              <textarea
                className="w-full h-20 mt-1 p-2 border rounded-md text-sm"
                placeholder="Да&#10;Нет&#10;Не знаю"
                value={(config.buttons || []).map((b: any) => b.text).join('\n')}
                onChange={(e) =>
                  updateConfig(
                    'buttons',
                    e.target.value.split('\n').filter(Boolean).map((text) => ({ text, value: text }))
                  )
                }
              />
            </div>
          </div>
        );

      case 'CONDITION':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Переменная</label>
              <Input
                value={config.variable || ''}
                onChange={(e) => updateConfig('variable', e.target.value)}
                placeholder="message.text"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Оператор</label>
              <select
                className="w-full mt-1 p-2 border rounded-md text-sm"
                value={config.operator || 'equals'}
                onChange={(e) => updateConfig('operator', e.target.value)}
              >
                <option value="equals">Равно</option>
                <option value="contains">Содержит</option>
                <option value="startsWith">Начинается с</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Значение</label>
              <Input
                value={config.value || ''}
                onChange={(e) => updateConfig('value', e.target.value)}
                placeholder="привет"
              />
            </div>
          </div>
        );

      case 'ADD_TAG':
        return (
          <div>
            <label className="text-sm font-medium">Тег</label>
            <Input
              value={config.tag || ''}
              onChange={(e) => updateConfig('tag', e.target.value)}
              placeholder="vip"
            />
          </div>
        );

      case 'ADD_POINTS':
        return (
          <div>
            <label className="text-sm font-medium">Количество баллов</label>
            <Input
              type="number"
              value={config.points || 0}
              onChange={(e) => updateConfig('points', parseInt(e.target.value) || 0)}
            />
          </div>
        );

      case 'DELAY':
        return (
          <div>
            <label className="text-sm font-medium">Задержка (секунды)</label>
            <Input
              type="number"
              value={config.duration || 1}
              onChange={(e) => updateConfig('duration', parseInt(e.target.value) || 1)}
            />
          </div>
        );

      case 'AI_RESPONSE':
        return (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Системный промпт</label>
              <textarea
                className="w-full h-20 mt-1 p-2 border rounded-md text-sm"
                value={config.systemPrompt || ''}
                onChange={(e) => updateConfig('systemPrompt', e.target.value)}
                placeholder="Ты помощник интернет-магазина..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Модель</label>
              <select
                className="w-full mt-1 p-2 border rounded-md text-sm"
                value={config.model || 'gpt-4o-mini'}
                onChange={(e) => updateConfig('model', e.target.value)}
              >
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="gpt-4o">GPT-4o</option>
              </select>
            </div>
          </div>
        );

      default:
        return <p className="text-sm text-muted-foreground">Нет настроек</p>;
    }
  };

  return (
    <Card className="w-72">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Настройки</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Название</label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>

        {renderConfigFields()}

        <Button onClick={handleSave} className="w-full">
          Применить
        </Button>
      </CardContent>
    </Card>
  );
}
