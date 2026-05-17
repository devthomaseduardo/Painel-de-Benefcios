'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Employee, PaginatedResponse } from '@/types';
import DashboardShell from '@/components/DashboardShell';

export default function LeavesPage() {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.employees.list(1, 100) as PaginatedResponse<Employee>;
      // For demo, we get vacation employees
      setData(res.data.filter(emp => emp.status === 'vacation'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <DashboardShell
      title="Férias e Licenças"
      subtitle="Gerenciamento de ausências programadas"
      actions={
        <button className="btn btn-primary btn-sm">
          Nova Solicitação
        </button>
      }
    >
       <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Tipo</th>
                <th>Período</th>
                <th>Retorno Previsto</th>
                <th>Status</th>
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
                <tr><td colSpan={5}><div className="empty-state"><p>Nenhuma licença ou férias em andamento.</p></div></td></tr>
              ) : (
                data.map(emp => {
                  const today = new Date();
                  const returnDate = new Date(today.setDate(today.getDate() + 14));
                  return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                          {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{emp.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.department?.name || 'RH'}</div>
                        </div>
                      </div>
                    </td>
                    <td>Férias Regulares</td>
                    <td>14 Dias</td>
                    <td>{returnDate.toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className="badge badge-info">Em Andamento</span>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
