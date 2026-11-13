# AlgoBasics

English | [Português (Brasil)](README.pt-BR.md)

AlgoBasics is a platform for studying algorithms and data structures through articles. Readers can explore content by topic, open explanations with mathematical formulas, and vote on articles after creating an account.

The application has a React and TypeScript interface, a Django REST Framework API, and a PostgreSQL database. Articles use Markdown, with mathematical expressions rendered through KaTeX.

## Features

- Browse and read published articles, with slug-based URLs.
- Organize topics and filter the article list with tags.
- Register, log in, and log out using Django sessions.
- Upvote articles once per user, with the option to remove the vote.
- Manage articles and tags through Django Admin.

Article text, tags, and creation/update timestamps are stored in the backend. The frontend fetches this content through the API and renders Markdown in the browser. Voting requires authentication; reading is public.

## Application structure

| Directory | Contents |
|---|---|
| [frontend/](frontend/) | React, TypeScript, Vite, routes, and authentication state |
| [frontend/src/pages/](frontend/src/pages/) | Home page, article list, article view, and authentication forms |
| [articles/](articles/) | Models, serializers, routes, and API rules |
| [articles/migrations/](articles/migrations/) | Schema migrations for articles, tags, and votes |
| [backend/](backend/) | Django configuration, database, sessions, and main URLs |

During development, Vite receives browser requests to `/api` and forwards them to Django at `127.0.0.1:8000`. Django queries PostgreSQL and returns JSON data.

## Run locally

Python, PostgreSQL, and Node.js with npm are required. For the frontend, use a version compatible with Vite 7 in `frontend/package.json`; the [Vite guide](https://vite.dev/guide/) specifies Node.js 20.19+ or 22.12+. For the backend, Python 3.12 is a compatible starting point for Django 5.2 and 6.0.

### Backend

From the repository root:

```bash
python -m venv .venv
```

Activate the environment with `source .venv/Scripts/activate` in Git Bash on Windows or `source .venv/bin/activate` on Linux. Install the backend dependencies:

```bash
python -m pip install django djangorestframework django-cors-headers psycopg2-binary
```

Create the `dsa_learning` PostgreSQL database and adjust `DATABASES` in [backend/settings.py](backend/settings.py) for your connection.

Then apply the migrations and create an administrator account:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 127.0.0.1:8000
```

The admin panel is at [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/). Use it to create tags, add Markdown articles, and mark the articles that should be published.

### Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev -- --host localhost
```

Open [http://localhost:5173/](http://localhost:5173/) while keeping Django running. This address matches the local CORS and CSRF origins configured in the backend.

## Pages and API

| Interface | Purpose |
|---|---|
| `/` | Introduction and access to articles |
| `/articles` | Article list |
| `/article/:slug` | Article content and voting |
| `/login` and `/register` | Login and registration |

| API | Purpose |
|---|---|
| `GET /api/articles/` | Lists published articles; accepts `?tag=<slug>` |
| `GET /api/articles/<slug>/` | Returns an article's content |
| `GET /api/tags/` | Lists tags |
| `POST /api/auth/register/` | Creates an account and starts a session |
| `POST /api/auth/login/` and `POST /api/auth/logout/` | Manage the session |
| `GET /api/auth/me/` | Returns the session user and prepares the CSRF cookie |
| `POST /api/articles/<slug>/upvote/` | Toggles the authenticated user's vote |
| `GET /api/articles/<slug>/upvote/status/` | Returns the vote count and voting status |

The backend uses session authentication and CSRF protection. The frontend sends session credentials and the CSRF token for authentication and voting operations.

## Frontend commands

The frontend provides `dev`, `build`, `lint`, and `preview` scripts. Run the build and static analysis inside `frontend/`:

```bash
npm run build
npm run lint
```
