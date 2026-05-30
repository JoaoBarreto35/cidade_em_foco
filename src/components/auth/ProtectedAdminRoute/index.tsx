import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Card } from '../../ui/Card';
import { getCurrentAdminSession } from '../../../services/supabase/authSupabaseService';

import styles from './styles.module.css';

type ProtectedAdminRouteProps = {
  children: ReactNode;
};

type AuthStatus = 'loading' | 'allowed' | 'blocked';

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const location = useLocation();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [message, setMessage] = useState('Validando acesso administrativo...');

  useEffect(() => {
    let active = true;

    async function validateSession(): Promise<void> {
      const result = await getCurrentAdminSession();

      if (!active) {
        return;
      }

      if (result.error) {
        setMessage(result.error);
        setStatus('blocked');
        return;
      }

      setStatus(result.session && result.profile ? 'allowed' : 'blocked');
    }

    void validateSession();

    return () => {
      active = false;
    };
  }, []);

  if (status === 'loading') {
    return (
      <main className={styles.page}>
        <Card className={styles.card}>
          <span className={styles.logo}>🌱</span>
          <h1>Área administrativa</h1>
          <p>{message}</p>
        </Card>
      </main>
    );
  }

  if (status === 'blocked') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
