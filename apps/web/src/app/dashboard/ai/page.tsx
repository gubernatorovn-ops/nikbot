'use client';

import { useState } from 'react';
import { Sparkles, Send, Wand2, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { aiApi } from '@/lib/api';

export default function AiPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'improve' | 'ideas'>('chat');
  const [loading, setLoading] = useState(false);

  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);

  const [improveText, setImproveText] = useState('');
  const [improveStyle, setImproveStyle] = useState('professional');
  const [improvedResult, setImprovedResult] = useState('');

  const [ideasTopic, setIdeasTopic] = useState('');
  const [ideasCount, setIdeasCount] = useState(5);
  const [ideas, setIdeas] = useState<string[]>([]);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setChatHistory((prev) => [...prev, { role: 'user', content: chatMessage }]);
    setLoading(true);

    try {
      const { data } = await aiApi.generate({ userMessage: chatMessage });
      setChatHistory((prev) => [...prev, { role: 'assistant', content: data.response }]);
      setChatMessage('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!improveText.trim()) return;

    setLoading(true);
    try {
      const { data } = await aiApi.improve({ text: improveText, style: improveStyle });
      setImprovedResult(data.improvedText);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideasTopic.trim()) return;

    setLoading(true);
    try {
      const { data } = await aiApi.contentIdeas({ topic: ideasTopic, count: ideasCount });
      setIdeas(data.ideas);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Ассистент</h1>
        <p className="text-muted-foreground">Используйте AI для создания контента</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={activeTab === 'chat' ? 'default' : 'outline'}
          onClick={() => setActiveTab('chat')}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Чат
        </Button>
        <Button
          variant={activeTab === 'improve' ? 'default' : 'outline'}
          onClick={() => setActiveTab('improve')}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Улучшить текст
        </Button>
        <Button
          variant={activeTab === 'ideas' ? 'default' : 'outline'}
          onClick={() => setActiveTab('ideas')}
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Идеи контента
        </Button>
      </div>

      {activeTab === 'chat' && (
        <Card>
          <CardContent className="p-4">
            <div className="h-[400px] overflow-auto mb-4 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Начните диалог с AI
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg ${
                        msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleChat} className="flex gap-2">
              <Input
                placeholder="Напишите сообщение..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <Button type="submit" disabled={loading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'improve' && (
        <Card>
          <CardHeader>
            <CardTitle>Улучшить текст</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleImprove} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Исходный текст</label>
                <textarea
                  className="w-full h-32 mt-1 p-2 border rounded-md"
                  value={improveText}
                  onChange={(e) => setImproveText(e.target.value)}
                  placeholder="Вставьте текст для улучшения..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Стиль</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={improveStyle}
                  onChange={(e) => setImproveStyle(e.target.value)}
                >
                  <option value="professional">Профессиональный</option>
                  <option value="friendly">Дружелюбный</option>
                  <option value="formal">Официальный</option>
                  <option value="casual">Неформальный</option>
                </select>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Улучшение...' : 'Улучшить'}
              </Button>

              {improvedResult && (
                <div>
                  <label className="text-sm font-medium">Результат</label>
                  <div className="mt-1 p-4 bg-muted rounded-md">{improvedResult}</div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'ideas' && (
        <Card>
          <CardHeader>
            <CardTitle>Генерация идей</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleIdeas} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Тема</label>
                <Input
                  value={ideasTopic}
                  onChange={(e) => setIdeasTopic(e.target.value)}
                  placeholder="Например: фитнес, здоровое питание"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Количество идей</label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={ideasCount}
                  onChange={(e) => setIdeasCount(parseInt(e.target.value) || 5)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Генерация...' : 'Сгенерировать'}
              </Button>

              {ideas.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Идеи</label>
                  <ul className="mt-2 space-y-2">
                    {ideas.map((idea, i) => (
                      <li key={i} className="p-3 bg-muted rounded-md flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 mt-0.5 text-primary" />
                        {idea}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
