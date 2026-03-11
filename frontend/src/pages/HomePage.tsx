import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .home-root {
    min-height: 100vh; background: #f8fafc;
    font-family: 'Inter', system-ui, sans-serif;
    display: flex; flex-direction: column;
  }

  .home-header { background: white; border-bottom: 1px solid #e2e8f0; padding: 18px 0; }
  .home-header-inner {
    max-width: 860px; margin: 0 auto; padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .home-logo { font-size: 1.25rem; font-weight: 600; color: #4f46e5; text-decoration: none; }

  .home-nav { display: flex; align-items: center; gap: 12px; }
  .home-nav-user {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem; color: #64748b;
  }
  .home-nav-link {
    font-size: 0.875rem; font-weight: 500; padding: 7px 16px;
    border-radius: 7px; text-decoration: none; transition: all 0.15s;
  }
  .home-nav-link.outline {
    border: 1px solid #e2e8f0; color: #374151; background: white;
  }
  .home-nav-link.outline:hover { border-color: #c7d2fe; color: #4f46e5; }
  .home-nav-link.filled {
    background: #4f46e5; color: white; border: 1px solid #4f46e5;
  }
  .home-nav-link.filled:hover { background: #4338ca; }
  .home-nav-btn {
    font-size: 0.875rem; font-weight: 500; padding: 7px 16px;
    border-radius: 7px; cursor: pointer; transition: all 0.15s;
    border: 1px solid #e2e8f0; color: #374151; background: white;
    font-family: inherit;
  }
  .home-nav-btn:hover { border-color: #fca5a5; color: #ef4444; }

  .home-main {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; padding: 40px 24px;
  }

  .home-hero {
    text-align: center; max-width: 520px;
    background: white; border: 1px solid #e2e8f0;
    border-radius: 16px; padding: 48px 40px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }

  .home-title { font-size: 2.5rem; font-weight: 600; color: #4f46e5; margin-bottom: 12px; }
  .home-sub { font-size: 1.05rem; color: #64748b; margin-bottom: 32px; line-height: 1.6; }

  .home-cta {
    display: inline-block; padding: 13px 36px;
    background: #4f46e5; color: white; text-decoration: none;
    border-radius: 9px; font-size: 1rem; font-weight: 600;
    transition: background 0.15s;
  }
  .home-cta:hover { background: #4338ca; }

  footer { text-align: center; padding: 24px; color: #94a3b8; font-size: 0.85rem; }
`;

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="home-root">
      <style>{styles}</style>

      <header className="home-header">
        <div className="home-header-inner">
          <Link to="/" className="home-logo">AlgoBasics</Link>
          <nav className="home-nav">
            {user ? (
              <>
                <span className="home-nav-user">{user.username}</span>
                <button className="home-nav-btn" onClick={logout}>Sair</button>
              </>
            ) : (
              <>
                <Link to="/login" className="home-nav-link outline">Entrar</Link>
                <Link to="/register" className="home-nav-link filled">Cadastrar</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="home-main">
        <div className="home-hero">
          <h1 className="home-title">AlgoBasics</h1>
          <p className="home-sub">Algoritmos e estruturas de dados explicados com clareza.</p>
          <Link to="/articles" className="home-cta">Ver Artigos →</Link>
        </div>
      </main>

      <footer>© 2026 AlgoBasics</footer>
    </div>
  );
}
