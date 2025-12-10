import Link from 'next/link';
import { Bot, Zap, MessageSquare, Users, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Nikbot</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm hover:underline">
              Войти
            </Link>
            <Link
              href="/auth/register"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"
            >
              Начать бесплатно
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Автоматизируйте общение
            <br />
            <span className="text-primary">с клиентами</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Создавайте чат-ботов для Telegram, Instagram и TikTok без программирования.
            Визуальный конструктор, AI-ответы и CRM в одном месте.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium text-lg"
            >
              Попробовать бесплатно
            </Link>
            <Link
              href="#features"
              className="border px-8 py-3 rounded-lg font-medium text-lg hover:bg-muted"
            >
              Узнать больше
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Возможности</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border rounded-xl">
              <MessageSquare className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Мультиплатформенность</h3>
              <p className="text-muted-foreground">
                Telegram, Instagram, TikTok — управляйте всеми ботами из одного места.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Визуальный конструктор</h3>
              <p className="text-muted-foreground">
                Создавайте сценарии drag-and-drop без единой строки кода.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <Bot className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-ответы</h3>
              <p className="text-muted-foreground">
                GPT-4 отвечает на вопросы клиентов 24/7 как живой оператор.
              </p>
            </div>
            <div className="p-6 border rounded-xl">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">CRM для контактов</h3>
              <p className="text-muted-foreground">
                Теги, баллы, сегменты — всё для персонализации общения.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Тарифы</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 border rounded-xl bg-background">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal">/мес</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 200 взаимодействий</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 1 бот</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Базовые автоматизации</li>
              </ul>
              <Link href="/auth/register" className="block text-center border py-2 rounded-lg hover:bg-muted">
                Начать
              </Link>
            </div>
            <div className="p-6 border-2 border-primary rounded-xl bg-background relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                Популярный
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-3xl font-bold mb-4">$20<span className="text-sm font-normal">/мес</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 1,000 взаимодействий</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 3 бота</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> AI-ответы</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Аналитика</li>
              </ul>
              <Link href="/auth/register" className="block text-center bg-primary text-primary-foreground py-2 rounded-lg">
                Выбрать
              </Link>
            </div>
            <div className="p-6 border rounded-xl bg-background">
              <h3 className="text-xl font-semibold mb-2">Premium</h3>
              <p className="text-3xl font-bold mb-4">$79<span className="text-sm font-normal">/мес</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Безлимит</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Безлимит ботов</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> API доступ</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Приоритетная поддержка</li>
              </ul>
              <Link href="/auth/register" className="block text-center border py-2 rounded-lg hover:bg-muted">
                Выбрать
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          © 2024 Nikbot. Все права защищены.
        </div>
      </footer>
    </div>
  );
}
