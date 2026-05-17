// Types aligned with the backend Prisma schema

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  active: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'hr_admin' | 'manager' | 'employee' | 'viewer';
  organization: Organization;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
}

export interface Benefit {
  id: string;
  name: string;
  description?: string;
  type: 'health' | 'food' | 'transport' | 'culture' | 'other';
  cost: number;
  provider: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeTracking {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  status: 'regular' | 'late' | 'absent' | 'overtime';
}

export interface Leave {
  id: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'personal';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Offboarding {
  id: string;
  employeeId: string;
  date: string;
  reason: string;
  status: 'pending' | 'completed';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  cpf: string;
  position: string;
  salary: number;
  status: 'active' | 'onboarding' | 'vacation' | 'suspended' | 'terminated';
  organizationId: string;
  departmentId: string;
  department?: Department;
  benefits?: Benefit[];
  timeTrackings?: TimeTracking[];
  leaves?: Leave[];
  offboarding?: Offboarding;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalEmployees: number;
  totalBenefits: number;
  employeesByStatus: { status: string; count: number }[];
  benefitsByType: { type: string; count: number }[];
  totalCost: number;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldData?: unknown;
  newData?: unknown;
  ipAddress?: string;
  createdAt: string;
  user?: { name: string; email?: string };
}

export interface AdminStats {
  users: number;
  employees: number;
  benefits: number;
  activity24h: number;
}
