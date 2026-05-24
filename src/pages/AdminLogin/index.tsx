import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import styles from './styles.module.css';
export function AdminLogin(){return <main className={styles.page}><Card><div className={styles.content}><span className={styles.logo}>🌱</span><h1>Área administrativa</h1><p>Acesso reservado para moderação das ocorrências comunitárias.</p><input placeholder="E-mail"/><input placeholder="Senha" type="password"/><Button to="/admin" fullWidth>Entrar</Button></div></Card></main>}
