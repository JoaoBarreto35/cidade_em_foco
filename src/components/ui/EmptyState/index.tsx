import { Button } from '../Button';
import styles from './styles.module.css';
type EmptyStateProps={title:string;description:string;actionLabel?:string;actionTo?:string};
export function EmptyState({title,description,actionLabel,actionTo}:EmptyStateProps){return <div className={styles.empty}><span className={styles.icon}>🔎</span><h2>{title}</h2><p>{description}</p>{actionLabel&&actionTo&&<Button to={actionTo} variant="secondary">{actionLabel}</Button>}</div>;}
