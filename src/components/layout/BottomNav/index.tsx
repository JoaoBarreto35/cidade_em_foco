import { NavLink } from 'react-router-dom';
import { publicRoutes } from '../../../utils/routes';
import styles from './styles.module.css';
export function BottomNav() { return <nav className={styles.nav} aria-label="Navegação principal">{publicRoutes.map((route)=><NavLink key={route.path} to={route.path} className={({isActive})=>isActive?`${styles.link} ${styles.active}`:styles.link} end={route.path==='/'}><span className={styles.icon}>{route.icon}</span><span className={styles.label}>{route.label}</span></NavLink>)}</nav>; }
