import SectionHead from '../SectionHead/SectionHead'
import { site } from '../../content/site'
import './Studio.css'

type Props = { bio: string[]; collaborators: string[] }

export default function Studio({ bio, collaborators }: Props) {
  const [first, ...rest] = bio
  return (
    <section className="studio grid section" id="studio" aria-label="Studio">
      <SectionHead index="05" label="Studio" />
      <p className="studio__first">{first}</p>
      <div className="studio__rest">
        {rest.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <p>
          Academic work and the full archive: <a href={site.kpSite.href}>{site.kpSite.label}</a>
        </p>
      </div>
      <div className="studio__side">
        <p className="eyebrow">Collaborators + clients</p>
        <ul className="studio__list">
          {collaborators.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </div>
    </section>
  )
}
