'use client';

import { useState } from 'react';
import { Send, Plus, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const mockBroadcasts = [
  {
    id: '1',
    name: 'Новогодняя акция',
    status: 'COMPLETED',
    sentAt: '2024-12-25T10:00:00',
    totalRecipients: 1250,
    delivered: 1230,
    failed: 20,
  },
  {
    id: '2',
    name: 'Еженедельный дайджест',
    status: 'SCHEDULED',
    scheduledAt: '2024-12-30T09:00:00',
    totalRecipients: 890,
  },
  {
    id: '3',
    name: 'Опрос удовлетворённости',
    status: 'DRAFT',
    totalRecipients: 0,
  },
];

export default function BroadcastsPage() {
  const [broadcasts] = useState(mockBroadcasts);
  const [showCreate, setShowCreate] = useState(false);

  const statusConfig: Record<string, { label: string; variant: any; icon: any }> = {
    DRAFT: { label: 'Черновик', variant: 'secondary', icon: Clock },
    SCHEDULED: { label: 'Запланировано', variant: 'warning', icon: Clock },
    SENDING: { label: 'Отправляется', variant: 'default', icon: Send },
    COMPLETED: { label: 'Завершено', variant: 'success', icon: CheckCircle },
    FAILED: { label: 'Ошибка', variant: 'destructive', icon: XCircle },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Рассылки</h1>
          <p className="text-muted-foreground">Массовые сообщения вашим контактам</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Создать рассылку
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всего отправлено</p>
                <p className="text-2xl font-bold">12,450</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Доставлено</p>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Охват</p>
                <p className="text-2xl font-bold">3,240</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {broadcasts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Нет рассылок</h3>
            <p className="text-muted-foreground mb-4">Создайте первую рассылку</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Создать рассылку
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {broadcasts.map((broadcast) => {
            const status = statusConfig[broadcast.status];
            const StatusIcon = status.icon;

            return (
              <Card key={broadcast.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Send className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{broadcast.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={status.variant}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                          {broadcast.scheduledAt && (
                            <span className="text-sm text-muted-foreground">
                              Запланировано: {new Date(broadcast.scheduledAt).toLocaleString('ru-RU')}
                            </span>
                          )}
                          {broadcast.sentAt && (
                            <span className="text-sm text-muted-foreground">
                              Отправлено: {new Date(broadcast.sentAt).toLocaleString('ru-RU')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {broadcast.status === 'COMPLETED' && (
                        <div className="text-right">
                          <p className="text-sm font-medium">{broadcast.delivered} / {broadcast.totalRecipients}</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((broadcast.delivered! / broadcast.totalRecipients) * 100)}% доставлено
                          </p>
                        </div>
                      )}
                      <Button variant="outline" size="sm">
                        {broadcast.status === 'DRAFT' ? 'Редактировать' : 'Подробнее'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader>
              <CardTitle>Новая рассылка</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Название</label>
                <Input placeholder="Название рассылки" />
              </div>
              <div>
                <label className="text-sm font-medium">Текст сообщения</label>
                <textarea
                  className="w-full h-32 mt-1 p-2 border rounded-md"
                  placeholder="Введите текст сообщения..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Выберите бота</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>Все боты</option>
                  <option>Telegram бот</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Получатели</label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>Все контакты</option>
                  <option>По тегу</option>
                  <option>Активные за 7 дней</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>
                  Отмена
                </Button>
                <Button variant="outline" className="flex-1">
                  Сохранить черновик
                </Button>
                <Button className="flex-1">
                  Отправить сейчас
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
