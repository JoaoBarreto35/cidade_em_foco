import type { Occurrence } from '../types/occurrence';
import { occurrenceCategories } from './categories';
import type { OccurrenceStatus } from './statusLabels';

export type MetricItem = {
  id: string;
  label: string;
  value: number;
  percent: number;
  icon?: string;
};

export type DashboardMetrics = {
  total: number;
  open: number;
  resolutionSuggested: number;
  resolved: number;
  underReview: number;
  cancelledOrDuplicated: number;
  totalResolutionVotes: number;
  totalReports: number;
  resolutionRate: number;
  reviewRate: number;
  byCategory: MetricItem[];
  byNeighborhood: MetricItem[];
  byStatus: MetricItem[];
  criticalOccurrences: Occurrence[];
  recentOccurrences: Occurrence[];
};

const statusLabels: Record<OccurrenceStatus, string> = {
  open: 'Abertas',
  resolution_suggested: 'Resolução sugerida',
  resolved: 'Resolvidas',
  under_review: 'Em revisão',
  cancelled: 'Canceladas',
  duplicated: 'Duplicadas',
};

function calculatePercent(value: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function countBy<T extends string>(values: T[]): Record<T, number> {
  return values.reduce<Record<T, number>>((accumulator, item) => {
    accumulator[item] = (accumulator[item] ?? 0) + 1;
    return accumulator;
  }, {} as Record<T, number>);
}

function sortMetricItems(items: MetricItem[]): MetricItem[] {
  return [...items].sort((first, second) => second.value - first.value || first.label.localeCompare(second.label));
}

export function buildDashboardMetrics(occurrences: Occurrence[]): DashboardMetrics {
  const total = occurrences.length;
  const statusCounts = countBy(occurrences.map((occurrence) => occurrence.status));
  const categoryCounts = countBy(occurrences.map((occurrence) => occurrence.category));
  const neighborhoodCounts = countBy(
    occurrences.map((occurrence) => occurrence.neighborhood.trim() || 'Sem bairro informado'),
  );

  const byCategory = sortMetricItems(
    occurrenceCategories.map((category) => ({
      id: category.id,
      label: category.label,
      icon: category.icon,
      value: categoryCounts[category.id] ?? 0,
      percent: calculatePercent(categoryCounts[category.id] ?? 0, total),
    })),
  ).filter((item) => item.value > 0);

  const byNeighborhood = sortMetricItems(
    Object.entries(neighborhoodCounts).map(([label, value]) => ({
      id: label,
      label,
      value,
      percent: calculatePercent(value, total),
    })),
  ).slice(0, 6);

  const byStatus = sortMetricItems(
    Object.entries(statusLabels).map(([status, label]) => ({
      id: status,
      label,
      value: statusCounts[status as OccurrenceStatus] ?? 0,
      percent: calculatePercent(statusCounts[status as OccurrenceStatus] ?? 0, total),
    })),
  ).filter((item) => item.value > 0);

  const totalResolutionVotes = occurrences.reduce(
    (totalVotes, occurrence) => totalVotes + occurrence.resolutionVotesCount,
    0,
  );

  const totalReports = occurrences.reduce(
    (totalReportsCount, occurrence) =>
      totalReportsCount +
      occurrence.reportsCount +
      occurrence.resolutionVotes.reduce((voteTotal, vote) => voteTotal + vote.reportsCount, 0),
    0,
  );

  const criticalOccurrences = [...occurrences]
    .filter(
      (occurrence) =>
        occurrence.status === 'under_review' ||
        occurrence.reportsCount >= 2 ||
        occurrence.resolutionVotes.some((vote) => vote.status === 'under_review' || vote.reportsCount >= 2),
    )
    .sort((first, second) => second.reportsCount - first.reportsCount)
    .slice(0, 4);

  const recentOccurrences = [...occurrences]
    .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
    .slice(0, 4);

  return {
    total,
    open: statusCounts.open ?? 0,
    resolutionSuggested: statusCounts.resolution_suggested ?? 0,
    resolved: statusCounts.resolved ?? 0,
    underReview: statusCounts.under_review ?? 0,
    cancelledOrDuplicated: (statusCounts.cancelled ?? 0) + (statusCounts.duplicated ?? 0),
    totalResolutionVotes,
    totalReports,
    resolutionRate: calculatePercent(statusCounts.resolved ?? 0, total),
    reviewRate: calculatePercent(statusCounts.under_review ?? 0, total),
    byCategory,
    byNeighborhood,
    byStatus,
    criticalOccurrences,
    recentOccurrences,
  };
}
