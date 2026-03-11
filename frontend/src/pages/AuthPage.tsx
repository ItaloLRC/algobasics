import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .auth-root {
    min-height: 100vh; background: #f8fafc;
    font-family: 'Inter', system-ui, sans-serif;
    display: flex; flex-direction: column;
  }

  .auth-header { background: white; border-bottom: 1px solid #e2e8f0; padding: 18px 0; }
  .auth-header-inner {
    max-width: 860px; margin: 0 auto; padding: 0 24px;
    display: flex; align-items: center; gap: 12px;
  }
  .auth-logo { font-size: 1.25rem; font-weight: 600; color: #4f46e5; text-decoration: none; }

  .auth-main {
    flex: 1; display: flex; align-items: center;
    justify-content: center; padding: 40px 24px;
  }

  .auth-card {
    background: white; border: 1px solid #e2e8f0;
    border-radius: 12px; padding: 40px;
    width: 100%; max-width: 400px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    animation: fadeUp 0.3s ease both;
  }

  .auth-card-title {
    font-size: 1.5rem; font-weight: 600;
    color: #0f172a; margin-bottom: 6px;
  }

  .auth-card-sub {
    font-size: 0.9rem; color: #64748b; margin-bottom: 32px;
  }

  .auth-field { margin-bottom: 20px; }

  .auth-label {
    display: block; font-size: 0.85rem; font-weight: 500;
    color: #374151; margin-bottom: 6px;
  }

  .auth-input {
    width: 100%; padding: 10px 14px;
    border: 1px solid #e2e8f0; border-radius: 8px;
    font-size: 0.95rem; font-family: inherit;
    color: #1e293b; background: #f8fafc;
    transition: border-color 0.15s, box-shadow 0.15s;
    outline: none;
    box-sizing: border-box;
  }
  .auth-input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
    background: white;
  }

  .auth-error {
    font-size: 0.85rem; color: #ef4444;
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: 6px; padding: 10px 14px;
    margin-bottom: 20px;
  }

  .auth-btn {
    width: 100%; padding: 11px;
    background: #4f46e5; color: white;
    border: none; border-radius: 8px;
    font-size: 1rem; font-weight: 600;
    font-family: inherit; cursor: pointer;
    transition: background 0.15s;
  }
  .auth-btn:hover { background: #4338ca; }
  .auth-btn:disabled { background: #a5b4fc; cursor: not-allowed; }

  .auth-switch {
    text-align: center; margin-top: 24px;
    font-size: 0.875rem; color: #64748b;
  }
  .auth-switch a { color: #4f46e5; font-weight: 500; text-decoration: none; }
  .auth-switch a:hover { text-decoration: underline; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

type Props = { mode: 'login' | 'register' };

export default function AuthPage({ mode }: Props) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = mode === 'login'
      ? await login(username, password)
      : await register(username, password);
    setLoading(false);
    if (err) { setError(err); return; }
    navigate('/articles');
  }

  const isLogin = mode === 'login';

  return (
    <div className="auth-root">
      <style>{styles}</style>

      <header className="auth-header">
        <div className="auth-header-inner">
          <Link to="/" className="auth-logo">AlgoBasics</Link>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <h1 className="auth-card-title">{isLogin ? 'Entrar' : 'Criar conta'}</h1>
          <p className="auth-card-sub">
            {isLogin ? 'Acesse sua conta para votar nos artigos.' : 'Cadastre-se para participar.'}
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Username</label>
              <input
                className="auth-input"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Senha</label>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
              />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <div className="auth-switch">
            {isLogin
              ? <>Não tem conta? <Link to="/register">Cadastre-se</Link></>
              : <>Já tem conta? <Link to="/login">Entrar</Link></>
            }
          </div>
        </div>
      </main>
    </div>
  );
}
