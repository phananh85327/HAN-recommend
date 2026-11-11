import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { api } from '../api.js'
import DemoList from '../components/DemoList.jsx'
import { ErrorBox, Loading } from '../components/Status.jsx'
import { DEMO_USERS } from '../config.js'
import { useAsync } from '../hooks.js'

const SAMPLE_SIZE = 12

function whole(value, fallback) {
  const n = Number.parseInt(value ?? '', 10)
  return Number.isFinite(n) && n >= 0 ? n : fallback
}

export default function UsersPage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const min = whole(params.get('min'), 6)
  const max = whole(params.get('max'), 20)
  const seed = whole(params.get('seed'), 0)
  const [lookup, setLookup] = useState('')
  const [range, setRange] = useState({ min, max })
  const sample = useAsync(() => api.sampleUsers({ min, max, limit: SAMPLE_SIZE, seed }), [min, max, seed])

  function open(e) {
    e.preventDefault()
    if (lookup.trim()) navigate(`/users/${encodeURIComponent(lookup.trim())}`)
  }

  function applyRange(e) {
    e.preventDefault()
    setParams({ min: String(range.min), max: String(range.max), seed: '0' })
  }

  return (
    <div>
      <h1>Customers</h1>
      <form className="row" onSubmit={open}>
        <label>
          Customer ID or user index
          <input value={lookup} onChange={e => setLookup(e.target.value)} placeholder="e.g. A29SHMCIJG2NSO" />
        </label>
        <button type="submit">Show recommendations</button>
      </form>

      <h2>Scenarios</h2>
      <DemoList items={DEMO_USERS.map(u => ({ to: `/users/${u.id}`, title: u.title, note: u.note, code: u.id }))} />

      <h2>A random sample</h2>
      <form className="row" onSubmit={applyRange}>
        <label>
          Reviewed at least
          <input type="number" min="0" value={range.min} onChange={e => setRange({ ...range, min: whole(e.target.value, 0) })} />
        </label>
        <label>
          and at most
          <input type="number" min="0" value={range.max} onChange={e => setRange({ ...range, max: whole(e.target.value, 0) })} />
        </label>
        <button type="submit">Show</button>
        <button type="button" onClick={() => setParams({ min: String(min), max: String(max), seed: String(seed + 1) })}>
          Another sample
        </button>
      </form>
      <p className="hint">Customers with about 6-20 reviewed products make the clearest lists.</p>
      {sample.loading && <Loading />}
      {sample.error && <ErrorBox error={sample.error} />}
      {sample.data && (
        <>
          <p className="muted">
            {sample.data.matching.toLocaleString('en-US')} customers reviewed {min}-{max} products.
          </p>
          <table>
            <thead>
              <tr><th>Customer ID</th><th>Reviewed</th></tr>
            </thead>
            <tbody>
              {sample.data.users.map(u => (
                <tr key={u.index}>
                  <td><Link to={`/users/${encodeURIComponent(u.id)}`} className="mono">{u.id}</Link></td>
                  <td>{u.reviewed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
