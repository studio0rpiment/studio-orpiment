import CaseStudy from '../CaseStudy/CaseStudy'
import { BlockCell, BlockRow } from '../BlockRow/BlockRow'
import type { CaseStudy as Study } from '../../content/types'
import './CaseStudyPage.css'

type Props = { study: Study; index: string; next?: { slug: string; title: string } }

/** a case study on its own page: a way back, the study, and a way on */
export default function CaseStudyPage({ study, index, next }: Props) {
  return (
    <main className="case-page">
      <div className="grid case-page__back">
        <BlockRow>
          <BlockCell kind="index">{index}</BlockCell>
          <BlockCell kind="title" as="p">Studio Orpiment</BlockCell>
          <BlockCell kind="action" href="/#work">All projects</BlockCell>
        </BlockRow>
      </div>
      <CaseStudy study={study} index={index} />
      {next && (
        <div className="grid case-page__next section">
          <BlockRow>
            <BlockCell kind="index">Next</BlockCell>
            <BlockCell kind="title" as="p">{next.title}</BlockCell>
            <BlockCell kind="action" href={`/work/${next.slug}`}>Case study</BlockCell>
          </BlockRow>
        </div>
      )}
    </main>
  )
}
