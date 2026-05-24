const STORAGE_KEY = 'cidade_em_foco_visitor_id';
export function getVisitorId(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  const visitorId = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, visitorId);
  return visitorId;
}
