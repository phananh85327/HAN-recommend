import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { MODELS, items, product } from '../test/mockApi.js'
import RecommendationGrid from './RecommendationGrid.jsx'

const book = product('0201924889', 'Effective C++')
const results = [
  { ...MODELS[3], items: items(book, product('0201633612', 'Design Patterns')) },
  { ...MODELS[2], items: items(product('B000002UB2', 'Abbey Road', 'Music'), book) },
]

function show(props) {
  return render(<MemoryRouter><RecommendationGrid results={results} {...props} /></MemoryRouter>)
}

describe('RecommendationGrid', () => {
  it('shows one column per model, with its kind and path set', () => {
    show()
    const columns = screen.getAllByRole('region')
    expect(columns).toHaveLength(2)
    expect(within(columns[0]).getByText('HAN')).toBeInTheDocument()
    expect(within(columns[0]).getByText(/manual_6/)).toBeInTheDocument()
    expect(within(columns[1]).getByText('metapath2vec')).toBeInTheDocument()
    expect(within(columns[0]).getAllByRole('listitem')).toHaveLength(2)
  })

  it('links each product to its page and marks products found by several models', () => {
    show()
    const links = screen.getAllByRole('link', { name: 'Effective C++' })
    expect(links[0]).toHaveAttribute('href', '/products/0201924889')
    expect(screen.getAllByText('in 2 lists')).toHaveLength(2)
    expect(screen.queryByText('Design Patterns').closest('li')).not.toHaveTextContent('in 2 lists')
  })

  it('shows the rating and reviewers the API sends, and nothing for products without them', () => {
    const withDetails = [{
      ...MODELS[3],
      items: items({ ...book, avg_rating: 4.5, reviewers: 30 }, product('0201633612', 'Design Patterns')),
    }]
    render(<MemoryRouter><RecommendationGrid results={withDetails} /></MemoryRouter>)
    expect(screen.getByText('Effective C++').closest('li')).toHaveTextContent('★ 4.5 · 30 reviewers')
    expect(screen.getByText('Design Patterns').closest('li')).not.toHaveTextContent('reviewers')
  })

  it('marks products the customer reviewed', () => {
    show({ reviewed: new Set(['B000002UB2']) })
    expect(screen.getByText('Abbey Road').closest('li')).toHaveTextContent('reviewed')
    expect(screen.getByText('Design Patterns').closest('li')).not.toHaveTextContent('reviewed')
  })
})
