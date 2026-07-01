# Regras Operacionais de Elite

- **Preservação de Compatibilidade:** Nenhuma mudança deve quebrar o comportamento legado.
- **Mudanças Incrementais:** Evoluções cirúrgicas ao invés de substituições globais.
- **Fronteiras de Domínio:** Respeitar rigorosamente a separação entre Autenticação, Saúde, Logística e Social.
- **Reuso de Abstrações:** Proibido duplicar lógica; utilizar serviços e componentes existentes.
- **Análise de Impacto:** Estimar a superfície de impacto antes de qualquer implementação.
- **Código Limpo:** Seguir os padrões industriais de nomenclatura e estruturação identificados no CRM-EMTEC e aplicados na Aplicação Modelo.
- **Independência de Fuso Horário:** Uso mandatório do campo `day` (YYYY-MM-DD) para todas as lógicas temporais operacionais.