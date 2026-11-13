# AlgoBasics Frontend

English | [Português (Brasil)](README.pt-BR.md)

Interface for the algorithms and data structures learning platform, built with **React, TypeScript, and Vite**.

## Features

- Browse articles and tags.
- Read Markdown content with mathematical formulas rendered by KaTeX.
- Registration, login, and authentication state.
- Article voting for authenticated users.
- Integration with the Django REST Framework API through `/api`.

## Run

From this directory:

```bash
npm install
npm run dev -- --host localhost
```

Open `http://localhost:5173/` with the backend running at `127.0.0.1:8000`. Vite forwards `/api` requests to the backend during development.

## Commands

```bash
npm run build
npm run lint
npm run preview
```

See the [main README](../README.md) to configure the backend, PostgreSQL, and the API.
