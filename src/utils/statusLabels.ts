export type OccurrenceStatus = 'open' | 'resolution_suggested' | 'resolved' | 'under_review' | 'cancelled' | 'duplicated';
export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type StatusInfo = { label: string; tone: StatusTone };
export const statusLabels: Record<OccurrenceStatus, StatusInfo> = {
  open: { label: 'Aberta', tone: 'info' },
  resolution_suggested: { label: 'Resolução sugerida', tone: 'warning' },
  resolved: { label: 'Resolvida pela comunidade', tone: 'success' },
  under_review: { label: 'Em revisão', tone: 'warning' },
  cancelled: { label: 'Cancelada', tone: 'danger' },
  duplicated: { label: 'Duplicada', tone: 'neutral' },
};
export function getStatusInfo(status: OccurrenceStatus): StatusInfo { return statusLabels[status]; }
