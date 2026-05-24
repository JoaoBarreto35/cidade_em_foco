import { Link } from 'react-router-dom';
import { OccurrenceCard } from '../../components/occurrences/OccurrenceCard';
import { occurrencesMock } from '../../mocks/occurrencesMock';
import styles from './styles.module.css';
export function AdminModeration(){const items=occurrencesMock.filter(item=>item.status==='under_review'||item.reportsCount>=3);return <main className={styles.page}><header className={styles.header}><div><span>Moderação</span><h1>Itens em revisão</h1></div><Link to="/admin">Dashboard</Link></header><section className="section">{items.map(item=><OccurrenceCard key={item.id} occurrence={item}/>)}</section></main>}
