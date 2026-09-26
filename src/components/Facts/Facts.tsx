import type { Fact } from '../../content/types'
import './Facts.css'

export default function Facts({ facts }: { facts: Fact[] }) {
  return (
    <dl className="facts">
      {facts.map((f) => (
        <div className="facts__row" key={f.label}>
          <dt className="eyebrow">{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}
