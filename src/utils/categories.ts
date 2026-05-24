export type OccurrenceCategory = {
  id: string;
  label: string;
  icon: string;
  description: string;
};

export const occurrenceCategories: OccurrenceCategory[] = [
  { id: 'dengue_focus', label: 'Foco de dengue', icon: '🦟', description: 'Água parada, recipientes expostos ou possíveis criadouros.' },
  { id: 'trash', label: 'Lixo acumulado', icon: '🗑️', description: 'Descarte irregular ou acúmulo de resíduos em via pública.' },
  { id: 'open_sewage', label: 'Esgoto a céu aberto', icon: '💧', description: 'Vazamento, mau cheiro ou esgoto exposto.' },
  { id: 'tall_grass', label: 'Mato alto', icon: '🌿', description: 'Vegetação alta em terrenos, calçadas ou áreas públicas.' },
  { id: 'debris', label: 'Entulho', icon: '🧱', description: 'Restos de obra ou materiais abandonados na rua.' },
  { id: 'clogged_drain', label: 'Bueiro entupido', icon: '🕳️', description: 'Bueiro obstruído, com acúmulo de sujeira ou risco de alagamento.' },
  { id: 'abandoned_land', label: 'Terreno abandonado', icon: '🏚️', description: 'Terreno sem manutenção, com risco sanitário ou urbano.' },
  { id: 'other', label: 'Outro risco urbano', icon: '⚠️', description: 'Outros problemas que afetam a comunidade.' },
];

export function getCategoryById(categoryId: string): OccurrenceCategory {
  return occurrenceCategories.find((category) => category.id === categoryId) ?? occurrenceCategories[occurrenceCategories.length - 1];
}
