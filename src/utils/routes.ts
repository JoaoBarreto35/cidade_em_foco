export type PublicRoute = {
  path: string;
  label: string;
  icon: string;
};

export const publicRoutes: PublicRoute[] = [
  { path: '/', label: 'Início', icon: '🏠' },
  { path: '/map', label: 'Mapa', icon: '🗺️' },
  { path: '/occurrences/new', label: 'Registrar', icon: '➕' },
  { path: '/occurrences', label: 'Lista', icon: '📋' },
  { path: '/about', label: 'Sobre', icon: 'ℹ️' },
];
