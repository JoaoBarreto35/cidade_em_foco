import { occurrencesMock } from '../mocks/occurrencesMock';
import type {
  CreateOccurrenceInput,
  CreateOccurrenceReportInput,
  CreateResolutionReportInput,
  CreateResolutionVoteInput,
  Occurrence,
  ResolutionModerationItem,
  ResolutionVote,
} from '../types/occurrence';
import { getCategoryById } from '../utils/categories';

const STORAGE_KEY = 'cidade_em_foco_occurrences_v1';
const OCCURRENCE_REPORTS_KEY = 'cidade_em_foco_occurrence_reports_v1';
const RESOLUTION_REPORTS_KEY = 'cidade_em_foco_resolution_reports_v1';

type ReportRegistry = Record<string, string[]>;

type AdminActionResult = {
  success: boolean;
  error?: string;
};

function cloneOccurrences(occurrences: Occurrence[]): Occurrence[] {
  return occurrences.map((occurrence) => ({
    ...occurrence,
    resolutionVotes: occurrence.resolutionVotes.map((vote) => ({ ...vote })),
  }));
}

function saveOccurrences(occurrences: Occurrence[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(occurrences));
}

function readRegistry(key: string): ReportRegistry {
  const stored = localStorage.getItem(key);

  if (!stored) {
    return {};
  }

  try {
    return JSON.parse(stored) as ReportRegistry;
  } catch {
    return {};
  }
}

