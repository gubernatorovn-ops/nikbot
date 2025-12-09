'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Workflow,
  Send,
  Users,
  MessageSquare,
  BarChart3,
  Sparkles,
  CreditCard,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

const navigation = [
  { name: 'Дашборд', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Боты', href: '/dashboard/bots', icon: Bot },
  { name: 'Автоматизации', href: '/dashboard/automations', icon: Workflow },
  { name: 'Рассылки', href: '/dashboard/broadcasts', icon: Send },
  { name: 'Контакты', href: '/dashboard/contacts', icon: Users },
  { name: 'Сообщения', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Аналитика', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'AI Ассистент', href: '/dashboard/ai', icon: Sparkles },
];

const bottomNavigation = [
  { name: 'Биллинг', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Настройки', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { organization } = useAuthStore();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-card">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b">
          <Bot className="w-8 h-8 text-primary" />
          <span className="ml-2 text-xl font-bold">ChatFlow</span>
        </div>

        {/* Organization */}
        {organization && (
          <div className="px-4 py-3 border-b">
            <p className="text-xs text-muted-foreground">Организация</p>
            <p className="font-medium truncate">{organization.name}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-2 py-4 border-t space-y-1">
          {bottomNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
