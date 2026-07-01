# MODELO_APLICACAO_REACT
Um modelo de aplicação Frontend React  e Backend Express - REDIS e MONGO_DB

## Banco de Dados - Runners de scripts

Adicionados runners para executar scripts por pasta em `backend/banco_dados`:

- `bd:inicializadores` — executa `backend/banco_dados/inicializadores/*`
- `bd:migracoes` — executa `backend/banco_dados/migracoes/*`
- `bd:auxiliares` — executa `backend/banco_dados/auxiliares/*`

Uso (no diretório `backend`):

```bash
npm run bd:inicializadores -- --dry-run
npm run bd:inicializadores -- --force
```

Flags disponíveis:

- `--dry-run`: lista os scripts que seriam executados sem rodá-los.
- `--force`: permite execução fora de `NODE_ENV=development`.
- `--only=<nome>`: executa apenas o script especificado.
- `--continue-on-error`: não aborta em caso de falha.

Segurança e recomendações:

- Os runners exigem `NODE_ENV=development` por padrão; use `--force` explicitamente para ambientes não-dev.
- Scripts devem ser idempotentes e preferir `findOneAndUpdate`/upsert em vez de operações destrutivas.
- Arquive scripts candidatos em `backend/banco_dados/00_CANDIDATOS_A_EXCLUSAO`.

## Como rodar a aplicação

A seguir estão as formas suportadas para subir a aplicação: via Docker (recomendado) e diretamente com Node (desenvolvimento ou produção).

**1) Via Docker (recomendado)**

- Requisitos: `Docker` e `docker-compose` instalados.
- Subir todos os containers:

```bash
docker-compose up -d
```

- Ver logs do backend:

```bash
docker-compose logs -f backend
```

Rodar via `docker-compose` em modo produção (o essencial)
- Para executar o `frontend` já pré-compilado pelo Docker, edite o serviço `frontend` em `docker-compose.yml` para apontar para um `Dockerfile` de produção ou para uma imagem já construída e garanta `NODE_ENV=production`.

Exemplo mínimo (substitua a seção `frontend` existente):

```yaml
	frontend:
		build:
			context: ./frontend
			dockerfile: Dockerfile.prod   # Dockerfile multistage que executa `npm run build`
		image: aplicacao-modelo-frontend:prod
		ports:
			- "3002:3000"
		environment:
			- NODE_ENV=production
			- NEXT_PUBLIC_API_URL=http://localhost:5001/api
			- INTERNAL_BACKEND_URL=http://backend:5000/api
		depends_on:
			- backend
```

- Alternativa: mantenha `build:` e remova `image:` para rebuild local com `docker-compose build`.
- Após editar, reconstrua e suba as imagens:

```bash
docker-compose build frontend
docker-compose up -d
```

Observação: o `Dockerfile.prod` deve executar `npm run build` e expor a aplicação com `npm run start` (modo production). Se preferir, crie `frontend/Dockerfile.prod` conforme o exemplo desta documentação.

Para rodar o `frontend` em modo produção dentro do Docker (pré-compilado), edite o serviço `frontend` em `docker-compose.yml` e adicione/ajuste estas linhas:

- Defina a variável de ambiente `NODE_ENV=production` (garante que o Next rode em produção).
- Substitua o `command` atual (`npm run dev`) por `npm run start`, ou aponte o serviço para uma imagem já construída (`image: saude-animal-frontend:prod`).

Exemplo mínimo (substitua no bloco `frontend:`):

```yaml
	frontend:
		build: ./frontend    # ou use `image: aplicacao-modelo-frontend:prod`
		environment:
			- NODE_ENV=production
			- NEXT_PUBLIC_API_URL=http://localhost:5001/api
		ports:
			- "3002:3000"
		command: npm run start
```

Após ajustar, rode `docker-compose up --build -d` para rebuild e subir em modo produção.

Observações: o `docker-compose.yml` já configura serviços para `backend`, `frontend`, `mongodb` e `redis` quando aplicável. Não é necessário modificar os scripts `.bat` para rodar via Docker.

**2) Rodando localmente com Node (desenvolvimento)**

- Requisitos no Windows: instalar o MongoDB (inclui o MongoDB Compass), Memurai (ou outro Redis compatível para Windows) e Redis Insight para inspeção do Redis.
- Entrar no diretório `backend` e instalar dependências:

```bash
cd backend
npm install
npm run dev
```

Ou, a partir da raiz do repositório:

```bash
npm --prefix backend install
npm --prefix backend run dev
```

**3) Rodando localmente com Node (produção)**

- No servidor/ambiente de produção, use:

```bash
cd backend
node src/server.js
```

ou via npm:

```bash
npm --prefix backend run start
```

**Runners de banco de dados**

Os runners para executar scripts por pasta em `backend/banco_dados` já estão disponíveis via `npm`:

```bash
npm --prefix backend run bd:migracoes -- --dry-run
npm --prefix backend run bd:inicializadores -- --dry-run
npm --prefix backend run bd:auxiliares -- --dry-run
```

