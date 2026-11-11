import { Link, useParams } from 'react-router'
import { api } from '../api.js'
import GroupBadge from '../components/GroupBadge.jsx'
import ModelControls from '../components/ModelControls.jsx'
import RecommendationGrid from '../components/RecommendationGrid.jsx'
import { ErrorBox, Loading } from '../components/Status.jsx'
import { useAsync } from '../hooks.js'
import { useSelection } from '../selection.js'
import { useServed } from '../served.jsx'

function Profile({ data }) {
  const counts = {}
  for (const p of data.products) counts[p.group] = (counts[p.group] || 0) + 1
  const mix = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([g, n]) => `${n} ${g}`).join(', ')
  return (
    <section className="panel">
      <p>
        Reviewed <strong>{data.user.reviewed}</strong> products ({mix}). User index {data.user.index}.
      </p>
      <details>
        <summary>What they reviewed</summary>
        <ul className="plain">
          {data.products.map(p => (
            <li key={p.asin}>
              <GroupBadge group={p.group} /> <Link to={`/products/${encodeURIComponent(p.asin)}`}>{p.title || p.asin}</Link>
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}

export default function UserPage() {
  const { id } = useParams()
  const { models } = useServed()
  const selection = useSelection(models)
  const showSeen = selection.param('seen') === 'show'
  const names = selection.selected.map(m => m.name)

  const profile = useAsync(() => api.user(id), [id])
  const recs = useAsync(
    () => (names.length
      ? api.recommendations(id, { models: names, k: selection.k, excludeSeen: !showSeen })
      : Promise.resolve(null)),
    [id, names.join(','), selection.k, showSeen],
  )
  const reviewed = new Set((profile.data?.products || []).map(p => p.asin))

  return (
    <div>
      <h1>Customer <span className="mono">{id}</span></h1>
      {profile.loading && <Loading />}
      {profile.error && <ErrorBox error={profile.error} />}
      {profile.data && <Profile data={profile.data} />}
      {!profile.error && (
        <section>
          <h2>Recommendations</h2>
          <ModelControls selection={selection} models={models}>
            <label className="check">
              <input
                type="checkbox"
                checked={showSeen}
                onChange={e => selection.update({ seen: e.target.checked ? 'show' : null })}
              />
              Include products they already reviewed
            </label>
          </ModelControls>
          <p className="hint">
            {showSeen
              ? 'Products the customer reviewed are marked "reviewed". They include the held-out test purchases, so a model that knows the customer ranks several of them near the top.'
              : 'Every product the customer reviewed is left out, held-out test purchases included: the lists show what each model would recommend next.'}
          </p>
          {names.length === 0 ? (
            <p className="muted">No model selected.</p>
          ) : recs.loading ? (
            <Loading what="Ranking products" />
          ) : recs.error ? (
            <ErrorBox error={recs.error} />
          ) : recs.data && (
            <RecommendationGrid
              results={recs.data.results}
              reviewed={reviewed}
              scoreLabel="Score: the dot product of the customer's and the product's vectors"
            />
          )}
        </section>
      )}
    </div>
  )
}
