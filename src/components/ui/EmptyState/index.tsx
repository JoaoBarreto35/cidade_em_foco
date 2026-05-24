import { Button } from '../Button';
import styles from './styles.module.css';

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
};

export function EmptyState({ icon = '🌱', title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <section className={styles.empty}>
      <span className={styles.icon}>{icon}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {actionLabel && actionTo && <Button to={actionTo}>{actionLabel}</Button>}
    </section>
  );
}
