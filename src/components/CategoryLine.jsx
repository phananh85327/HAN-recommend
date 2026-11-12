import { categoryPath, shortCategory } from '../format.js'

/** A product's first category path, shortened to its last levels, the full path on hover. Nothing
 *  when the product has none (or the API is older and sends no category). */
export default function CategoryLine({ path, as: Tag = 'div', prefix = '' }) {
  const short = shortCategory(path)
  if (!short) return null
  return (
    <Tag className="category" title={categoryPath(path)}>
      {prefix}{short}
    </Tag>
  )
}
