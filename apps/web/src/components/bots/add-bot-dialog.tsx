'use client';

import { useState } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { botsApi } from '@/lib/api';

interface AddBotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddBotDialog({ open, onOpenChange, onSuccess }: AddBotDialogProps) {
  const { organization } = useAuthStore();
  const [platform, setPlatform] = useState<'telegram' | 'instagram' | 'tiktok' | null>(null);
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id || !platform) return;

    setLoading(true);
    setError('');

    try {
      if (platform === 'telegram') {
        await botsApi.createTelegram(organization.id, { name, token });
      }
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при добавлении бота');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPlatform(null);
    setName('');
    setToken('');
    setError('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Добавить бота</CardTitle>
          <CardDescription>Выберите платформу и настройте бота</CardDescription>
        </CardHeader>
        <CardContent>
          {!platform ? (
            <div className="space-y-2">
              <button
                onClick={() => setPlatform('telegram')}
                className="w-full p-4 border rounded-lg hover:bg-muted flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Telegram</p>
                  <p className="text-sm text-muted-foreground">Подключить Telegram бота</p>
                </div>
              </button>
              <button
                onClick={() => setPlatform('instagram')}
                className="w-full p-4 border rounded-lg hover:bg-muted flex items-center gap-3 opacity-50"
                disabled
              >
                <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-pink-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Instagram</p>
                  <p className="text-sm text-muted-foreground">Скоро</p>
                </div>
              </button>
              <button
                onClick={() => setPlatform('tiktok')}
                className="w-full p-4 border rounded-lg hover:bg-muted flex items-center gap-3 opacity-50"
                disabled
              >
                <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium">TikTok</p>
                  <p className="text-sm text-muted-foreground">Скоро</p>
                </div>
              </button>
              <Button variant="outline" className="w-full mt-4" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">{error}</div>}
              <div>
                <label className="text-sm font-medium">Название бота</label>
                <Input
                  placeholder="Мой бот"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              {platform === 'telegram' && (
                <div>
                  <label className="text-sm font-medium">Токен бота</label>
                  <Input
                    placeholder="123456:ABC-DEF1234..."
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Получите токен у @BotFather в Telegram
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setPlatform(null)}>
                  Назад
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Добавление...' : 'Добавить'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
