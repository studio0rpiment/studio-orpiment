import type { Service, WorkEntry } from './types'

export const site = {
  name: 'Studio Orpiment',
  /** stacked disciplines, lower left of the opening stage */
  disciplines: ['Augmented', 'Real-time', 'Web'],
  /** words the intro steps through before the stage opens */
  introWords: ['Augmented', 'Real-time', 'Web', 'Orpiment'],
  lede: 'Browser-based augmented reality, interactive systems, and websites for museums, festivals, and cultural institutions.',
  /**
   * Studio contact address. Contact links render only when this is set.
   */
  email: 'info@orpiment.studio',
  kpSite: { href: 'https://kevinpatton.site', label: 'kevinpatton.site' },
}

export const nav = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#studio', label: 'Studio' },
]

/** "Other work" index — what it was, who it was for, the year */
export const work: WorkEntry[] = [
  { title: 'Adventurous Electric Guitar Festival', what: 'Festival website, real-time 3D', client: 'Adventurous Electric Guitar Festival', year: '2026', href: 'https://adventurous-guitar-2026.vercel.app' },
  { title: 'Song Cards', what: 'Interactive listening objects', year: 'In progress' },
  { title: 'Sites for artists', what: 'Websites and identities for musicians and performers', client: 'Louise et Ondarel, The Twiolins, and others', year: '2024–26' },
  { title: 'Tied To The Land', what: 'Exhibition', year: '2025' },
  { title: 'Earth Out of Joint', what: 'Video', year: '2025' },
  { title: 'Three Black Wall Streets', what: 'Web-based 3D', year: '2021' },
  { title: 'White Mob Violence Map', what: 'Geospatial visualization', year: '2021' },
  { title: 'Cast Down Tither', what: 'Performance system', year: '2017–' },
]

export const services: Service[] = [
  { title: 'Augmented reality', body: 'Geolocated and image-anchored augmented reality delivered through the mobile browser, without an app download.' },
  { title: 'Interactive systems', body: 'Real-time graphics, point clouds, and sound for installations, exhibitions, and performance.' },
  { title: 'Web design + development', body: 'Sites and web applications for institutions, festivals, and artists; design and engineering carried out in the same studio.' },
  { title: 'Interpretation + visualization', body: 'Maps, timelines, and data-driven narratives that carry a collection or a site to a public audience.' },
]

/** the quieter fifth line */
export const soundLine = 'Mixing and mastering for recorded music, through Studio Orpiment Sound.'

export const studio = {
  bio: [
    'Studio Orpiment is the design and development practice of Kevin Patton, a creative technologist and professor in the Interaction Design program at the Corcoran School of the Arts and Design, George Washington University.',
    'The work spans augmented reality, interactive installation, experimental music interfaces, and multimedia performance systems. Research interests include expressive technological systems, automation and agency, and visualization. Projects are designed and built in-house, from interaction model to deployment.',
  ],
  collaborators: [
    'Andrew Kastner',
    'The Fourth Floor Design Collective',
    'Capital Fringe',
    'Adventurous Electric Guitar Festival',
    'Louise et Ondarel',
    'The Twiolins',
  ],
}
