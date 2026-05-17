#!/bin/bash

echo "Parando BenefitPanel..."

# Para backend e frontend
[ -f /tmp/backend.pid ]  && kill $(cat /tmp/backend.pid)  2>/dev/null && echo "Backend parado."
[ -f /tmp/frontend.pid ] && kill $(cat /tmp/frontend.pid) 2>/dev/null && echo "Frontend parado."

rm -f /tmp/backend.pid /tmp/frontend.pid

# Para Docker
cd "$(dirname "$0")/backend"
docker-compose down

echo "Tudo parado."
