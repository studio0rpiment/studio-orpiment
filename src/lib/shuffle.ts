/** Fisher–Yates: a new, evenly random order of the items (the input is left as is). */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** keep the first item where it is and shuffle the rest */
export function shuffleAfterFirst<T>(items: readonly T[]): T[] {
  const [first, ...rest] = items
  return first === undefined ? [] : [first, ...shuffle(rest)]
}
