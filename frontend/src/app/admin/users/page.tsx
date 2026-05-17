'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';
import DashboardShell from '@/components/DashboardShell';

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner', hr_admin: 'HR Admin', manager: 'Manager',
  employee: 'Employee', viewer: 'Viewer',
};
const ROLE_COLORS: Record<string, string> = {
  owner: '#f59e0b', hr_admin: '#2563eb', manager: '#10b981',
  employee: '#6366f1', viewer: '#64748b',
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.users()
      .then(u => setUsers(u as User[]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell
      title="Usuários da Organização"
      subtitle={`${users.length} usuários ativos`}
    >
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Cargo (RBAC)</th>
                <th>Desde</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(3)].map((__, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: j === 0 ? 180 : 100, borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={3}><div className="empty-state"><p>Nenhum usuário encontrado.</p></div></td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${ROLE_COLORS[u.role] ?? '#2563eb'}, #7c3aed)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '3px 10px', borderRadius: 999,
                        fontSize: 11, fontWeight: 600,
                        background: `${ROLE_COLORS[u.role] ?? '#2563eb'}18`,
                        color: ROLE_COLORS[u.role] ?? '#2563eb',
                      }}>
                        {ROLE_LABELS[u.role] ?? u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
