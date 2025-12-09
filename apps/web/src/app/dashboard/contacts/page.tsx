'use client';

import { useEffect, useState } from 'react';
import { Users, Search, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import { contactsApi } from '@/lib/api';

export default function ContactsPage() {
  const { organization } = useAuthStore();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!organization?.id) return;

    setLoading(true);
    contactsApi
      .getAll(organization.id, { page, search, limit: 20 })
      .then(({ data }) => {
        setContacts(data.items);
        setTotalPages(data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [organization?.id, page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const platformColors: Record<string, string> = {
    TELEGRAM: 'bg-blue-500/10 text-blue-500',
    INSTAGRAM: 'bg-pink-500/10 text-pink-500',
    TIKTOK: 'bg-black/10 text-black',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Контакты</h1>
        <p className="text-muted-foreground">Управляйте вашей аудиторией</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </form>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : contacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Нет контактов</h3>
            <p className="text-muted-foreground">Контакты появятся после взаимодействия с ботами</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {contacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {contact.firstName || contact.username || 'Без имени'}
                          {contact.lastName ? ` ${contact.lastName}` : ''}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={platformColors[contact.platform] || ''}>
                            {contact.platform}
                          </Badge>
                          {contact.username && (
                            <span className="text-sm text-muted-foreground">@{contact.username}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{contact.points} баллов</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(contact.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      {contact.tags?.length > 0 && (
                        <div className="flex gap-1">
                          {contact.tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Назад
              </button>
              <span className="px-3 py-1">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Далее
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
