'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Employee, Benefit, Department, PaginatedResponse } from '@/types';
import DashboardShell from '@/components/DashboardShell';

const STATUS_COLORS: Record<string, string> = {
  active: 'badge-active', onboarding: 'badge-onboarding', vacation: 'badge-info',
  suspended: 'badge-suspended', terminated: 'badge-terminated',
};
const STATUS_PT: Record<string, string> = {
  active: 'Ativo', onboarding: 'Onboarding', vacation: 'Férias',
  suspended: 'Suspenso', terminated: 'Desligado',
};

const EMPTY_FORM = {
  name: '', email: '', cpf: '', position: '', salary: '',
  status: 'onboarding', departmentId: '',
};

function SearchIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="6.5" cy="6.5" r="5"/><path d="M11 11l3.5 3.5"/></svg>;
}
function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v12M2 8h12"/></svg>;
}
function EditIcon() {
  return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 11.5V14h2.5l7.1-7.1-2.5-2.5L2 11.5z"/><path d="M11.9 4.6l-2.5-2.5 1.4-1.4a1 1 0 0 1 1.4 0l1.1 1.1a1 1 0 0 1 0 1.4l-1.4 1.4z"/></svg>;
}
function TrashIcon() {
  return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 4h12M5 4V2.5h6V4M6 7v5M10 7v5M3 4l1 10h8l1-10"/></svg>;
}

export default function EmployeesPage() {
  const [data, setData] = useState<PaginatedResponse<Employee> | null>(null);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    api.employees.list(page)
      .then(r => setData(r as PaginatedResponse<Employee>))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    api.benefits.list().then(b => setBenefits(b as Benefit[]));
  }, []);

  const filtered = data?.data.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const openCreate = () => {
    setForm(EMPTY_FORM); setSelected(null); setError(''); setModal('create');
  };
  const openEdit = (emp: Employee) => {
    setForm({ name: emp.name, email: emp.email, cpf: emp.cpf, position: emp.position, salary: String(emp.salary), status: emp.status, departmentId: emp.departmentId });
    setSelected(emp); setError(''); setModal('edit');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const body = { ...form, salary: parseFloat(form.salary) };
      if (modal === 'create') await api.employees.create(body as Record<string, unknown>);
      else if (modal === 'edit' && selected) await api.employees.update(selected.id, body as Record<string, unknown>);
      setModal(null); load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Arquivar este funcionário?')) return;
    await api.employees.remove(id);
    load();
  };

  const formatSalary = (n: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

  return (
    <DashboardShell
      title="Funcionários"
      subtitle={`${data?.meta.total ?? 0} registros encontrados`}
      actions={
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <PlusIcon /> Novo Funcionário
        </button>
      }
    >
      {/* Search */}
      <div className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon"><SearchIcon /></span>
          <input
            className="search-input"
            placeholder="Buscar por nome, e-mail ou cargo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Salário</th>
                <th>Status</th>
                <th>Benefícios</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((__, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: j === 0 ? 160 : 80, borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7}><div className="empty-state"><p>Nenhum funcionário encontrado.</p></div></td></tr>
              ) : (
                filtered.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                          {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{emp.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-primary">{emp.position}</td>
                    <td>{emp.department?.name ?? '—'}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>{formatSalary(emp.salary)}</td>
                    <td><span className={`badge ${STATUS_COLORS[emp.status] ?? ''}`}>{STATUS_PT[emp.status] ?? emp.status}</span></td>
                    <td>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {emp.benefits?.length ?? 0} plano{(emp.benefits?.length ?? 0) !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(emp)} title="Editar"><EditIcon /></button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(emp.id)} title="Arquivar"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
            <div className="pagination">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {[...Array(data.meta.totalPages)].map((_, i) => (
                <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
              <button className="page-btn" disabled={page === data.meta.totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{modal === 'create' ? 'Novo Funcionário' : 'Editar Funcionário'}</span>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {error && <div className="auth-error">{error}</div>}
                <div className="form-grid">
                  <div className="form-group"><label className="form-label">Nome *</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                  <div className="form-group"><label className="form-label">E-mail *</label><input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
                  <div className="form-group"><label className="form-label">CPF *</label><input className="form-input" value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} placeholder="000.000.000-00" required /></div>
                  <div className="form-group"><label className="form-label">Cargo *</label><input className="form-input" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} required /></div>
                  <div className="form-group"><label className="form-label">Salário (R$) *</label><input className="form-input" type="number" step="0.01" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} required /></div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      <option value="onboarding">Onboarding</option>
                      <option value="active">Ativo</option>
                      <option value="vacation">Férias</option>
                      <option value="suspended">Suspenso</option>
                      <option value="terminated">Desligado</option>
                    </select>
                  </div>
                </div>
                {departments.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Departamento</label>
                    <select className="form-select" value={form.departmentId} onChange={e => setForm(f => ({ ...f, departmentId: e.target.value }))}>
                      <option value="">Selecionar...</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
