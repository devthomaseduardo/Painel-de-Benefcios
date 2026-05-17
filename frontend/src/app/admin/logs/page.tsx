'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AuditLog } from '@/types';
import DashboardShell from '@/components/DashboardShell';

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'create', UPDATE: 'update', DELETE: 'delete', LOGIN: 'login',
};
const ACTION_LABELS: Record<string, string> = {
  CREATE: 'Criação', UPDATE: 'Atualização', DELETE: 'Exclusão', LOGIN: 'Login',
};
const ENTITY_LABELS: Record<string, string> = {
  EMPLOYEE: 'Funcionário', BENEFIT: 'Benefício', USER: 'Usuário', ORGANIZATION: 'Organização',
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.admin.logs()
      .then(l => setLogs(l as AuditLog[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(l =>
    !filter ||
    l.action === filter ||
    l.entityType === filter ||
    (l.user?.name?.toLowerCase().includes(filter.toLowerCase()))
  );

  const timeSince = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'agora';
    if (m < 60) return `${m}min atrás`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h atrás`;
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const counts = {
    total: logs.length,
    creates: logs.filter(l => l.action === 'CREATE').length,
    updates: logs.filter(l => l.action === 'UPDATE').length,
    deletes: logs.filter(l => l.action === 'DELETE').length,
  };

  return (
    <DashboardShell title="Audit Trail" subtitle="Rastreabilidade completa de ações na plataforma">
      {/* Summary */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total de Registros', value: counts.total, color: '#6366f1' },
          { label: 'Criações', value: counts.creates, color: '#10b981' },
          { label: 'Atualizações', value: counts.updates, color: '#f59e0b' },
          { label: 'Exclusões', value: counts.deletes, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--card-accent': s.color } as React.CSSProperties}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="search-bar" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <button className={`btn btn-sm ${!filter ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('')}>Todos</button>
        {['CREATE', 'UPDATE', 'DELETE', 'LOGIN'].map(a => (
          <button key={a} className={`btn btn-sm ${filter === a ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(a)}>
            {ACTION_LABELS[a]}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>{filtered.length} registros</span>
      </div>

      {/* Log Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ação</th>
                <th>Entidade</th>
                <th>Usuário</th>
                <th>IP</th>
                <th>Quando</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((__, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: j === 0 ? 90 : 120, borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state"><p>Nenhum registro encontrado.</p></div></td></tr>
              ) : (
                filtered.map(log => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className={`log-dot ${ACTION_COLORS[log.action] ?? ''}`} style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{log.action}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="tag">{ENTITY_LABELS[log.entityType] ?? log.entityType}</span>
                        {log.entityId && <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{log.entityId.slice(0, 8)}…</span>}
                      </div>
                    </td>
                    <td>{log.user ? <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{log.user.name}</span> : <span style={{ color: 'var(--text-muted)' }}>Sistema</span>}</td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{log.ipAddress ?? '—'}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{timeSince(log.createdAt)}</td>
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