Flags comuns:

- `--dry-run`: lista os scripts sem executá-los.
- `--force`: permite execução fora de `NODE_ENV=development`.
- `--only=<nome>`: executa apenas o script especificado.
- `--continue-on-error`: não aborta em caso de falha.

Recomendações de segurança:

- Mantenha scripts destrutivos arquivados em `backend/banco_dados/00_CANDIDATOS_A_EXCLUSAO`.
- Prefira operações idempotentes (`findOneAndUpdate` com `upsert`, `$addToSet`).
- Faça backup do banco antes de rodar `migracoes` em produção.

### Rodar todas as migrações

Para executar todas as migrações presentes em `backend/banco_dados/migracoes` (ordem numérica):

```bash
# dentro da raiz do repositório
npm --prefix backend run bd:migracoes
```

Exemplos úteis:

```bash
# apenas listar (sem executar)
npm --prefix backend run bd:migracoes -- --dry-run

# forçar execução mesmo fora de NODE_ENV=development
npm --prefix backend run bd:migracoes -- --force

# continuar em caso de erro e tentar executar todas
npm --prefix backend run bd:migracoes -- --continue-on-error
```

Observações:

- O runner executa cada arquivo `.js` como um processo Node separado com timeout de 5 minutos por script.
- Se não estiver em `NODE_ENV=development` e não passar `--force`, o runner aborta por segurança.
- Não há backups automáticos — faça snapshot/backup antes de rodar em produção.

## Scripts auxiliares (.bat)

Existem dois scripts `.bat` na raiz para orquestrar execuções rápidas no Windows:

- `docker-start.bat` — sobe a stack via Docker Compose e executa os runners dentro do container `backend`.
	- Usos comuns:
		- Iniciar tudo (containers + runners + smoke test):

```powershell
docker-start.bat start
```

		- Parar todos os containers:

```powershell
docker-start.bat stop
```

	- Observação: o `docker-start.bat` chama internamente os runners (`bd:migracoes`, `bd:inicializadores`, `bd:auxiliares`) dentro do container `backend` com `--force`.

- `develop-start.bat` — modo local (sem Docker). Executa os runners localmente (com `--force`) e sobe o `backend` e `frontend` via `npm run dev` em janelas separadas do `cmd`.
	- Usos comuns:

```powershell
develop-start.bat start   # executa runners e abre backend/frontend em janelas separadas
develop-start.bat stop    # encerra processos node/npm (usa taskkill)
develop-start.bat build   # builda o frontend localmente
```

	- Observação: este script é adequado para desenvolvimento em Windows. Garanta que `node` e `npm` estejam no PATH.

Recomendações rápidas:

- Use `docker-start.bat` para ambientes onde Docker é suportado (recomendado para replicar produção).
- Use `develop-start.bat` para desenvolvimento local iterativo com hot-reload.
- Use `develop-start-fast.bat` para testes de utilização, a aplicação executará mais rápido, sem hot-reload.
- Antes de rodar qualquer runner em produção, faça backup do banco e prefira rodar um `--dry-run` primeiro.

## Rodar o frontend localmente

Para desenvolver o `frontend` localmente (Next.js):

- Entre na pasta `frontend` e instale dependências:

```bash
cd frontend
npm install
```

- Rodar em modo desenvolvimento (hot-reload):

```bash
npm run dev
```

- Por padrão o frontend espera a API em `http://localhost:5001/api`. Se necessário ajuste a variável de ambiente `NEXT_PUBLIC_API_URL` antes de iniciar. Exemplo (PowerShell):

```powershell
$env:NEXT_PUBLIC_API_URL = 'http://localhost:5001/api'
npm run dev
```

- Para produção (build + start):

```bash
npm run build
npm run start
```

Observações:

- As instruções de Docker já configuram o `frontend` no `docker-compose.yml`; estas instruções são apenas para execução local independente.
- Se estiver desenvolvendo tanto backend quanto frontend localmente, inicie primeiro o `backend` (porta 5001 por padrão) e depois o `frontend`.

**Usuários inseridos por inicializadores**

- **Administrador do sistema:**
	- **Email:** `admin_teste@emtec.com`
	- **Senha:** `admin123`

- **Administrador da unidade:**
	- **CPF:** `unit_admin@local.test`
	- **Senha:** `admin123`

- **Outros usuários (exemplos):**
	- **Luana Victoria** `luana.coto@gmail.com`
	- **Senha:** `admin123`

- **Observações de segurança:**
	- Estas credenciais são apenas para ambientes de desenvolvimento e testes locais. Altere a senha do administrador do sistema e inative usuários desnecessários em produção.

## Atualização de Schema (renomear/alterar/remover campos)

Quando for necessário alterar um campo no modelo, siga o fluxo abaixo para evitar perda de dados:

1) Planejamento

2) Alteração do schema (compatível)

3) Deploy compatível (dual-read / dual-write)

4) Migration de dados (cópia)
```powershell
npm --prefix backend run bd:migracoes -- --only=000X_copy_old_to_new.js --force
```

