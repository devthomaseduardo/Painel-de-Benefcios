'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, Zap, BarChart, Users, ChevronRight, Briefcase, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#09090b', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 6%', borderBottom: '1px solid #f4f4f5', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: '#18181b', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={18} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#18181b', letterSpacing: '-0.03em' }}>GestorRH</span>
        </div>
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#features" style={{ color: '#71717a', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>Plataforma</a>
          <a href="#security" style={{ color: '#71717a', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>Segurança</a>
          <a href="#pricing" style={{ color: '#71717a', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>Enterprise</a>
        </nav>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button 
            onClick={() => router.push('/login')}
            style={{ background: 'transparent', color: '#18181b', border: 'none', padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Falar com Vendas
          </button>
          <button 
            onClick={() => router.push(user ? '/dashboard' : '/login')}
            style={{ background: '#18181b', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {user ? 'Acessar Painel' : 'Entrar'}
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section style={{ padding: '120px 6% 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: '#fafafa', borderBottom: '1px solid #f4f4f5' }}>
          <div style={{ padding: '6px 16px', border: '1px solid #e4e4e7', borderRadius: 100, color: '#52525b', fontSize: 13, fontWeight: 600, marginBottom: 32, backgroundColor: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, background: '#18181b', borderRadius: '50%' }}></span>
            Apresentando GestorRH 2.0
          </div>
          
          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, color: '#18181b', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 24, maxWidth: 900 }}>
            A espinha dorsal da <br/> gestão de pessoas.
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#52525b', lineHeight: 1.6, marginBottom: 48, maxWidth: 650 }}>
            Uma plataforma desenhada para operações complexas. Folha de pagamento, controle de benefícios e compliance de dados unificados em um único ambiente de alta segurança.
          </p>
          
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button 
              onClick={() => router.push('/login')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#18181b', color: '#ffffff', border: 'none', padding: '16px 36px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
            >
              Começar Agora
              <ArrowRight size={18} />
            </button>
            <button 
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', color: '#18181b', border: '1px solid #e4e4e7', padding: '16px 36px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
            >
              Solicitar Demonstração
            </button>
          </div>
        </section>

        {/* Value Proposition */}
        <section id="features" style={{ padding: '120px 6%', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 80, maxWidth: 600 }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#18181b', letterSpacing: '-0.03em', marginBottom: 20 }}>
                Arquitetura feita para escala corporativa.
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#71717a', lineHeight: 1.6 }}>
                Nós repensamos o software de RH do zero. Ao invés de sistemas fragmentados, entregamos um core de dados centralizado e infraestrutura Zero-Trust.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
              {[
                { icon: <Shield size={24} color="#18181b" />, title: 'Segurança Zero-Trust', desc: 'Sessões isoladas via JWT, trilha de auditoria granular e conformidade estrita com LGPD.' },
                { icon: <Users size={24} color="#18181b" />, title: 'Controle de Acessos', desc: 'RBAC (Role-Based Access Control) nativo. Defina exatamente o que cada operador pode ver e editar.' },
                { icon: <BarChart size={24} color="#18181b" />, title: 'Analytics em Tempo Real', desc: 'Processamento imediato de folhas e benefícios. Elimine as planilhas e o fechamento manual.' },
              ].map((feat, idx) => (
                <div key={idx} style={{ padding: '32px', backgroundColor: '#fafafa', border: '1px solid #f4f4f5', borderRadius: 12 }}>
                  <div style={{ marginBottom: 20 }}>{feat.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#18181b', marginBottom: 12 }}>{feat.title}</h3>
                  <p style={{ color: '#71717a', lineHeight: 1.6, fontSize: 15 }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration / Security Section */}
        <section id="security" style={{ padding: '120px 6%', backgroundColor: '#18181b', color: '#ffffff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 24 }}>
                Sua infraestrutura de dados intacta.
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#a1a1aa', lineHeight: 1.6, marginBottom: 32 }}>
                O GestorRH opera em ambientes isolados (Single-Tenant). Seus dados de funcionários, folhas e benefícios nunca compartilham banco de dados com outras organizações.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'Criptografia End-to-End nativa',
                  'Isolamento de banco de dados por empresa',
                  'Autenticação JWT sem cookies de terceiros',
                  'Logs de auditoria imutáveis'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#e4e4e7', fontSize: 15 }}>
                    <CheckCircle2 size={20} color="#52525b" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={{ backgroundColor: '#27272a', padding: 40, borderRadius: 16, border: '1px solid #3f3f46' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#a1a1aa', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><span style={{ color: '#10b981' }}>GET</span> /api/enterprise/compliance</div>
                <div style={{ paddingLeft: 16 }}>
                  {`{`} <br/>
                  &nbsp;&nbsp;"status": "secure", <br/>
                  &nbsp;&nbsp;"encryption": "AES-256-GCM", <br/>
                  &nbsp;&nbsp;"tenant_isolation": true, <br/>
                  &nbsp;&nbsp;"active_policies": 14 <br/>
                  {`}`}
                </div>
                <div style={{ marginTop: 16, height: 1, backgroundColor: '#3f3f46' }}></div>
                <div style={{ marginTop: 16 }}><span style={{ color: '#10b981' }}>200 OK</span> - 12ms</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '60px 6%', backgroundColor: '#ffffff', borderTop: '1px solid #f4f4f5' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={20} color="#18181b" />
              <span style={{ fontSize: 18, fontWeight: 700, color: '#18181b', letterSpacing: '-0.02em' }}>GestorRH</span>
            </div>
            <div style={{ display: 'flex', gap: 32, color: '#71717a', fontSize: 14, fontWeight: 500 }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Empresa</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Segurança</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Termos</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacidade</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}


