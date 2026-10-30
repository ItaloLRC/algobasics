# Frontend do AlgoBasics

Interface da plataforma de estudo de algoritmos e estruturas de dados, construída com **React, TypeScript e Vite**.

## Funcionalidades

- Navegação por artigos e tags.
- Leitura de conteúdo em Markdown com fórmulas matemáticas renderizadas por KaTeX.
- Cadastro, login e estado de autenticação.
- Votação em artigos para usuários autenticados.
- Integração com a API Django REST Framework por meio de `/api`.

## Executar

Neste diretório:

```bash
npm install
npm run dev -- --host localhost
```

Abra `http://localhost:5173/` com o backend em execução em `127.0.0.1:8000`. O Vite encaminha as chamadas de `/api` ao backend durante o desenvolvimento.

## Comandos

```bash
npm run build
npm run lint
npm run preview
```

Consulte o [README principal](../README.md) para configurar o backend, o PostgreSQL e a API.
