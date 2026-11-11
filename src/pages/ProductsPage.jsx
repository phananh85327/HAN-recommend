import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { api } from '../api.js'
import DemoList from '../components/DemoList.jsx'
import GroupBadge from '../components/GroupBadge.jsx'
import { ErrorBox, Loading } from '../components/Status.jsx'
import { DEMO_PRODUCTS } from '../config.js'
import { useAsync } from '../hooks.js'

export default function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [text, setText] = useState(q)
  useEffect(() => setText(q), [q])
  const results = useAsync(() => (q ? api.searchProducts(q) : Promise.resolve(null)), [q])

  function search(e) {
    e.preventDefault()
    setParams(text.trim() ? { q: text.trim() } : {})
  }

  return (
    <div>
      <h1>Products</h1>
      <form className="row" onSubmit={search} role="search">
        <label>
          Title or ASIN
          <input value={text} onChange={e => setText(e.target.value)} placeholder="e.g. harry potter, c++, B000002UB2" />
        </label>
        <button type="submit">Search</button>
      </form>
      <p className="hint">Every word must appear in the title or the ASIN.</p>
      {results.loading && q && <Loading what="Searching" />}
      {results.error && <ErrorBox error={results.error} />}
      {results.data && (
        results.data.products.length === 0 ? (
          <p className="muted">No product matches "{q}".</p>
        ) : (
          <ul className="plain results">
            {results.data.products.map(p => (
              <li key={p.asin}>
                <GroupBadge group={p.group} />{' '}
                <Link to={`/products/${encodeURIComponent(p.asin)}`}>{p.title || p.asin}</Link>{' '}
                <span className="asin">{p.asin}</span>
              </li>
            ))}
          </ul>
        )
      )}
      {!q && (
        <>
          <h2>Scenarios</h2>
          <DemoList items={DEMO_PRODUCTS.map(p => ({ to: `/products/${p.asin}`, title: p.title, note: p.note, code: p.asin }))} />
        </>
      )}
    </div>
  )
}