function saveRegistry(key: string, registry: ReportRegistry): void {
  localStorage.setItem(key, JSON.stringify(registry));
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
    return {
      ...occurrence,
      resolutionVotesCount: occurrence.resolutionVotes.filter((vote) => vote.status === 'valid').length,
    };
  }

  if (occurrence.reportsCount >= 3) {
    return {
      ...occurrence,
      status: 'under_review',
      resolutionVotesCount: occurrence.resolutionVotes.filter((vote) => vote.status === 'valid').length,
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

function updateOccurrenceInList(
  occurrenceId: string,
  updater: (occurrence: Occurrence) => Occurrence,
): AdminActionResult {
  const occurrences = getOccurrences();
  const occurrence = occurrences.find((item) => item.id === occurrenceId);

  if (!occurrence) {
    return { success: false, error: 'Ocorrência não encontrada.' };
  }

  const updated = updater(occurrence);
  saveOccurrences(occurrences.map((item) => (item.id === occurrenceId ? updated : item)));

  return { success: true };
}

function deleteRegistryEntry(key: string, entryId: string): void {
  const registry = readRegistry(key);
  delete registry[entryId];
  saveRegistry(key, registry);
}

export function getOccurrences(): Occurrence[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    const initialData = cloneOccurrences(occurrencesMock);
    saveOccurrences(initialData);
    return initialData;
  }

  try {
    return JSON.parse(stored) as Occurrence[];
  } catch {
    const fallbackData = cloneOccurrences(occurrencesMock);
    saveOccurrences(fallbackData);
    return fallbackData;
  }
}

export function getOccurrenceById(id: string): Occurrence | undefined {
  return getOccurrences().find((occurrence) => occurrence.id === id);
}

export function getResolutionModerationItems(): ResolutionModerationItem[] {
  return getOccurrences().flatMap((occurrence) =>
    occurrence.resolutionVotes
      .filter((vote) => vote.status === 'under_review' || vote.reportsCount >= 3)
      .map((vote) => ({ occurrence, vote })),
  );
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

  if (occurrence.status === 'cancelled' || occurrence.status === 'duplicated') {
    return { error: 'Esta ocorrência não aceita novas confirmações.' };
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
  const registry = readRegistry(OCCURRENCE_REPORTS_KEY);
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
  saveRegistry(OCCURRENCE_REPORTS_KEY, registry);

  const updatedOccurrence = recalculateOccurrenceStatus({
    ...occurrence,
    reportsCount: updatedReports.length,
  });

  saveOccurrences(
    occurrences.map((item) => (item.id === updatedOccurrence.id ? updatedOccurrence : item)),
  );

  return { occurrence: updatedOccurrence };
}

export function createResolutionReport(input: CreateResolutionReportInput): {
  occurrence?: Occurrence;
  error?: string;
} {
  const registry = readRegistry(RESOLUTION_REPORTS_KEY);
  const reports = registry[input.resolutionVoteId] ?? [];

  if (reports.includes(input.anonymousVisitorId)) {
    return { error: 'Este navegador já denunciou esta resolução.' };
  }

  const occurrences = getOccurrences();
  const occurrence = occurrences.find((item) => item.id === input.occurrenceId);

  if (!occurrence) {
    return { error: 'Ocorrência não encontrada.' };
  }

  const voteExists = occurrence.resolutionVotes.some((vote) => vote.id === input.resolutionVoteId);

  if (!voteExists) {
    return { error: 'Resolução não encontrada.' };
  }

  const updatedReports = [...reports, input.anonymousVisitorId];
  registry[input.resolutionVoteId] = updatedReports;
  saveRegistry(RESOLUTION_REPORTS_KEY, registry);

  const updatedOccurrence = recalculateOccurrenceStatus({
    ...occurrence,
    resolutionVotes: occurrence.resolutionVotes.map((vote) => {
      if (vote.id !== input.resolutionVoteId) {
        return vote;
      }

      return {
        ...vote,
        reportsCount: updatedReports.length,
        status: updatedReports.length >= 3 ? 'under_review' : vote.status,
      };
    }),
  });

  saveOccurrences(
    occurrences.map((item) => (item.id === updatedOccurrence.id ? updatedOccurrence : item)),
  );

  return { occurrence: updatedOccurrence };
}

export function adminKeepOccurrence(occurrenceId: string): AdminActionResult {
  deleteRegistryEntry(OCCURRENCE_REPORTS_KEY, occurrenceId);

  return updateOccurrenceInList(occurrenceId, (occurrence) =>
    recalculateOccurrenceStatus({
      ...occurrence,
      reportsCount: 0,
      moderationNotes: 'Ocorrência mantida após revisão administrativa.',
      moderatedAt: new Date().toISOString(),
    }),
  );
}

export function adminCancelOccurrence(occurrenceId: string): AdminActionResult {
  return updateOccurrenceInList(occurrenceId, (occurrence) => ({
    ...occurrence,
    status: 'cancelled',
    moderatedAt: new Date().toISOString(),
    moderationNotes: 'Ocorrência cancelada pela moderação.',
    updatedAt: new Date().toISOString(),
  }));
}

export function adminMarkOccurrenceAsDuplicated(occurrenceId: string): AdminActionResult {
  return updateOccurrenceInList(occurrenceId, (occurrence) => ({
    ...occurrence,
    status: 'duplicated',
    moderatedAt: new Date().toISOString(),
    moderationNotes: 'Ocorrência marcada como duplicada pela moderação.',
    updatedAt: new Date().toISOString(),
  }));
}

export function adminKeepResolutionVote(
  occurrenceId: string,
  resolutionVoteId: string,
): AdminActionResult {
  deleteRegistryEntry(RESOLUTION_REPORTS_KEY, resolutionVoteId);

  return updateOccurrenceInList(occurrenceId, (occurrence) =>
    recalculateOccurrenceStatus({
      ...occurrence,
      resolutionVotes: occurrence.resolutionVotes.map((vote) =>
        vote.id === resolutionVoteId
          ? {
              ...vote,
              status: 'valid',
              reportsCount: 0,
              reviewedAt: new Date().toISOString(),
              reviewNotes: 'Resolução mantida após revisão administrativa.',
            }
          : vote,
      ),
    }),
  );
}

export function adminCancelResolutionVote(
  occurrenceId: string,
  resolutionVoteId: string,
): AdminActionResult {
  return updateOccurrenceInList(occurrenceId, (occurrence) =>
    recalculateOccurrenceStatus({
      ...occurrence,
      resolutionVotes: occurrence.resolutionVotes.map((vote) =>
        vote.id === resolutionVoteId
          ? {
              ...vote,
              status: 'cancelled',
              reviewedAt: new Date().toISOString(),
              reviewNotes: 'Resolução cancelada pela moderação.',
            }
          : vote,
      ),
    }),
  );
}

export function resetLocalOccurrences(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(OCCURRENCE_REPORTS_KEY);
  localStorage.removeItem(RESOLUTION_REPORTS_KEY);
}
