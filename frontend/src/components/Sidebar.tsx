'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  {
    section: 'Principal',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: GridIcon },
      { label: 'Funcionários', href: '/employees', icon: UsersIcon },
      { label: 'Benefícios', href: '/benefits', icon: HeartIcon },
    ],
  },
  {
    section: 'Operacional',
    items: [
      { label: 'Controle de Ponto', href: '/time-tracking', icon: ClockIcon },
      { label: 'Férias e Licenças', href: '/leaves', icon: CalendarIcon },
      { label: 'Desligamento', href: '/offboarding', icon: OffboardingIcon },
    ],
  },
  {
    section: 'Financeiro',
    items: [
      { label: 'Folha de Pagamento', href: '/payroll', icon: DollarIcon },
    ],
  },
  {
    section: 'Administração',
    items: [
      { label: 'Auditoria', href: '/admin/logs', icon: ShieldIcon },
      { label: 'Usuários', href: '/admin/users', icon: UserCogIcon },
      { label: 'Relatórios', href: '/admin/reports', icon: BarChartIcon },
    ],
  },
];

function GridIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5"/>
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 14v-1.5A2.5 2.5 0 0 0 8.5 10h-5A2.5 2.5 0 0 0 1 12.5V14"/>
      <circle cx="6" cy="5.5" r="2.5"/>
      <path d="M15 14v-1.5a2.5 2.5 0 0 0-2-2.45"/>
      <path d="M11 3.05a2.5 2.5 0 0 1 0 4.9"/>
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 13.5S1.5 9.5 1.5 5.5a3.5 3.5 0 0 1 6.5-1.8A3.5 3.5 0 0 1 14.5 5.5c0 4-6.5 8-6.5 8z"/>
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1.5L2 4v4c0 3.5 2.5 6.3 6 7 3.5-.7 6-3.5 6-7V4L8 1.5z"/>
      <path d="M5.5 8l1.5 1.5 3.5-3"/>
    </svg>
  );
}
function UserCogIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="5" r="2.5"/>
      <path d="M1 14v-1.5A2.5 2.5 0 0 1 3.5 10H9"/>
      <circle cx="13" cy="13" r="2"/>
      <path d="M13 11v-.5M13 15v-.5M11.5 13h-.5M15 13h-.5M12.05 11.55l-.35.35M14.3 13.8l-.35.35M11.05 13.8l.35.35M13.3 11.55l.35.35"/>
    </svg>
  );
}
function BarChartIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="9" width="3" height="6" rx="1"/>
      <rect x="6.5" y="5" width="3" height="10" rx="1"/>
      <rect x="12" y="1" width="3" height="14" rx="1"/>
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3"/>
      <path d="M11 11l3-3-3-3M14 8H6"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function DollarIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}
function OffboardingIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
        </div>
        <div>
          <div className="logo-text">BenefitPanel</div>
          <div className="logo-sub">Enterprise</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(section => (
          <div key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <button
                  key={item.href}
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={() => router.push(item.href)}
                >
                  <Icon />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <>
            <div className="user-card" onClick={handleLogout} title="Clique para sair">
              <div className="user-avatar">{getInitials(user.name)}</div>
              <div className="user-info" style={{ flex: 1, minWidth: 0 }}>
                <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                <div className="user-role">{user.role.replace('_', ' ')}</div>
              </div>
              <LogoutIcon />
            </div>
            {user.organization && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="plan-pill">{user.organization.plan}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.organization.name}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
