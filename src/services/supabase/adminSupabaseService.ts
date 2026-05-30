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

async function runAdminRpc(
  rpcName:
    | 'admin_keep_occurrence'
    | 'admin_cancel_occurrence'
    | 'admin_mark_occurrence_as_duplicated',
  occurrenceId: string,
  notes: string,
): Promise<AdminActionResult> {
  const { error } = await supabase.rpc(rpcName, {
    target_occurrence_id: occurrenceId,
    target_notes: notes,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

async function runResolutionAdminRpc(
  rpcName: 'admin_keep_resolution_vote' | 'admin_cancel_resolution_vote',
  resolutionVoteId: string,
  notes: string,
): Promise<AdminActionResult> {
  const { error } = await supabase.rpc(rpcName, {
    target_resolution_vote_id: resolutionVoteId,
    target_notes: notes,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export function adminKeepOccurrenceInSupabase(occurrenceId: string): Promise<AdminActionResult> {
  return runAdminRpc(
    'admin_keep_occurrence',
    occurrenceId,
    'Ocorrência mantida após revisão administrativa.',
  );
}

export function adminCancelOccurrenceInSupabase(occurrenceId: string): Promise<AdminActionResult> {
  return runAdminRpc(
    'admin_cancel_occurrence',
    occurrenceId,
    'Ocorrência cancelada pela moderação.',
  );
}

export function adminMarkOccurrenceAsDuplicatedInSupabase(
  occurrenceId: string,
): Promise<AdminActionResult> {
  return runAdminRpc(
    'admin_mark_occurrence_as_duplicated',
    occurrenceId,
    'Ocorrência marcada como duplicada pela moderação.',
  );
}

export function adminKeepResolutionVoteInSupabase(
  resolutionVoteId: string,
): Promise<AdminActionResult> {
  return runResolutionAdminRpc(
    'admin_keep_resolution_vote',
    resolutionVoteId,
    'Resolução mantida após revisão administrativa.',
  );
}

export function adminCancelResolutionVoteInSupabase(
  resolutionVoteId: string): Promise<AdminActionResult> {
  return runResolutionAdminRpc(
    'admin_cancel_resolution_vote',
    resolutionVoteId,
    'Resolução cancelada pela moderação.',
  );
}
