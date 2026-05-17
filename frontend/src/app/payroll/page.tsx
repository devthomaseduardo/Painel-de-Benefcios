'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Employee, PaginatedResponse } from '@/types';
import DashboardShell from '@/components/DashboardShell';

export default function PayrollPage() {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.employees.list(1, 100) as PaginatedResponse<Employee>;
      setData(res.data.filter(emp => emp.status !== 'terminated'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

  return (
    <DashboardShell
      title="Folha de Pagamento"
      subtitle="Competência: Maio/2026"
      actions={
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm">
            Recalcular Encargos
          </button>
          <button className="btn btn-primary btn-sm">
            Fechar Folha
          </button>
        </div>
      }
    >
       <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Cargo</th>
                <th>Salário Base</th>
                <th>Benefícios (Deduções)</th>
                <th>Líquido Estimado</th>
                <th style={{ textAlign: 'right' }}>Holerite</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6}><div className="skeleton" style={{ height: 14, width: '100%' }} /></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state"><p>Nenhum funcionário na folha.</p></div></td></tr>
              ) : (
                data.map(emp => {
                  const deductions = emp.salary * 0.11; // estimativa INSS
                  const netSalary = emp.salary - deductions;
                  return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                          {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{emp.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.cpf}</div>
                        </div>
                      </div>
                    </td>
                    <td>{emp.position}</td>
                    <td>{formatCurrency(emp.salary)}</td>
                    <td style={{ color: 'var(--danger)' }}>-{formatCurrency(deductions)}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 'bold' }}>{formatCurrency(netSalary)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-icon btn-sm" title="Gerar PDF">
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 4.5V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h7.5L14 4.5z"/><polyline points="10 1 10 5 14 5"/><path d="M5 11h6M5 8h6"/></svg>
                        </button>
                      </div>
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
