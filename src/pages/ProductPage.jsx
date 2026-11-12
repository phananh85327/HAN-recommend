import { useState } from 'react'
import { useParams } from 'react-router'
import { api } from '../api.js'
import GroupBadge from '../components/GroupBadge.jsx'
import ModelControls from '../components/ModelControls.jsx'
import RecommendationGrid from '../components/RecommendationGrid.jsx'
import { ErrorBox, Loading } from '../components/Status.jsx'
import { categoryPath, count } from '../format.js'

const FIRST_PATHS = 10

/** Every category path of the product, in full; the first 10, then a button for the rest.
 *  Nothing when the API sends none (no paths, or an API older than the categories). */
function Categories({ paths }) {
  const [all, setAll] = useState(false)
  if (!Array.isArray(paths) || paths.length === 0) return null
  const shown = all ? paths : paths.slice(0, FIRST_PATHS)
  return (
    <div className="categories">
      <h3>Categories</h3>
      <ul className="plain">
        {shown.map((path, i) => <li key={i}>{categoryPath(path)}</li>)}
      </ul>
      {!all && paths.length > FIRST_PATHS && (
        <button type="button" onClick={() => setAll(true)}>Show all {paths.length}</button>
      )}
    </div>
  )
}
import { useAsync } from '../hooks.js'
import { canFindSimilar } from '../models.js'
import { useSelection } from '../selection.js'
import { useServed } from '../served.jsx'

export default function ProductPage() {
  const { asin } = useParams()
  const { models } = useServed()
  const usable = models.filter(canFindSimilar)
  const selection = useSelection(usable)
  const names = selection.selected.map(m => m.name)

  const info = useAsync(() => api.product(asin), [asin])
  const similar = useAsync(
    () => (names.length ? api.similar(asin, { models: names, k: selection.k }) : Promise.resolve(null)),
    [asin, names.join(','), selection.k],
  )

  return (
    <div>
      {info.loading && <Loading />}
      {info.error && (
        <>
          <h1>Product <span className="mono">{asin}</span></h1>
          <ErrorBox error={info.error} />
        </>
      )}
      {info.data && (
        <>
          <h1>{info.data.product.title || asin}</h1>
          <section className="panel">
            <p className="meta">
              <GroupBadge group={info.data.product.group} />
              <span className="asin">ASIN {info.data.product.asin}</span>
              <span>{count(info.data.product.reviewers ?? info.data.reviewers)} reviewers in the data</span>
              {typeof info.data.product.avg_rating === 'number' && (
                <span>★ {info.data.product.avg_rating.toFixed(1)} average rating</span>
              )}
              {typeof info.data.product.sales_rank === 'number' && (
                <span>Sales rank {count(info.data.product.sales_rank)}</span>
              )}
              <a href={`https://www.amazon.com/dp/${encodeURIComponent(asin)}`} target="_blank" rel="noreferrer">
                Amazon page
              </a>
            </p>
            <Categories key={asin} paths={info.data.product.categories} />
            <p className="hint">
              Rating, sales rank (lower sells better) and categories are Amazon's, from the 2006 data, so
              the Amazon page may no longer exist.
            </p>
          </section>
          <h2>Similar products</h2>
          <ModelControls selection={selection} models={usable} />
          <p className="hint">Products whose vectors point the same way as this one's (cosine similarity).</p>
          {names.length === 0 ? (
            <p className="muted">No model selected.</p>
          ) : similar.loading ? (
            <Loading what="Finding similar products" />
          ) : similar.error ? (
            <ErrorBox error={similar.error} />
          ) : similar.data && (
            <RecommendationGrid results={similar.data.results} scoreLabel="Cosine similarity to this product" />
          )}
        </>
      )}
    </div>
  )
}
