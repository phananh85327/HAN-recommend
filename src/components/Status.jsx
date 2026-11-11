export function Loading({ what = 'Loading' }) {
  return <p className="muted" role="status">{what}…</p>
}

export function ErrorBox({ error }) {
  return (
    <div className="error" role="alert">
      {error?.message || String(error)}
    </div>
  )
}
