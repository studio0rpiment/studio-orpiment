/**
 * Content types — every section renders from these manifests, so copy and
 * media change here, never inside components.
 */

export type MediaItem = {
  kind: 'image' | 'video'
  src: string
  caption?: string
  /** portrait phone captures get narrower columns (and a phone-shaped frame) */
  portrait?: boolean
  /** columns of the twelve it spans on wide screens (defaults: portrait 3, landscape 6) */
  span?: number
  /** a still shown before a video plays */
  poster?: string
}

/** one experience in the dossier's concept / requirements / solution tables */
export type Experience = {
  name: string
  concept?: string
  requirements?: string
  /** the solution, shown: usually a screen capture */
  solution: MediaItem
}

/**
 * A chapter is a run of blocks, so a study can follow its own breakdown:
 * paragraphs (with an optional run-in heading), rows of media, experience
 * tables, or the interactive point-cloud exhibit.
 */
export type Block =
  | { kind: 'text'; heading?: string; text: string; link?: { href: string; label: string } }
  | { kind: 'media'; items: MediaItem[] }
  | { kind: 'experiences'; items: Experience[] }
  | { kind: 'exhibit'; caption: string; forms: CloudForm[] }

export type Chapter = {
  id: string
  title: string
  /** a line beside the title */
  lead?: string
  blocks: Block[]
}

export type Fact = { label: string; value: string }

/** a point-cloud form the exhibit can morph to */
export type CloudForm = { id: string; label: string; src: string }

/**
 * the stage's colour for a slide: paper, orpiment, or chocolate; or a
 * project's own palette (defined in styles/tones.css)
 */
export type Tone = 'paper' | 'orpiment' | 'ink' | 'aegf' | 'aegf26' | 'ulrike' | 'earth' | 'tttl' | 'wmv' | 'wayside' | 'decides' | 'tbws'

/**
 * A project: one record feeds the opening slideshow (when it has an image)
 * and the work index.
 */
export type Project = {
  id: string
  title: string
  /** what it was — format */
  kind: string
  /** who it was for; omitted when self-initiated or not yet filled in */
  client?: string
  year: string
  /** short descriptive lines on the slideshow card */
  lines: string[]
  /** the stacked words, lower left of the stage, while this project is up */
  disciplines?: string[]
  /** one or two sentences beside those words */
  about?: string
  image?: string
  alt?: string
  /** object-position for the photograph's crop */
  focus?: string
  /** 'contain' for artwork that must not be cropped (shown on chocolate) */
  fit?: 'cover' | 'contain'
  /**
   * the stage colour while this photograph is up, matched to the picture:
   * orpiment when warm yellows lead its colour, else paper or chocolate by
   * which is closer to its dominant tone
   */
  tone?: Tone
  /** slug of an in-site case study (/work/<slug>) */
  caseStudy?: string
  /** outbound link: live site, video, article */
  href?: string
  /**
   * a live render of the project's site, shown over its photograph while its
   * slide is up (on screens with a pointer); the photograph is the still
   */
  embed?: string
}

export type CaseStudy = {
  slug: string
  kicker: string
  title: string
  link?: { href: string; label: string }
  facts: Fact[]
  intro: string
  /** full-bleed photograph opening the case study */
  cover?: MediaItem
  chapters: Chapter[]
}

export type Service = { title: string; body: string }
