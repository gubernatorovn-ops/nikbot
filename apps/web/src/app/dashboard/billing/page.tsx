'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Check, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import { billingApi } from '@/lib/api';

export default function BillingPage() {
  const { organization } = useAuthStore();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organization?.id) return;

    billingApi
      .getSubscription(organization.id)
      .then(({ data }) => setSubscription(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [organization?.id]);

  const handleUpgrade = async (plan: 'PRO' | 'PREMIUM') => {
    if (!organization?.id) return;

    try {
      const { data } = await billingApi.createCheckout({
        organizationId: organization.id,
        plan,
        successUrl: `${window.location.origin}/dashboard/billing?success=true`,
        cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`,
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleManage = async () => {
    if (!organization?.id) return;

    try {
      const { data } = await billingApi.createPortal({
        organizationId: organization.id,
        returnUrl: `${window.location.origin}/dashboard/billing`,
      });

      if (data.url) {
        window.location.href = data.url;
      }
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

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: ['200 взаимодействий/мес', '1 бот', 'Базовые автоматизации'],
      current: subscription?.plan === 'FREE',
    },
    {
      name: 'Pro',
      price: 20,
      features: ['1,000 взаимодействий/мес', '3 бота', 'AI-ответы', 'Аналитика'],
      current: subscription?.plan === 'PRO',
      popular: true,
    },
    {
      name: 'Premium',
      price: 79,
      features: ['Безлимит взаимодействий', 'Безлимит ботов', 'API доступ', 'Приоритетная поддержка'],
      current: subscription?.plan === 'PREMIUM',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Биллинг</h1>
        <p className="text-muted-foreground">Управляйте подпиской</p>
      </div>

      {subscription && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Текущий план: {subscription.plan}</h3>
                  <p className="text-sm text-muted-foreground">
                    Использовано: {subscription.usedInteractions} / {subscription.monthlyInteractions === -1 ? '∞' : subscription.monthlyInteractions}
                  </p>
                </div>
              </div>
              {subscription.stripeSubscriptionId && (
                <Button variant="outline" onClick={handleManage}>
                  Управление подпиской
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? 'border-2 border-primary relative' : ''}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Популярный</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground">/мес</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <Button className="w-full" disabled>
                  Текущий план
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleUpgrade(plan.name.toUpperCase() as 'PRO' | 'PREMIUM')}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Выбрать
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
