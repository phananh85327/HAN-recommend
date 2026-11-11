import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { DEFAULT_K, K_OPTIONS } from './config.js'
import { modelsForSize, sizes } from './models.js'

/** A page's view settings, kept in the URL (?size=6&k=10, ?size=all, ?size=custom&models=a,b, and
 *  any page-specific ones such as ?seen=show) so a view can be bookmarked or shared.
 *
 *  React Router applies URL changes as a low-priority update, so a control bound to the URL alone
 *  would show its old value until that update lands. The settings are therefore kept here as well,
 *  changed at once, and follow the URL when it changes from outside (links, back and forward). */
export function useSelection(models) {
  const [params, setParams] = useSearchParams()
  const query = params.toString()
  const [settings, setSettings] = useState(() => Object.fromEntries(params))
  useEffect(() => setSettings(Object.fromEntries(new URLSearchParams(query))), [query])

  const param = key => settings[key] ?? null
  const sizeOptions = sizes(models)
  const raw = param('size')
  const size = raw === 'custom' || raw === 'all' ? raw
    : sizeOptions.includes(Number(raw)) ? Number(raw)
      : (sizeOptions[0] ?? 'all')
  const custom = (param('models') || '').split(',').filter(Boolean)
  const k = K_OPTIONS.includes(Number(param('k'))) ? Number(param('k')) : DEFAULT_K
  const selected = size === 'custom' ? models.filter(m => custom.includes(m.name))
    : size === 'all' ? models
      : modelsForSize(models, size)

  function update(changes) {
    const next = { ...settings }
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === undefined || value === '') delete next[key]
      else next[key] = Array.isArray(value) ? value.join(',') : String(value)
    }
    setSettings(next)
    setParams(next, { replace: true })
  }

  return { param, size, sizeOptions, custom, k, selected, update }
}
