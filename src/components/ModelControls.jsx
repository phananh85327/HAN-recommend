import { K_OPTIONS } from '../config.js'
import { modelLabel } from '../models.js'

/** Which models to show and how long the lists are; `selection` comes from useSelection(). */
export default function ModelControls({ selection, models, children }) {
  const { size, sizeOptions, custom, k, selected, update } = selection

  function changeSize(value) {
    if (value === 'custom') {
      // start the custom choice from what is on screen
      update({ size: 'custom', models: custom.length ? custom : selected.map(m => m.name) })
    } else {
      update({ size: value, models: null })
    }
  }

  function toggle(name, on) {
    update({ models: on ? [...custom, name] : custom.filter(n => n !== name) })
  }

  return (
    <div className="controls">
      <label>
        Models
        <select value={String(size)} onChange={e => changeSize(e.target.value)}>
          {sizeOptions.map(n => (
            <option key={n} value={String(n)}>{n}-path sets + GAT</option>
          ))}
          <option value="all">All served models</option>
          <option value="custom">Choose models…</option>
        </select>
      </label>
      <label>
        List length
        <select value={k} onChange={e => update({ k: e.target.value })}>
          {K_OPTIONS.map(n => (
            <option key={n} value={n}>Top {n}</option>
          ))}
        </select>
      </label>
      {children}
      {size === 'custom' && (
        <fieldset className="picker">
          <legend>Models to show</legend>
          {models.map(m => (
            <label key={m.name} className="check">
              <input type="checkbox" checked={custom.includes(m.name)} onChange={e => toggle(m.name, e.target.checked)} />
              {modelLabel(m)}
            </label>
          ))}
        </fieldset>
      )}
    </div>
  )
}
