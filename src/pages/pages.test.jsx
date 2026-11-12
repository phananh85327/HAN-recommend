import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import Layout from '../components/Layout.jsx'
import { ServedProvider } from '../served.jsx'
import { MODELS, items, mockApi, product, productWithCategory } from '../test/mockApi.js'
import ProductPage from './ProductPage.jsx'
import ProductsPage from './ProductsPage.jsx'
import UserPage from './UserPage.jsx'

function visit(path) {
  return render(
    <ServedProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="users/:id" element={<UserPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:asin" element={<ProductPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ServedProvider>,
  )
}

// answers a recommendations or similar request with one list per model asked for
const perModel = url => [200, {
  results: url.searchParams.get('models').split(',').map(name => ({
    ...MODELS.find(m => m.name === name),
    items: items(product('0201633612', 'Design Patterns'), product('B000002UB2', 'Abbey Road', 'Music')),
  })),
}]

const profile = [200, {
  user: { id: 'A29SHMCIJG2NSO', index: 32855, reviewed: 1 },
  products: [product('0201379260', 'The C++ Standard Library')],
}]

describe('customer page', () => {
  it('shows the profile and one list per 6-path model plus GAT and popularity', async () => {
    const calls = mockApi([
      [/^\/api\/users\/A29SHMCIJG2NSO$/, () => profile],
      [/recommendations$/, perModel],
    ])
    visit('/users/A29SHMCIJG2NSO')
    expect(await screen.findByText(/Reviewed/)).toHaveTextContent('Reviewed 1 products (1 Book)')
    const columns = await screen.findAllByRole('region')
    expect(columns.map(c => within(c).getByRole('banner').textContent)).toEqual([
      expect.stringMatching(/^HANautomatic \(LMSPS\) · v3_f6_a1/),
      expect.stringMatching(/^HANmanual · manual_6/),
      expect.stringMatching(/^metapath2vecmanual · manual_6/),
      expect.stringMatching(/^GATno meta-paths/),
      expect.stringMatching(/^popularityno meta-paths/),
    ])
    const request = calls.find(u => u.pathname.endsWith('/recommendations'))
    expect(request.searchParams.get('exclude_seen')).toBe('true')
    expect(request.searchParams.get('k')).toBe('10')
  })

  it('switches to the 4-path sets and to including reviewed products', async () => {
    const calls = mockApi([
      [/^\/api\/users\/A29SHMCIJG2NSO$/, () => profile],
      [/recommendations$/, perModel],
    ])
    visit('/users/A29SHMCIJG2NSO')
    const user = userEvent.setup()
    await user.selectOptions(await screen.findByLabelText('Models'), '4')
    await user.click(screen.getByLabelText(/Include products they already reviewed/))
    await screen.findAllByRole('region')
    const last = calls.filter(u => u.pathname.endsWith('/recommendations')).at(-1)
    expect(last.searchParams.get('models')).toBe('han_amazon_lp_manual_5_s1,gat_union_s1,popularity_s1')
    expect(last.searchParams.get('exclude_seen')).toBe('false')
  })

  it('says so when the customer does not exist', async () => {
    mockApi([[/^\/api\/users\/NOBODY$/, () => [404, { error: "user 'NOBODY' not found" }]]])
    visit('/users/NOBODY')
    expect(await screen.findByRole('alert')).toHaveTextContent("user 'NOBODY' not found")
    expect(screen.queryByText('Recommendations')).not.toBeInTheDocument()
  })
})

describe('product pages', () => {
  it('asks for similar products without popularity, which has none', async () => {
    const effective = { ...product('0201924889', 'Effective C++'), sales_rank: 1309, avg_rating: 4.5, reviewers: 30 }
    const calls = mockApi([
      [/^\/api\/products\/0201924889$/, () => [200, { product: effective, reviewers: 30 }]],
      [/similar$/, perModel],
    ])
    visit('/products/0201924889')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Effective C++')
    expect(screen.getByText('30 reviewers in the data')).toBeInTheDocument()
    expect(screen.getByText('★ 4.5 average rating')).toBeInTheDocument()
    expect(screen.getByText('Sales rank 1,309')).toBeInTheDocument()
    await screen.findAllByRole('region')
    const request = calls.find(u => u.pathname.endsWith('/similar'))
    expect(request.searchParams.get('models').split(',')).not.toContain('popularity_s1')
  })

  it('lists every category path in full: 10, then all of them on request', async () => {
    const paths = Array.from({ length: 12 }, (_, i) => ['Books', 'Subjects', `Shelf ${i + 1}`])
    const many = { ...productWithCategory('0590353403', 'Harry Potter', 'Book', paths[0]), categories: paths }
    mockApi([
      [/^\/api\/products\/0590353403$/, () => [200, { product: many, reviewers: 921 }]],
      [/similar$/, perModel],
    ])
    visit('/products/0590353403')
    expect(await screen.findByRole('heading', { name: 'Categories' })).toBeInTheDocument()
    expect(screen.getByText('Books › Subjects › Shelf 1')).toBeInTheDocument()
    expect(screen.getByText('Books › Subjects › Shelf 10')).toBeInTheDocument()
    expect(screen.queryByText('Books › Subjects › Shelf 11')).not.toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Show all 12' }))
    expect(screen.getByText('Books › Subjects › Shelf 12')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Show all/ })).not.toBeInTheDocument()
  })

  it('shows no category list for an API without categories', async () => {
    mockApi([
      [/^\/api\/products\/0201924889$/, () => [200, { product: product('0201924889', 'Effective C++'), reviewers: 30 }]],
      [/similar$/, perModel],
    ])
    visit('/products/0201924889')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Effective C++')
    expect(screen.queryByRole('heading', { name: 'Categories' })).not.toBeInTheDocument()
  })

  it('searches by title and lists the matches', async () => {
    const calls = mockApi([[/^\/api\/products$/, () => [200, { products: [product('0201924889', 'Effective C++')] }]]])
    visit('/products')
    const user = userEvent.setup()
    await user.type(await screen.findByLabelText('Title or ASIN'), 'effective c++')
    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(await screen.findByRole('link', { name: 'Effective C++' })).toHaveAttribute('href', '/products/0201924889')
    expect(calls.find(u => u.pathname === '/api/products').searchParams.get('q')).toBe('effective c++')
  })

  it('shows a banner when the API is down', async () => {
    mockApi([
      [/^\/api\/health$/, () => [502, null]],
    ])
    visit('/products')
    expect(await screen.findByRole('alert')).toHaveTextContent(/recommend_api\.bat/)
  })
})
