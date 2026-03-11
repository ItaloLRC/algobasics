import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Tag = { id: number; name: string; slug: string };
type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  tags: Tag[];
  created_at: string;
  published: boolean;
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .ap-root { min-height: 100vh; background: #f8fafc; color: #1a1a2e; font-family: 'Inter', system-ui, sans-serif; }

  .ap-header { background: white; border-bottom: 1px solid #e2e8f0; padding: 18px 0; }
  .ap-header-inner {
    max-width: 860px; margin: 0 auto; padding: 0 24px;
    display: flex; align-items: center; gap: 12px;
  }
  .ap-logo { font-size: 1.25rem; font-weight: 600; color: #4f46e5; text-decoration: none; }
  .ap-sep { color: #cbd5e1; }
  .ap-breadcrumb { font-size: 0.9rem; color: #64748b; }
  .ap-nav { display: flex; align-items: center; gap: 12px; margin-left: auto; }
  .ap-nav-user { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: #64748b; }
  .ap-nav-link { font-size: 0.875rem; font-weight: 500; padding: 7px 16px; border-radius: 7px; text-decoration: none; transition: all 0.15s; }
  .ap-nav-link.outline { border: 1px solid #e2e8f0; color: #374151; background: white; }
  .ap-nav-link.outline:hover { border-color: #c7d2fe; color: #4f46e5; }
  .ap-nav-link.filled { background: #4f46e5; color: white; border: 1px solid #4f46e5; }
  .ap-nav-link.filled:hover { background: #4338ca; }
  .ap-nav-btn { font-size: 0.875rem; font-weight: 500; padding: 7px 16px; border-radius: 7px; cursor: pointer; transition: all 0.15s; border: 1px solid #e2e8f0; color: #374151; background: white; font-family: inherit; }
  .ap-nav-btn:hover { border-color: #fca5a5; color: #ef4444; }

  .ap-main { max-width: 860px; margin: 0 auto; padding: 48px 24px 80px; }

  .ap-page-title { font-size: 1.85rem; font-weight: 600; color: #1e293b; margin-bottom: 6px; }
  .ap-page-subtitle { font-size: 0.95rem; color: #64748b; margin-bottom: 32px; }

  .ap-count {
    display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;
    color: #4f46e5; background: #eef2ff; padding: 2px 8px; border-radius: 20px;
    margin-left: 8px; vertical-align: middle;
  }

  /* Tag filter bar */
  .ap-filters {
    display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px;
    padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;
  }
  .ap-filter-btn {
    font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;
    padding: 5px 12px; border-radius: 20px; border: 1px solid #e2e8f0;
    background: white; color: #64748b; cursor: pointer;
    transition: all 0.15s; letter-spacing: 0.03em;
  }
  .ap-filter-btn:hover { border-color: #c7d2fe; color: #4f46e5; background: #f5f3ff; }
  .ap-filter-btn.active { background: #4f46e5; color: white; border-color: #4f46e5; }

  /* List */
  .ap-list { display: flex; flex-direction: column; gap: 12px; }

  .ap-card {
    display: flex; align-items: center; background: white;
    border: 1px solid #e2e8f0; border-radius: 10px;
    padding: 20px 24px; text-decoration: none; color: inherit;
    transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
    gap: 20px; animation: fadeUp 0.25s ease both;
  }
  .ap-card:hover { box-shadow: 0 4px 20px rgba(79,70,229,0.1); border-color: #c7d2fe; transform: translateY(-1px); }

  .ap-card-num { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #cbd5e1; min-width: 28px; flex-shrink: 0; }

  .ap-card-body { flex: 1; min-width: 0; }
  .ap-card-title { font-size: 1.05rem; font-weight: 600; color: #1e293b; margin-bottom: 6px; transition: color 0.15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ap-card:hover .ap-card-title { color: #4f46e5; }

  .ap-card-bottom { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .ap-card-excerpt { font-size: 0.875rem; color: #64748b; }

  /* Tag badges no card */
  .ap-badge {
    font-family: 'JetBrains Mono', monospace; font-size: 0.68rem;
    padding: 2px 8px; border-radius: 4px;
    background: #eef2ff; color: #4f46e5;
    white-space: nowrap; letter-spacing: 0.03em;
    transition: background 0.15s;
  }
  .ap-badge:hover { background: #e0e7ff; }

  .ap-card-meta { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #94a3b8; white-space: nowrap; flex-shrink: 0; }

  .ap-arrow { color: #c7d2fe; font-size: 1.1rem; flex-shrink: 0; transition: transform 0.15s, color 0.15s; }
  .ap-card:hover .ap-arrow { transform: translateX(3px); color: #4f46e5; }

  .ap-status { text-align: center; padding: 80px 0; color: #94a3b8; font-size: 0.9rem; }
  .ap-status.error { color: #ef4444; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function getExcerpt(content: string, max = 80): string {
  const plain = content.replace(/[#*`_[\]()>]/g, '').replace(/\$.*?\$/g, '').trim();
  return plain.length > max ? plain.slice(0, max).trimEnd() + '…' : plain;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ArticlesPage() {
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca tags uma vez
  useEffect(() => {
    fetch('/api/tags/')
      .then(r => r.json())
      .then(data => setTags(Array.isArray(data) ? data : data.results ?? []));
  }, []);

  // Re-busca artigos quando tag muda
  useEffect(() => {
    let cancelled = false;
    const url = activeTag ? `/api/articles/?tag=${activeTag}` : '/api/articles/';
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (cancelled) return;
        setArticles(Array.isArray(data) ? data : data.results ?? []);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [activeTag]);

  return (
    <div className="ap-root">
      <style>{styles}</style>

      <header className="ap-header">
        <div className="ap-header-inner">
          <Link to="/" className="ap-logo">AlgoBasics</Link>
          <span className="ap-sep">/</span>
          <span className="ap-breadcrumb">Artigos</span>
          <nav className="ap-nav">
            {user ? (
              <>
                <span className="ap-nav-user">{user.username}</span>
                <button className="ap-nav-btn" onClick={logout}>Sair</button>
              </>
            ) : (
              <>
                <Link to="/login" className="ap-nav-link outline">Entrar</Link>
                <Link to="/register" className="ap-nav-link filled">Cadastrar</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="ap-main">
        <h1 className="ap-page-title">
          Artigos de DSA
          {!loading && !error && <span className="ap-count">{articles.length}</span>}
        </h1>
        <p className="ap-page-subtitle">Algoritmos e estruturas de dados explicados com clareza.</p>

        {tags.length > 0 && (
          <div className="ap-filters">
            <button
              className={`ap-filter-btn ${activeTag === null ? 'active' : ''}`}
              onClick={() => setActiveTag(null)}
            >
              todos
            </button>
            {tags.map(tag => (
              <button
                key={tag.id}
                className={`ap-filter-btn ${activeTag === tag.slug ? 'active' : ''}`}
                onClick={() => setActiveTag(activeTag === tag.slug ? null : tag.slug)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}

        {loading && <div className="ap-status">Carregando...</div>}
        {error && <div className="ap-status error">Erro: {error}</div>}

        {!loading && !error && (
          <div className="ap-list">
            {articles.length === 0 && <div className="ap-status">Nenhum artigo encontrado.</div>}
            {articles.map((article, i) => (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                className="ap-card"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="ap-card-num">#{String(i + 1).padStart(2, '0')}</span>
                <div className="ap-card-body">
                  <div className="ap-card-title">{article.title}</div>
                  <div className="ap-card-bottom">
                    <span className="ap-card-excerpt">{getExcerpt(article.content)}</span>
                    {article.tags?.map(tag => (
                      <span key={tag.id} className="ap-badge">{tag.name}</span>
                    ))}
                  </div>
                </div>
                <span className="ap-card-meta">{formatDate(article.created_at)}</span>
                <span className="ap-arrow">→</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
