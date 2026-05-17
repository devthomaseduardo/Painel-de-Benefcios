// API client — can use a remote backend URL in production, or local /api rewrites in development
const BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/api`
  : '/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data as T;
}

// AUTH
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (body: { name: string; email: string; password: string; organizationName: string; organizationSlug: string }) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  },
  dashboard: {
    stats: () => request('/dashboard/stats'),
    logs: () => request('/dashboard/logs'),
    notifications: () => request('/dashboard/notifications'),
    markNotificationRead: (id: string) => request(`/dashboard/notifications/${id}/read`, { method: 'POST' }),
  },
  employees: {
    list: (page = 1, limit = 10) => request(`/employees?page=${page}&limit=${limit}`),
    get: (id: string) => request(`/employees/${id}`),
    create: (body: Record<string, unknown>) =>
      request('/employees', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Record<string, unknown>) =>
      request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id: string) => request(`/employees/${id}`, { method: 'DELETE' }),
    addBenefit: (employeeId: string, benefitId: string) =>
      request('/employees/benefit', { method: 'POST', body: JSON.stringify({ employeeId, benefitId }) }),
  },
  benefits: {
    list: () => request('/benefits'),
    get: (id: string) => request(`/benefits/${id}`),
    create: (body: Record<string, unknown>) =>
      request('/benefits', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Record<string, unknown>) =>
      request(`/benefits/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id: string) => request(`/benefits/${id}`, { method: 'DELETE' }),
  },
  admin: {
    stats: () => request('/admin/stats'),
    logs: () => request('/admin/logs'),
    users: () => request('/admin/users'),
    exportEmployees: () => `${BASE}/admin/export/employees`,
    exportBenefits: () => `${BASE}/admin/export/benefits`,
  },
};
