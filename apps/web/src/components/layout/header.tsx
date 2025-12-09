'use client';

import { useRouter } from 'next/navigation';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-card px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="lg:hidden">
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>

          <div className="relative group">
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="hidden sm:block text-sm">{user?.name || user?.email}</span>
            </Button>

            <div className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-2">
                <p className="px-2 py-1 text-sm font-medium">{user?.name}</p>
                <p className="px-2 py-1 text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="border-t">
                <button
                  onClick={() => router.push('/dashboard/settings')}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted"
                >
                  <Settings className="w-4 h-4" />
                  Настройки
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-muted text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
