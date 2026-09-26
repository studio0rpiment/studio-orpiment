import SectionHead from '../SectionHead/SectionHead'
import type { Service } from '../../content/types'
import './Services.css'

type Props = { services: Service[]; soundLine: string }

export default function Services({ services, soundLine }: Props) {
  return (
    <section className="services grid section" id="services" aria-label="Services">
      <SectionHead index="04" label="Services" />
      {services.map((s, i) => (
        <div className="services__item" key={s.title}>
          <p className="band services__num">{String(i + 1).padStart(2, '0')}</p>
          <h3 className="display services__title">{s.title}</h3>
          <p className="services__body">{s.body}</p>
        </div>
      ))}
      <p className="services__sound">{soundLine}</p>
    </section>
  )
}
