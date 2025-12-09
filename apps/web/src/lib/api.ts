import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/auth/refresh`,
            { refreshToken }
          );

          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (e) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string; organizationName?: string }) =>
    api.post('/auth/register', data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
};

export const usersApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data: { name?: string }) => api.patch('/users/me', data),
};

export const organizationsApi = {
  getById: (id: string) => api.get(`/organizations/${id}`),
  update: (id: string, data: { name?: string }) => api.patch(`/organizations/${id}`, data),
  getStats: (id: string) => api.get(`/organizations/${id}/stats`),
  getMembers: (id: string) => api.get(`/organizations/${id}/members`),
};

export const botsApi = {
  getAll: (organizationId: string) => api.get(`/bots?organizationId=${organizationId}`),
  getById: (id: string) => api.get(`/bots/${id}`),
  createTelegram: (organizationId: string, data: { name: string; token: string }) =>
    api.post(`/bots/telegram?organizationId=${organizationId}`, data),
  update: (id: string, data: { name?: string; isActive?: boolean }) => api.patch(`/bots/${id}`, data),
  delete: (id: string) => api.delete(`/bots/${id}`),
};

export const automationsApi = {
  getAll: (organizationId: string) => api.get(`/automations?organizationId=${organizationId}`),
  getById: (id: string) => api.get(`/automations/${id}`),
  create: (organizationId: string, data: { name: string; description?: string; triggerType: string }) =>
    api.post(`/automations?organizationId=${organizationId}`, data),
  update: (id: string, data: { name?: string; description?: string; isActive?: boolean }) =>
    api.patch(`/automations/${id}`, data),
  delete: (id: string) => api.delete(`/automations/${id}`),
  saveFlow: (id: string, nodes: any[], edges: any[]) => api.post(`/automations/${id}/flow`, { nodes, edges }),
  assignToBots: (id: string, botIds: string[]) => api.post(`/automations/${id}/bots`, { botIds }),
};

export const contactsApi = {
  getAll: (organizationId: string, params?: { page?: number; limit?: number; search?: string }) =>
    api.get(`/contacts`, { params: { organizationId, ...params } }),
  getById: (id: string) => api.get(`/contacts/${id}`),
  update: (id: string, data: { tags?: string[]; points?: number }) => api.patch(`/contacts/${id}`, data),
};

export const messagesApi = {
  getConversations: (organizationId: string) => api.get(`/messages/conversations?organizationId=${organizationId}`),
  getConversationMessages: (conversationId: string) => api.get(`/messages/conversations/${conversationId}`),
};

export const aiApi = {
  generate: (data: { systemPrompt?: string; userMessage: string; model?: string }) => api.post('/ai/generate', data),
  improve: (data: { text: string; style: string }) => api.post('/ai/improve', data),
  contentIdeas: (data: { topic: string; count: number }) => api.post('/ai/content-ideas', data),
};

export const billingApi = {
  getSubscription: (organizationId: string) => api.get(`/billing/${organizationId}`),
  createCheckout: (data: { organizationId: string; plan: string; successUrl: string; cancelUrl: string }) =>
    api.post('/billing/checkout', data),
  createPortal: (data: { organizationId: string; returnUrl: string }) => api.post('/billing/portal', data),
};

export default api;
