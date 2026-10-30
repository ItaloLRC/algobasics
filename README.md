# AlgoBasics

AlgoBasics é uma plataforma de estudo de algoritmos e estruturas de dados por meio de artigos. O leitor pode explorar o conteúdo por assunto, abrir explicações com fórmulas matemáticas e votar nos artigos depois de criar uma conta.

A aplicação tem uma interface em React e TypeScript, uma API em Django REST Framework e um banco PostgreSQL. O conteúdo dos artigos usa Markdown, com renderização de expressões matemáticas por KaTeX.

## Funcionalidades

- Listagem e leitura de artigos publicados, com endereços identificados por slug.
- Tags para organizar assuntos e filtrar a listagem de artigos.
- Cadastro, login e logout com sessões do Django.
- Upvote por usuário e artigo, com opção de remover o voto.
- Administração de artigos e tags pelo Django Admin.

O texto do artigo, suas tags e as datas de criação e atualização ficam no backend. O frontend busca esse conteúdo pela API e renderiza o Markdown no navegador. O voto exige autenticação; a leitura é pública.

## Estrutura da aplicação

| Diretório | Conteúdo |
|---|---|
| [frontend/](frontend/) | React, TypeScript, Vite, rotas e estado de autenticação |
| [frontend/src/pages/](frontend/src/pages/) | Página inicial, lista de artigos, leitura e formulários de acesso |
| [articles/](articles/) | Modelos, serializadores, rotas e regras da API |
| [articles/migrations/](articles/migrations/) | Evolução das tabelas de artigos, tags e votos |
| [backend/](backend/) | Configuração do Django, banco, sessões e URLs principais |

Durante o desenvolvimento, o Vite recebe as chamadas do navegador para `/api` e as encaminha ao Django em `127.0.0.1:8000`. O Django consulta o PostgreSQL e devolve os dados como JSON.

## Executar localmente

São necessários Python, PostgreSQL e Node.js com npm. Para o frontend, use uma versão compatível com o Vite 7 declarado em `frontend/package.json`; o [guia do Vite](https://vite.dev/guide/) informa Node.js 20.19+ ou 22.12+. Para o backend, Python 3.12 é um ponto de partida compatível com Django 5.2 e 6.0.

### Backend

Na raiz do repositório:

```bash
python -m venv .venv
```

Ative o ambiente com `source .venv/Scripts/activate` no Git Bash do Windows ou `source .venv/bin/activate` em Linux. Instale as dependências usadas pelo backend:

```bash
python -m pip install django djangorestframework django-cors-headers psycopg2-binary
```

Crie o banco PostgreSQL `dsa_learning` e ajuste `DATABASES` em [backend/settings.py](backend/settings.py) para a conexão do seu ambiente.

Depois, aplique as migrações e crie uma conta de administração:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 127.0.0.1:8000
```

O painel fica em [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/). Use-o para criar tags, cadastrar artigos em Markdown e marcar os artigos que devem aparecer como publicados.

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev -- --host localhost
```

Abra [http://localhost:5173/](http://localhost:5173/), mantendo o Django em execução. Esse endereço corresponde às origens locais de CORS e CSRF configuradas no backend.

## Páginas e API

| Interface | Função |
|---|---|
| `/` | Apresentação e acesso aos artigos |
| `/articles` | Lista de artigos |
| `/article/:slug` | Conteúdo e votação de um artigo |
| `/login` e `/register` | Acesso e cadastro |

| API | Função |
|---|---|
| `GET /api/articles/` | Lista os artigos publicados; aceita `?tag=<slug>` |
| `GET /api/articles/<slug>/` | Retorna o conteúdo de um artigo |
| `GET /api/tags/` | Lista as tags |
| `POST /api/auth/register/` | Cria uma conta e inicia a sessão |
| `POST /api/auth/login/` e `POST /api/auth/logout/` | Controla a sessão |
| `GET /api/auth/me/` | Consulta o usuário da sessão e prepara o cookie CSRF |
| `POST /api/articles/<slug>/upvote/` | Alterna o voto do usuário autenticado |
| `GET /api/articles/<slug>/upvote/status/` | Retorna contagem e estado do voto |

O backend usa autenticação por sessão e proteção CSRF. O frontend envia as credenciais da sessão e o token CSRF nas operações de acesso e votação.

## Comandos do frontend

O frontend possui scripts `dev`, `build`, `lint` e `preview`. A compilação e a análise estática podem ser executadas dentro de `frontend/`:

```bash
npm run build
npm run lint
```
