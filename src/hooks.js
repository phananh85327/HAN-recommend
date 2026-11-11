import { useEffect, useState } from 'react'

/** Runs `load` (a function returning a promise) whenever `deps` change and returns
 *  {loading, data, error}. The answer is tied to the deps it was loaded for, so a render with new
 *  deps never shows the previous answer, and an answer that arrives late is dropped. `deps` must be
 *  plain values (strings, numbers, booleans). */
export function useAsync(load, deps) {
  const key = JSON.stringify(deps)
  const [state, setState] = useState({ key: null, data: null, error: null })
  useEffect(() => {
    let current = true
    load().then(
      data => current && setState({ key, data, error: null }),
      error => current && setState({ key, data: null, error }),
    )
    return () => {
      current = false
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  const fresh = state.key === key
  return { loading: !fresh, data: fresh ? state.data : null, error: fresh ? state.error : null }
}
