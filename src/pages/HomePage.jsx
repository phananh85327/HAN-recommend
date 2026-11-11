import { Link } from 'react-router'
import DemoList from '../components/DemoList.jsx'
import { DEMO_PRODUCTS, DEMO_USERS } from '../config.js'
import { useServed } from '../served.jsx'

export default function HomePage() {
  const { health } = useServed()
  return (
    <div>
      <h1>Product recommendations from heterogeneous graphs</h1>
      <p className="lead">
        Each list comes from a model trained on the Amazon co-purchasing graph: HAN and metapath2vec on
        meta-path sets chosen three ways (automatic by LMSPS, manual, random), and GAT, which uses no
        meta-paths. Compare them side by side for a customer, or for a product's neighbours.
      </p>
      {health && (
        <p className="muted">
          {health.models} models, {health.products.toLocaleString('en-US')} products,{' '}
          {health.users.toLocaleString('en-US')} customers. <Link to="/models">See the models</Link>.
        </p>
      )}
      <h2>Customers to try</h2>
      <DemoList items={DEMO_USERS.map(u => ({ to: `/users/${u.id}`, title: u.title, note: u.note, code: u.id }))} />
      <h2>Products to try</h2>
      <DemoList items={DEMO_PRODUCTS.map(p => ({ to: `/products/${p.asin}`, title: p.title, note: p.note, code: p.asin }))} />
    </div>
  )
}
