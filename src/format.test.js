import { describe, expect, it } from 'vitest'
import { categoryPath, productDetails, shortCategory } from './format.js'

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

describe('categoryPath', () => {
  const path = ['Books', 'Subjects', 'Computers & Internet', 'Programming', 'C & C++']

  it('joins a path from the root down', () => {
    expect(categoryPath(path)).toBe('Books › Subjects › Computers & Internet › Programming › C & C++')
    expect(categoryPath(['Music'])).toBe('Music')
  })

  it('keeps the last 3 levels of a longer path for lists', () => {
    expect(shortCategory(path)).toBe('… › Computers & Internet › Programming › C & C++')
    expect(shortCategory(['DVD', 'Genres', 'Drama'])).toBe('DVD › Genres › Drama')
  })

  it('is empty for a missing or empty path (an older API, or a product without one)', () => {
    expect(categoryPath(null)).toBe('')
    expect(categoryPath(undefined)).toBe('')
    expect(shortCategory([])).toBe('')
  })
})
