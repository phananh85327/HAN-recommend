import { NavLink, Outlet } from 'react-router'
import { OFFLINE_HINT } from '../api.js'
import { useServed } from '../served.jsx'

export default function Layout() {
  const { health, error, loading, reload } = useServed()
  const status = loading ? 'Connecting…' : error ? 'API offline' : `${health.models} models served`
  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="brand" end>HAN-recommend</NavLink>
        <nav aria-label="Main">
          <NavLink to="/users">Customers</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/models">Models</NavLink>
        </nav>
        <span className={`status ${error ? 'status-bad' : loading ? '' : 'status-ok'}`}>{status}</span>
      </header>
      {error && (
        <div className="banner" role="alert">
          <strong>The recommendation API is not answering.</strong> {error.message}
          {!error.message.includes(OFFLINE_HINT) && ` ${OFFLINE_HINT}`}{' '}
          <button type="button" onClick={reload}>Try again</button>
        </div>
      )}
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        Amazon product co-purchasing metadata (SNAP), rebuilt data, split seed 1. Models served by
        HAN-improve's <code>recommend_api.py</code>.
      </footer>
    </div>
  )
}
