import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  createOccurrenceReport,
  getOccurrenceById,
} from '../../services/occurrencesLocalService';
import { getVisitorId } from '../../utils/visitorId';

import styles from './styles.module.css';

const reasons = [
  'Foto falsa',
  'Local incorreto',
  'Ocorrência duplicada',
  'Conteúdo ofensivo',
  'Não existe problema no local',
  'Outro motivo',
];

export function ReportOccurrence() {
  const { id } = useParams();
  const navigate = useNavigate();
  const occurrence = id ? getOccurrenceById(id) : undefined;
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!occurrence) {
    return (
      <EmptyState
        title="Ocorrência não encontrada"
        description="Não encontramos o registro para denunciar."
        actionLabel="Voltar para lista"
        actionTo="/occurrences"
      />
    );
  }

  function handleSubmit(): void {
    if (!reason) {
      setError('Selecione o motivo da denúncia.');
      return;
    }

    const result = createOccurrenceReport({
      occurrenceId: occurrence.id,
      anonymousVisitorId: getVisitorId(),
    });

    if (result.error) {
      setError(result.error);
      return;
    }

    if (note.trim()) {
      console.info('Observação da denúncia no MVP local:', note.trim());
    }

    navigate(`/occurrences/${occurrence.id}`);
  }

  return (
    <div className="page stack">
      <PageHeader
        eyebrow="Denúncia comunitária"
        title="Denunciar ocorrência"
        description="Use esta opção apenas para registros falsos, duplicados, inadequados ou incorretos."
      />

      <Card>
        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset>
            <legend>Motivo da denúncia</legend>
            {reasons.map((item) => (
              <label key={item} className={styles.option}>
                <input
                  type="radio"
                  name="reason"
                  value={item}
                  checked={reason === item}
                  onChange={(event) => setReason(event.target.value)}
                />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>

          <div className="formField">
            <label>Observação opcional</label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Explique rapidamente, se desejar."
            />
          </div>

          <div className={styles.alert}>Com 3 denúncias, a ocorrência entra em revisão administrativa.</div>

          <Button type="button" variant="danger" fullWidth disabled={!reason} onClick={handleSubmit}>
            Enviar denúncia
          </Button>

          {error && <span className={styles.error}>{error}</span>}
        </form>
      </Card>
    </div>
  );
}
