import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { signInAdmin } from '../../services/supabase/authSupabaseService';

import styles from './styles.module.css';

type LocationState = {
  from?: string;
};

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const redirectTo = locationState?.from ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Informe e-mail e senha para entrar.');
      return;
    }

    setLoading(true);
    const result = await signInAdmin(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  return (
    <main className={styles.page}>
      <Card className={styles.card}>
        <form className={styles.content} onSubmit={handleSubmit}>
          <span className={styles.logo}>🌱</span>
          <div>
            <span className={styles.eyebrow}>Cidade em Foco</span>
            <h1>Área administrativa</h1>
            <p>Acesso reservado para moderação das ocorrências comunitárias.</p>
          </div>

          <label className={styles.field}>
            <span>E-mail</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@email.com"
              type="email"
              autoComplete="email"
            />
          </label>

          <label className={styles.field}>
            <span>Senha</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              type="password"
              autoComplete="current-password"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <Link className={styles.backLink} to="/">
            Voltar para o app público
          </Link>
        </form>
      </Card>
    </main>
  );
}
