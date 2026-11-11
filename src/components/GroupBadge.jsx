const KNOWN = new Set(['book', 'dvd', 'music', 'video'])

/** The product group (Book, DVD, Music, Video) as a coloured label. */
export default function GroupBadge({ group }) {
  const key = (group || '').toLowerCase()
  return <span className={`group ${KNOWN.has(key) ? `group-${key}` : ''}`}>{group || 'unknown'}</span>
}
