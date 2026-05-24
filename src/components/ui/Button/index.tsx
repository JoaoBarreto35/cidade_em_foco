import { Link } from 'react-router-dom';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './styles.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type BaseButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: never };
type LinkButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

type ButtonProps = NativeButtonProps | LinkButtonProps;

export function Button({ children, variant = 'primary', fullWidth = false, className = '', ...props }: ButtonProps) {
  const buttonClassName = [styles.button, styles[variant], fullWidth ? styles.fullWidth : '', className].filter(Boolean).join(' ');

  if ('to' in props && props.to) {
    return (
      <Link className={buttonClassName} to={props.to}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClassName} type={props.type ?? 'button'} {...props}>
      {children}
    </button>
  );
}
