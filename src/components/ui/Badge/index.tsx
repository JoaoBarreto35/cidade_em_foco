import type { ReactNode } from 'react';
import type { StatusTone } from '../../../utils/statusLabels';
import styles from './styles.module.css';
type BadgeProps={children:ReactNode;tone?:StatusTone};
export function Badge({children,tone='neutral'}:BadgeProps){return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;}
