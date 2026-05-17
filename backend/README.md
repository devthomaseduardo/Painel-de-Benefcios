# Painel de Benefícios - Enterprise SaaS Engine

Backend robusto e escalável para gestão de benefícios corporativos em tempo real, com arquitetura Multi-tenant e rastro de auditoria completo.

## 🏢 Arquitetura Enterprise

- **Multi-tenancy**: Isolamento completo de dados por organização.
- **RBAC Real**: Cargos (Owner, HR Admin, Manager, Viewer) com permissões granulares.
- **Audit Trail**: Logs de atividade detalhados (Quem, Quando, Onde, De/Para).
- **Soft Deletes**: Preservação de dados para compliance.
- **Histórico de Mudanças**: Rastreamento automático de cargos e salários.
- **Fila de Notificações**: Sistema de alertas interno e real-time.

## 🛠 Stack Tecnológica

- **Node.js + Express + TypeScript**
- **PostgreSQL + Prisma**: Persistência isolada.
- **Socket.IO**: Real-time push de notificações e logs operacionais.
- **Redis**: Cache e escalabilidade.
- **Zod**: Validação rigorosa de contratos.

## 🧪 Como Testar a Nova Camada

1. **Inicie a infraestrutura**:
   ```bash
   docker-compose up -d
   ```

2. **Sincronize e Semeie (Enterprise Seed)**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

3. **Inicie o servidor**:
   ```bash
   npm run dev
   ```

4. **Execute o script de teste automatizado**:
   ```bash
   chmod +x scripts/test-enterprise.sh
   ./scripts/test-enterprise.sh
   ```

## 📡 Endpoints Enterprise

- `POST /api/auth/register`: Criação de Organização + Owner.
- `POST /api/auth/login`: Autenticação com contexto de Tenant.
- `GET /api/admin/logs`: Visualização do Rastro de Auditoria (Admin Only).
- `GET /api/admin/stats`: Métricas globais da organização.

---
Desenvolvido por Thomas | Foco em Software Boutique & Business Value.
