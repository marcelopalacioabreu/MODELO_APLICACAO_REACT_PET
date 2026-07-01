# Contratos de Implementação

## Regras de API (Backend)
- **Respostas Tipadas:** Sucesso e erro devem seguir o padrão industrial.
- **Validação de DTO:** Obrigatória em todos os endpoints (Sanitização e Tipagem).
- **Erros Padronizados:** Uso sistemático do `ErrorResponse`.
- **RBAC Ativo:** Validação de permissão em nível de Middleware e Controller.

## Regras de Banco de Dados
- **Migrações Reversíveis:** Scripts de alteração devem possuir plano de rollback.
- **Campos de Auditoria:** `createdBy`, `updatedAt` e `day` são mandatórios.
- **Unicidade Nuclear:** Garantia de integridade absoluta em alocações físicas.

## Regras de Frontend
- **Componentização:** Preferência por componentes atômicos e reutilizáveis.
- **Design System:** Respeito aos Magic Values (Border-radius 3.5rem, tipografia Black, sombras profundas).
- **Serviços Centralizados:** Todo consumo de API deve passar pelo `apiService.ts`.