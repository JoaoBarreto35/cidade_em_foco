import { Link } from 'react-router-dom';

import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { occurrencesMock } from '../../mocks/occurrencesMock';
import { getCategoryById } from '../../utils/categories';
import styles from './styles.module.css';

export function AdminModeration() {
  const reviewItems = occurrencesMock.filter((item) => item.status === 'under_review' || item.reportsCount >= 3);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link to="/admin" className={styles.backLink}>← Dashboard</Link>
        <Badge tone="warning">Moderação</Badge>
      </header>

      <section className={styles.hero}>
        <h1>Itens em revisão</h1>
        <p>Ocorrências com denúncias suficientes devem ser analisadas pelo administrador.</p>
      </section>

      <section className={styles.list}>
        {reviewItems.map((occurrence) => {
          const category = getCategoryById(occurrence.category);

          return (
            <Card key={occurrence.id} className={styles.card}>
              <span className={styles.icon}>{category.icon}</span>
              <div>
                <strong>{occurrence.title}</strong>
                <p>{occurrence.reportsCount} denúncias recebidas • {occurrence.neighborhood}</p>
              </div>
              <Button variant="secondary">Analisar</Button>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
