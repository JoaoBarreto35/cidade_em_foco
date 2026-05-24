import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import styles from './styles.module.css';

export function ResolveOccurrence() {
  const { id } = useParams();
  const [hasPhoto, setHasPhoto] = useState(false);

  return (
    <div className="page section">
      <PageHeader
        eyebrow={`Ocorrência #${id ?? ''}`}
        title="Informar resolução"
        description="Envie uma foto atual mostrando que o problema foi resolvido. A ocorrência só será concluída após 3 confirmações diferentes."
      />

      <Card>
        <form className={styles.form}>
          <button className={styles.uploadBox} type="button" onClick={() => setHasPhoto(true)}>
            <strong>{hasPhoto ? 'Foto de resolução adicionada' : 'Adicionar foto atual obrigatória'}</strong>
            <small>A foto precisa mostrar o local após a solução do problema.</small>
          </button>

          <label className={styles.field}>
            <span>Observação opcional</span>
            <textarea placeholder="Ex: local foi limpo e não há mais água parada..." rows={5} />
          </label>

          <div className={styles.notice}>
            <strong>Regra comunitária</strong>
            <p>Com 3 confirmações diferentes com foto, a ocorrência será marcada como resolvida pela comunidade.</p>
          </div>

          <Button fullWidth>Enviar confirmação</Button>
        </form>
      </Card>
    </div>
  );
}
