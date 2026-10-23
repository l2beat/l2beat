import { install } from '@sinonjs/fake-timers'

/** Runs `start` with fake timers, so its waits pass at once. */
export async function withFakeTimers<T>(start: () => Promise<T>): Promise<T> {
  const time = install()
  try {
    const promise = start()
    await time.runAllAsync()
    return await promise
  } finally {
    time.uninstall()
  }
}
