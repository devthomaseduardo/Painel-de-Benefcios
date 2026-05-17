'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Employee, PaginatedResponse } from '@/types';
import DashboardShell from '@/components/DashboardShell';

export default function OffboardingPage() {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.employees.list(1, 100) as PaginatedResponse<Employee>;
      const terminated = res.data.filter(emp => emp.status === 'terminated');
      setData(terminated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <DashboardShell
      title="Desligamentos"
      subtitle="Controle de processos de offboarding"
      actions={
        <button className="btn btn-danger btn-sm">
          Iniciar Processo de Desligamento
        </button>
      }
    >
       <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Cargo</th>
                <th>Status do Desligamento</th>
                <th>Data Efetiva</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5}><div className="skeleton" style={{ height: 14, width: '100%' }} /></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state"><p>Nenhum processo de desligamento encontrado.</p></div></td></tr>
              ) : (
                data.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#ef4444,#b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                          {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{emp.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-primary">{emp.position}</td>
                    <td><span className="badge badge-terminated">Concluído</span></td>
                    <td>{new Date().toLocaleDateString('pt-BR')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-icon btn-sm" title="Ver Detalhes">
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 8s4-5 7-5 7 5 7 5-4 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/></svg>
                        </button>
                      </div>
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
