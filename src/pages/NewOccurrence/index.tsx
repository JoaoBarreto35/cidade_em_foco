import { useState } from 'react';

import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { occurrenceCategories } from '../../utils/categories';
import styles from './styles.module.css';

type FormState = {
  category: string;
  description: string;
  reference: string;
};

export function NewOccurrence() {
  const [formState, setFormState] = useState<FormState>({ category: '', description: '', reference: '' });
  const [hasLocation, setHasLocation] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setFormState((currentState) => ({ ...currentState, [field]: value }));
  }

  return (
    <div className="page section">
      <PageHeader
        eyebrow="Novo registro"
        title="Registrar ocorrência"
        description="Envie uma foto e marque a localização para ajudar a comunidade a visualizar o problema."
      />

      <Card>
        <form className={styles.form}>
          <label className={styles.field}>
            <span>Categoria</span>
            <select value={formState.category} onChange={(event) => updateField('category', event.target.value)}>
              <option value="">Selecione uma categoria</option>
              {occurrenceCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Descrição</span>
            <textarea
              value={formState.description}
              placeholder="Ex: água parada em recipientes no terreno..."
              rows={5}
              onChange={(event) => updateField('description', event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Referência opcional</span>
            <input
              value={formState.reference}
              placeholder="Ex: próximo à escola, praça, ponto de ônibus..."
              onChange={(event) => updateField('reference', event.target.value)}
            />
          </label>

          <button className={styles.uploadBox} type="button" onClick={() => setHasPhoto(true)}>
            <strong>{hasPhoto ? 'Foto adicionada' : 'Adicionar foto obrigatória'}</strong>
            <small>Na integração real, abriremos câmera ou galeria.</small>
          </button>

          <button className={styles.locationBox} type="button" onClick={() => setHasLocation(true)}>
            <strong>{hasLocation ? 'Localização capturada' : 'Usar minha localização'}</strong>
            <small>Também poderemos permitir ajuste manual no mapa.</small>
          </button>

          <p className={styles.privacy}>Evite enviar fotos com rostos, placas de veículos, documentos ou dados pessoais.</p>

          <Button fullWidth>Enviar ocorrência</Button>
        </form>
      </Card>
    </div>
  );
}
