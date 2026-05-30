import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  createOccurrenceReportInSupabase,
  getOccurrenceByIdFromSupabase,
} from '../../services/supabase/occurrencesSupabaseService';
import type { Occurrence } from '../../types/occurrence';
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
  const [occurrence, setOccurrence] = useState<Occurrence | undefined>();
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadOccurrence(): Promise<void> {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getOccurrenceByIdFromSupabase(id);

        if (active) {
          setOccurrence(data);
          setError('');
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar a ocorrência.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOccurrence();

    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(): Promise<void> {
    if (!reason) {
      setError('Selecione o motivo da denúncia.');
      return;
    }

    if (!occurrence) {
      setError('Ocorrência não encontrada.');
      return;
    }

    setSubmitting(true);
    setError('');

    const fullReason = note.trim() ? `${reason} — ${note.trim()}` : reason;
    const result = await createOccurrenceReportInSupabase(
      {
        occurrenceId: occurrence.id,
        anonymousVisitorId: getVisitorId(),
      },
      fullReason,
    );

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate(`/occurrences/${occurrence.id}`);
  }

  if (loading) {
    return <Card><p>Carregando ocorrência...</p></Card>;
  }

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

          <Button
            type="button"
            variant="danger"
            fullWidth
            disabled={!reason || submitting}
            onClick={() => void handleSubmit()}
          >
            {submitting ? 'Enviando denúncia...' : 'Enviar denúncia'}
          </Button>

          {error && <span className={styles.error}>{error}</span>}
        </form>
      </Card>
    </div>
  );
}
