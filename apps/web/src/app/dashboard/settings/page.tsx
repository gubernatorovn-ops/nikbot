'use client';

import { useState } from 'react';
import { Settings, User, Building2, Bell, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth-store';
import { usersApi, organizationsApi } from '@/lib/api';

export default function SettingsPage() {
  const { user, organization, fetchUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [userName, setUserName] = useState(user?.name || '');
  const [orgName, setOrgName] = useState(organization?.name || '');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usersApi.updateMe({ name: userName });
      await fetchUser();
      alert('Профиль обновлён');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization?.id) return;
    
    setLoading(true);
    try {
      await organizationsApi.update(organization.id, { name: orgName });
      await fetchUser();
      alert('Организация обновлена');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'organization', label: 'Организация', icon: Building2 },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'api', label: 'API ключи', icon: Key },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">Управляйте аккаунтом и настройками</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-64">
          <CardContent className="p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                  activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Профиль</CardTitle>
                <CardDescription>Настройки вашего аккаунта</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input value={user?.email || ''} disabled />
                    <p className="text-xs text-muted-foreground mt-1">Email нельзя изменить</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Имя</label>
                    <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'organization' && (
            <Card>
              <CardHeader>
                <CardTitle>Организация</CardTitle>
                <CardDescription>Настройки организации</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateOrganization} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Название</label>
                    <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">ID организации</label>
                    <Input value={organization?.id || ''} disabled />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Уведомления</CardTitle>
                <CardDescription>Настройте уведомления</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email уведомления</p>
                      <p className="text-sm text-muted-foreground">Получать отчёты на email</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Новые контакты</p>
                      <p className="text-sm text-muted-foreground">Уведомлять о новых подписчиках</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card>
              <CardHeader>
                <CardTitle>API ключи</CardTitle>
                <CardDescription>Ключи для интеграции с API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center text-muted-foreground">
                  <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>API ключи доступны на тарифе Premium</p>
                  <Button variant="outline" className="mt-4">
                    Обновить тариф
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
