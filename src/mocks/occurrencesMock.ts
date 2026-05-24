import type { OccurrenceStatus } from '../utils/statusLabels';

export type OccurrenceMock = {
  id: string;
  category: string;
  title: string;
  description: string;
  neighborhood: string;
  reference: string;
  status: OccurrenceStatus;
  resolutionVotesCount: number;
  reportsCount: number;
  createdAt: string;
  latitude: number;
  longitude: number;
};

export const occurrencesMock: OccurrenceMock[] = [
  {
    id: '1',
    category: 'dengue_focus',
    title: 'Água parada em terreno',
    description: 'Possível foco de dengue em terreno com recipientes expostos e água parada.',
    neighborhood: 'Centro',
    reference: 'Próximo à praça principal',
    status: 'open',
    resolutionVotesCount: 0,
    reportsCount: 0,
    createdAt: '2026-05-20T10:00:00.000Z',
    latitude: -23.305,
    longitude: -45.965,
  },
  {
    id: '2',
    category: 'trash',
    title: 'Lixo acumulado na calçada',
    description: 'Acúmulo de sacos de lixo e entulho próximo ao ponto de ônibus.',
    neighborhood: 'Jardim Esperança',
    reference: 'Perto do ponto de ônibus',
    status: 'resolution_suggested',
    resolutionVotesCount: 1,
    reportsCount: 0,
    createdAt: '2026-05-21T13:30:00.000Z',
    latitude: -23.307,
    longitude: -45.971,
  },
  {
    id: '3',
    category: 'open_sewage',
    title: 'Esgoto a céu aberto',
    description: 'Vazamento constante de esgoto na via, com mau cheiro e risco sanitário.',
    neighborhood: 'Parque Brasil',
    reference: 'Rua lateral da escola',
    status: 'under_review',
    resolutionVotesCount: 0,
    reportsCount: 3,
    createdAt: '2026-05-22T08:10:00.000Z',
    latitude: -23.31,
    longitude: -45.96,
  },
  {
    id: '4',
    category: 'tall_grass',
    title: 'Mato alto em área pública',
    description: 'Vegetação alta ocupando parte da calçada e dificultando passagem.',
    neighborhood: 'Vila Nova',
    reference: 'Ao lado da quadra',
    status: 'resolved',
    resolutionVotesCount: 3,
    reportsCount: 0,
    createdAt: '2026-05-18T16:45:00.000Z',
    latitude: -23.302,
    longitude: -45.958,
  },
];
