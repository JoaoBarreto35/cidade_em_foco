import { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import styles from './styles.module.css';
const reasons=['Foto falsa','Local incorreto','Ocorrência duplicada','Conteúdo ofensivo','Não existe problema no local','Outro motivo'];
export function ReportOccurrence(){const[reason,setReason]=useState('');const[note,setNote]=useState('');return <div className="page stack"><PageHeader eyebrow="Denúncia comunitária" title="Denunciar ocorrência" description="Use esta opção apenas para registros falsos, duplicados, inadequados ou incorretos."/><Card><form className={styles.form}><fieldset><legend>Motivo da denúncia</legend>{reasons.map((item)=><label key={item} className={styles.option}><input type="radio" name="reason" value={item} checked={reason===item} onChange={(event)=>setReason(event.target.value)}/><span>{item}</span></label>)}</fieldset><div className="formField"><label>Observação opcional</label><textarea value={note} onChange={(event)=>setNote(event.target.value)} placeholder="Explique rapidamente, se desejar."/></div><div className={styles.alert}>Com 3 denúncias, a ocorrência entra em revisão administrativa.</div><Button type="button" variant="danger" fullWidth disabled={!reason}>Enviar denúncia</Button></form></Card></div>}
