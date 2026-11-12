import { vi } from 'vitest'

const info = (name, model, kind, arch, paths) => ({
  name, model, kind, arch, paths, seed: 1, test_hit10: 0.6, test_ndcg10: 0.4, val_bpr: 0.28,
})

// What GET /api/models answers, in the API's shape (a mix of sizes, plus GAT and popularity).
export const MODELS = [
  info('gat_union_s1', 'GAT', 'none', '-', []),
  info('han_amazon_lp_manual_5_s1', 'HAN', 'manual', 'amazon_lp_manual_5', ['PP', 'PUP', 'PCP', 'PPUP']),
  info('m2v_amazon_lp_manual_6_s1', 'metapath2vec', 'manual', 'amazon_lp_manual_6', ['PP', 'PUP', 'PCP', 'PPUP', 'PPP', 'PCCCP']),
  info('han_amazon_lp_manual_6_s1', 'HAN', 'manual', 'amazon_lp_manual_6', ['PP', 'PUP', 'PCP', 'PPUP', 'PPP', 'PCCCP']),
  info('han_amazon_lp_v3_f6_a1_s1', 'HAN', 'automatic (LMSPS)', 'amazon_lp_v3_f6_a1', ['PCCP', 'PCCPP', 'PPCCPP', 'PPUP', 'PUPPUP', 'PUPUP']),
  info('popularity_s1', 'popularity', 'none', '-', []),
]

// a product as an older API sends it (no details, no category) ...
export const product = (asin, title, group = 'Book') => ({ asin, title, group })

// ... and as the current one does, with its first category path
export const productWithCategory = (asin, title, group = 'Book', category = null) => ({
  ...product(asin, title, group), sales_rank: 1000, avg_rating: 4.5, reviewers: 30, category,
})

export function items(...products) {
  return products.map((p, i) => ({ rank: i + 1, ...p, score: 1 - i / 10 }))
}

/** Replaces fetch with a router over `routes` ([regex on the path, (url, match) => [status, body]]),
 *  answering /api/health and /api/models from MODELS unless a route says otherwise. Returns the
 *  URLs fetched. */
export function mockApi(routes = []) {
  const calls = []
  const all = [
    ...routes,
    [/^\/api\/health$/, () => [200, { status: 'ok', models: MODELS.length, products: 48883, users: 53569 }]],
    [/^\/api\/models$/, () => [200, { models: MODELS }]],
  ]
  vi.stubGlobal('fetch', vi.fn(async input => {
    const url = new URL(String(input), 'http://localhost')
    calls.push(url)
    for (const [pattern, handler] of all) {
      const match = url.pathname.match(pattern)
      if (match) {
        const [status, body] = handler(url, match)
        return { ok: status >= 200 && status < 300, status, json: async () => body }
      }
    }
    return { ok: false, status: 404, json: async () => ({ error: `no mock for ${url.pathname}` }) }
  }))
  return calls
}
