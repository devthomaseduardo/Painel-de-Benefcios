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

  const handleDemoLogin = async () => {
    setAlertInfo(null);
    setLoading(true);
    const demoEmail = 'admin@thomas.com';
    const demoPassword = 'admin123';
    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      await login(demoEmail, demoPassword);
      router.push('/dashboard');
    } catch (err: unknown) {
      setAlertInfo({ type: 'error', message: err instanceof Error ? err.message : 'Erro ao entrar com a conta demo.' });
    } finally {
      setLoading(false);
    }
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
          align-items: center;
          justify-content: center;
          background: #f5f6f7;
          color: #111827;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          padding: 24px;
        }

        .login-content {
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .login-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          box-shadow: 0 20px 80px rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }

        .login-card-header {
          padding: 32px 32px 24px;
        }

        .brand-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .brand-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #111827;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-title {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          color: #111827;
        }

        .brand-subtitle {
          margin: 0;
          color: #475569;
          font-size: 14px;
        }

        .login-form {
          padding: 0 32px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-corp {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #111827;
          padding: 14px 16px;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input-corp:focus {
          border-color: #111827;
          box-shadow: 0 0 0 4px rgba(17, 24, 39, 0.08);
        }

        .btn-corp {
          width: 100%;
          background: #111827;
          color: #ffffff;
          border: none;
          padding: 14px 16px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .btn-corp-secondary {
          width: 100%;
          background: transparent;
          color: #111827;
          border: 1px solid #cbd5e1;
          padding: 14px 16px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-corp:hover {
          transform: translateY(-1px);
        }

        .login-hint {
          margin-top: 0;
          color: #475569;
          font-size: 13px;
          line-height: 1.6;
        }

        .footer-note {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          color: #64748b;
          font-size: 13px;
          justify-content: center;
        }

        .demo-pill {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 13px;
          color: #111827;
        }
      `}</style>

      <div className="login-content">
        <div className="login-card">
          <div className="login-card-header">
            <div className="brand-row">
              <div className="brand-icon">
                <Command size={20} color="#ffffff" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="brand-title">GestorRH</h1>
                <p className="brand-subtitle">Acesso ao workspace</p>
              </div>
            </div>
            <p className="login-hint">Use a conta demo para testar rapidamente ou crie um novo workspace.</p>
          </div>

          <div className="login-form">
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div className="demo-pill">demo: admin@thomas.com</div>
              <div className="demo-pill">senha: admin123</div>
            </div>

            {alertInfo && (
              <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, color: '#b91c1c' }}>
                {alertInfo.message}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <label style={{ display: 'grid', gap: 8, fontSize: 13, color: '#475569' }}>
                  E-mail
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nome@empresa.com.br" className="input-corp" />
                </label>
                <label style={{ display: 'grid', gap: 8, fontSize: 13, color: '#475569' }}>
                  Senha
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="input-corp" />
                </label>

                <button type="submit" className="btn-corp" disabled={loading}>
                  {loading ? 'Autenticando...' : 'Entrar'}
                </button>
                <button type="button" className="btn-corp-secondary" disabled={loading} onClick={handleDemoLogin}>
                  Entrar com Demo
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <label style={{ display: 'grid', gap: 8, fontSize: 13, color: '#475569' }}>
                  Nome Completo
                  <input type="text" value={regName} onChange={e => setRegName(e.target.value)} required placeholder="Seu nome" className="input-corp" />
                </label>
                <label style={{ display: 'grid', gap: 8, fontSize: 13, color: '#475569' }}>
                  E-mail Corporativo
                  <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required placeholder="email@empresa.com.br" className="input-corp" />
                </label>
                <label style={{ display: 'grid', gap: 8, fontSize: 13, color: '#475569' }}>
                  Senha
                  <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required placeholder="••••••••" className="input-corp" />
                </label>
                <label style={{ display: 'grid', gap: 8, fontSize: 13, color: '#475569' }}>
                  Nome da Empresa
                  <input type="text" value={regOrg} onChange={e => setRegOrg(e.target.value)} required placeholder="Ex: Acme Corp" className="input-corp" />
                </label>
                <button type="submit" className="btn-corp" disabled={loading}>
                  {loading ? 'Provisionando...' : 'Criar Workspace'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-note">
          <span>Design inspirado no estilo Notion.</span>
          <span>Login e landing com aparência organizada, porém diferente.</span>
        </div>
      </div>
    </div>
  );
}

