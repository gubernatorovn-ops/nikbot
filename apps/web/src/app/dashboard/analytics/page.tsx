'use client';

import { useState } from 'react';
import { BarChart3, Users, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const lineData = [
  { name: 'Пн', messages: 120, contacts: 20 },
  { name: 'Вт', messages: 180, contacts: 35 },
  { name: 'Ср', messages: 150, contacts: 28 },
  { name: 'Чт', messages: 220, contacts: 42 },
  { name: 'Пт', messages: 280, contacts: 55 },
  { name: 'Сб', messages: 320, contacts: 48 },
  { name: 'Вс', messages: 240, contacts: 33 },
];

const pieData = [
  { name: 'Telegram', value: 65, color: '#3B82F6' },
  { name: 'Instagram', value: 25, color: '#EC4899' },
  { name: 'TikTok', value: 10, color: '#000000' },
];

const topAutomations = [
  { name: 'Приветствие', executions: 1250, successRate: 98 },
  { name: 'FAQ бот', executions: 890, successRate: 95 },
  { name: 'Сбор контактов', executions: 560, successRate: 92 },
  { name: 'Реферальная программа', executions: 340, successRate: 88 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7d');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Аналитика</h1>
          <p className="text-muted-foreground">Статистика вашей платформы</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((p) => (
            <Button
              key={p}
              variant={period === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {p === '7d' ? '7 дней' : p === '30d' ? '30 дней' : '90 дней'}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Сообщений</p>
                <p className="text-2xl font-bold">1,510</p>
                <p className="text-xs text-green-500">+23% к прошлому периоду</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Новых контактов</p>
                <p className="text-2xl font-bold">211</p>
                <p className="text-xs text-green-500">+15% к прошлому периоду</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Автоматизации</p>
                <p className="text-2xl font-bold">8 / 12</p>
                <p className="text-xs text-muted-foreground">активных</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ср. время ответа</p>
                <p className="text-2xl font-bold">1.2s</p>
                <p className="text-xs text-green-500">-0.3s к прошлому периоду</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Активность</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="messages" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="contacts" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>По платформам</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Топ автоматизаций</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topAutomations.map((automation, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{automation.name}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{automation.executions} выполнений</span>
                    <span>{automation.successRate}% успешных</span>
                  </div>
                </div>
                <div className="w-32 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${automation.successRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
