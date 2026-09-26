import { Project } from './types'

const M = '/projects/wayside'

export const wayside: Project = {
  slug: 'wayside',
  num: '01',
  title: 'wayside.at',
  category: 'AR',
  year: '2025',
  link: 'https://kenilworth.wayside.at',
  // Desktop spread — the information distributed across the composition's
  // faces. Designed against desktop layout 1; cards travel with their piece
  // when the composition rearranges.
  spread: {
    'right-portrait': { type: 'title' },
    'lower-left': { type: 'intro' },
    'lower-right': { type: 'facts' },
    'left-portrait': { type: 'image', src: `${M}/hero.jpg` },
    'r1c2': { type: 'image', src: `${M}/map-geofence.png` },
    'r2c1': { type: 'image', src: `${M}/user-testing.jpg` },
    'r2c2': { type: 'image', src: `${M}/map-user.png` },
    'r3c3': { type: 'more' },
  },
  showcase: {
    facts: {
      date: 'Summer 2025',
      client: 'Andrew Kastner & The Fourth Floor Design Collective',
      role: 'AR + app development, interaction design',
    },
    intro:
      'wayside.at is a browser-based augmented reality system built for Kenilworth Aquatic Gardens, commissioned by artist-in-residence Andrew Kastner with Capital Fringe. Nine geolocated experiences interpret the park across three themes — time, seasons, and moments — rendered as point clouds.',
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
  },
}
