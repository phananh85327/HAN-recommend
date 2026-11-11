import { ErrorBox, Loading } from '../components/Status.jsx'
import { kindLabel, shortArch } from '../models.js'
import { useServed } from '../served.jsx'

const num = (value, digits) => (typeof value === 'number' ? value.toFixed(digits) : '-')

export default function ModelsPage() {
  const { models, loading, error } = useServed()
  return (
    <div>
      <h1>Models</h1>
      <p className="hint">
        The results the API serves. Test Hit@10 and NDCG@10 rank each test purchase against 99 sampled
        negatives; validation BPR is the loss the runs were picked by (lower is better).
      </p>
      {loading && <Loading />}
      {error && <ErrorBox error={error} />}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Result</th><th>Model</th><th>Path set</th><th>Meta-paths</th>
              <th className="num">Test Hit@10</th><th className="num">Test NDCG@10</th><th className="num">Val BPR</th>
            </tr>
          </thead>
          <tbody>
            {models.map(m => (
              <tr key={m.name}>
                <td className="mono">{m.name}</td>
                <td>{m.model}</td>
                <td>{kindLabel(m.kind)}{shortArch(m.arch) && ` (${shortArch(m.arch)})`}</td>
                <td className="mono">{m.paths.join(' ') || '-'}</td>
                <td className="num">{num(m.test_hit10, 3)}</td>
                <td className="num">{num(m.test_ndcg10, 3)}</td>
                <td className="num">{num(m.val_bpr, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
