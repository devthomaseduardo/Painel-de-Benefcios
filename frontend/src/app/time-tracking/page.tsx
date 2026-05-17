'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Employee, PaginatedResponse } from '@/types';
import DashboardShell from '@/components/DashboardShell';

export default function TimeTrackingPage() {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.employees.list(1, 100) as PaginatedResponse<Employee>;
      // For demo purposes, we show active employees
      setData(res.data.filter(emp => emp.status === 'active' || emp.status === 'onboarding'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <DashboardShell
      title="Controle de Ponto"
      subtitle="Registro diário de entrada e saída"
      actions={
        <button className="btn btn-primary btn-sm">
          Exportar Relatório
        </button>
      }
    >
       <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Data</th>
                <th>Entrada</th>
                <th>Saída</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5}><div className="skeleton" style={{ height: 14, width: '100%' }} /></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state"><p>Nenhum registro encontrado.</p></div></td></tr>
              ) : (
                data.flatMap(emp => {
                  const tracks = emp.timeTrackings || [];
                  if (tracks.length === 0) return [];
                  
                  return tracks.map(track => {
                    const isLate = track.status === 'late';
                    return (
                      <tr key={track.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                              {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{emp.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.department?.name || 'Geral'}</div>
                            </div>
                          </div>
                        </td>
                        <td>{new Date(track.date).toLocaleDateString('pt-BR')}</td>
                        <td style={{ color: isLate ? 'var(--danger)' : 'inherit' }}>
                          {track.clockIn ? new Date(track.clockIn).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td>
                          {track.clockOut ? new Date(track.clockOut).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td>
                          {isLate ? (
                            <span className="badge badge-suspended">Atraso</span>
                          ) : (
                            <span className="badge badge-active">Regular</span>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
