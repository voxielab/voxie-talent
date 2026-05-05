# Voxie Talent Database

Plataforma privada de gestão de talento creative para Voxie Talent.

## Funcionalidades

- Base de dados de candidatos com filtros e pesquisa
- Auto-registo público de candidatos com extracção automática de CV via IA
- Perfis públicos partilháveis (sem contactos sensíveis)
- Acesso admin protegido por palavra-passe

## Stack

- React 18 + Vite
- Supabase (Postgres + REST API) para armazenamento
- Anthropic Claude API para análise de CVs
- Vercel para hosting + serverless functions

## Variáveis de Ambiente

Configurar no dashboard da Vercel:

- `VITE_SUPABASE_URL` — URL do projecto Supabase
- `VITE_SUPABASE_KEY` — Publishable key do Supabase
- `ANTHROPIC_API_KEY` — API key da Anthropic (servidor apenas)
