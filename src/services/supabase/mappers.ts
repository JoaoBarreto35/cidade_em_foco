import type { Occurrence, ResolutionVote } from '../../types/occurrence';
import type { OccurrenceRow, ResolutionVoteRow } from '../../types/supabase';

type OccurrenceRowWithVotes = OccurrenceRow & {
  resolution_votes?: ResolutionVoteRow[] | null;
};

export function mapResolutionVoteRowToResolutionVote(row: ResolutionVoteRow): ResolutionVote {
  return {
    id: row.id,
    occurrenceId: row.occurrence_id,
    photoUrl: row.photo_url ?? '',
    note: row.note ?? undefined,
    anonymousVisitorId: row.anonymous_visitor_id,
    reportsCount: row.reports_count,
    status: row.status,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at ?? undefined,
    reviewNotes: row.review_notes ?? undefined,
  };
}

export function mapOccurrenceRowToOccurrence(row: OccurrenceRowWithVotes): Occurrence {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description,
    photoUrl: row.photo_url ?? '',
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    reference: row.reference ?? '',
    neighborhood: row.neighborhood ?? 'Não informado',
    status: row.status,
    resolutionVotesCount: row.resolution_votes_count,
    reportsCount: row.reports_count,
    anonymousAuthorId: row.anonymous_author_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at ?? undefined,
    moderatedAt: row.moderated_at ?? undefined,
    moderationNotes: row.moderation_notes ?? undefined,
    resolutionVotes: (row.resolution_votes ?? []).map(mapResolutionVoteRowToResolutionVote),
  };
}
