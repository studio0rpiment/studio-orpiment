import CaseStudy from '../CaseStudy/CaseStudy'
import { BlockCell, BlockRow } from '../BlockRow/BlockRow'
import type { CaseStudy as Study, Tone } from '../../content/types'
import './CaseStudyPanel.css'

type Props = {
  study: Study
  /** the colours of the slide it opened from */
  tone?: Tone
  /** where Exit leads: back to that slide in the slideshow */
  exitHref: string
}

/**
 * A case study opened in place beneath its slide, in that slide's colours.
 * It is the rest of the page: it ends with the live site and a way back out.
 */
export default function CaseStudyPanel({ study, tone = 'paper', exitHref }: Props) {
  return (
    <section className="case-panel" id={`case-${study.slug}`} data-tone={tone}>
      <CaseStudy study={study} action={{ href: exitHref, label: 'Exit' }} />
      <div className="grid case-panel__foot">
        {study.link && (
          <BlockRow>
            <BlockCell kind="index">Live</BlockCell>
            <BlockCell kind="title" as="p">{study.link.label}</BlockCell>
            <BlockCell kind="action" href={study.link.href}>Visit ↗</BlockCell>
          </BlockRow>
        )}
        <BlockRow>
          <BlockCell kind="index">Back</BlockCell>
          <BlockCell kind="title" as="p">{study.title}</BlockCell>
          <BlockCell kind="action" href={exitHref}>Exit</BlockCell>
        </BlockRow>
      </div>
    </section>
  )
}
