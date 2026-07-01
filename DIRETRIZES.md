# Diretrizes

## Filosofia de Desenvolvimento
- **Código Limpo:** Seguir os melhores padrões de engenharia de software e manter a consistência com a estrutura existente.
- **Autonomia:** Resolução independente de obstáculos e busca pela excelência técnica.

## Fluxo de Trabalho e Comandos
- **Ambiente Local (Windows):** 
  - Sempre reconstruir/reiniciar os containers após modificações: `docker compose --profile dev up -d --build`
- **Controle de Versão:**
  - Manter consistência com a branch `main` e validação rigorosa via containers.

## Arquitetura e Padrões
- **Dia Operacional:** Toda filtragem por data em rotas e relatórios deve utilizar o campo `day` (String YYYY-MM-DD) em vez de objetos `Date`. Isso garante imunidade a fusos horários e precisão civil.
- **Auto-Recuperação (IntegrityService):** O serviço roda em cada boot para sincronizar permissões, papéis (Roles), menus e funcionalidades..

## Interface e Navegabilidade
- **Navegação:** Sidebars dinâmicas devem atuar como radares, permitindo navegação "Fly-to" (foco animado) em objetos do mapa.
- **Design:** Border-radius industrial (3.5rem+), sombras profundas, tipografia Extra-Bold e botões com feedback tátil (active:scale-95).

## Contratos de API e Serviços
- **Serviços Centralizados:** Todo consumo de API no frontend deve ser feito via `apiService.ts`, utilizando interceptors para cache-busting e segurança.
- **Autenticação:** Via JWT para API e JWT via cookie para clientes WEB.
- **Autorização granular:** Validação de acesso baseada em chaves de permissão (ex: `funcionalidade.editar`, `funcionalidade.vizualizar`) implementada tanto no middleware quanto nos controladores.

## Comunicação
- Todas as saídas do terminal e comunicações devem ser em **Português**.
