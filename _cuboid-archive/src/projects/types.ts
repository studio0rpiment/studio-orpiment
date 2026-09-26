/**
 * Project manifests — the single source of truth for everything that lists,
 * links, or showcases work: the work list, the showcases, and (later) the
 * grid keypad all render from these.
 */

/** what a piece's face carries when a project spread is open (desktop) */
export type CardKind =
  | { type: 'title' }
  | { type: 'intro' }
  | { type: 'facts' }
  | { type: 'image'; src: string }
  | { type: 'more' }

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

export type Project = {
  slug: string
  /** two-digit index shown in the work list ("01") */
  num: string
  title: string
  category: string
  year: string
  /** outbound link (live site, video, article) */
  link?: string
  /** desktop spread: which piece carries which card when this project is
      rotated into the composition (pieces without an entry stay blank) */
  spread?: Record<string, CardKind>
  /** projects with a built showcase are openable in-site */
  showcase?: {
    facts: { date: string; client: string; role: string }
    intro: string
    chapters: Chapter[]
  }
}
