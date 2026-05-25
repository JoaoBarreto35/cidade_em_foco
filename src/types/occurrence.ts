import type { OccurrenceStatus } from '../utils/statusLabels';

export type ResolutionVoteStatus = 'valid' | 'under_review' | 'cancelled';

export type ResolutionVote = {
  id: string;
  occurrenceId: string;
  photoUrl: string;
  note?: string;
  anonymousVisitorId: string;
  reportsCount: number;
  status: ResolutionVoteStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
};

export type Occurrence = {
  id: string;
  category: string;
  title: string;
  description: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
  reference: string;
  neighborhood: string;
  status: OccurrenceStatus;
  resolutionVotesCount: number;
  reportsCount: number;
  anonymousAuthorId: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  moderatedAt?: string;
  moderationNotes?: string;
  resolutionVotes: ResolutionVote[];
};

export type CreateOccurrenceInput = {
  category: string;
  description: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
  reference: string;
  neighborhood: string;
  anonymousAuthorId: string;
};

export type CreateResolutionVoteInput = {
  occurrenceId: string;
  photoUrl: string;
  note?: string;
  anonymousVisitorId: string;
};

export type CreateOccurrenceReportInput = {
  occurrenceId: string;
  anonymousVisitorId: string;
};

export type CreateResolutionReportInput = {
  occurrenceId: string;
  resolutionVoteId: string;
  anonymousVisitorId: string;
};

export type ResolutionModerationItem = {
  occurrence: Occurrence;
  vote: ResolutionVote;
};
