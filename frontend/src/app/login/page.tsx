'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Formulário Login
  const [email, setEmail] = useState('admin@thomas.com');
  const [password, setPassword] = useState('admin123');

  // Formulário Registro
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regOrg, setRegOrg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        organizationName: regOrg,
        organizationSlug: regOrg.toLowerCase().replace(/\s+/g, '-'),
      });
      setTab('login');
      setError('');
      alert('Organização criada! Faça login para continuar.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0c10', color: '#e5e7eb' }}>
      
      {/* Coluna Esquerda - Branding Enterprise */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', 
        borderRight: '1px solid var(--border)',
        padding: '60px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Patterns / Glow */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)', zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 80 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                <line x1="12" y1="12" x2="12" y2="16"/>
                <line x1="10" y1="14" x2="14" y2="14"/>
              </svg>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>BenefitPanel<span style={{ color: '#3b82f6' }}>.</span></span>
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', color: '#fff', marginBottom: 32, maxWidth: 540 }}>
            Eleve a gestão de benefícios da sua empresa.
          </h1>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { text: 'Arquitetura Multi-Tenant com isolamento total de dados' },
              { text: 'Provisionamento automático e auditoria em tempo real' },
              { text: 'Dashboard analítico para controle de custos e utilização' }
            ].map((feature, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: '#cbd5e1' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                {feature.text}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: 60 }}>
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: '#475569', marginBottom: 20 }}>Empresas que confiam na nossa tecnologia</div>
          <div style={{ display: 'flex', gap: 32, opacity: 0.5, filter: 'grayscale(100%)', alignItems: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.05em' }}>ACME Corp</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.05em' }}>Globex</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.05em' }}>Soylent</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.05em' }}>Initech</div>
          </div>
        </div>
      </div>

      {/* Coluna Direita - Formulário */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#0a0c10' 
      }}>
        <div style={{ width: '100%', maxWidth: 420, padding: '0 32px' }}>
          
          <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'var(--bg-elevated)', borderRadius: 10, padding: 4 }}>
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className="btn"
                style={{
                  flex: 1, justifyContent: 'center',
                  background: tab === t ? 'var(--bg-surface)' : 'transparent',
                  color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: tab === t ? '1px solid var(--border)' : '1px solid transparent',
                  fontWeight: tab === t ? 600 : 400,
                  fontSize: 13, padding: '8px 12px'
                }}
              >
                {t === 'login' ? 'Acessar Conta' : 'Criar Organização'}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>
              {tab === 'login' ? 'Bem-vindo de volta' : 'Setup Inicial'}
            </h2>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              {tab === 'login' ? 'Insira suas credenciais corporativas.' : 'Provisione seu ambiente isolado.'}
            </p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 8, fontSize: 13, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>E-mail Corporativo</label>
                <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nome@suaempresa.com.br"
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', color: '#fff', padding: '12px 16px', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 2px rgba(37,99,235,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = '#1e293b'; e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.1)'; }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#cbd5e1' }}>Senha</label>
                  <span style={{ fontSize: 12, color: '#3b82f6', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'} onMouseLeave={e => e.currentTarget.style.color = '#3b82f6'}>Esqueceu a senha?</span>
                </div>
                <input 
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', color: '#fff', padding: '12px 16px', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 2px rgba(37,99,235,0.2)'; }}
                  onBlur={e => { e.target.style.borderColor = '#1e293b'; e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.1)'; }}
                />
              </div>
              <button 
                type="submit" disabled={loading}
                style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', padding: '14px', borderRadius: 8, fontSize: 15, fontWeight: 600, marginTop: 8, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(37,99,235,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.3)'; }}
                onMouseDown={e => { e.currentTarget.style.transform = 'translateY(1px)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.3)'; }}
              >
                {loading ? 'Autenticando SSO...' : 'Acessar Workspace'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Nome Completo (Administrador)</label>
                <input 
                  type="text" value={regName} onChange={e => setRegName(e.target.value)} required placeholder="Ex: Thomas Silva"
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', color: '#fff', padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'border 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#1e293b'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>E-mail Corporativo</label>
                <input 
                  type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required placeholder="thomas@suaempresa.com.br"
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', color: '#fff', padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'border 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#1e293b'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Senha Administrativa</label>
                <input 
                  type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required placeholder="••••••••"
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', color: '#fff', padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'border 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#1e293b'}
                />
              </div>
              <div style={{ height: 1, background: '#1e293b', margin: '8px 0' }} />
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Nome da Empresa / Razão Social</label>
                <input 
                  type="text" value={regOrg} onChange={e => setRegOrg(e.target.value)} required placeholder="Ex: Acme Corp do Brasil LTDA"
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #1e293b', color: '#fff', padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'border 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#1e293b'}
                />
              </div>
              
              <button 
                type="submit" disabled={loading}
                style={{ width: '100%', background: '#f8fafc', color: '#0f172a', border: 'none', padding: '12px', borderRadius: 8, fontSize: 14, fontWeight: 700, marginTop: 8, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'none'; }}
              >
                {loading ? 'Provisionando Ambiente...' : 'Criar Conta Enterprise'}
              </button>
            </form>
          )}

          <div style={{ marginTop: 40, borderTop: '1px solid #1e293b', paddingTop: 24, display: 'flex', justifyContent: 'center', gap: 24, color: '#475569', fontSize: 12 }}>
            <span>© 2026 BenefitPanel</span>
            <span style={{ cursor: 'pointer' }}>Privacy</span>
            <span style={{ cursor: 'pointer' }}>Terms</span>
          </div>
        </div>
      </div>

    </div>
  );
}
