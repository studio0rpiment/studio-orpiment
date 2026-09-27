/**
 * Content types — every section renders from these manifests, so copy and
 * media change here, never inside components.
 */

export type MediaItem = {
  kind: 'image' | 'video'
  src: string
  caption?: string
  /** portrait phone captures get narrower columns */
  portrait?: boolean
}

export type Chapter = {
  id: string
  title: string
  body: string
  media: MediaItem[]
}

export type Fact = { label: string; value: string }

/** a point-cloud form the exhibit can morph to */
export type CloudForm = { id: string; label: string; src: string }

/**
 * the stage's colour for a slide: paper, orpiment, or chocolate; or a
 * project's own palette (defined in styles/tones.css)
 */
export type Tone = 'paper' | 'orpiment' | 'ink' | 'aegf' | 'ulrike' | 'earth' | 'tttl' | 'wmv'

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
  exhibit?: { caption: string; forms: CloudForm[] }
}

export type Service = { title: string; body: string }
