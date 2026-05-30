import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

import styles from './styles.module.css';

const odsItems = [
  {
    id: '03',
    title: 'Saúde e bem-estar',
    text: 'Apoia a identificação de focos de dengue e riscos sanitários que podem afetar a saúde da comunidade.',
  },
  {
    id: '06',
    title: 'Água potável e saneamento',
    text: 'Permite registrar situações ligadas a esgoto a céu aberto, água parada, descarte irregular e saneamento urbano.',
  },
  {
    id: '11',
    title: 'Cidades e comunidades sustentáveis',
    text: 'Organiza dados comunitários para visualizar áreas críticas e apoiar ações de melhoria urbana.',
  },
  {
    id: '17',
    title: 'Parcerias e meios de implementação',
    text: 'Gera informações que podem ser compartilhadas com comunidade, escola, prefeitura ou órgãos responsáveis.',
  },
];

const steps = [
  'O morador registra uma ocorrência com categoria, descrição, foto e localização.',
  'A ocorrência aparece na lista pública, no mapa com pins e no mapa de calor.',
  'A comunidade pode enviar fotos de resolução, denunciar registros falsos ou contestar resoluções incorretas.',
  'Após 3 confirmações diferentes com foto, a ocorrência é marcada como resolvida pela comunidade.',
  'O administrador modera casos denunciados, duplicados ou inadequados.',
];

export function About() {
  return (
    <div className="page stack">
      <PageHeader
        eyebrow="Sobre o projeto"
        title="Tecnologia simples para mapear problemas reais"
        description="O Cidade em Foco é uma atividade extensionista desenvolvida para apoiar o registro comunitário de riscos sanitários e urbanos por meio de um web app responsivo."
        action={<Button to="/occurrences/new">Registrar ocorrência</Button>}
      />

      <Card>
        <div className={styles.content}>
          <span className={styles.kicker}>Objetivo geral</span>
          <h2>Mapeamento comunitário com foto e localização</h2>
          <p>
            O objetivo do projeto é permitir que moradores registrem ocorrências como focos de dengue,
            lixo acumulado, esgoto a céu aberto, mato alto, entulho, bueiros entupidos e outros problemas
            urbanos que possam afetar a saúde pública, o saneamento e a qualidade de vida da comunidade.
          </p>
          <p>
            As informações são exibidas em lista, mapa interativo, dashboard e mapa de calor, facilitando a
            identificação de regiões com maior concentração de problemas e apoiando ações de conscientização
            ou encaminhamento aos canais oficiais.
          </p>
        </div>
      </Card>

      <section className={styles.grid}>
        {odsItems.map((item) => (
          <Card key={item.id}>
            <div className={styles.odsCard}>
              <strong>ODS {item.id}</strong>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </Card>
        ))}
      </section>

      <Card>
        <div className={styles.content}>
          <span className={styles.kicker}>Como funciona</span>
          <h2>Fluxo comunitário sem login para o usuário comum</h2>
          <ol className={styles.steps}>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </Card>

      <section className={styles.grid}>
        <Card>
          <div className={styles.content}>
            <span className={styles.kicker}>Privacidade</span>
            <h2>Cuidados com dados pessoais</h2>
            <p>
              O usuário comum não precisa criar conta e não precisa informar nome, CPF, telefone ou e-mail.
              Para evitar duplicidade de votos, o app utiliza apenas um identificador anônimo salvo no navegador.
            </p>
            <p>
              As fotos devem focar exclusivamente no problema urbano registrado, evitando rostos, placas de
              veículos, documentos, fachadas identificáveis ou qualquer dado pessoal desnecessário.
            </p>
          </div>
        </Card>

        <Card>
          <div className={styles.content}>
            <span className={styles.kicker}>Limite do projeto</span>
            <h2>Ferramenta de apoio comunitário</h2>
            <p>
              Este aplicativo não substitui os canais oficiais da prefeitura, serviços de emergência ou órgãos
              públicos responsáveis. O sistema organiza informações comunitárias para apoiar visualizações,
              relatórios, conscientização e possíveis encaminhamentos.
            </p>
            <p>
              Casos urgentes, situações de risco imediato ou problemas que exijam intervenção oficial devem ser
              comunicados diretamente aos canais competentes do município.
            </p>
          </div>
        </Card>
      </section>

      <Card>
        <div className={styles.callout}>
          <div>
            <span className={styles.kicker}>Participação cidadã</span>
            <h2>Ajude a melhorar o mapa da comunidade</h2>
            <p>
              Registre ocorrências reais, evite duplicidades e envie fotos claras. O valor do projeto está na
              colaboração responsável entre moradores e na organização dos dados gerados pela própria comunidade.
            </p>
          </div>
          <Button to="/map" variant="secondary">Ver mapa</Button>
        </div>
      </Card>
    </div>
  );
}
