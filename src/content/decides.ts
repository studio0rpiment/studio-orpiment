import type { CaseStudy } from './types'

const M = '/projects/decides'

export const decides: CaseStudy = {
  slug: 'decides',
  kicker: 'Case study',
  title: 'DECIDE(S)',
  link: { href: 'https://decides.app', label: 'decides.app' },
  facts: [
    { label: 'Date', value: '2026' },
    { label: 'Studio', value: 'Concept, design, and development' },
    { label: 'Stack', value: 'React, TypeScript, Node, WebSockets, SQLite, Cloudflare R2' },
    { label: 'Context', value: 'Developed during a spring 2026 sabbatical, from discussions with the Berlin chamber jazz group Azolia' },
  ],
  intro:
    'DECIDE(S) is a networked workspace for evaluating multiple iterations of recorded music. Bands, producers, and engineers review takes, edits, mixes, and masters in a shared session, score them, discuss them, and record a decision. The system is intended for production work that generates many takes per piece — jazz ensembles and contemporary chamber and orchestral sessions.',
  chapters: [
    {
      id: 'playback',
      title: 'Playback',
      body: 'Each take carries a waveform player; amplitude peaks are computed from the source audio and cached, and the waveform is the scrubber. Playback is single-channel: starting one take stops all others. Named sections are shared across takes for like-for-like comparison, and any take can detach into a floating, always-on-top card that stays above a DAW or notation software.',
      media: [{ kind: 'image', src: `${M}/landing.jpg`, caption: 'decides.app, sign-in and description' }],
    },
    {
      id: 'evaluation',
      title: 'Evaluation',
      body: 'Per-section scoring on a scale of 0–100 displays the individual score, the group average, and one colour dot per participant. MUST and NEVER designations mark takes without relocating them. Notes are author-stamped, thread one level deep, and accept image attachments and mentions.',
      media: [],
    },
    {
      id: 'synchronization',
      title: 'Synchronization',
      body: 'Votes, notes, and flags propagate to every connected device over WebSockets, with a polling fallback for networks that open a socket but never deliver frames. A per-viewer activity layer reports what other members have changed since the last visit.',
      media: [],
    },
    {
      id: 'listening',
      title: 'Critical listening',
      body: 'A critical listening mode bypasses the Web Audio graph and plays each file through the browser’s native media path at unity gain. Files are stored and served exactly as bounced, byte for byte, and remain downloadable so that every participant can audition the original on their own system.',
      media: [],
    },
  ],
}
