import { describe, expect, it } from 'vitest'
import { productDetails } from './format.js'

describe('productDetails', () => {
  it('writes the rating and the number of reviewers', () => {
    expect(productDetails({ avg_rating: 4.5, reviewers: 1103 })).toBe('★ 4.5 · 1,103 reviewers')
    expect(productDetails({ avg_rating: 5, reviewers: 5 })).toBe('★ 5.0 · 5 reviewers')
  })

  it('leaves out what the API did not send (an older API, or an unknown rating)', () => {
    expect(productDetails({ avg_rating: null, reviewers: 30 })).toBe('30 reviewers')
    expect(productDetails({ asin: 'x', title: 'y', group: 'Book' })).toBe('')
  })
})
