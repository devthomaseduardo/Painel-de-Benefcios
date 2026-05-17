'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Benefit } from '@/types';
import DashboardShell from '@/components/DashboardShell';

const TYPE_LABELS: Record<string, string> = {
  health: 'Saúde', food: 'Alimentação', transport: 'Transporte', culture: 'Cultura', other: 'Outros',
};
const STATUS_COLORS: Record<string, string> = {
  approved: 'badge-approved', pending: 'badge-pending', denied: 'badge-terminated', expired: 'badge-terminated',
};
const STATUS_PT: Record<string, string> = {
  approved: 'Aprovado', pending: 'Pendente', denied: 'Negado', expired: 'Expirado',
};
const TYPE_ICONS: Record<string, string> = {
  health: '🏥', food: '🍽️', transport: '🚌', culture: '🎭', other: '📦',
};

const EMPTY_FORM = { name: '', description: '', type: 'health', cost: '', provider: '', status: 'pending' };

function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v12M2 8h12"/></svg>; }
function EditIcon() { return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 11.5V14h2.5l7.1-7.1-2.5-2.5L2 11.5z"/><path d="M11.9 4.6l-2.5-2.5 1.4-1.4a1 1 0 0 1 1.4 0l1.1 1.1a1 1 0 0 1 0 1.4l-1.4 1.4z"/></svg>; }
function TrashIcon() { return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 4h12M5 4V2.5h6V4M6 7v5M10 7v5M3 4l1 10h8l1-10"/></svg>; }

export default function BenefitsPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Benefit | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    api.benefits.list()
      .then(b => setBenefits(b as Benefit[]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = benefits.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.provider.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY_FORM); setSelected(null); setError(''); setModal('create'); };
  const openEdit = (b: Benefit) => {
    setForm({ name: b.name, description: b.description ?? '', type: b.type, cost: String(b.cost), provider: b.provider, status: b.status });
    setSelected(b); setError(''); setModal('edit');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const body = { ...form, cost: parseFloat(form.cost) };
      if (modal === 'create') await api.benefits.create(body as Record<string, unknown>);
      else if (modal === 'edit' && selected) await api.benefits.update(selected.id, body as Record<string, unknown>);
      setModal(null); load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Arquivar este benefício?')) return;
    await api.benefits.remove(id);
    load();
  };

  const totalCost = benefits.reduce((s, b) => s + b.cost, 0);
  const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

  return (
    <DashboardShell
      title="Benefícios"
      subtitle={`${benefits.length} planos cadastrados · Custo total: ${fmt(totalCost)}`}
      actions={
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <PlusIcon /> Novo Benefício
        </button>
      }
    >
      {/* Summary strip */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {Object.entries(TYPE_LABELS).map(([type, label]) => {
          const count = benefits.filter(b => b.type === type).length;
          const cost = benefits.filter(b => b.type === type).reduce((s, b) => s + b.cost, 0);
          return (
            <div key={type} className="stat-card" style={{ '--card-accent': '#2563eb' } as React.CSSProperties}>
              <div className="stat-header">
                <span className="stat-label">{label}</span>
                <span style={{ fontSize: 20 }}>{TYPE_ICONS[type]}</span>
              </div>
              <div className="stat-value">{count}</div>
              <div className="stat-change">{fmt(cost)}</div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: 16 }}>
        <div className="search-input-wrap">
          <span className="search-icon">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="6.5" cy="6.5" r="5"/><path d="M11 11l3.5 3.5"/></svg>
          </span>
          <input className="search-input" placeholder="Buscar por nome ou fornecedor..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid-auto">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><p>Nenhum benefício encontrado.</p></div>
      ) : (
        <div className="grid-auto">
          {filtered.map(b => (
            <div key={b.id} className="card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 24 }}>{TYPE_ICONS[b.type] ?? '📦'}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.provider}</div>
                  </div>
                </div>
                <span className={`badge ${STATUS_COLORS[b.status] ?? ''}`}>{STATUS_PT[b.status] ?? b.status}</span>
              </div>
              {b.description && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{b.description}</p>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--success)' }}>{fmt(b.cost)}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{TYPE_LABELS[b.type]}</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(b)} title="Editar"><EditIcon /></button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(b.id)} title="Arquivar"><TrashIcon /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{modal === 'create' ? 'Novo Benefício' : 'Editar Benefício'}</span>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {error && <div className="auth-error">{error}</div>}
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Nome *</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                  <div className="form-group">
                    <label className="form-label">Tipo</label>
                    <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      <option value="pending">Pendente</option>
                      <option value="approved">Aprovado</option>
                      <option value="denied">Negado</option>
                      <option value="expired">Expirado</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Custo (R$) *</label><input className="form-input" type="number" step="0.01" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} required /></div>
                  <div className="form-group"><label className="form-label">Fornecedor *</label><input className="form-input" value={form.provider} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))} required /></div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Descrição</label><textarea className="form-textarea" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                </div>
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
