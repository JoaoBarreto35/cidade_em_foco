import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { occurrencesMock } from '../../mocks/occurrencesMock';
import styles from './styles.module.css';
export function AdminDashboard(){const review=occurrencesMock.filter(o=>o.status==='under_review').length;return <main className={styles.page}><header className={styles.header}><div><span>Admin</span><h1>Dashboard</h1></div><Link to="/">Voltar ao app</Link></header><section className={styles.grid}><Card><strong>{occurrencesMock.length}</strong><span>Total de ocorrências</span></Card><Card><strong>{review}</strong><span>Em revisão</span></Card><Card><strong>3</strong><span>Denúncias pendentes</span></Card></section><Link className={styles.link} to="/admin/moderation">Abrir moderação</Link></main>}
