'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Building, Lock, ArrowRight, Command } from 'lucide-react';

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [alertInfo, setAlertInfo] = useState<{ type: 'error' | 'success', message: string } | null>(null);
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
    setAlertInfo(null); setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setAlertInfo({ type: 'error', message: err instanceof Error ? err.message : 'Erro ao fazer login. Verifique suas credenciais.' });
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertInfo(null); setLoading(true);
    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        organizationName: regOrg,
        organizationSlug: regOrg.toLowerCase().replace(/\s+/g, '-'),
      });
      setTab('login');
      setAlertInfo({ type: 'success', message: 'Organização criada com sucesso! Faça login para continuar.' });
    } catch (err: unknown) {
      setAlertInfo({ type: 'error', message: err instanceof Error ? err.message : 'Erro ao registrar' });
    } finally { setLoading(false); }
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          background: #09090b;
          color: #fafafa;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        /* Premium Background Effects */
        .bg-glow-1 {
          position: absolute;
          top: -20%;
          left: -10%;
          width: 70vw;
          height: 70vw;
          background: radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(9,9,11,0) 70%);
          border-radius: 50%;
          z-index: 0;
          pointer-events: none;
        }
        .bg-glow-2 {
          position: absolute;
          bottom: -20%;
          right: -10%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(16,185,129,0.05) 0%, rgba(9,9,11,0) 70%);
          border-radius: 50%;
          z-index: 0;
          pointer-events: none;
        }

        .login-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1;
          padding: 24px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(24, 24, 27, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .input-corp {
          width: 100%;
          background: rgba(9, 9, 11, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fafafa;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-corp::placeholder { color: #52525b; }
        .input-corp:focus {
          border-color: #3b82f6;
          background: rgba(9, 9, 11, 0.8);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        }

        .btn-corp {
          width: 100%;
          background: #fafafa;
          color: #09090b;
          border: none;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-corp:hover { 
          background: #e4e4e7; 
          transform: translateY(-1px);
        }
        .btn-corp:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .tab-container {
          display: flex;
          padding: 4px;
          background: rgba(9, 9, 11, 0.5);
          border-radius: 10px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tab-btn {
          flex: 1;
          padding: 8px 12px;
          background: transparent;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-btn.active {
          color: #fafafa;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }
        
        .brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2);
        }
      `}</style>

      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      <div className="login-content">
        <div className="brand-header">
          <div className="brand-icon">
            <Command size={20} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.03em', color: '#fafafa' }}>GestorRH</h1>
            <p style={{ fontSize: 13, color: '#a1a1aa', marginTop: 2 }}>Enterprise OS</p>
          </div>
        </div>

        <div className="login-card">
          <div style={{ padding: '32px' }}>
            <div className="tab-container">
              <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>
                Acesso Seguro
              </button>
              <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>
                Novo Workspace
              </button>
            </div>

            {alertInfo && (
              <div style={{ 
                padding: '12px 16px', 
                background: alertInfo.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                border: `1px solid ${alertInfo.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`, 
                color: alertInfo.type === 'error' ? '#fca5a5' : '#6ee7b7', 
                borderRadius: 8, 
                fontSize: 13, 
                marginBottom: 24,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12
              }}>
                <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ lineHeight: 1.5 }}>{alertInfo?.message}</div>
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#e4e4e7', marginBottom: 8 }}>E-mail Corporativo</label>
                  <input 
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nome@empresa.com.br"
                    className="input-corp"
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#e4e4e7' }}>Senha de Acesso</label>
                    <a href="#" style={{ fontSize: 12, color: '#60a5fa', textDecoration: 'none', fontWeight: 500 }}>Recuperar senha</a>
                  </div>
                  <input 
                    type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                    className="input-corp"
                  />
                </div>

                <button type="submit" className="btn-corp" disabled={loading} style={{ marginTop: 8 }}>
                  {loading ? 'Autenticando...' : (
                    <>
                      Continuar <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#e4e4e7', marginBottom: 8 }}>Nome Completo</label>
                  <input 
                    type="text" value={regName} onChange={e => setRegName(e.target.value)} required placeholder="Seu nome"
                    className="input-corp"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#e4e4e7', marginBottom: 8 }}>E-mail Corporativo</label>
                  <input 
                    type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required placeholder="email@empresa.com.br"
                    className="input-corp"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#e4e4e7', marginBottom: 8 }}>Senha</label>
                  <input 
                    type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required placeholder="••••••••"
                    className="input-corp"
                  />
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#e4e4e7', marginBottom: 8 }}>Nome da Empresa</label>
                  <input 
                    type="text" value={regOrg} onChange={e => setRegOrg(e.target.value)} required placeholder="Ex: Acme Corp"
                    className="input-corp"
                  />
                </div>
                
                <button type="submit" className="btn-corp" disabled={loading} style={{ marginTop: 8 }}>
                  {loading ? 'Provisionando...' : 'Criar Workspace'}
                </button>
              </form>
            )}
          </div>
          
          <div style={{ background: 'rgba(9, 9, 11, 0.3)', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#71717a', fontSize: 12 }}>
            <Lock size={12} />
            <span>Autenticação Zero-Trust Ativa</span>
          </div>
        </div>

        <div style={{ marginTop: 32, fontSize: 12, color: '#52525b', display: 'flex', gap: 16 }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#a1a1aa'} onMouseOut={e => e.currentTarget.style.color = '#52525b'}>Termos de Serviço</a>
          <span>•</span>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#a1a1aa'} onMouseOut={e => e.currentTarget.style.color = '#52525b'}>Privacidade</a>
          <span>•</span>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#a1a1aa'} onMouseOut={e => e.currentTarget.style.color = '#52525b'}>Ajuda</a>
        </div>
      </div>
    </div>
  );
}

