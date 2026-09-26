import { useMemo, useSyncExternalStore } from 'react'

/**
 * View state, driven by the URL hash so every view is linkable:
 *   ''                → the landing composition
 *   '#/work'          → the work list
 *   '#/work/<slug>'   → a project showcase
 * Event-driven: navigation writes the hash; React subscribes to hashchange.
 * (The store snapshot is the raw hash STRING — stable between events — and
 * the parsed view object is memoized from it.)
 */

export type View = { name: 'landing' } | { name: 'work' } | { name: 'project'; slug: string }

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function parse(hash: string): View {
  if (hash.startsWith('#/work/')) return { name: 'project', slug: hash.slice('#/work/'.length) }
  if (hash === '#/work') return { name: 'work' }
  return { name: 'landing' }
}

export function useView(): View {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  return useMemo(() => parse(hash), [hash])
}

export function navigate(hash: '' | `#/work` | `#/work/${string}`): void {
  if (hash === '') {
    // clear without leaving a dangling '#'
    history.pushState(null, '', window.location.pathname + window.location.search)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else {
    window.location.hash = hash
  }
}
