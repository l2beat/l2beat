/** Runs at most `limit` calls at once; the rest wait their turn in order. */
export function createLimiter(limit: number) {
  let running = 0
  const waiting: (() => void)[] = []

  return async function run<T>(fn: () => Promise<T>): Promise<T> {
    if (running < limit) {
      running++
    } else {
      // The finishing call hands its slot over, so `running` stays put.
      await new Promise<void>((resolve) => waiting.push(resolve))
    }
    try {
      return await fn()
    } finally {
      const next = waiting.shift()
      if (next) {
        next()
      } else {
        running--
      }
    }
  }
}
