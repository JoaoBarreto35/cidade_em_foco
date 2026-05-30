import type { Occurrence, ResolutionModerationItem } from '../../types/occurrence';
import { supabase } from '../supabaseClient';
import { getOccurrencesFromSupabase } from './occurrencesSupabaseService';

type AdminActionResult = {
  success: boolean;
  error?: string;
};

export async function getResolutionModerationItemsFromSupabase(): Promise<ResolutionModerationItem[]> {
  const occurrences = await getOccurrencesFromSupabase();

  return occurrences.flatMap((occurrence) =>
    occurrence.resolutionVotes
      .filter((vote) => vote.status === 'under_review' || vote.reportsCount >= 3)
      .map((vote) => ({ occurrence, vote })),
  );
}

export async function getOccurrencesUnderReviewFromSupabase(): Promise<Occurrence[]> {
  const occurrences = await getOccurrencesFromSupabase();

  return occurrences.filter((occurrence) => occurrence.status === 'under_review');
}

function formatAdminError(errorMessage: string): AdminActionResult {
  return { success: false, error: errorMessage };
}

export async function adminKeepOccurrenceInSupabase(
  occurrenceId: string,
): Promise<AdminActionResult> {
  const { error } = await supabase.rpc('admin_keep_occurrence', {
    target_occurrence_id: occurrenceId,
    target_notes: 'Ocorrência mantida após revisão administrativa.',
  });

  if (error) {
    return formatAdminError(error.message);
  }

  return { success: true };
}

export async function adminCancelOccurrenceInSupabase(
  occurrenceId: string,
): Promise<AdminActionResult> {
  const { error } = await supabase.rpc('admin_cancel_occurrence', {
    target_occurrence_id: occurrenceId,
    target_notes: 'Ocorrência cancelada pela moderação.',
  });

  if (error) {
    return formatAdminError(error.message);
  }

  return { success: true };
}

export async function adminMarkOccurrenceAsDuplicatedInSupabase(
  occurrenceId: string,
): Promise<AdminActionResult> {
  const { error } = await supabase.rpc('admin_mark_occurrence_as_duplicated', {
    target_occurrence_id: occurrenceId,
    target_notes: 'Ocorrência marcada como duplicada pela moderação.',
  });

  if (error) {
    return formatAdminError(error.message);
  }

  return { success: true };
}

export async function adminKeepResolutionVoteInSupabase(
  resolutionVoteId: string,
): Promise<AdminActionResult> {
  const { error } = await supabase.rpc('admin_keep_resolution_vote', {
    target_resolution_vote_id: resolutionVoteId,
    target_notes: 'Resolução mantida após revisão administrativa.',
  });

  if (error) {
    return formatAdminError(error.message);
  }

  return { success: true };
}

export async function adminCancelResolutionVoteInSupabase(
  resolutionVoteId: string,
): Promise<AdminActionResult> {
  const { error } = await supabase.rpc('admin_cancel_resolution_vote', {
    target_resolution_vote_id: resolutionVoteId,
    target_notes: 'Resolução cancelada pela moderação.',
  });

  if (error) {
    return formatAdminError(error.message);
  }

  return { success: true };
}
