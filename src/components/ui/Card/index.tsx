import type { HTMLAttributes, ReactNode } from 'react';

import styles from './styles.module.css';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}
