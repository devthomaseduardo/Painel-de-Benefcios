#!/bin/bash

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${BLUE}[INFO]${NC} $1"; }
ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERR]${NC} $1"; }

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      BenefitPanel — Startup Script    ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════╝${NC}"
echo ""

# ─── 1. Docker ────────────────────────────────────────────
log "Iniciando infraestrutura (PostgreSQL + Redis)..."
cd "$BACKEND"
docker-compose down -v # Remove volumes antigos corrompidos
docker-compose up -d
ok "Docker containers rodando limpos."

# ─── 2. Aguarda banco subir ───────────────────────────────
log "Aguardando banco de dados ficar disponível..."
sleep 8 # Tempo extra para o postgres inicializar o banco do zero

# ─── 3. Prisma ────────────────────────────────────────────
log "Sincronizando schema Prisma..."
cd "$BACKEND"
npx prisma db push --accept-data-loss 2>&1 | tail -5

log "Executando seed de dados..."
npx prisma db seed 2>&1 | tail -10
ok "Banco pronto com dados de demonstração."

# ─── 4. Frontend deps ────────────────────────────────────
if [ ! -d "$FRONTEND/node_modules" ]; then
  log "Instalando dependências do frontend..."
  cd "$FRONTEND"
  npm install --silent
  ok "Dependências do frontend instaladas."
else
  ok "node_modules do frontend já existe, pulando install."
fi

# ─── 5. Backend em background ────────────────────────────
log "Iniciando backend (porta 5000)..."
cd "$BACKEND"
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/backend.pid
ok "Backend iniciado (PID $BACKEND_PID) → http://localhost:5000"

# Aguarda backend responder
log "Verificando saúde do backend..."
for i in $(seq 1 15); do
  if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    ok "Backend respondendo em http://localhost:5000/health ✓"
    break
  fi
  sleep 1
  echo -n "."
done
echo ""

# ─── 6. Frontend em background ───────────────────────────
log "Iniciando frontend Next.js (porta 3000)..."
cd "$FRONTEND"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/frontend.pid
ok "Frontend iniciado (PID $FRONTEND_PID) → http://localhost:3000"

# ─── 7. Aguarda e abre browser ───────────────────────────
log "Aguardando Next.js compilar..."
sleep 6

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          TUDO RODANDO! 🚀                 ║${NC}"
echo -e "${GREEN}╠═══════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Frontend:  http://localhost:3000         ║${NC}"
echo -e "${GREEN}║  Backend:   http://localhost:5000         ║${NC}"
echo -e "${GREEN}║  Health:    http://localhost:5000/health  ║${NC}"
echo -e "${GREEN}╠═══════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Logs backend:   tail -f /tmp/backend.log ║${NC}"
echo -e "${GREEN}║  Logs frontend:  tail -f /tmp/frontend.log║${NC}"
echo -e "${GREEN}╠═══════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Para parar: bash stop.sh                 ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""

# Abre browser automaticamente (Linux)
if command -v xdg-open &> /dev/null; then
  xdg-open http://localhost:3000 &
fi

# Mantém o script exibindo os logs combinados
echo -e "${YELLOW}[LOGS — Ctrl+C para parar de ver, os processos continuam rodando]${NC}"
echo ""
tail -f /tmp/backend.log /tmp/frontend.log
