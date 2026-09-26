import { Project } from './types'
import { wayside } from './wayside'

export const PROJECTS: Project[] = [
  wayside,
  { slug: 'songcards', num: '02', title: 'Song Cards', category: 'interactive', year: 'in progress' },
  { slug: 'decides', num: '03', title: 'DECIDE(S)', category: 'product', year: '2026' },
  { slug: 'client-sites', num: '04', title: 'Sites for artists', category: 'web', year: '2024–26' },
  { slug: 'adventurous-guitar', num: '05', title: 'Adventurous Electric Guitar Festival', category: 'web · 3D', year: '2026', link: 'https://adventurous-guitar-2026.vercel.app' },
  { slug: 'cast-down-tither', num: '06', title: 'Cast Down Tither', category: 'performance', year: '2017–' },
  { slug: 'tied-to-the-land', num: '07', title: 'Tied To The Land', category: 'exhibition', year: '2025' },
  { slug: 'three-black-wallstreets', num: '08', title: 'Three Black Wall Streets', category: 'web · 3D', year: '2021' },
  { slug: 'violence-map', num: '09', title: 'White Mob Violence Map', category: 'geospatial', year: '2021' },
  { slug: 'earth-out-of-joint', num: '10', title: 'Earth Out of Joint', category: 'video', year: '2025' },
]

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

/** which landing block opens which project */
export const BLOCK_TO_PROJECT: Record<string, string> = {
  'left-portrait': 'wayside',
}

/** the block that carries the work index — sits below the tagline in both
    compositions (desktop right portrait; mobile tall right column) */
export const WORK_BLOCK = 'right-portrait'
