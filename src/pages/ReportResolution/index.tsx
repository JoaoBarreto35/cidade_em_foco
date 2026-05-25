import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  createResolutionReport,
  getOccurrenceById,
} from '../../services/occurrencesLocalService';
import { formatDate } from '../../utils/formatDate';
import { getVisitorId } from '../../utils/visitorId';

import styles from './styles.module.css';

const reasons = [
  'Foto não mostra o local',
  'O problema ainda existe',
  'Foto antiga ou falsa',
  'Imagem inadequada',
  'Outro motivo',
];

export function ReportResolution() {
  const { id, resolutionId } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState(reasons[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const occurrence = id ? getOccurrenceById(id) : undefined;
  const resolutionVote = occurrence?.resolutionVotes.find((vote) => vote.id === resolutionId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!occurrence || !resolutionVote) {
      setError('Resolução não encontrada.');
      return;
    }

    const result = createResolutionReport({
      occurrenceId: occurrence.id,
      resolutionVoteId: resolutionVote.id,
      anonymousVisitorId: getVisitorId(),
    });

    if (result.error) {
      setError(result.error);
      setSuccess('');
      return;
    }

    setError('');
    setSuccess(
      `Denúncia enviada por: ${reason}${note.trim() ? ` — ${note.trim()}` : ''}.`,
    );

    window.setTimeout(() => {
      navigate(`/occurrences/${occurrence.id}`);
    }, 900);
  }

  if (!occurrence || !resolutionVote) {
    return (
      <EmptyState
        title="Resolução não encontrada"
        description="A foto de resolução solicitada não existe ou já foi removida."
        actionLabel="Voltar para lista"
        actionTo="/occurrences"
      />
    );
  }

  return (
    <div className="page stack">
      <PageHeader
        eyebrow="Denúncia comunitária"
        title="Denunciar resolução"
        description="Use esta opção quando a foto enviada não comprovar que o problema foi resolvido."
      />

      <Card className={styles.photoCard}>
        <img src={resolutionVote.photoUrl} alt="Foto de resolução denunciada" />
      </Card>

      <Card>
        <div className={styles.summary}>
          <strong>{occurrence.title}</strong>
          <span>Enviada em {formatDate(resolutionVote.createdAt)}</span>
          <span>{resolutionVote.reportsCount} denúncia(s) nesta resolução</span>
        </div>
      </Card>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Card className={styles.cardForm}>
          <label className={styles.label} htmlFor="reason">
            Motivo da denúncia
          </label>
          <select
            id="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className={styles.field}
          >
            {reasons.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label className={styles.label} htmlFor="note">
            Observação opcional
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className={styles.textarea}
            placeholder="Explique rapidamente, se quiser."
          />

          <p className={styles.help}>
            Com 3 denúncias, a resolução entra em revisão administrativa e deixa de contar para
            resolver a ocorrência até ser analisada.
          </p>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <div className={styles.actions}>
            <Button type="submit" fullWidth variant="danger">
              Enviar denúncia
            </Button>
            <Button to={`/occurrences/${occurrence.id}`} fullWidth variant="secondary">
              Voltar
            </Button>
          </div>
        </Card>
      </form>

      <Link to="/about" className={styles.privacyLink}>
        Ver cuidados de privacidade do projeto
      </Link>
    </div>
  );
}
