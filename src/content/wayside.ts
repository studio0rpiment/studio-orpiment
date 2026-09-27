import type { CaseStudy } from './types'

const M = '/projects/wayside'

/**
 * Follows the Wayside breakdown in the Creative Work Dossier (2026 update,
 * pp. 20–28): description, the challenge, the three themes and their nine
 * experiences, navigation and wayfinding, system development, client
 * engagement, user testing, and examples. Text is the dossier's, lightly
 * copy-edited for the web.
 */
export const wayside: CaseStudy = {
  slug: 'wayside',
  kicker: 'Case study',
  title: 'wayside.at',
  link: { href: 'https://kenilworth.wayside.at', label: 'kenilworth.wayside.at' },
  facts: [
    { label: 'Date', value: 'Summer 2025' },
    { label: 'Client', value: 'Andrew Kastner and The Fourth Floor Design Collective' },
    { label: 'Role', value: 'AR + app development and interaction design' },
    { label: 'Concept', value: 'Andrew Kastner — concept, themes, map, icons, visual identity' },
    { label: 'Site', value: 'Kenilworth Aquatic Gardens, Washington, DC, with Capital Fringe' },
  ],
  intro:
    'wayside.at is an augmented reality app envisioned by Andrew Kastner while an artist-in-residence at Kenilworth Aquatic Gardens, in partnership with Capital Fringe. His residency focused on researching the history of the park and the impacts of climate change on it, and transforming them into nine interpretations within three themes: time, seasons, and moments.',
  cover: { kind: 'image', src: `${M}/mockup-callout.jpg`, caption: 'Lotus, placed in the landscape as a point cloud' },
  chapters: [
    {
      id: 'challenge',
      title: 'The challenge',
      lead: 'Create a map-based AR application that guides users through the park to nine specific locations, where they can experience AR visualizations based on the three themes created by Andrew.',
      blocks: [
        {
          kind: 'text',
          text: 'Andrew is an artist and stroke survivor whose work explores post-linguistic communication, an interest that deepened after a stroke and resulting aphasia. His aesthetic for this project is defined by point clouds, so 3D model generation had to be transformed into point cloud models. The size and scope of the project is also notable: any one of the nine experiences could be an entire project in itself.',
        },
      ],
    },
    {
      id: 'time',
      title: 'Time',
      lead: 'Tracing 4,000 years of park history and its climate-driven future.',
      blocks: [
        {
          kind: 'experiences',
          items: [
            {
              name: 'BC2200',
              concept: 'By 2200 BC the Savannah River people lived along the major rivers east of the Blue Ridge Mountains. Rivers and waterways were important for trade and transportation, and were affected by the cycles of the incoming and outgoing tides.',
              requirements: 'Position a point cloud model of a Native American in a canoe, visible at high tide, and dynamically modify the model’s point resolution depending on the phone’s processor.',
              solution: { kind: 'video', src: `${M}/time-bc2200.mp4`, poster: `${M}/time-bc2200-poster.webp` },
            },
            {
              name: '1968',
              concept: 'Call attention to the former practice of burning up to 250,000 tons of garbage a year, carried on in Northeast DC until 1968, when the fire claimed the life of a young boy.',
              requirements: 'Create and position a point cloud visualization of billowing smoke, simulating the burning of up to 250,000 tons of garbage.',
              solution: { kind: 'video', src: `${M}/time-1968.mp4`, poster: `${M}/time-1968-poster.webp` },
            },
            {
              name: '2030–2100',
              concept: 'Sea level rise and coastal flood maps highlight areas at risk, including Kenilworth, which sits in a severely threatened zone. Projections show significant flooding throughout the gardens, raising the question: what will happen to them by 2100, or even 2030?',
              requirements: 'Create and position a point cloud simulation of rising water levels that responds to a slider linked to the flooding projections for Kenilworth Park.',
              solution: { kind: 'video', src: `${M}/time-2030.mp4`, poster: `${M}/time-2030-poster.webp` },
            },
          ],
        },
      ],
    },
    {
      id: 'seasons',
      title: 'Seasons',
      lead: 'Highlighting biodiversity and plant transformations through animated point clouds.',
      blocks: [
        {
          kind: 'text',
          heading: 'Requirements',
          text: 'Create a real-time particle morphing system, based on point cloud models, that adapts to the strength of each visitor’s phone.',
        },
        {
          kind: 'experiences',
          items: [
            { name: 'Lotus', solution: { kind: 'video', src: `${M}/seasons-lotus.mp4`, poster: `${M}/seasons-lotus-poster.webp` } },
            { name: 'Water lily', solution: { kind: 'video', src: `${M}/seasons-lily.mp4`, poster: `${M}/seasons-lily-poster.webp` } },
            { name: 'Cattail', solution: { kind: 'video', src: `${M}/seasons-cattail.mp4`, poster: `${M}/seasons-cattail-poster.webp` } },
          ],
        },
        {
          kind: 'exhibit',
          caption: 'Point clouds from the project data. Drag to turn; select a form to morph.',
          forms: [
            { id: 'lotus', label: 'Lotus', src: '/models/points/lotus_2.bin' },
            { id: 'lily', label: 'Water lily', src: '/models/points/lily_1.bin' },
            { id: 'cattail', label: 'Cattail', src: '/models/points/cattail_1.bin' },
          ],
        },
      ],
    },
    {
      id: 'moments',
      title: 'Moments',
      lead: 'Showcasing figures who shaped Kenilworth’s legacy.',
      blocks: [
        {
          kind: 'experiences',
          items: [
            {
              name: 'Ranger Mac',
              concept: 'Growing up, Walter, “Ranger Mac” to visitors, often explored these gardens on his own and through ranger-led activities. In 1968 he was hired as one of the first African American national park rangers. He inspired everyone with his love of nature.',
              requirements: 'Position a point cloud model of a scene with Ranger Mac.',
              solution: { kind: 'video', src: `${M}/moments-mac.mp4`, poster: `${M}/moments-mac-poster.webp` },
            },
            {
              name: 'Helen Fowler',
              concept: 'Helen Fowler was the founder of Kenilworth Aquatic Gardens. In addition to being women-owned, the Gardens under her leadership employed a number of local African American residents in the early twentieth century.',
              requirements: 'Position a point cloud model of a vintage photograph of Helen Fowler and crew from the early twentieth century.',
              solution: { kind: 'video', src: `${M}/moments-helen.mp4`, poster: `${M}/moments-helen-poster.webp` },
            },
            {
              name: 'Volunteers',
              concept: 'The park has always relied on volunteers from the community. This experience shows that the love and support still flow from the community.',
              requirements: 'Position a point cloud model of a scene with volunteers working in the park.',
              solution: { kind: 'video', src: `${M}/moments-volunteers.mp4`, poster: `${M}/moments-volunteers-poster.webp` },
            },
          ],
        },
      ],
    },
    {
      id: 'wayfinding',
      title: 'Navigation and wayfinding',
      lead: 'One of the most crucial aspects of my responsibility was helping users find the experiences.',
      blocks: [
        {
          kind: 'text',
          text: 'Andrew had designed a map and icons to represent the experiences, but they had to be geolocated and visible on the map, and users needed to be prompted as they approached the experience locations. I created several systems and interaction modes based on user proximity and map zoom.',
        },
        {
          kind: 'text',
          heading: 'Viewing position v. experience position',
          text: 'For users to see the experiences, they need to be at a specific location in the park. These positions were defined in longitude and latitude. Each marker represents either a viewing position (the geofence centre) or an anchor position, the location in the physical world to which the experience is tied. In the app they were eventually represented with inverted icons. This is a good example of how I use interaction design principles: the client had not indicated any method of helping users find the experiences.',
        },
        { kind: 'media', items: [{ kind: 'image', src: `${M}/map-positions.webp`, caption: 'Viewing and anchor positions across the park', span: 12 }] },
        {
          kind: 'text',
          heading: 'Geofencing, zoom effects, and user location tracker',
          text: 'I created a geofence concept that indicates to users when they are within range of a viewing location. When users enter a geofence boundary, the map automatically zooms to show the viewing position, the anchor location, and their own position.',
        },
        {
          kind: 'media',
          items: [
            { kind: 'image', src: `${M}/map-viewing-anchor.webp`, caption: 'Viewing and anchor positions', span: 4 },
            { kind: 'image', src: `${M}/map-geofence-zoom.webp`, caption: 'Geofence zoom: viewing position, anchor, and user', span: 4 },
          ],
        },
      ],
    },
    {
      id: 'system',
      title: 'System development and challenges',
      lead: 'From markers to geolocation, and a bespoke AR system in the browser.',
      blocks: [
        {
          kind: 'text',
          text: 'At the beginning of the project we planned to use markers, a distinct pattern like a QR code, to cue each experience: a much simpler and more direct approach. A user sees the marker, a physical object at the viewing location, and the phone recognizes it and launches the experience; several existing code libraries support this. Weeks into that work, however, we were informed that the park service would not allow physical markers in the park, so we pivoted to a geolocation model.',
        },
        {
          kind: 'text',
          text: 'While well-known libraries support geolocation, I advocated for a browser-based experience, to obviate the need to download an app. It is well documented that users dislike being required to download an app: a study by Forbes showed that 91% of people see downloading apps negatively, and Pew Research Center research shows that most adults don’t use more than five or six apps regularly. A browser-based solution means people simply need a QR code to visit the site.',
        },
        {
          kind: 'text',
          heading: 'Complications of iOS',
          text: 'WebXR, a standard that allows users to access augmented reality (AR) and virtual reality (VR) experiences directly through web browsers, is not supported in iOS. Apple supports XR through its own approved technologies, which require native apps built with ARKit or RealityKit. Given this, I created a bespoke AR system to support the project.',
        },
      ],
    },
    {
      id: 'engagement',
      title: 'Client engagement and collaborative models',
      lead: 'When asked to create a system with this level of complexity, I try to give the client a way to interact with concepts and try different approaches.',
      blocks: [
        {
          kind: 'text',
          text: 'For this project I used CodePen, an online way of sharing code examples without the overhead of an app.',
        },
        { kind: 'media', items: [{ kind: 'image', src: `${M}/codepen.webp`, caption: 'Prototypes shared on CodePen', span: 12 }] },
        {
          kind: 'text',
          text: 'For Seasons, where four point cloud models were to morph into each other, I created an interface that allowed the client to test different approaches. It offered four mathematical modes of morphing: direct interpolation (linear); “flowing streams” (Bézier curve interpolation); spawn and dissolve (points disappear and emerge from a single position); and “organic growth,” a variation of linear interpolation with randomness remapped every phase. Many more parameters vary the experience, including point density, smoothing, and animation rate.',
          link: { href: 'https://codepen.io/KevinPatton1/pen/bNdggOm', label: 'Try it on CodePen' },
        },
        {
          kind: 'text',
          text: 'I also created testing windows for the client to manipulate components of the models and their placement in the park. These model and placement windows allow precise positioning, based on user and client experience.',
        },
        {
          kind: 'media',
          items: [
            { kind: 'image', src: `${M}/testing-window-1.webp`, caption: 'Model window', span: 3 },
            { kind: 'image', src: `${M}/testing-window-2.webp`, caption: 'Placement window', span: 3 },
            { kind: 'image', src: `${M}/testing-window-ar.webp`, caption: 'Placement in the park', span: 3 },
          ],
        },
        {
          kind: 'text',
          text: 'Another way I create avenues of communication is a dev journal that shows snippets of features and work in progress. It also serves as process documentation.',
        },
        { kind: 'media', items: [{ kind: 'image', src: `${M}/dev-journal.webp`, caption: 'The dev journal', span: 12 }] },
      ],
    },
    {
      id: 'testing',
      title: 'User testing',
      lead: 'I led two user testing sessions that gave crucial insight into two key components of the app: data and permissions handling, and how visitors behave in the park and use their phones.',
      blocks: [
        {
          kind: 'text',
          heading: 'Data and permissions',
          text: 'Unsurprisingly, none of the users who tested wanted to download a separate app, which confirmed my earlier research. The users were also very clear that they wanted to know specifically how permissions would be handled, and whether we were storing any user data. This helped us be specific in our messages: we are not storing data, and here is why the app needs each permission.',
        },
        {
          kind: 'media',
          items: [
            { kind: 'image', src: `${M}/permission-camera.webp`, span: 4 },
            { kind: 'image', src: `${M}/permission-location.webp`, span: 4 },
            { kind: 'image', src: `${M}/permission-motion.webp`, span: 4 },
          ],
        },
        {
          kind: 'text',
          heading: 'User behavior and phone treatment',
          text: 'One of the most crucial insights came from observing how users managed their phones during the experience. Because of the distance and walking required to visit each location, users would close their phones and put them in their pockets, or multitask, between experiences. This revealed the need for the app to persist while users were in the park.',
        },
        {
          kind: 'media',
          items: [
            { kind: 'image', src: `${M}/testing-group.webp`, caption: 'The May 2, 2025 group', span: 4 },
            { kind: 'image', src: `${M}/testing-in-action.webp`, caption: 'In action', span: 4 },
            { kind: 'image', src: `${M}/testing-dietz.webp`, caption: 'May 24, 2025: Andrea Dietz testing with Andrew Kastner and me', span: 4 },
          ],
        },
      ],
    },
    {
      id: 'examples',
      title: 'Examples and screenshots',
      blocks: [
        {
          kind: 'media',
          items: [
            { kind: 'image', src: `${M}/mockup-1.webp`, span: 4 },
            { kind: 'image', src: `${M}/mockup-2.webp`, span: 4 },
            { kind: 'image', src: `${M}/mockup-3.webp`, span: 4 },
          ],
        },
        {
          kind: 'media',
          items: [
            { kind: 'image', src: `${M}/screen-splash.webp`, caption: 'Landing', span: 3 },
            { kind: 'image', src: `${M}/screen-kenilworth.webp`, caption: 'Themes', span: 3 },
            { kind: 'image', src: `${M}/screen-permissions.webp`, caption: 'Required permissions', span: 3 },
            { kind: 'image', src: `${M}/screen-onboarding.webp`, caption: 'Onboarding', span: 3 },
            { kind: 'image', src: `${M}/screen-map.webp`, caption: 'Map', span: 3 },
            { kind: 'image', src: `${M}/screen-lotus.webp`, caption: 'Lotus in the pond', span: 3 },
            { kind: 'image', src: `${M}/screen-lotus-modal.webp`, caption: 'Lotus, launch', span: 3 },
            { kind: 'image', src: `${M}/screen-1968-modal.webp`, caption: '1968, launch', span: 3 },
          ],
        },
      ],
    },
  ],
}
