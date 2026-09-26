import { useEffect, useRef } from 'react'

/** calls `handler` on keydown of any of `keys` while `active` */
export function useKey(keys: string[], handler: (e: KeyboardEvent) => void, active = true) {
  const ref = useRef(handler)
  ref.current = handler
  const list = keys.join('|')
  useEffect(() => {
    if (!active) return
    const wanted = list.split('|')
    const onKey = (e: KeyboardEvent) => {
      if (wanted.includes(e.key)) ref.current(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [list, active])
}
