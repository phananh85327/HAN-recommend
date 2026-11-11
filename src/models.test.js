import { describe, expect, it } from 'vitest'
import { canFindSimilar, modelLabel, modelsForSize, shortArch, sizes, sortModels } from './models.js'
import { MODELS } from './test/mockApi.js'

describe('model grouping', () => {
  it('orders HAN, metapath2vec, GAT, popularity, and automatic, manual, random within a model', () => {
    expect(sortModels(MODELS).map(m => m.name)).toEqual([
      'han_amazon_lp_v3_f6_a1_s1', 'han_amazon_lp_manual_5_s1', 'han_amazon_lp_manual_6_s1',
      'm2v_amazon_lp_manual_6_s1', 'gat_union_s1', 'popularity_s1',
    ])
  })

  it('offers each path-set size, largest first', () => {
    expect(sizes(MODELS)).toEqual([6, 4])
  })

  it('puts the models without meta-paths into every size', () => {
    expect(modelsForSize(MODELS, 4).map(m => m.name)).toEqual(['han_amazon_lp_manual_5_s1', 'gat_union_s1', 'popularity_s1'])
    expect(modelsForSize(MODELS, 6)).toHaveLength(5)
  })

  it('labels models', () => {
    expect(shortArch('amazon_lp_v3_f6_a1')).toBe('v3_f6_a1')
    expect(shortArch('-')).toBe('')
    expect(modelLabel(MODELS[0])).toBe('GAT, no meta-paths')
    expect(modelLabel(MODELS[3])).toBe('HAN, manual (manual_6)')
  })

  it('leaves popularity out of "similar products"', () => {
    expect(MODELS.filter(canFindSimilar).map(m => m.model)).not.toContain('popularity')
  })
})
