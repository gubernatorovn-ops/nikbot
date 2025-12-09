'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Workflow, Plus, Play, Pause, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import { automationsApi } from '@/lib/api';
import { CreateAutomationDialog } from '@/components/flow/create-automation-dialog';

export default function AutomationsPage() {
  const { organization } = useAuthStore();
  const [automations, setAutomations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const fetchAutomations = () => {
    if (!organization?.id) return;

    automationsApi
      .getAll(organization.id)
      .then(({ data }) => setAutomations(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAutomations();
  }, [organization?.id]);

  const handleToggleActive = async (automation: any) => {
    try {
      await automationsApi.update(automation.id, { isActive: !automation.isActive });
      fetchAutomations();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить автоматизацию?')) return;

    try {
      await automationsApi.delete(id);
      fetchAutomations();
    } catch (error) {
      console.error(error);
    }
  };

  const triggerLabels: Record<string, string> = {
    MESSAGE: 'Любое сообщение',
    KEYWORD: 'Ключевое слово',
    COMMAND: 'Команда',
    BUTTON_CLICK: 'Нажатие кнопки',
    SUBSCRIPTION: 'Подписка',
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
          <h1 className="text-2xl font-bold">Автоматизации</h1>
          <p className="text-muted-foreground">Создавайте сценарии для ботов</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Создать
        </Button>
      </div>

      {automations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Workflow className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Нет автоматизаций</h3>
            <p className="text-muted-foreground mb-4">Создайте первую автоматизацию</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Создать автоматизацию
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {automations.map((automation) => (
            <Card key={automation.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Workflow className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{automation.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{triggerLabels[automation.triggerType] || automation.triggerType}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {automation._count?.executions || 0} выполнений
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={automation.isActive ? 'success' : 'secondary'}>
                      {automation.isActive ? 'Активна' : 'Отключена'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleToggleActive(automation)}>
                      {automation.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Link href={`/dashboard/automations/${automation.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(automation.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateAutomationDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={fetchAutomations} />
    </div>
  );
}
