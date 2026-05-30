# Cidade em Foco

**Cidade em Foco** é um web app mobile-first desenvolvido como atividade extensionista para mapear ocorrências sanitárias e urbanas da comunidade, como focos de dengue, lixo acumulado, esgoto a céu aberto, mato alto, entulho, bueiros entupidos e outros riscos urbanos.

O projeto permite que qualquer morador registre uma ocorrência com foto e localização, acompanhe os registros em mapa/lista/dashboard e participe da resolução colaborativa. A área administrativa é restrita a administradores e serve para moderar ocorrências falsas, duplicadas, inadequadas ou resoluções contestadas pela comunidade.

## Objetivo

Criar uma ferramenta comunitária simples, acessível e visual para organizar informações sobre problemas urbanos e sanitários, apoiando conscientização local, análise de áreas críticas e possível encaminhamento dos dados a canais oficiais.

O sistema **não substitui canais oficiais da prefeitura**, serviços de emergência ou órgãos públicos. Ele atua como ferramenta acadêmica e comunitária de apoio à organização das informações.

## ODS relacionadas

- **ODS 03 — Saúde e bem-estar:** identificação de focos de dengue e riscos sanitários.
- **ODS 06 — Água potável e saneamento:** registro de esgoto a céu aberto, água parada e descarte irregular.
- **ODS 11 — Cidades e comunidades sustentáveis:** visualização de áreas críticas e apoio à melhoria urbana.
- **ODS 17 — Parcerias e meios de implementação:** geração de dados que podem ser compartilhados com comunidade, escola, prefeitura ou órgãos responsáveis.

## Funcionalidades

### Área pública

- Registro de ocorrência sem login.
- Foto obrigatória da ocorrência.
- Localização obrigatória por GPS ou pin manual no mapa.
- Lista pública de ocorrências.
- Mapa interativo com pins.
- Mapa de calor para visualizar regiões críticas.
- Detalhe da ocorrência com foto, descrição, status, localização e progresso de resolução.
- Envio de confirmação de resolução com foto obrigatória.
- Resolução automática com 3 confirmações diferentes.
- Denúncia de ocorrência falsa, duplicada, inadequada ou incorreta.
- Denúncia de fotos de resolução.

### Área administrativa

- Login com Supabase Auth.
- Proteção de rotas administrativas.
- Dashboard com indicadores.
- Visualização de ocorrências em revisão.
- Visualização de resoluções em revisão.
- Manter ocorrência.
- Cancelar ocorrência.
- Marcar ocorrência como duplicada.
- Manter resolução.
- Cancelar resolução.

## Regras comunitárias

- Usuário comum não precisa de cadastro.
- Cada navegador recebe um identificador anônimo salvo localmente.
- O identificador é usado apenas para evitar votos/denúncias duplicados na mesma ocorrência.
- Uma ocorrência é marcada como resolvida quando recebe 3 confirmações diferentes com foto.
- Uma ocorrência com 3 denúncias entra em revisão administrativa.
- Uma resolução com 3 denúncias entra em revisão administrativa.
- O administrador decide se mantém, cancela ou marca como duplicado.

## Privacidade e LGPD

O app não solicita nome, CPF, telefone ou e-mail do usuário comum. Para evitar votos duplicados, é usado apenas um identificador anônimo salvo no navegador.

As fotos enviadas devem focar somente no problema urbano ou sanitário. O usuário deve evitar imagens com rostos, placas de veículos, documentos, fachadas identificáveis ou outros dados pessoais desnecessários.

## Tecnologias

- React
- Vite
- TypeScript
- CSS Modules
- React Router DOM
- Leaflet
- React Leaflet
- Supabase Auth
- Supabase Database
- Supabase Storage

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

Dependências necessárias do projeto:

```bash
npm install react-router-dom leaflet react-leaflet @supabase/supabase-js
npm install -D @types/leaflet
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` com base no `.env.example`:

```env
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-anon-public"
```

### 3. Rodar o projeto

```bash
npm run dev
```

## Configuração do Supabase

### 1. Criar o banco

No Supabase, abra o **SQL Editor** e execute o arquivo:

```txt
supabase/schema.sql
```

Esse script cria as tabelas, status, índices, triggers, RLS, RPCs de moderação e bucket de fotos.

### 2. Criar o primeiro administrador

1. Acesse **Authentication > Users** no Supabase.
2. Crie um usuário com e-mail e senha.
3. Copie o ID do usuário criado.
4. Abra o arquivo:

```txt
supabase/admin-setup.sql
```

5. Substitua `COLE_AQUI_O_ID_DO_USUARIO_AUTH` pelo ID do usuário.
6. Execute o script no SQL Editor.

## Estrutura principal

```txt
src/
  components/
    auth/
    layout/
    map/
    occurrences/
    ui/
  pages/
    About/
    AdminDashboard/
    AdminLogin/
    AdminModeration/
    Home/
    MapPage/
    NewOccurrence/
    OccurrenceDetails/
    OccurrencesList/
    ReportOccurrence/
    ReportResolution/
    ResolveOccurrence/
  services/
    supabase/
  types/
  utils/
supabase/
  schema.sql
  admin-setup.sql
docs/
  checklist-entrega.md
  roteiro-video.md
```

## Sugestão de roteiro para demonstração

1. Apresentar a Home e os indicadores.
2. Registrar uma ocorrência com foto e pin no mapa.
3. Mostrar a ocorrência na lista.
4. Mostrar a ocorrência no mapa com pin.
5. Abrir o detalhe da ocorrência.
6. Enviar uma confirmação de resolução com foto.
7. Mostrar o progresso de resolução.
8. Denunciar ocorrência ou resolução.
9. Entrar no painel admin.
10. Moderar um item em revisão.
11. Mostrar o mapa de calor.
12. Encerrar explicando ODS e impacto comunitário.

## Padrão de commits utilizado

```bash
chore: setup initial mobile-first app structure
feat: build mocked MVP navigation flow
feat: add local occurrence creation flow
feat: add interactive Leaflet map
feat: add map pin picker to occurrence form
feat: add local moderation and resolution reports
feat: add Supabase database schema
feat: configure Supabase client and services
feat: integrate occurrences with Supabase
feat: add admin authentication
feat: add dashboard metrics and heatmap
docs: add final project documentation
```

## Status do MVP

- [x] Interface mobile-first
- [x] Cadastro de ocorrência
- [x] Upload de foto
- [x] Localização por GPS ou pin manual
- [x] Lista de ocorrências
- [x] Detalhe da ocorrência
- [x] Mapa com pins
- [x] Mapa de calor
- [x] Resolução colaborativa
- [x] Denúncias públicas
- [x] Admin com login
- [x] Moderação administrativa
- [x] Supabase integrado
- [x] Documentação inicial

## Observação acadêmica

Este projeto foi desenvolvido com finalidade educacional e extensionista, buscando aplicar tecnologia web na organização de informações comunitárias relacionadas à saúde pública, saneamento e qualidade urbana.
