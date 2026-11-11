// Client for the HAN-improve recommendation API (recommend_api.py; its README section
// "Recommendation API" lists the endpoints). In development the requests go to /api on the Vite
// server, which forwards them; VITE_API_BASE points a built copy straight at the API instead.
const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '')

export const OFFLINE_HINT = 'Start recommend_api.bat in the HAN-improve folder, then try again.'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** The query string for `params`, leaving out empty values. URLSearchParams writes "+" as %2B,
 *  which the API needs: a plain "+" in a query means a space. */
export function query(params = {}) {
  const kept = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  const text = new URLSearchParams(kept.map(([k, v]) => [k, String(v)])).toString()
  return text ? `?${text}` : ''
}

async function get(path, params) {
  const url = `${BASE}/api/${path}${query(params)}`
  let res
  try {
    res = await fetch(url)
  } catch {
    throw new ApiError(0, `The recommendation API is not reachable. ${OFFLINE_HINT}`)
  }
  let body = null
  try {
    body = await res.json()
  } catch {
    // not JSON: the dev server's proxy answers this way when the API is down
  }
  if (!res.ok) {
    throw new ApiError(res.status, body?.error ||
      `The recommendation API did not answer (HTTP ${res.status}). ${OFFLINE_HINT}`)
  }
  if (body === null) throw new ApiError(res.status, `Unexpected answer from ${url}`)
  return body
}

const id = value => encodeURIComponent(String(value).trim())

// In the answers below, a product is {asin, title, group, sales_rank, avg_rating, reviewers}. An API
// older than HAN-improve commit 49d41e7 sends only {asin, title, group}; the pages then leave the
// rest out. A recommendation item is a product plus {rank, score}.
export const api = {
  /** {status, models, products, users} */
  health: () => get('health'),
  /** [{name, model, arch, kind, paths, seed, test_hit10, test_ndcg10, val_bpr}] */
  models: () => get('models').then(body => body.models),
  /** {matching, users: [{id, index, reviewed}]} */
  sampleUsers: ({ min, max, limit, seed }) =>
    get('users', { min_reviewed: min, max_reviewed: max, limit, seed }),
  /** {user: {id, index, reviewed}, products: [product]} */
  user: userId => get(`users/${id(userId)}`),
  /** {user, k, exclude_seen, results: [{...model info, items: [item]}]} */
  recommendations: (userId, { models, k, excludeSeen }) =>
    get(`users/${id(userId)}/recommendations`, { models: models.join(','), k, exclude_seen: excludeSeen }),
  /** {products: [product]} */
  searchProducts: (q, limit = 50) => get('products', { q, limit }),
  /** {product, reviewers} */
  product: asin => get(`products/${id(asin)}`),
  /** {product, k, results: [{...model info, items: [item]}]} */
  similar: (asin, { models, k }) => get(`products/${id(asin)}/similar`, { models: models.join(','), k }),
}
