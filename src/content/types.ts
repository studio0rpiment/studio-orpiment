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

/** a project in the opening stage slider */
export type Slide = {
  id: string
  title: string
  /** short descriptive lines under the title (place, format) */
  lines: string[]
  kind: string
  year: string
  image: string
  alt: string
  /** object-position for the photograph's crop */
  focus?: string
  /** in-page anchor or outbound link */
  href: string
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

export type WorkEntry = {
  title: string
  /** what it was */
  what: string
  /** who it was for — omitted when self-initiated or not yet filled in */
  client?: string
  year: string
  href?: string
}

export type Service = { title: string; body: string }
