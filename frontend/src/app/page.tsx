'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, Zap, BarChart, Users, ChevronRight, Briefcase, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f6f7', color: '#111827', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 6%', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f5f6f7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, background: '#111827', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={18} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>GestorRH</span>
        </div>
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#features" style={{ color: '#475569', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Plataforma</a>
          <a href="#security" style={{ color: '#475569', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Segurança</a>
          <a href="#pricing" style={{ color: '#475569', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Enterprise</a>
        </nav>
        <button 
          onClick={() => router.push(user ? '/dashboard' : '/login')}
          style={{ background: '#111827', color: '#ffffff', border: 'none', padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          {user ? 'Acessar Painel' : 'Entrar'}
        </button>
      </header>

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '60px 6%' }}>
        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 40, alignItems: 'center', marginBottom: 72 }}>
          <div>
            <p style={{ margin: 0, color: '#475569', fontWeight: 600, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>RH com foco em clareza</p>
            <h1 style={{ marginTop: 20, marginBottom: 24, fontSize: '3.5rem', lineHeight: 1.05, fontWeight: 800, color: '#111827' }}>
              Organize benefícios, equipes e folha com estilo Notion.
            </h1>
            <p style={{ margin: 0, maxWidth: 560, color: '#475569', fontSize: 17, lineHeight: 1.8 }}>
              Uma homepage leve, limpa e funcional. Tudo construído para que gestores encontrem decisões rapidamente, sem ruído visual.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 32 }}>
              <button onClick={() => router.push('/login')} style={{ background: '#111827', color: '#ffffff', border: 'none', padding: '14px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                Entrar
              </button>
              <button style={{ background: 'transparent', color: '#111827', border: '1px solid #cbd5e1', padding: '14px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                Solicitar Demonstração
              </button>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 32, boxShadow: '0 18px 60px rgba(15, 23, 42, 0.08)' }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>Conta Demo</h2>
            <p style={{ margin: '12px 0 24px', color: '#475569', lineHeight: 1.7 }}>A conta demo está pronta para uso. Faça login e comece a navegar.</p>
            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</span>
                <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>admin@thomas.com</div>
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Senha</span>
                <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>admin123</div>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#475569', fontWeight: 600 }}><Zap size={16} /> Fácil de testar</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#475569', fontWeight: 600 }}><CheckCircle2 size={16} /> Sem instalação extra</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" style={{ marginBottom: 72 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { icon: <Shield size={24} color="#111827" />, title: 'Segurança simples', desc: 'Transparência total em permissões e acesso, exatamente como uma página Notion organizada.' },
              { icon: <Users size={24} color="#111827" />, title: 'Equipe alinhada', desc: 'Estrutura de equipe clara, com informação do colaborador e benefícios à vista.' },
              { icon: <BarChart size={24} color="#111827" />, title: 'Dados confiáveis', desc: 'Visão de métricas de RH em painéis simples e fáceis de entender.' },
            ].map((feat, idx) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 28, minHeight: 210 }}>
                <div style={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: 12, background: '#f8fafc', marginBottom: 20 }}>
                  {feat.icon}
                </div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>{feat.title}</h3>
                <p style={{ marginTop: 12, color: '#475569', lineHeight: 1.7 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="security" style={{ marginBottom: 72 }}>
          <div style={{ display: 'grid', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 28 }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>Segurança transparente</h3>
                <p style={{ marginTop: 14, color: '#475569', lineHeight: 1.8 }}>
                  Proteção e auditoria com controle claro, sem elementos desnecessários. Ideal para empresas que querem segurança com simplicidade.
                </p>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 28 }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>Adoção mais rápida</h3>
                <p style={{ marginTop: 14, color: '#475569', lineHeight: 1.8 }}>
                  Layout limpo e familiar acelera o entendimento do time. Tudo disponível em blocos, sem distrações visuais.
                </p>
              </div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 28 }}>
              <p style={{ margin: 0, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 12 }}>Dados e integração</p>
              <h2 style={{ margin: '16px 0 0', fontSize: 28, fontWeight: 700, color: '#111827' }}>Controle de acesso e relatórios sem ruído</h2>
              <p style={{ marginTop: 16, color: '#475569', lineHeight: 1.8 }}>
                Mantemos o foco em simplicidade: perfis, permissões, benefícios e histórico com navegação direta, como em um workspace Notion.
              </p>
            </div>
          </div>
        </section>

        <footer style={{ padding: '40px 0', color: '#475569', fontSize: 14, borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, background: '#111827', borderRadius: 8, display: 'grid', placeItems: 'center' }}>
                <Briefcase size={16} color="#ffffff" />
              </div>
              <span style={{ fontWeight: 700, color: '#111827' }}>GestorRH</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <a href="#" style={{ color: '#475569', textDecoration: 'none' }}>Empresa</a>
              <a href="#" style={{ color: '#475569', textDecoration: 'none' }}>Segurança</a>
              <a href="#" style={{ color: '#475569', textDecoration: 'none' }}>Privacidade</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}


