import { Link } from 'react-router'
import GroupBadge from './GroupBadge.jsx'

/** One ranked product. `overlap` is how many of the lists on the page hold it; `reviewed` marks a
 *  product the customer already reviewed (shown only when those are let into the lists). */
export default function ProductCard({ item, overlap = 1, reviewed = false, scoreLabel }) {
  return (
    <li className="card">
      <span className="rank" aria-label={`rank ${item.rank}`}>{item.rank}</span>
      <div className="card-body">
        <Link to={`/products/${encodeURIComponent(item.asin)}`} className="card-title" title={item.title}>
          {item.title || item.asin}
        </Link>
        <div className="meta">
          <GroupBadge group={item.group} />
          <span className="asin">{item.asin}</span>
          {reviewed && <span className="tag tag-reviewed">reviewed</span>}
          {overlap > 1 && (
            <span className="tag" title={`This product is in ${overlap} of the lists shown`}>
              in {overlap} lists
            </span>
          )}
        </div>
      </div>
      <span className="score" title={scoreLabel}>{item.score.toFixed(3)}</span>
    </li>
  )
}
