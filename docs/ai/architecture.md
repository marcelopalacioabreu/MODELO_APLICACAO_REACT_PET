# Arquitetura do Sistema

## Tech Stack Core
- **Backend:** Node.js, Express, MongoDB (Mongoose), Redis.
- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion.
- **Infra:** Docker, Nginx, Redis Adapter (Socket.io).

## Padrões Estruturais
- **Auto-Recuperação:** `IntegrityService` como autoridade soberana de configuração no boot.
- **Navegabilidade Industrial:** Canvas de 4000x3000px, Zoom, Pan e Radar Fly-to.
- **Sincronia Real-time:** Barramento Redis para eventos globais.
- **Multi-tenancy:** Isolamento geográfico por Unidade (`locationId`).

## Decisões de Design
- Estética "Elite/Premium" com alto contraste e tipografia de impacto.
- UX focada em agilidade operacional (Drag & Drop, Atalhos de teclado).