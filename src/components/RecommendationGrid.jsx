import { kindLabel, shortArch } from '../models.js'
import ProductCard from './ProductCard.jsx'

function ColumnHeader({ result }) {
  const arch = shortArch(result.arch)
  return (
    <header className="column-head">
      <div className="family">{result.model}</div>
      <div className="kind">
        {kindLabel(result.kind)}
        {arch && <span className="arch"> · {arch}</span>}
      </div>
      {typeof result.test_hit10 === 'number' && (
        <div className="metric" title="Test Hit@10 of this run: the true product ranked against 99 sampled negatives">
          test Hit@10 {result.test_hit10.toFixed(3)}
        </div>
      )}
    </header>
  )
}

/** One column per model (an API `results` list), side by side. */
export default function RecommendationGrid({ results, reviewed, scoreLabel }) {
  const overlap = new Map()
  for (const result of results) {
    for (const item of result.items) overlap.set(item.asin, (overlap.get(item.asin) || 0) + 1)
  }
  return (
    <div className="grid">
      {results.map(result => (
        <section key={result.name} className="column" aria-label={`${result.model}, ${kindLabel(result.kind)}`}>
          <ColumnHeader result={result} />
          {result.items.length === 0 ? (
            <p className="muted">No products.</p>
          ) : (
            <ol className="cards">
              {result.items.map(item => (
                <ProductCard
                  key={item.asin}
                  item={item}
                  overlap={overlap.get(item.asin)}
                  reviewed={reviewed?.has(item.asin) ?? false}
                  scoreLabel={scoreLabel}
                />
              ))}
            </ol>
          )}
        </section>
      ))}
    </div>
  )
}
