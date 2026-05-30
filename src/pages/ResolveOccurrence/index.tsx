import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  createResolutionVoteInSupabase,
  getOccurrenceByIdFromSupabase,
} from '../../services/supabase/occurrencesSupabaseService';
import type { Occurrence } from '../../types/occurrence';
import { getVisitorId } from '../../utils/visitorId';

import styles from './styles.module.css';

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Não foi possível ler a imagem.'));
    };

    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });
}

export function ResolveOccurrence() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [occurrence, setOccurrence] = useState<Occurrence | undefined>();
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
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

  async function handlePhotoChange(fileList: FileList | null): Promise<void> {
    const file = fileList?.[0];

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readImageAsDataUrl(file);
      setPhotoUrl(dataUrl);
      setPhotoFile(file);
      setError('');
    } catch {
      setError('Não foi possível carregar a foto. Tente outra imagem.');
    }
  }

  async function handleSubmit(): Promise<void> {
    if (!photoFile || !occurrence) {
      setError('Envie uma foto atual para confirmar a resolução.');
      return;
    }

    setSubmitting(true);
    setError('');

    const result = await createResolutionVoteInSupabase(
      {
        occurrenceId: occurrence.id,
        photoUrl: '',
        note: note.trim() || undefined,
        anonymousVisitorId: getVisitorId(),
      },
      photoFile,
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
        description="Não encontramos o registro para enviar uma confirmação."
        actionLabel="Voltar para lista"
        actionTo="/occurrences"
      />
    );
  }

  return (
    <div className="page stack">
      <PageHeader
        eyebrow="Resolução comunitária"
        title="Informar que foi resolvido"
        description={`Envie uma foto atualizada para ${occurrence.title}.`}
      />

      <Card>
        <div className={styles.content}>
          <div className={styles.alert}>
            <strong>Regra da comunidade</strong>
            <p>A ocorrência só fecha com 3 confirmações diferentes, todas com foto obrigatória.</p>
          </div>

          <div className={styles.uploadBox}>
            <strong>Foto atual obrigatória</strong>
            <p>A foto deve mostrar claramente o local após a resolução.</p>
            <label className={styles.fileButton}>
              📷 Enviar foto de resolução
              <input
                accept="image/*"
                type="file"
                onChange={(event) => void handlePhotoChange(event.target.files)}
              />
            </label>
            {photoUrl && <img src={photoUrl} alt="Prévia da resolução" className={styles.preview} />}
          </div>

          <div className="formField">
            <label>Observação opcional</label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ex: local limpo, mato cortado, lixo removido..."
            />
          </div>

          <Button type="button" fullWidth disabled={!photoFile || submitting} onClick={() => void handleSubmit()}>
            {submitting ? 'Salvando no Supabase...' : 'Enviar confirmação'}
          </Button>

          {error && <span className={styles.error}>{error}</span>}
        </div>
      </Card>
    </div>
  );
}
