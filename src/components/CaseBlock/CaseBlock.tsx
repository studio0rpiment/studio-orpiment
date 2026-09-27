import TextBlock from '../TextBlock/TextBlock'
import MediaRow from '../MediaRow/MediaRow'
import ExperienceGrid from '../ExperienceGrid/ExperienceGrid'
import ExhibitFrame from '../ExhibitFrame/ExhibitFrame'
import type { Block } from '../../content/types'

/** one block of a chapter, by kind */
export default function CaseBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case 'text':
      return <TextBlock heading={block.heading} text={block.text} link={block.link} />
    case 'media':
      return <MediaRow items={block.items} />
    case 'experiences':
      return <ExperienceGrid items={block.items} />
    case 'exhibit':
      return <ExhibitFrame forms={block.forms} caption={block.caption} />
  }
}
