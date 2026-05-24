import { Link, Outlet } from 'react-router-dom';
import { BottomNav } from '../BottomNav';
import styles from './styles.module.css';
export function AppShell() { return <div className={styles.shell}><header className={styles.header}><Link to="/" className={styles.brand} aria-label="Ir para o início"><span className={styles.logo}>🌱</span><span><strong>Cidade em Foco</strong><small>Mapeamento comunitário</small></span></Link><Link to="/admin/login" className={styles.adminLink}>Admin</Link></header><main className={styles.main}><Outlet /></main><BottomNav /></div>; }
