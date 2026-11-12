// Small text helpers for product details from the API (HAN-improve recommend_api.py: sales_rank,
// avg_rating, reviewers and category on every product; an older API leaves them out).

const count = n => n.toLocaleString('en-US')

/** "★ 4.5 · 921 reviewers", or "" when the API sent neither. */
export function productDetails(p) {
  return [
    typeof p.avg_rating === 'number' && `★ ${p.avg_rating.toFixed(1)}`,
    typeof p.reviewers === 'number' && `${count(p.reviewers)} reviewers`,
  ].filter(Boolean).join(' · ')
}

export const DETAILS_TITLE =
  "Amazon's average customer rating (2006 data) and the number of customers in the data who reviewed it"

export const CATEGORY_SEPARATOR = ' › '

/** A category path (a list of names, root first) as text. With `last`, a longer path keeps only
 *  its last `last` names, after "… › ". "" for a missing or empty path. */
export function categoryPath(path, { last } = {}) {
  if (!Array.isArray(path) || path.length === 0) return ''
  const shown = last && path.length > last ? ['…', ...path.slice(-last)] : path
  return shown.join(CATEGORY_SEPARATOR)
}

/** The short form shown in lists: the last 3 levels. */
export const shortCategory = path => categoryPath(path, { last: 3 })

export { count }
