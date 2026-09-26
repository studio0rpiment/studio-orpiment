import { useCallback, useReducer } from 'react'

type State = { index: number; previous: number | null; direction: 1 | -1 }
type Action =
  | { type: 'step'; dir: 1 | -1; count: number }
  | { type: 'go'; target: number; count: number }
  | { type: 'settle' }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'step': {
      const index = (s.index + a.dir + a.count) % a.count
      return { index, previous: s.index, direction: a.dir }
    }
    case 'go': {
      const index = ((a.target % a.count) + a.count) % a.count
      if (index === s.index) return s
      return { index, previous: s.index, direction: index > s.index ? 1 : -1 }
    }
    case 'settle':
      return s.previous === null ? s : { ...s, previous: null }
  }
}

/**
 * Index state for a looping slider. It changes only on user action — there
 * is no autoplay. `previous` stays set while the incoming slide is being
 * revealed over it; the reveal's transitionend calls `settle()` to release it.
 */
export function useSlider(count: number) {
  const [state, dispatch] = useReducer(reducer, { index: 0, previous: null, direction: 1 })
  const next = useCallback(() => dispatch({ type: 'step', dir: 1, count }), [count])
  const prev = useCallback(() => dispatch({ type: 'step', dir: -1, count }), [count])
  const go = useCallback((target: number) => dispatch({ type: 'go', target, count }), [count])
  const settle = useCallback(() => dispatch({ type: 'settle' }), [])
  return { ...state, next, prev, go, settle }
}
