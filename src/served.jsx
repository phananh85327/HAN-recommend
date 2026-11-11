import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from './api.js'
import { sortModels } from './models.js'

// What the API serves (health and the model list), loaded once and shared by every page.
const ServedContext = createContext(null)

export function ServedProvider({ children }) {
  const [state, setState] = useState({ loading: true, health: null, models: [], error: null })
  const load = useCallback(() => {
    setState(s => ({ ...s, loading: true, error: null }))
    Promise.all([api.health(), api.models()]).then(
      ([health, models]) => setState({ loading: false, health, models: sortModels(models), error: null }),
      error => setState({ loading: false, health: null, models: [], error }),
    )
  }, [])
  useEffect(load, [load])
  return <ServedContext.Provider value={{ ...state, reload: load }}>{children}</ServedContext.Provider>
}

export function useServed() {
  const value = useContext(ServedContext)
  if (!value) throw new Error('useServed() needs a <ServedProvider> around it')
  return value
}
