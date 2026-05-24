import { Link } from 'react-router-dom';

import { Card } from '../../components/ui/Card';
import { getOccurrences } from '../../services/occurrencesLocalService';

import styles from './styles.module.css';

export function AdminDashboard() {
  const occurrences = getOccurrences();
  const review = occurrences.filter((occurrence) => occurrence.status === 'under_review').length;
  const totalReports = occurrences.reduce((total, occurrence) => total + occurrence.reportsCount, 0);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span>Admin</span>
          <h1>Dashboard</h1>
        </div>
        <Link to="/">Voltar ao app</Link>
      </header>

      <section className={styles.grid}>
        <Card>
          <strong>{occurrences.length}</strong>
          <span>Total de ocorrências</span>
        </Card>
        <Card>
          <strong>{review}</strong>
          <span>Em revisão</span>
        </Card>
        <Card>
          <strong>{totalReports}</strong>
          <span>Denúncias registradas</span>
        </Card>
      </section>

      <Link className={styles.link} to="/admin/moderation">
        Abrir moderação
      </Link>
    </main>
  );
}
