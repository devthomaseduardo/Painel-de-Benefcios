#!/bin/bash

# Configurações
API_URL="http://localhost:5000/api"
ADMIN_EMAIL="admin@thomas.com"
ADMIN_PASS="admin123"

echo "🚀 Iniciando Teste do Sistema Enterprise..."

# 1. Login
echo -e "\n🔑 1. Autenticando Admin..."
LOGIN_RES=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASS\"}")

TOKEN=$(echo $LOGIN_RES | grep -oP '(?<="token":")[^"]*')
ORG_ID=$(echo $LOGIN_RES | grep -oP '(?<="id":")[^"]*' | head -n 2 | tail -n 1)

if [ -z "$TOKEN" ]; then
  echo "❌ Erro na autenticação. Verifique se o servidor está rodando e o banco foi semeado."
  exit 1
fi

echo "✅ Autenticado com sucesso! Token obtido."

# 2. Listar Benefícios (Filtrado por Tenant)
echo -e "\n📦 2. Listando Benefícios da Organização..."
curl -s -X GET "$API_URL/benefits" \
  -H "Authorization: Bearer $TOKEN" | json_pp

# 3. Criar Novo Funcionário com Validação Zod
echo -e "\n👤 3. Criando Funcionário (Teste de Validação e Tenant)..."
curl -s -X POST "$API_URL/employees" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Thomas Teste",
    "email": "teste@thomas.com",
    "cpf": "111.222.333-44",
    "departmentId": "ID_DO_DEP_ENGINEERING",
    "position": "Senior Developer",
    "salary": 12000
  }' | json_pp

# 4. Ver Logs de Auditoria
echo -e "\n📜 4. Verificando Rastro de Auditoria (Enterprise Only)..."
curl -s -X GET "$API_URL/admin/logs" \
  -H "Authorization: Bearer $TOKEN" | json_pp

echo -e "\n✨ Teste concluído. Verifique os resultados acima."
