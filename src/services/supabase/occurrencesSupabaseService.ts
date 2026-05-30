import type {
  CreateOccurrenceInput,
  CreateOccurrenceReportInput,
  CreateResolutionReportInput,
  CreateResolutionVoteInput,
  Occurrence,
} from '../../types/occurrence';
import { getCategoryById } from '../../utils/categories';
import { supabase } from '../supabaseClient';
import { mapOccurrenceRowToOccurrence } from './mappers';
import { uploadOccurrenceImage } from './storageService';

type ServiceResult<T> = {
  data?: T;
  error?: string;
};

type OccurrenceQueryRow = Parameters<typeof mapOccurrenceRowToOccurrence>[0];

function buildOccurrenceTitle(categoryId: string): string {
  return getCategoryById(categoryId).label;
}

function normalizeDatabaseError(errorMessage: string): string {
  if (errorMessage.includes('duplicate key')) {
    return 'Este navegador já realizou esta ação.';
  }

  return errorMessage;
}

export async function getOccurrencesFromSupabase(): Promise<Occurrence[]> {
  const { data, error } = await supabase
    .from('occurrences')
    .select('*, resolution_votes(*)')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as OccurrenceQueryRow[]).map(mapOccurrenceRowToOccurrence);
}

export async function getOccurrenceByIdFromSupabase(id: string): Promise<Occurrence | undefined> {
  const { data, error } = await supabase
    .from('occurrences')
    .select('*, resolution_votes(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return undefined;
  }

  return mapOccurrenceRowToOccurrence(data as OccurrenceQueryRow);
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
      .select('*, resolution_votes(*)')
      .single();

    if (error) {
      return { error: normalizeDatabaseError(error.message) };
    }

    return { data: mapOccurrenceRowToOccurrence(data as OccurrenceQueryRow) };
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
