'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { automationsApi } from '@/lib/api';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const triggerTypes = [
  { value: 'COMMAND', label: 'Команда', description: 'Например, /start' },
  { value: 'KEYWORD', label: 'Ключевое слово', description: 'Срабатывает при слове в сообщении' },
  { value: 'MESSAGE', label: 'Любое сообщение', description: 'Срабатывает на любое сообщение' },
  { value: 'SUBSCRIPTION', label: 'Подписка', description: 'При подписке на бота' },
];

export function CreateAutomationDialog({ open, onOpenChange, onSuccess }: Props) {
  const router = useRouter();
  const { organization } = useAuthStore();
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState('COMMAND');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id) return;

    setLoading(true);
    setError('');

    try {
      const { data } = await automationsApi.create(organization.id, { name, triggerType });
      onSuccess();
      onOpenChange(false);
      router.push(`/dashboard/automations/${data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при создании');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Новая автоматизация</CardTitle>
          <CardDescription>Задайте имя и выберите триггер</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">{error}</div>}
            
            <div>
              <label className="text-sm font-medium">Название</label>
              <Input
                placeholder="Приветствие новых подписчиков"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Триггер</label>
              <div className="grid gap-2 mt-2">
                {triggerTypes.map((trigger) => (
                  <label
                    key={trigger.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted ${
                      triggerType === trigger.value ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="triggerType"
                      value={trigger.value}
                      checked={triggerType === trigger.value}
                      onChange={(e) => setTriggerType(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">{trigger.label}</p>
                      <p className="text-sm text-muted-foreground">{trigger.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Создание...' : 'Создать'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
