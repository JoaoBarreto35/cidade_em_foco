import type {
  CreateOccurrenceInput,
  CreateOccurrenceReportInput,
  CreateResolutionReportInput,
  CreateResolutionVoteInput,
  Occurrence,
} from '../../types/occurrence';
import type { OccurrenceRow, ResolutionVoteRow } from '../../types/supabase';
import { getCategoryById } from '../../utils/categories';
import { supabase } from '../supabaseClient';
import { mapOccurrenceRowToOccurrence } from './mappers';
import { uploadOccurrenceImage } from './storageService';

type ServiceResult<T> = {
  data?: T;
  error?: string;
};

type OccurrenceQueryRow = OccurrenceRow & {
  resolution_votes?: ResolutionVoteRow[] | null;
};

function buildOccurrenceTitle(categoryId: string): string {
  return getCategoryById(categoryId).label;
}

function normalizeDatabaseError(errorMessage: string): string {
  if (errorMessage.includes('duplicate key')) {
    return 'Este navegador já realizou esta ação.';
  }

  return errorMessage;
}

async function getResolutionVotesByOccurrenceIds(
  occurrenceIds: string[],
): Promise<Map<string, ResolutionVoteRow[]>> {
  const votesByOccurrenceId = new Map<string, ResolutionVoteRow[]>();

  if (occurrenceIds.length === 0) {
    return votesByOccurrenceId;
  }

  const { data, error } = await supabase
    .from('resolution_votes')
    .select('*')
    .in('occurrence_id', occurrenceIds)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  (data ?? []).forEach((vote) => {
    const currentVotes = votesByOccurrenceId.get(vote.occurrence_id) ?? [];
    votesByOccurrenceId.set(vote.occurrence_id, [...currentVotes, vote]);
  });

  return votesByOccurrenceId;
}

function attachVotesToOccurrenceRows(
  occurrenceRows: OccurrenceRow[],
  votesByOccurrenceId: Map<string, ResolutionVoteRow[]>,
): OccurrenceQueryRow[] {
  return occurrenceRows.map((occurrence) => ({
    ...occurrence,
    resolution_votes: votesByOccurrenceId.get(occurrence.id) ?? [],
  }));
}

export async function getOccurrencesFromSupabase(): Promise<Occurrence[]> {
  const { data, error } = await supabase
    .from('occurrences')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const occurrenceRows = data ?? [];
  const votesByOccurrenceId = await getResolutionVotesByOccurrenceIds(
    occurrenceRows.map((occurrence) => occurrence.id),
  );

  return attachVotesToOccurrenceRows(occurrenceRows, votesByOccurrenceId).map(
    mapOccurrenceRowToOccurrence,
  );
}

export async function getOccurrenceByIdFromSupabase(id: string): Promise<Occurrence | undefined> {
  const { data, error } = await supabase.from('occurrences').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return undefined;
  }

  const votesByOccurrenceId = await getResolutionVotesByOccurrenceIds([data.id]);
  const occurrenceWithVotes: OccurrenceQueryRow = {
    ...data,
    resolution_votes: votesByOccurrenceId.get(data.id) ?? [],
  };

  return mapOccurrenceRowToOccurrence(occurrenceWithVotes);
}

export async function createOccurrenceInSupabase(
  input: CreateOccurrenceInput,
  photoFile: File,
): Promise<ServiceResult<Occurrence>> {
  try {
    const uploadedImage = await uploadOccurrenceImage(photoFile, 'occurrences');

    const { data, error } = await supabase
      .from('occurrences')
      .insert({
        category: input.category,
        title: buildOccurrenceTitle(input.category),
        description: input.description,
        photo_path: uploadedImage.path,
        photo_url: uploadedImage.publicUrl,
        latitude: input.latitude,
        longitude: input.longitude,
        reference: input.reference || null,
        neighborhood: input.neighborhood || null,
        anonymous_author_id: input.anonymousAuthorId,
      })
      .select('*')
      .single();

    if (error) {
      return { error: normalizeDatabaseError(error.message) };
    }

    return {
      data: mapOccurrenceRowToOccurrence({
        ...data,
        resolution_votes: [],
      }),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Não foi possível cadastrar a ocorrência.',
    };
  }
}

export async function createResolutionVoteInSupabase(
  input: CreateResolutionVoteInput,
  photoFile: File,
): Promise<ServiceResult<Occurrence>> {
  try {
    const uploadedImage = await uploadOccurrenceImage(photoFile, 'resolutions');

    const { error } = await supabase.from('resolution_votes').insert({
      occurrence_id: input.occurrenceId,
      photo_path: uploadedImage.path,
      photo_url: uploadedImage.publicUrl,
      note: input.note ?? null,
      anonymous_visitor_id: input.anonymousVisitorId,
    });

    if (error) {
      return { error: normalizeDatabaseError(error.message) };
    }

    const occurrence = await getOccurrenceByIdFromSupabase(input.occurrenceId);

    return { data: occurrence };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Não foi possível enviar a resolução.',
    };
  }
}

export async function createOccurrenceReportInSupabase(
  input: CreateOccurrenceReportInput,
  reason = 'Ocorrência denunciada pela comunidade.',
): Promise<ServiceResult<Occurrence>> {
  const { error } = await supabase.from('occurrence_reports').insert({
    occurrence_id: input.occurrenceId,
    reason,
    anonymous_visitor_id: input.anonymousVisitorId,
  });

  if (error) {
    return { error: normalizeDatabaseError(error.message) };
  }

  const occurrence = await getOccurrenceByIdFromSupabase(input.occurrenceId);

  return { data: occurrence };
}

export async function createResolutionReportInSupabase(
  input: CreateResolutionReportInput,
  reason = 'Resolução denunciada pela comunidade.',
): Promise<ServiceResult<Occurrence>> {
  const { error } = await supabase.from('resolution_reports').insert({
    resolution_vote_id: input.resolutionVoteId,
    reason,
    anonymous_visitor_id: input.anonymousVisitorId,
  });

  if (error) {
    return { error: normalizeDatabaseError(error.message) };
  }

  const occurrence = await getOccurrenceByIdFromSupabase(input.occurrenceId);

  return { data: occurrence };
}
