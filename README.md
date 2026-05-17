# Painel de Benefícios

**Painel de Benefícios** é uma solução de gestão corporativa voltada para RH e benefícios, construída com arquitetura moderna e pronta para deploy em Vercel.

## Visão Geral

Este repositório reúne:

- **Frontend** em `frontend/` com **Next.js 14 + React + TypeScript**
- **Backend** em `src/` com **Node.js + Express + TypeScript**
- **Persistência** com **PostgreSQL + Prisma**
- **Infraestrutura** leve com **Docker Compose** para banco e cache

## Diferenciais do Projeto

- **Estrutura modular**: separação clara entre frontend e backend
- **Suporte para deploy em Vercel** no diretório `frontend`
- **API proxy** configurada para enviar `/api/*` ao backend remoto
- **Configuração de ambiente** preparada para `NEXT_PUBLIC_API_URL`
- **Build validadas com sucesso** para produção

## Principais Funcionalidades

- Autenticação e registro de usuários
- Dashboard corporativo com métricas de RH
- Gestão de colaboradores e benefícios
- Painel administrativo com logs e relatórios
- Estrutura de UI dark-mode e navegação em app router

## Tecnologias

- **Frontend**: Next.js, React, TypeScript, Recharts, Socket.IO Client
- **Backend**: Express, TypeScript, Prisma, CORS, Helmet
- **Banco**: PostgreSQL
- **Cache/Infra**: Redis
- **Deployment**: Vercel (frontend) + backend remoto via `NEXT_PUBLIC_API_URL`

## Como rodar localmente

### 1. Infraestrutura

```bash
cd /home/thomas/Documentos/Github/Painel-de-Benefcios
docker compose up -d
```

### 2. Build do frontend

```bash
cd frontend
npm install
npm run build
```

### 3. Executar desenvolvimento

```bash
cd frontend
npm run dev
```

## Deploy no Vercel

Para deploy no Vercel, use o diretório de projeto `frontend` e configure as variáveis de ambiente:

- `NEXT_PUBLIC_API_URL=https://<url-do-backend>`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID=<seu-google-client-id>`
- `GOOGLE_CLIENT_ID=<seu-google-client-id>`

O aplicativo frontend usará `NEXT_PUBLIC_API_URL` para enviar requisições à API e `NEXT_PUBLIC_GOOGLE_CLIENT_ID` para o login com Google.

## Observações para Recrutadores

- Projeto com foco em aplicação empresarial de RH e benefícios
- Estrutura preparada para produção e deploy contínuo
- Código escrito com TypeScript e boas práticas de separação de responsabilidades
- Apresenta uma visão real de trabalho em equipe e capacidade de integrar frontend moderno com backend API

---

Se precisar, posso também fornecer um resumo executivo ou preparar um `README` em português/inglês mais voltado para avaliação técnica. 