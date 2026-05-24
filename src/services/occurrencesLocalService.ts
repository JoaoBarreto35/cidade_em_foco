import { occurrencesMock } from '../mocks/occurrencesMock';
import type {
  CreateOccurrenceInput,
  CreateOccurrenceReportInput,
  CreateResolutionVoteInput,
  Occurrence,
  ResolutionVote,
} from '../types/occurrence';
import { getCategoryById } from '../utils/categories';

const STORAGE_KEY = 'cidade_em_foco_occurrences_v1';
const REPORTS_KEY = 'cidade_em_foco_occurrence_reports_v1';

type OccurrenceReportRegistry = Record<string, string[]>;

function cloneOccurrences(occurrences: Occurrence[]): Occurrence[] {
  return occurrences.map((occurrence) => ({
    ...occurrence,
    resolutionVotes: occurrence.resolutionVotes.map((vote) => ({ ...vote })),
  }));
}

function saveOccurrences(occurrences: Occurrence[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(occurrences));
}

function readReportsRegistry(): OccurrenceReportRegistry {
  const stored = localStorage.getItem(REPORTS_KEY);

  if (!stored) {
    return {};
  }

  try {
    const parsed = JSON.parse(stored) as OccurrenceReportRegistry;
    return parsed;
  } catch {
    return {};
  }
}

function saveReportsRegistry(registry: OccurrenceReportRegistry): void {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(registry));
}

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function buildTitle(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return category.label;
}

function recalculateOccurrenceStatus(occurrence: Occurrence): Occurrence {
  if (occurrence.status === 'cancelled' || occurrence.status === 'duplicated') {
    return occurrence;
  }

  if (occurrence.reportsCount >= 3) {
    return {
      ...occurrence,
      status: 'under_review',
      updatedAt: new Date().toISOString(),
    };
  }

  const validVotes = occurrence.resolutionVotes.filter((vote) => vote.status === 'valid');
  const resolutionVotesCount = validVotes.length;

  if (resolutionVotesCount >= 3) {
    return {
      ...occurrence,
      status: 'resolved',
      resolutionVotesCount,
      resolvedAt: occurrence.resolvedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  if (resolutionVotesCount > 0) {
    return {
      ...occurrence,
      status: 'resolution_suggested',
      resolutionVotesCount,
      resolvedAt: undefined,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    ...occurrence,
    status: 'open',
    resolutionVotesCount,
    resolvedAt: undefined,
    updatedAt: new Date().toISOString(),
  };
}

export function getOccurrences(): Occurrence[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    const initialData = cloneOccurrences(occurrencesMock);
    saveOccurrences(initialData);
    return initialData;
  }

  try {
    const parsed = JSON.parse(stored) as Occurrence[];
    return parsed;
  } catch {
    const fallbackData = cloneOccurrences(occurrencesMock);
    saveOccurrences(fallbackData);
    return fallbackData;
  }
}

export function getOccurrenceById(id: string): Occurrence | undefined {
  return getOccurrences().find((occurrence) => occurrence.id === id);
}

export function createOccurrence(input: CreateOccurrenceInput): Occurrence {
  const now = new Date().toISOString();

  const occurrence: Occurrence = {
    id: createId('occ'),
    category: input.category,
    title: buildTitle(input.category),
    description: input.description,
    photoUrl: input.photoUrl,
    latitude: input.latitude,
    longitude: input.longitude,
    reference: input.reference,
    neighborhood: input.neighborhood || 'Não informado',
    status: 'open',
    resolutionVotesCount: 0,
    reportsCount: 0,
    anonymousAuthorId: input.anonymousAuthorId,
    createdAt: now,
    updatedAt: now,
    resolutionVotes: [],
  };

  const occurrences = [occurrence, ...getOccurrences()];
  saveOccurrences(occurrences);

  return occurrence;
}

export function createResolutionVote(input: CreateResolutionVoteInput): {
  occurrence?: Occurrence;
  error?: string;
} {
  const occurrences = getOccurrences();
  const occurrence = occurrences.find((item) => item.id === input.occurrenceId);

  if (!occurrence) {
    return { error: 'Ocorrência não encontrada.' };
  }

  const alreadyVoted = occurrence.resolutionVotes.some(
    (vote) => vote.anonymousVisitorId === input.anonymousVisitorId,
  );

  if (alreadyVoted) {
    return { error: 'Este navegador já enviou uma confirmação para esta ocorrência.' };
  }

  const vote: ResolutionVote = {
    id: createId('res'),
    occurrenceId: occurrence.id,
    photoUrl: input.photoUrl,
    note: input.note,
    anonymousVisitorId: input.anonymousVisitorId,
    reportsCount: 0,
    status: 'valid',
    createdAt: new Date().toISOString(),
  };

  const updatedOccurrence = recalculateOccurrenceStatus({
    ...occurrence,
    resolutionVotes: [...occurrence.resolutionVotes, vote],
  });

  saveOccurrences(
    occurrences.map((item) => (item.id === updatedOccurrence.id ? updatedOccurrence : item)),
  );

  return { occurrence: updatedOccurrence };
}

export function createOccurrenceReport(input: CreateOccurrenceReportInput): {
  occurrence?: Occurrence;
  error?: string;
} {
  const registry = readReportsRegistry();
  const reports = registry[input.occurrenceId] ?? [];

  if (reports.includes(input.anonymousVisitorId)) {
    return { error: 'Este navegador já denunciou esta ocorrência.' };
  }

  const occurrences = getOccurrences();
  const occurrence = occurrences.find((item) => item.id === input.occurrenceId);

  if (!occurrence) {
    return { error: 'Ocorrência não encontrada.' };
  }

  const updatedReports = [...reports, input.anonymousVisitorId];
  registry[input.occurrenceId] = updatedReports;
  saveReportsRegistry(registry);

  const updatedOccurrence = recalculateOccurrenceStatus({
    ...occurrence,
    reportsCount: updatedReports.length,
  });

  saveOccurrences(
    occurrences.map((item) => (item.id === updatedOccurrence.id ? updatedOccurrence : item)),
  );

  return { occurrence: updatedOccurrence };
}

export function resetLocalOccurrences(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(REPORTS_KEY);
}
