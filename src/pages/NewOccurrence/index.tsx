import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '../../components/layout/PageHeader';
import { LocationPicker } from '../../components/map/LocationPicker';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { createOccurrence } from '../../services/occurrencesLocalService';
import { occurrenceCategories } from '../../utils/categories';
import { getVisitorId } from '../../utils/visitorId';

import styles from './styles.module.css';

type Coordinates = {
  latitude: number;
  longitude: number;
};

const DEFAULT_MANUAL_LOCATION: Coordinates = {
  latitude: -23.3053,
  longitude: -45.9658,
};

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

export function NewOccurrence() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState('');

  const isValid = Boolean(
    category && description.trim().length >= 10 && photoUrl && coordinates,
  );

  async function handlePhotoChange(fileList: FileList | null): Promise<void> {
    const file = fileList?.[0];

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readImageAsDataUrl(file);
      setPhotoUrl(dataUrl);
      setError('');
    } catch {
      setError('Não foi possível carregar a foto. Tente outra imagem.');
    }
  }

  function handleLocation(): void {
    setLoadingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setCoordinates(DEFAULT_MANUAL_LOCATION);
      setError('Seu navegador não liberou GPS. Marque o ponto manualmente no mapa.');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      () => {
        setCoordinates(DEFAULT_MANUAL_LOCATION);
        setError('Não conseguimos acessar o GPS. Marque ou ajuste o ponto manualmente no mapa.');
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  function handleSubmit(): void {
    if (!isValid || !coordinates) {
      setError('Preencha categoria, descrição, foto e localização para continuar.');
      return;
    }

    const occurrence = createOccurrence({
      category,
      description: description.trim(),
      photoUrl,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      reference: reference.trim() || 'Referência não informada',
      neighborhood: neighborhood.trim() || 'Não informado',
      anonymousAuthorId: getVisitorId(),
    });

    navigate(`/occurrences/${occurrence.id}`);
  }

  return (
    <div className="page stack">
      <PageHeader
        eyebrow="Nova ocorrência"
        title="Registre um problema urbano"
        description="Envie uma foto e informe a localização para ajudar a comunidade a mapear pontos críticos."
      />

      <Card>
        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <div className="formField">
            <label>Categoria</label>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">Selecione uma categoria</option>
              {occurrenceCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.icon} {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="formField">
            <label>Descrição</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ex: água parada em terreno próximo à calçada..."
            />
          </div>

          <div className={styles.uploadBox}>
            <strong>Foto obrigatória</strong>
            <p>Evite rostos, placas de veículos e dados pessoais.</p>
            <label className={styles.fileButton}>
              📷 Enviar foto
              <input
                accept="image/*"
                type="file"
                onChange={(event) => void handlePhotoChange(event.target.files)}
              />
            </label>
            {photoUrl && <img src={photoUrl} alt="Prévia da ocorrência" className={styles.preview} />}
          </div>

          <div className={styles.uploadBox}>
            <strong>Localização obrigatória</strong>
            <p>
              Use o GPS para aproximar o local e toque no mapa para ajustar o pin exatamente onde
              está o problema.
            </p>
            <button type="button" onClick={handleLocation} disabled={loadingLocation}>
              {coordinates ? '✅ Atualizar pelo GPS' : '📍 Usar minha localização'}
            </button>
            {loadingLocation && <span className={styles.validation}>Buscando localização...</span>}

            <div className={styles.mapPickerArea}>
              <LocationPicker value={coordinates} onChange={setCoordinates} height="compact" />
            </div>

            {coordinates ? (
              <span className={styles.validation}>
                Pin selecionado: Lat {coordinates.latitude.toFixed(5)} • Long{' '}
                {coordinates.longitude.toFixed(5)}
              </span>
            ) : (
              <span className={styles.validation}>Toque no mapa ou use o GPS para definir o ponto.</span>
            )}
          </div>

          <div className="formField">
            <label>Bairro opcional</label>
            <input
              value={neighborhood}
              onChange={(event) => setNeighborhood(event.target.value)}
              placeholder="Ex: Centro, Jardim das Flores..."
            />
          </div>

          <div className="formField">
            <label>Referência opcional</label>
            <input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="Ex: perto da escola, praça, mercado..."
            />
          </div>

          <Button type="button" fullWidth disabled={!isValid} onClick={handleSubmit}>
            Enviar ocorrência
          </Button>

          {!isValid && (
            <span className={styles.validation}>
              Preencha categoria, descrição, foto e localização para continuar.
            </span>
          )}

          {error && <span className={styles.error}>{error}</span>}
        </form>
      </Card>
    </div>
  );
}
