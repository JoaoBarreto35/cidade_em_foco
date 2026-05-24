import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
type ButtonVariant='primary'|'secondary'|'ghost'|'danger';
type Base={children:ReactNode;variant?:ButtonVariant;fullWidth?:boolean};
type Btn=Base&ButtonHTMLAttributes<HTMLButtonElement>&{to?:undefined};
type Anchor=Base&AnchorHTMLAttributes<HTMLAnchorElement>&{to:string};
type Props=Btn|Anchor;
export function Button(props:Props){const {children,variant='primary',fullWidth=false,className='',...rest}=props;const classes=[styles.button,styles[variant],fullWidth?styles.fullWidth:'',className].filter(Boolean).join(' ');if('to'in props&&props.to){return <Link to={props.to} className={classes}>{children}</Link>;}return <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;}
