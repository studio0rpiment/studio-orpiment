import type { Slide } from './types'

/** the projects shown in the opening stage, in order */
export const slides: Slide[] = [
  {
    id: 'wayside',
    title: 'wayside.at',
    lines: ['For Andrew Kastner', 'Kenilworth Aquatic Gardens, DC'],
    kind: 'AR development',
    year: '2025',
    image: '/projects/wayside/mockup-phone.jpg',
    alt: 'A phone among the reeds showing lotus buds rendered as a point cloud in augmented reality.',
    focus: '45% 50%',
    href: '#wayside',
  },
  {
    id: 'tied-to-the-land',
    title: 'Tied To The Land',
    lines: ['Interactive exhibition map'],
    kind: 'Exhibition',
    year: '2025',
    image: '/projects/tied-to-the-land/installed.jpg',
    alt: 'A gallery with framed works on the walls and a touchscreen map table at the centre of the room.',
    focus: '50% 60%',
    href: '#work',
  },
  {
    id: 'adventurous-guitar',
    title: 'Adventurous Electric Guitar',
    lines: ['Summit + festival website', 'REMLABS, New Orleans'],
    kind: 'Web',
    year: '2025–26',
    image: '/projects/adventurous-guitar/stage.jpg',
    alt: 'A stage lit in blue with guitars and amplifiers, the festival website projected above.',
    focus: '100% 50%',
    href: 'https://adventurous-guitar-2026.vercel.app',
  },
]