5) Verificação

6) Índices/constraints

7) Cleanup

8) Backup e rollback

9) Comandos úteis
```powershell
npm --prefix backend run bd:migracoes -- --dry-run
```
```powershell
npm --prefix backend run bd:migracoes -- --force --continue-on-error
```

Template mínimo de migration (idempotente):
```js
// backend/banco_dados/migracoes/000X_copy_old_to_new.js
const path = require('path');
const mongoose = require('mongoose');
require(path.join(__dirname, '../../src/models/SeuModelo'));
const SeuModelo = mongoose.model('SeuModelo');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function run() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('Conectado para migration 000X_copy_old_to_new');

		// Copia oldField -> newField somente quando newField não existe
		const res = await SeuModelo.updateMany(
			{ oldField: { $exists: true }, newField: { $exists: false } },
			[{ $set: { newField: '$oldField' } }]
		);

		console.log('Migration concluída', res.matchedCount || res.modifiedCount);
		process.exit(0);
	} catch (err) {
		console.error('Migration falhou:', err.message || err);
		process.exit(1);
	}
}

run();
```

---

## Próximos passos: Migração para objeto estático de especificações de itens do menu, funcionalidades e permissões
Visão rápida
- Objetivo: parar de persistir `Functionality`/`Permission` no Mongo e usar uma única constante estática em memória como fonte imutável e canonica. Por consequência eliminar a necessidade de sincronização de funcionalidades e permissões com o MongoDB no processo de inicialização da instância. Os benefícios existem desde ambientes de instância única mas são mais benéficos quando se têm múltiplas instâncias pois elimina concorrência no processo de inicialização.

Impactos principais
- Autorização: **compatível** — o middleware já usa `permissionKeys` (strings). Para autorização em tempo de execução, continue usando `Role.permissionKeys` como fonte imediata.
- Escrita no banco: o `integrityService` e inicializadores **não devem** mais gravar/atualizar documentos de `Functionality`/`Permission`. Em vez disso, devem ler a constante estática e apenas garantir que `Role.permissionKeys` existam (escrever apenas arrays de chaves nas Roles quando necessário).
- APIs/Frontend: endpoints que hoje retornam `populate('functionality')` precisam ser adaptados para construir a representação de `functionality` a partir da constante em memória (backend monta o objeto retornado) ou simplesmente expor `functionalityKey`/`permissionKey` e deixar o frontend mapear via o mesmo spec.
- Scripts/migrations/seeders: a maior parte relacionada a criação/atualização de funcionalidades/permissões torna-se obsoleta; arquive esses scripts. Migrations que atualizam Roles/Users continuam relevantes somente quando modificam `permissionKeys` ou dados de pessoas/roles.

Riscos e pontos de atenção
- Consistência entre processos: se houver mais de uma instância do backend, a constante deve ser idempotente e imutável em todas as instâncias (deploy sincronizado). Atualizações exigirão deploy coordenado.
- Dependências antigas: atualize scripts, migrations e qualquer código que consulte `_id` de `Permission`/`Functionality` (ex.: queries `Permission.find({_id: {$in: role.permissions}})`), pois esses campos podem ser removidos.
- Admin UI/Operações: páginas administrativas que editam permissões/funcionalidades devem ler/escrever contra o spec (arquivo) ou oferecer edição via PR/CI (já que os dados são imutáveis em runtime).

Plano de adoção (passos recomendados)
1) Criar o spec estático
	- Adicionar `backend/banco_dados/specs/permissions_and_funcs.js` exportando um objeto `{ functionalities: [...], permissions: [...] }` com keys definidas.
2) Adaptar `integrityService`
	- Refatorar para **ler** do spec e **não escrever** nas coleções `Functionality`/`Permission`.
	- Opcional: sincronizar `Role.permissionKeys` a partir do spec (atualizar Roles existentes apenas com arrays de chaves).
3) Atualizar controllers/API
	- Remover dependência de `populate('functionality')` nos responses; montar objetos `functionality` a partir do spec quando necessário.
4) Atualizar frontend
	- Garantir que o cliente use `permission.key` strings; se o frontend precisar de metadados de funcionalidades (ícone/nome), consumir um endpoint que retorna o spec (será montado a partir do arquivo estático no backend).
5) Arquivar e descontinuar scripts
	- Mover scripts que escrevem `Functionality`/`Permission` para `00_CANDIDATOS_A_EXCLUSAO` e documentar a deprecação.
6) Cleanup final (opcional)
	- Após validação e deploy coordenado, remover campos ObjectId (`Permission.functionality`, `Functionality.permissions`) e o código que os atualiza.

Comandos e verificações sugeridas
```powershell
# Executar uma verificação local: expor spec via endpoint temporário e validar que o frontend monta menus corretamente
npm --prefix backend run dev

# Atualizar Roles para refletir as permission keys do spec (script de sincronização)
node backend/banco_dados/scripts/sync_roles_from_spec.js
```
