'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AdminStats } from '@/types';
import DashboardShell from '@/components/DashboardShell';

export default function ReportsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.stats()
      .then(s => setStats(s as AdminStats))
      .finally(() => setLoading(false));
  }, []);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const downloadCsv = async (type: 'employees' | 'benefits') => {
    const url = type === 'employees' ? api.admin.exportEmployees() : api.admin.exportBenefits();
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${type}_export.csv`;
    a.click();
  };

  return (
    <DashboardShell title="Relatórios" subtitle="Exportações e métricas administrativas">
      {/* Admin Stats */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {[
          { label: 'Usuários', value: stats?.users ?? 0, color: '#2563eb' },
          { label: 'Funcionários', value: stats?.employees ?? 0, color: '#10b981' },
          { label: 'Benefícios', value: stats?.benefits ?? 0, color: '#f59e0b' },
          { label: 'Atividades (24h)', value: stats?.activity24h ?? 0, color: '#6366f1' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--card-accent': s.color } as React.CSSProperties}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{loading ? '—' : s.value}</div>
          </div>
        ))}
      </div>

      {/* Export Cards */}
      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, background: 'var(--success-dim)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👥</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Exportar Funcionários</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Todos os registros ativos em CSV</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            Exporta nome, e-mail, CPF, cargo, salário, status e departamento de todos os funcionários ativos da organização.
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => downloadCsv('employees')}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v9M5 8l3 3 3-3"/><path d="M2 13h12"/></svg>
            Baixar CSV de Funcionários
          </button>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, background: 'var(--warning-dim)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏥</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Exportar Benefícios</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Catálogo completo em CSV</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            Exporta nome, tipo, custo, fornecedor e status de todos os benefícios cadastrados na organização.
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => downloadCsv('benefits')}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v9M5 8l3 3 3-3"/><path d="M2 13h12"/></svg>
            Baixar CSV de Benefícios
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{ marginTop: 20, padding: '14px 20px', background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--accent-light)" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5"/><path d="M8 7v4M8 5.5v.5"/></svg>
        <span style={{ fontSize: 13, color: 'var(--text-accent)' }}>
          Todos os relatórios são gerados em tempo real e filtrados pelo escopo da sua organização (Multi-tenant).
        </span>
      </div>
    </DashboardShell>
  );
}
