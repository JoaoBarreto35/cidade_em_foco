import { Link } from 'react-router-dom';

import { Card } from '../../components/ui/Card';
import {
  getOccurrences,
  getResolutionModerationItems,
} from '../../services/occurrencesLocalService';

import styles from './styles.module.css';

export function AdminDashboard() {
  const occurrences = getOccurrences();
  const resolutionReviewItems = getResolutionModerationItems();
  const occurrenceReview = occurrences.filter(
    (occurrence) => occurrence.status === 'under_review' || occurrence.reportsCount >= 3,
  ).length;
  const totalReports = occurrences.reduce(
    (total, occurrence) =>
      total +
      occurrence.reportsCount +
      occurrence.resolutionVotes.reduce((voteTotal, vote) => voteTotal + vote.reportsCount, 0),
    0,
  );
  const resolved = occurrences.filter((occurrence) => occurrence.status === 'resolved').length;

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
          <strong>{resolved}</strong>
          <span>Resolvidas pela comunidade</span>
        </Card>
        <Card>
          <strong>{occurrenceReview}</strong>
          <span>Ocorrências em revisão</span>
        </Card>
        <Card>
          <strong>{resolutionReviewItems.length}</strong>
          <span>Resoluções em revisão</span>
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
