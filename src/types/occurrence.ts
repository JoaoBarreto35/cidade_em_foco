import type { OccurrenceStatus } from '../utils/statusLabels';
export type ResolutionVote = { id: string; photoUrl: string; note?: string; createdAt: string; reportsCount: number };
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
  createdAt: string;
  resolvedAt?: string;
  resolutionVotes: ResolutionVote[];
};
