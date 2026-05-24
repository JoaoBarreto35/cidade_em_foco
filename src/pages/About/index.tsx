import { PageHeader } from '../../components/layout/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import styles from './styles.module.css';

export function About() {
  return (
    <div className="page section">
      <PageHeader
        eyebrow="Sobre"
        title="Tecnologia a favor da comunidade"
        description="O Cidade em Foco é uma proposta acadêmica e comunitária para mapear riscos sanitários e urbanos com participação cidadã."
      />

      <Card className={styles.card}>
        <h2>Objetivo</h2>
        <p>
          Facilitar o registro de focos de dengue, lixo acumulado, esgoto a céu aberto, mato alto, entulho e outros problemas que afetam saúde, saneamento e qualidade de vida.
        </p>
      </Card>

      <Card className={styles.card}>
        <h2>ODS relacionadas</h2>
        <div className={styles.badges}>
          <Badge tone="success">ODS 3 Saúde e bem-estar</Badge>
          <Badge tone="info">ODS 6 Água e saneamento</Badge>
          <Badge tone="success">ODS 11 Cidades sustentáveis</Badge>
          <Badge tone="neutral">ODS 17 Parcerias</Badge>
        </div>
      </Card>

      <Card className={styles.card}>
        <h2>Privacidade</h2>
        <p>
          O app não solicita cadastro para usuários comuns. Para evitar votos duplicados, será usado apenas um identificador anônimo no navegador. As fotos devem evitar rostos, placas e dados pessoais.
        </p>
      </Card>

      <Card className={styles.card}>
        <h2>Aviso importante</h2>
        <p>
          O sistema não substitui canais oficiais da prefeitura. Ele funciona como ferramenta comunitária de organização, visualização e apoio à conscientização.
        </p>
      </Card>
    </div>
  );
}
