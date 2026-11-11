import { Link } from 'react-router'

/** Scenario shortcuts: [{to, title, note, code}]. */
export default function DemoList({ items }) {
  return (
    <ul className="demos">
      {items.map(item => (
        <li key={item.to}>
          <Link to={item.to} className="demo">
            <span className="demo-title">{item.title}</span>
            <span className="demo-note">{item.note}</span>
            <code>{item.code}</code>
          </Link>
        </li>
      ))}
    </ul>
  )
}
