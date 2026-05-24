import type { ReactNode } from 'react';
import styles from './styles.module.css';
type CardProps={children:ReactNode;className?:string};
export function Card({children,className=''}:CardProps){return <section className={`${styles.card} ${className}`}>{children}</section>;}
