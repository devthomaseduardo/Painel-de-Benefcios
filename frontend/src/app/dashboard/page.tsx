'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { DashboardStats, AuditLog } from '@/types';
import DashboardShell from '@/components/DashboardShell';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const PIE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#6366f1', '#ef4444'];

const STATUS_LABELS: Record<string, string> = {
  active: 'Ativos', onboarding: 'Onboarding', vacation: 'Férias',
  suspended: 'Suspensos', terminated: 'Desligados',
};
const TYPE_LABELS: Record<string, string> = {
  health: 'Saúde', food: 'Alimentação', transport: 'Transporte',
  culture: 'Cultura', other: 'Outros',
};

function StatCard({ label, value, sub, color, icon }: { label: string; value: string | number; sub?: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="stat-card" style={{ '--card-accent': color, '--icon-bg': `${color}18`, '--icon-color': color } as React.CSSProperties}>
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-change">{sub}</div>}
    </div>
  );
}

const ActionBadge: Record<string, string> = {
  CREATE: 'create', UPDATE: 'update', DELETE: 'delete', LOGIN: 'login',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [employees, setEmployees] = useState<any[]>([]); // Using any or Employee if imported
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.dashboard.stats(),
      api.dashboard.logs(),
      api.employees.list(1, 100) // Fetching a good amount to simulate dashboard metrics
    ])
      .then(([s, l, eRes]) => {
        setStats(s as DashboardStats);
        setLogs((l as AuditLog[]).slice(0, 10));
        setEmployees((eRes as any).data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

  const statusData = stats?.employeesByStatus.map(s => ({
    name: STATUS_LABELS[s.status] ?? s.status,
    value: s.count,
  })) ?? [];

  const benefitData = stats?.benefitsByType.map(b => ({
    name: TYPE_LABELS[b.type] ?? b.type,
    value: b.count,
  })) ?? [];

  const timeSince = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'agora';
    if (m < 60) return `${m}min atrás`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h atrás`;
    return `${Math.floor(h / 24)}d atrás`;
  };

  // Derive specialized insights from employee data
  const alerts: { id: string; type: 'warning' | 'error' | 'info'; title: string; message: string }[] = [];
  const lateOrAbsent: { emp: any; status: string; date: string }[] = [];
  const onVacation: any[] = [];
  const offboardingList: any[] = [];

  employees.forEach(emp => {
    // Process Offboardings
    if (emp.offboarding) {
      offboardingList.push(emp);
      if (emp.offboarding.status === 'pending') {
        alerts.push({
          id: `off_${emp.id}`,
          type: 'error',
          title: 'Desligamento Pendente',
          message: `${emp.name} aguarda finalização de offboarding (${emp.offboarding.reason}).`
        });
      }
    }

    // Process Vacations
    if (emp.status === 'vacation') {
      onVacation.push(emp);
    } else if (emp.leaves?.some((l: any) => l.type === 'vacation' && l.status === 'approved')) {
      // Check if they have an upcoming or active vacation not reflected in status
      onVacation.push(emp);
    }

    // Pending Leave requests
    const pendingLeave = emp.leaves?.find((l: any) => l.status === 'pending');
    if (pendingLeave) {
      alerts.push({
        id: `leave_${pendingLeave.id}`,
        type: 'warning',
        title: 'Férias/Licença Pendente',
        message: `${emp.name} solicitou ${pendingLeave.type} e aguarda aprovação.`
      });
    }

    // Process Time Tracking (Ponto)
    if (emp.timeTrackings && emp.timeTrackings.length > 0) {
      const recent = emp.timeTrackings[0]; // Assuming ordered descending
      if (recent.status === 'late' || recent.status === 'absent') {
        lateOrAbsent.push({ emp, status: recent.status, date: recent.date });
      }
    }
  });

  if (lateOrAbsent.length > 0) {
    alerts.unshift({
      id: 'ponto_alert',
      type: 'error',
      title: 'Atenção ao Ponto',
      message: `${lateOrAbsent.length} funcionário(s) com registro de atraso ou falta recente.`
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 'all_good',
      type: 'info',
      title: 'Sistema Operacional',
      message: 'Nenhum alerta crítico no momento. Operação normalizada.'
    });
  }

  return (
    <DashboardShell title="Painel de Controle" subtitle="Visão executiva do capital humano e benefícios">
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        <>
          {/* Custom Alerts Section */}
          <div className="alerts-container" style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Alertas Personalizados
            </h3>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
              {alerts.map(alert => (
                <div key={alert.id} className="alert-card" style={{
                  minWidth: 300,
                  padding: 16,
                  borderRadius: 12,
                  background: alert.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : alert.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                  border: `1px solid ${alert.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : alert.type === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(37, 99, 235, 0.2)'}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12
                }}>
                  <div style={{
                    color: alert.type === 'error' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#3b82f6',
                    marginTop: 2
                  }}>
                    {alert.type === 'error' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    )}
                    {alert.type === 'warning' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    )}
                    {alert.type === 'info' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    )}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: 14, color: 'var(--text-primary)' }}>{alert.title}</h4>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="stats-grid">
            <StatCard
              label="Total de Funcionários" value={stats?.totalEmployees ?? 0}
              sub="Ativos na organização" color="#2563eb"
              icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 14v-1.5A2.5 2.5 0 0 0 8.5 10h-5A2.5 2.5 0 0 0 1 12.5V14"/><circle cx="6" cy="5.5" r="2.5"/><path d="M15 14v-1.5a2.5 2.5 0 0 0-2-2.45"/><path d="M11 3.05a2.5 2.5 0 0 1 0 4.9"/></svg>}
            />
            <StatCard
              label="Total de Benefícios" value={stats?.totalBenefits ?? 0}
              sub="Planos cadastrados" color="#10b981"
              icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 13.5S1.5 9.5 1.5 5.5a3.5 3.5 0 0 1 6.5-1.8A3.5 3.5 0 0 1 14.5 5.5c0 4-6.5 8-6.5 8z"/></svg>}
            />
            <StatCard
              label="Custo Operacional Mensal" value={fmt(stats?.totalCost ?? 0)}
              sub="Investimento em benefícios" color="#f59e0b"
              icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5"/><path d="M8 5v6M6 6.5h2.5a1.5 1.5 0 0 1 0 3H6"/></svg>}
            />
            <StatCard
              label="Taxa de Turnover" value={offboardingList.length > 0 && stats?.totalEmployees ? `${((offboardingList.length / stats.totalEmployees) * 100).toFixed(1)}%` : '0%'}
              sub="Desligamentos recentes" color="#ef4444"
              icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 14h12M4 14V6l4-3 4 3v8M6 10h4"/></svg>}
            />
          </div>

          {/* Detailed Modules Grid */}
          <div className="grid-2" style={{ marginBottom: 24, alignItems: 'start' }}>
            {/* Ponto / Attendance */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Controle de Ponto (Exceções)</div>
                  <div className="card-sub">Atrasos e faltas registradas recentemente</div>
                </div>
              </div>
              <div style={{ padding: '0 20px 20px 20px' }}>
                {lateOrAbsent.length === 0 ? (
                  <div className="empty-state" style={{ padding: 24 }}>Nenhuma ocorrência de ponto registrada.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {lateOrAbsent.map((record, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>{record.emp.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{new Date(record.date).toLocaleDateString('pt-BR')}</div>
                        </div>
                        <span className="tag" style={{ background: record.status === 'late' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: record.status === 'late' ? '#f59e0b' : '#ef4444' }}>
                          {record.status === 'late' ? 'Atraso' : 'Falta'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Férias e Desligamentos */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Movimentações de Pessoal</div>
                  <div className="card-sub">Férias em curso e desligamentos pendentes</div>
                </div>
              </div>
              <div style={{ padding: '0 20px 20px 20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {onVacation.map((emp, i) => (
                    <div key={`vac_${i}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{emp.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Férias</div>
                      </div>
                      <span className="tag" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>Em Gozo</span>
                    </div>
                  ))}
                  {offboardingList.map((emp, i) => (
                    <div key={`off_${i}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{emp.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Desligamento: {emp.offboarding.reason}</div>
                      </div>
                      <span className="tag" style={{ background: emp.offboarding.status === 'completed' ? 'rgba(100, 116, 139, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: emp.offboarding.status === 'completed' ? '#94a3b8' : '#ef4444' }}>
                        {emp.offboarding.status === 'completed' ? 'Finalizado' : 'Pendente'}
                      </span>
                    </div>
                  ))}
                  {onVacation.length === 0 && offboardingList.length === 0 && (
                    <div className="empty-state" style={{ padding: 24, border: 'none' }}>Nenhuma movimentação recente.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid-2" style={{ marginBottom: 24 }}>
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Distribuição de Status</div>
                  <div className="card-sub">Capital humano por situação contratual</div>
                </div>
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#0f172a' }}
                      cursor={{ fill: 'rgba(37,99,235,0.08)' }}
                    />
                    <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Adesão a Benefícios</div>
                  <div className="card-sub">Concentração de custos por categoria</div>
                </div>
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={benefitData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {benefitData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
                    <Tooltip
                      contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#0f172a' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Audit Log Feed */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Auditoria Operacional</div>
                <div className="card-sub">Trilha de modificações sensíveis no sistema</div>
              </div>
            </div>
            {logs.length === 0 ? (
              <div className="empty-state">
                <p>Nenhuma atividade registrada.</p>
              </div>
            ) : (
              <div>
                {logs.map(log => (
                  <div key={log.id} className="log-item">
                    <div className={`log-dot ${ActionBadge[log.action] ?? ''}`} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="log-action">{log.action}</span>
                        <span className="tag">{log.entityType}</span>
                        {log.user && (
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            por <strong>{log.user.name}</strong>
                          </span>
                        )}
                      </div>
                      <div className="log-meta">{timeSince(log.createdAt)} · IP: {log.ipAddress ?? '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
