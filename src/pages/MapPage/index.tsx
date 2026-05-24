import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { OccurrenceCard } from '../../components/occurrences/OccurrenceCard';
import { occurrencesMock } from '../../mocks/occurrencesMock';
import styles from './styles.module.css';
export function MapPage(){return <div className="page stack"><PageHeader eyebrow="Mapa" title="Mapa da comunidade" description="Nesta fase, o mapa ainda está mockado. Na integração real, os pins virão da latitude e longitude." action={<Button to="/occurrences/new">Registrar</Button>}/><Card className={styles.mapMock}><span>🗺️</span><strong>Mapa interativo</strong><p>Próxima fase: Leaflet com pins e mapa de calor.</p></Card><section className="section">{occurrencesMock.slice(0,3).map((occurrence)=><OccurrenceCard key={occurrence.id} occurrence={occurrence}/>)}</section></div>}
