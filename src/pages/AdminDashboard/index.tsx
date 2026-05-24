import { Link } from 'react-router-dom';

import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { occurrencesMock } from '../../mocks/occurrencesMock';
import styles from './styles.module.css';

export function AdminDashboard() {
  const openCount = occurrencesMock.filter((item) => item.status === 'open').length;
  const reviewCount = occurrencesMock.filter((item) => item.status === 'under_review').length;
  const resolvedCount = occurrencesMock.filter((item) => item.status === 'resolved').length;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>← App público</Link>
        <Badge tone="success">Admin mockado</Badge>
      </header>

      <section className={styles.hero}>
        <h1>Dashboard admin</h1>
        <p>Visão inicial para acompanhar registros, denúncias e itens em revisão.</p>
      </section>

      <section className={styles.stats}>
        <Card><strong>{openCount}</strong><span>Abertas</span></Card>
        <Card><strong>{reviewCount}</strong><span>Em revisão</span></Card>
        <Card><strong>{resolvedCount}</strong><span>Resolvidas</span></Card>
      </section>

      <Button to="/admin/moderation" fullWidth>Ir para moderação</Button>
    </main>
  );
}
