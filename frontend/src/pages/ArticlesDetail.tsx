import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

type ArticleDetail = {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  updated_at: string;
  published: boolean;
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

  .ad-root { min-height: 100vh; background: #f8fafc; font-family: 'Inter', system-ui, sans-serif; color: #1e293b; }

  .ad-header { background: white; border-bottom: 1px solid #e2e8f0; padding: 18px 0; }
  .ad-header-inner {
    max-width: 760px; margin: 0 auto; padding: 0 24px;
    display: flex; align-items: center; gap: 12px;
  }
  .ad-logo { font-size: 1.25rem; font-weight: 600; color: #4f46e5; text-decoration: none; }
  .ad-sep { color: #cbd5e1; }
  .ad-back { font-size: 0.9rem; color: #64748b; text-decoration: none; transition: color 0.15s; }
  .ad-back:hover { color: #4f46e5; }
  .ad-nav { display: flex; align-items: center; gap: 12px; margin-left: auto; }
  .ad-nav-user { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: #64748b; }
  .ad-nav-link { font-size: 0.875rem; font-weight: 500; padding: 7px 16px; border-radius: 7px; text-decoration: none; transition: all 0.15s; }
  .ad-nav-link.outline { border: 1px solid #e2e8f0; color: #374151; background: white; }
  .ad-nav-link.outline:hover { border-color: #c7d2fe; color: #4f46e5; }
  .ad-nav-link.filled { background: #4f46e5; color: white; border: 1px solid #4f46e5; }
  .ad-nav-link.filled:hover { background: #4338ca; }
  .ad-nav-btn { font-size: 0.875rem; font-weight: 500; padding: 7px 16px; border-radius: 7px; cursor: pointer; transition: all 0.15s; border: 1px solid #e2e8f0; color: #374151; background: white; font-family: inherit; }
  .ad-nav-btn:hover { border-color: #fca5a5; color: #ef4444; }

  .ad-main { max-width: 760px; margin: 0 auto; padding: 56px 24px 100px; }

  .ad-meta-top {
    font-family: 'JetBrains Mono', monospace; font-size: 0.72rem;
    color: #94a3b8; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px;
  }

  .ad-title {
    font-family: 'Lora', Georgia, serif; font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 600; line-height: 1.2; color: #0f172a; margin-bottom: 24px;
  }

  .ad-divider {
    height: 1px; background: #e2e8f0; margin: 28px 0; position: relative;
  }
  .ad-divider::after {
    content: ''; position: absolute; left: 0; top: -1px;
    width: 56px; height: 2px; background: #4f46e5;
  }

  .ad-dates {
    display: flex; gap: 24px; font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem; color: #94a3b8; margin-bottom: 48px;
  }
  .ad-dates span b { color: #4f46e5; font-weight: 500; }

  .ad-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px; }
  .ad-tag {
    font-family: 'JetBrains Mono', monospace; font-size: 0.72rem;
    padding: 3px 10px; border-radius: 4px;
    background: #eef2ff; color: #4f46e5; letter-spacing: 0.03em;
  }

  /* Prose */
  .ad-body { font-family: 'Lora', Georgia, serif; font-size: 1.05rem; line-height: 1.85; color: #334155; }

  .ad-body h1, .ad-body h2, .ad-body h3 {
    font-family: 'Inter', sans-serif; color: #0f172a;
    font-weight: 600; margin: 2em 0 0.6em; line-height: 1.25;
  }
  .ad-body h1 { font-size: 1.6rem; }
  .ad-body h2 { font-size: 1.35rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
  .ad-body h3 { font-size: 1.1rem; color: #4f46e5; }

  .ad-body p { margin-bottom: 1.4em; }
  .ad-body a { color: #4f46e5; text-decoration: underline; text-underline-offset: 3px; }

  .ad-body code {
    font-family: 'JetBrains Mono', monospace; font-size: 0.85em;
    background: #eef2ff; color: #4338ca; padding: 2px 6px; border-radius: 4px;
  }

  .ad-body pre {
    background: #1e293b; border-left: 3px solid #4f46e5;
    border-radius: 8px; padding: 20px 24px; overflow-x: auto; margin: 1.6em 0;
  }
  .ad-body pre code {
    background: none; color: #e2e8f0; padding: 0; font-size: 0.9rem; line-height: 1.65;
  }

  .ad-body blockquote {
    border-left: 3px solid #c7d2fe; padding: 12px 20px; margin: 1.6em 0;
    background: #f5f3ff; color: #64748b; font-style: italic; border-radius: 0 8px 8px 0;
  }

  .ad-body ul, .ad-body ol { padding-left: 1.6em; margin-bottom: 1.4em; }
  .ad-body li { margin-bottom: 0.5em; }
  .ad-body strong { color: #0f172a; font-weight: 600; }

  /* KaTeX */
  .ad-body .katex-display {
    overflow-x: auto; padding: 16px 0; margin: 1.6em 0;
    background: #f8fafc; border-radius: 6px;
  }
  .ad-body .katex { font-size: 1.05em; }

  .ad-status { text-align: center; padding: 80px 0; color: #94a3b8; font-size: 0.9rem; }
  .ad-status.error { color: #ef4444; }


  /* Upvote */
  .ad-upvote-bar {
    display: flex; align-items: center; gap: 12px;
    margin-top: 48px; padding-top: 32px;
    border-top: 1px solid #e2e8f0;
  }

  .ad-upvote-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 8px; cursor: pointer;
    font-size: 0.9rem; font-weight: 500; font-family: inherit;
    transition: all 0.15s; border: 1px solid #e2e8f0;
    background: white; color: #64748b;
  }
  .ad-upvote-btn:hover:not(:disabled) {
    border-color: #c7d2fe; color: #4f46e5;
    background: #f5f3ff;
  }
  .ad-upvote-btn.voted {
    background: #4f46e5; color: white; border-color: #4f46e5;
  }
  .ad-upvote-btn.voted:hover:not(:disabled) {
    background: #4338ca; border-color: #4338ca; color: white;
  }
  .ad-upvote-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .ad-upvote-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem; color: #94a3b8;
  }

  .ad-upvote-hint {
    font-size: 0.8rem; color: #94a3b8;
  }
  .ad-upvote-hint a { color: #4f46e5; text-decoration: underline; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ad-content { animation: fadeUp 0.3s ease both; }
`;

async function renderContent(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function ArticleDetail() {
  const { user, logout } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [voted, setVoted] = useState(false);
  const [upvoteLoading, setUpvoteLoading] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/articles/${slug}/`)
      .then(res => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then(async data => {
        setArticle(data);
        setUpvoteCount(data.upvote_count ?? 0);
        const rendered = await renderContent(data.content);
        setHtml(rendered);
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/articles/${slug}/upvote/status/`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setVoted(data.voted); setUpvoteCount(data.upvote_count); })
      .catch(() => {});
  }, [slug, user]);

  async function getCsrf(): Promise<string> {
    let match = document.cookie.match(/csrftoken=([^;]+)/);
    if (match) return match[1];
    // cookie não existe ainda — faz um GET para forçar o Django setar
    await fetch('/api/auth/me/', { credentials: 'include' });
    match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : '';
  }

  const handleUpvote = useCallback(async () => {
    if (!slug || upvoteLoading) return;
    setUpvoteLoading(true);
    try {
      const csrf = await getCsrf();
      const res = await fetch(`/api/articles/${slug}/upvote/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-CSRFToken': csrf },
      });
      if (res.ok) {
        const data = await res.json();
        setVoted(data.voted);
        setUpvoteCount(data.upvote_count);
      } else {
        console.error('Upvote falhou:', res.status, await res.text());
      }
    } catch (e) {
      console.error('Upvote erro:', e);
    }
    setUpvoteLoading(false);
  }, [slug, upvoteLoading]);

  return (
    <div className="ad-root">
      <style>{styles}</style>

      <header className="ad-header">
        <div className="ad-header-inner">
          <Link to="/" className="ad-logo">AlgoBasics</Link>
          <span className="ad-sep">/</span>
          <Link to="/articles" className="ad-back">← Artigos</Link>
          <nav className="ad-nav">
            {user ? (
              <>
                <span className="ad-nav-user">{user.username}</span>
                <button className="ad-nav-btn" onClick={logout}>Sair</button>
              </>
            ) : (
              <>
                <Link to="/login" className="ad-nav-link outline">Entrar</Link>
                <Link to="/register" className="ad-nav-link filled">Cadastrar</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="ad-main">
        {loading && <div className="ad-status">Carregando...</div>}
        {error && <div className="ad-status error">Erro: {error}</div>}
        {!loading && !error && !article && <div className="ad-status">Artigo não encontrado.</div>}

        {!loading && !error && article && (
          <div className="ad-content">
            <div className="ad-meta-top">artigo</div>
            <h1 className="ad-title">{article.title}</h1>
            <div className="ad-divider" />
            <div className="ad-dates">
              <span>publicado <b>{formatDate(article.created_at)}</b></span>
              <span>atualizado <b>{formatDate(article.updated_at)}</b></span>
            </div>
            <div className="ad-body" dangerouslySetInnerHTML={{ __html: html }} />

            <div className="ad-upvote-bar">
              {user ? (
                <>
                  <button
                    className={`ad-upvote-btn ${voted ? 'voted' : ''}`}
                    onClick={handleUpvote}
                    disabled={upvoteLoading}
                  >
                    ▲ {voted ? 'Votado' : 'Upvote'}
                  </button>
                  <span className="ad-upvote-count">
                    {upvoteCount} {upvoteCount === 1 ? 'voto' : 'votos'}
                  </span>
                </>
              ) : (
                <>
                  <button className="ad-upvote-btn" disabled>▲ Upvote</button>
                  <span className="ad-upvote-hint">
                    <a href="/login">Entre</a> para votar · {upvoteCount} {upvoteCount === 1 ? 'voto' : 'votos'}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
