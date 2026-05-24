import { PageHeader } from '../../components/layout/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { occurrencesMock } from '../../mocks/occurrencesMock';
import { occurrenceCategories } from '../../utils/categories';
import styles from './styles.module.css';

export function Home() {
  const totalOccurrences = occurrencesMock.length;
  const resolvedOccurrences = occurrencesMock.filter((occurrence) => occurrence.status === 'resolved').length;
  const reviewOccurrences = occurrencesMock.filter((occurrence) => occurrence.status === 'under_review').length;

  return (
    <div className="page section">
      <PageHeader
        eyebrow="Atividade extensionista"
        title="Mapeie riscos urbanos da sua comunidade"
        description="Registre focos de dengue, lixo, esgoto a céu aberto, mato alto e outros problemas com foto e localização. A comunidade acompanha e confirma quando foi resolvido."
        action={<Button to="/occurrences/new">Registrar ocorrência</Button>}
      />

      <section className={styles.actions}>
        <Button to="/map" fullWidth>
          Ver mapa da cidade
        </Button>
        <Button to="/occurrences" variant="secondary" fullWidth>
          Ver ocorrências
        </Button>
      </section>

      <section className={styles.stats} aria-label="Resumo da comunidade">
        <Card>
          <span className={styles.statValue}>{totalOccurrences}</span>
          <span className={styles.statLabel}>Ocorrências</span>
        </Card>
        <Card>
          <span className={styles.statValue}>{resolvedOccurrences}</span>
          <span className={styles.statLabel}>Resolvidas</span>
        </Card>
        <Card>
          <span className={styles.statValue}>{reviewOccurrences}</span>
          <span className={styles.statLabel}>Em revisão</span>
        </Card>
      </section>

      <section className="section">
        <div className={styles.sectionTitle}>
          <h2>Categorias monitoradas</h2>
          <Badge tone="success">ODS 3, 6, 11 e 17</Badge>
        </div>

        <div className={styles.categories}>
          {occurrenceCategories.slice(0, 6).map((category) => (
            <Card key={category.id} className={styles.categoryCard}>
              <span className={styles.categoryIcon}>{category.icon}</span>
              <strong>{category.label}</strong>
              <p>{category.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <Card className={styles.howItWorks}>
        <h2>Como funciona?</h2>
        <ol>
          <li>Qualquer pessoa registra uma ocorrência com foto e localização.</li>
          <li>A ocorrência aparece na lista e no mapa da comunidade.</li>
          <li>Para resolver, são necessárias 3 confirmações diferentes com foto.</li>
          <li>Denúncias levam itens suspeitos para revisão do administrador.</li>
        </ol>
      </Card>
    </div>
  );
}
