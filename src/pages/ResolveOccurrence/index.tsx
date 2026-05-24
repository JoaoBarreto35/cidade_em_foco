import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { occurrencesMock } from '../../mocks/occurrencesMock';
import styles from './styles.module.css';
export function ResolveOccurrence(){const{id}=useParams();const occurrence=occurrencesMock.find((item)=>item.id===id);const[hasPhoto,setHasPhoto]=useState(false);const[note,setNote]=useState('');return <div className="page stack"><PageHeader eyebrow="Resolução comunitária" title="Informar que foi resolvido" description={occurrence?`Envie uma foto atualizada para ${occurrence.title}.`:'Envie uma foto atualizada para confirmar a resolução.'}/><Card><div className={styles.content}><div className={styles.alert}><strong>Regra da comunidade</strong><p>A ocorrência só fecha com 3 confirmações diferentes, todas com foto obrigatória.</p></div><div className={styles.uploadBox}><strong>Foto atual obrigatória</strong><p>A foto deve mostrar claramente o local após a resolução.</p><button type="button" onClick={()=>setHasPhoto(true)}>{hasPhoto?'✅ Foto adicionada':'📷 Simular envio de foto'}</button></div><div className="formField"><label>Observação opcional</label><textarea value={note} onChange={(event)=>setNote(event.target.value)} placeholder="Ex: local limpo, mato cortado, lixo removido..."/></div><Button type="button" fullWidth disabled={!hasPhoto}>Enviar confirmação</Button></div></Card></div>}
