const VISITOR_ID_KEY = 'cidade_em_foco_visitor_id';

export function getAnonymousVisitorId(): string {
  const currentId = localStorage.getItem(VISITOR_ID_KEY);

  if (currentId) {
    return currentId;
  }

  const newId = crypto.randomUUID();
  localStorage.setItem(VISITOR_ID_KEY, newId);

  return newId;
}
