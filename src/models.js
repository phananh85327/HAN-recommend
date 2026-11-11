// Grouping and labels for the models the API serves (GET /api/models). The default served list is
// HAN and metapath2vec on one automatic, one manual and one random path set at 6 and at 4 paths, plus
// GAT; grouping by the number of paths gives exactly the lists of recommend_6path.bat and
// recommend_4path.bat in HAN-improve.

const FAMILY_ORDER = { HAN: 0, metapath2vec: 1, GAT: 2, popularity: 3 }
const KIND_ORDER = { 'automatic (LMSPS)': 0, manual: 1, random: 2, other: 3, none: 4 }
const KIND_LABEL = { 'automatic (LMSPS)': 'automatic (LMSPS)', none: 'no meta-paths' }

export function sortModels(models) {
  return [...models].sort((a, b) =>
    (FAMILY_ORDER[a.model] ?? 9) - (FAMILY_ORDER[b.model] ?? 9) ||
    (KIND_ORDER[a.kind] ?? 9) - (KIND_ORDER[b.kind] ?? 9) ||
    a.name.localeCompare(b.name))
}

/** The path-set sizes among the served models, largest first. */
export function sizes(models) {
  return [...new Set(models.map(m => m.paths.length).filter(n => n > 0))].sort((a, b) => b - a)
}

/** The models of one size, plus every model without meta-paths (GAT, popularity). */
export function modelsForSize(models, size) {
  return sortModels(models.filter(m => m.paths.length === size || m.paths.length === 0))
}

/** "amazon_lp_v3_f6_a1" -> "v3_f6_a1"; "" for models without a path set. */
export function shortArch(arch) {
  return !arch || arch === '-' ? '' : arch.replace(/^amazon_lp_/, '')
}

export function kindLabel(kind) {
  return KIND_LABEL[kind] ?? kind
}

/** One line naming a model, e.g. "HAN, manual (manual_6)". */
export function modelLabel(m) {
  const arch = shortArch(m.arch)
  return `${m.model}, ${kindLabel(m.kind)}${arch ? ` (${arch})` : ''}`
}

/** Popularity's product embedding is a single number, so the API refuses "similar products" for it. */
export function canFindSimilar(m) {
  return m.model !== 'popularity'
}
