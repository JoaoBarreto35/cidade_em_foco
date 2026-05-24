import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import styles from './styles.module.css';

const reportReasons = ['Foto falsa', 'Local incorreto', 'Ocorrência duplicada', 'Conteúdo ofensivo', 'Não existe problema no local', 'Outro motivo'];

export function ReportOccurrence() {
  const { id } = useParams();
  const [reason, setReason] = useState('');

  return (
    <div className="page section">
      <PageHeader
        eyebrow={`Ocorrência #${id ?? ''}`}
        title="Denunciar ocorrência"
        description="Ajude a manter o mapa confiável. Com 3 denúncias, o item vai para revisão do administrador."
      />

      <Card>
        <form className={styles.form}>
          <div className={styles.reasons}>
            {reportReasons.map((item) => (
              <label key={item} className={reason === item ? `${styles.reason} ${styles.selected}` : styles.reason}>
                <input type="radio" name="reason" value={item} checked={reason === item} onChange={(event) => setReason(event.target.value)} />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <label className={styles.field}>
            <span>Observação opcional</span>
            <textarea placeholder="Explique se quiser..." rows={5} />
          </label>

          <Button variant="danger" fullWidth>Enviar denúncia</Button>
        </form>
      </Card>
    </div>
  );
}
