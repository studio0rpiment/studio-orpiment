import { navigate } from '../../viewStore'
import './Nav.css'

/** The one word a portfolio needs. Grows to `work · studio · contact` later. */
export default function Nav() {
  return (
    <nav className="nav">
      <button type="button" className="nav__item" onClick={() => navigate('#/work')}>
        work
      </button>
    </nav>
  )
}
