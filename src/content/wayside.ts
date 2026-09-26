import type { CaseStudy } from './types'

const M = '/projects/wayside'

export const wayside: CaseStudy = {
  slug: 'wayside',
  kicker: 'Case study',
  title: 'wayside.at',
  link: { href: 'https://kenilworth.wayside.at', label: 'kenilworth.wayside.at' },
  facts: [
    { label: 'Date', value: 'Summer 2025' },
    { label: 'Concept', value: 'Andrew Kastner, artist-in-residence — concept, icons, visual identity' },
    { label: 'With', value: 'The Fourth Floor Design Collective; Capital Fringe' },
    { label: 'Site', value: 'Kenilworth Aquatic Gardens, Washington, DC' },
    { label: 'Studio', value: 'Development — browser AR system, geolocation, point-cloud rendering; interaction design with Andrew Kastner' },
  ],
  intro:
    'wayside.at is a browser-based augmented reality work for Kenilworth Aquatic Gardens, conceived by artist-in-residence Andrew Kastner and presented with Capital Fringe. Nine geolocated experiences interpret the park across three themes — time, seasons, and moments — rendered as point clouds. The concept, icons, and visual identity are Kastner’s; Studio Orpiment developed the system, and the interaction elements were designed jointly.',
  cover: { kind: 'image', src: `${M}/mockup-callout.jpg`, caption: 'Lotus, placed in the landscape as a point cloud' },
  exhibit: {
    caption: 'Point clouds from the project data. Drag to turn; select a form to morph.',
    forms: [
      { id: 'lotus', label: 'Lotus', src: '/models/points/lotus_2.bin' },
      { id: 'lily', label: 'Water lily', src: '/models/points/lily_1.bin' },
      { id: 'cattail', label: 'Cattail', src: '/models/points/cattail_1.bin' },
    ],
  },
  chapters: [
    {
      id: 'time',
      title: 'Time',
      body: 'Three experiences trace four thousand years of the site: a Savannah River canoe positioned in the tidal channel (BC2200); a smoke simulation marking the garbage fires that burned here until 1968; and a water-rise simulation projecting flood conditions from 2030 to 2100, driven by a user-controlled slider.',
      media: [
        { kind: 'video', src: `${M}/time-bc2200.mp4`, caption: 'BC2200', portrait: true },
        { kind: 'video', src: `${M}/time-1968.mp4`, caption: '1968', portrait: true },
        { kind: 'video', src: `${M}/time-2030.mp4`, caption: '2030–2100', portrait: true },
      ],
    },
    {
      id: 'seasons',
      title: 'Seasons',
      body: 'Real-time particle systems morph the park’s plants through their seasonal stages — lotus, water lily, cattail. Point density adapts to the capability of each visitor’s phone.',
      media: [
        { kind: 'video', src: `${M}/seasons-lotus.mp4`, caption: 'Lotus', portrait: true },
        { kind: 'video', src: `${M}/seasons-cattail.mp4`, caption: 'Cattail', portrait: true },
        { kind: 'image', src: `${M}/mockup-lotus.jpg`, caption: 'Lotus and water lily, AR view' },
      ],
    },
    {
      id: 'moments',
      title: 'Moments',
      body: 'Three experiences document figures in the park’s history: Walter “Ranger Mac,” among the first African American National Park Service rangers, hired in 1968; Helen Fowler, under whose leadership the women-owned gardens employed local African American residents in the early twentieth century; and the volunteers who maintain the park today.',
      media: [
        { kind: 'video', src: `${M}/moments-mac.mp4`, caption: 'Ranger Mac', portrait: true },
        { kind: 'video', src: `${M}/moments-helen.mp4`, caption: 'Helen Fowler', portrait: true },
        { kind: 'video', src: `${M}/moments-volunteers.mp4`, caption: 'Volunteers', portrait: true },
      ],
    },
    {
      id: 'wayfinding',
      title: 'Finding the experiences',
      body: 'The system runs entirely in the browser — iOS does not support WebXR, so the AR stack is bespoke. Experiences are anchored to longitude/latitude positions and revealed by geofence: entering a viewing radius zooms the map to the viewing position, the anchor, and the visitor. The approach was validated in two rounds of on-site user testing.',
      media: [
        { kind: 'image', src: `${M}/map-geofence.png`, caption: 'Viewing + anchor positions' },
        { kind: 'image', src: `${M}/map-user.png`, caption: 'Geofence zoom', portrait: true },
        { kind: 'image', src: `${M}/permissions.jpg`, caption: 'Permissions, explained', portrait: true },
        { kind: 'image', src: `${M}/user-testing.jpg`, caption: 'User testing, May 2025' },
      ],
    },
  ],
}
