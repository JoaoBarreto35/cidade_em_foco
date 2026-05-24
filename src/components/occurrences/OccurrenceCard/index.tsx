import { Link } from 'react-router-dom';
import { Badge } from '../../ui/Badge';
import { Card } from '../../ui/Card';
import { ResolutionProgress } from '../ResolutionProgress';
import { getCategoryById } from '../../../utils/categories';
import { formatDate } from '../../../utils/formatDate';
import { getStatusInfo } from '../../../utils/statusLabels';
import type { Occurrence } from '../../../types/occurrence';
import styles from './styles.module.css';
type OccurrenceCardProps={occurrence:Occurrence};
export function OccurrenceCard({occurrence}:OccurrenceCardProps){const category=getCategoryById(occurrence.category);const status=getStatusInfo(occurrence.status);return <Card className={styles.card}><Link to={`/occurrences/${occurrence.id}`} className={styles.content}><img src={occurrence.photoUrl} alt={occurrence.title} className={styles.image}/><div className={styles.body}><div className={styles.top}><span className={styles.category}>{category.icon} {category.label}</span><Badge tone={status.tone}>{status.label}</Badge></div><h2>{occurrence.title}</h2><p>{occurrence.description}</p><div className={styles.meta}><span>📍 {occurrence.neighborhood}</span><span>📅 {formatDate(occurrence.createdAt)}</span></div><ResolutionProgress votes={occurrence.resolutionVotesCount}/>{occurrence.reportsCount>=3&&<span className={styles.warning}>⚠️ Em revisão por denúncias da comunidade</span>}</div></Link></Card>;}
