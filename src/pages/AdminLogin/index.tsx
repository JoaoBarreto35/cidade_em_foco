import { Link } from 'react-router-dom';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import styles from './styles.module.css';

export function AdminLogin() {
  return (
    <main className={styles.page}>
      <Card className={styles.card}>
        <Link to="/" className={styles.backLink}>← Voltar ao app</Link>
        <div className={styles.header}>
          <span>🛡️</span>
          <h1>Área administrativa</h1>
          <p>Acesso restrito para moderação de ocorrências e resoluções denunciadas.</p>
        </div>

        <form className={styles.form}>
          <label>
            <span>E-mail</span>
            <input type="email" placeholder="admin@email.com" />
          </label>
          <label>
            <span>Senha</span>
            <input type="password" placeholder="Sua senha" />
          </label>
          <Button fullWidth>Entrar</Button>
        </form>
      </Card>
    </main>
  );
}
