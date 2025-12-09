'use client';

import { useEffect, useState } from 'react';
import { Bot, Plus, MoreVertical, Power, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import { botsApi } from '@/lib/api';
import { AddBotDialog } from '@/components/bots/add-bot-dialog';

export default function BotsPage() {
  const { organization } = useAuthStore();
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const fetchBots = () => {
    if (!organization?.id) return;

    botsApi
      .getAll(organization.id)
      .then(({ data }) => setBots(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBots();
  }, [organization?.id]);

  const handleToggleActive = async (bot: any) => {
    try {
      await botsApi.update(bot.id, { isActive: !bot.isActive });
      fetchBots();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (botId: string) => {
    if (!confirm('Удалить бота?')) return;

    try {
      await botsApi.delete(botId);
      fetchBots();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Боты</h1>
          <p className="text-muted-foreground">Управляйте подключенными ботами</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить бота
        </Button>
      </div>

      {bots.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Нет подключенных ботов</h3>
            <p className="text-muted-foreground mb-4">Добавьте первого бота для начала работы</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить бота
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <Card key={bot.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{bot.name}</h3>
                      <p className="text-sm text-muted-foreground">@{bot.username}</p>
                    </div>
                  </div>
                  <Badge variant={bot.isActive ? 'success' : 'secondary'}>
                    {bot.isActive ? 'Активен' : 'Отключен'}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{bot._count?.contacts || 0} контактов</span>
                  <span>{bot._count?.conversations || 0} диалогов</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleToggleActive(bot)}>
                    <Power className="w-4 h-4 mr-1" />
                    {bot.isActive ? 'Отключить' : 'Включить'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(bot.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddBotDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={fetchBots} />
    </div>
  );
}
