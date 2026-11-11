// Small text helpers for product details from the API (HAN-improve recommend_api.py: sales_rank,
// avg_rating and reviewers on every product; an older API leaves them out).

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

export { count }
