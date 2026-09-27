import type { Service } from './types'

export const site = {
  name: 'Studio Orpiment',
  /** stacked words, lower left of the opening stage, when a project has none of its own */
  disciplines: ['Augmented', 'Real-time', 'Web'],
  /** the studio's one line, under its name at the top of the stage */
  lede: 'Bespoke applications, browser-based augmented reality, collaborative interactive systems, and websites for artists, festivals, and cultural institutions.',
  /**
   * Studio contact address. Contact links render only when this is set.
   */
  email: 'info@orpiment.studio',
  kpSite: { href: 'https://kevinpatton.site', label: 'kevinpatton.site' },
}

export const nav = [
  { href: '/#work', label: 'Work' },
  { href: '/#services', label: 'Services' },
  { href: '/#studio', label: 'Studio' },
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
