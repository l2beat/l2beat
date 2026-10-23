import { install } from '@sinonjs/fake-timers'

/** Runs `start` with fake timers, so its waits pass at once. */
export async function withFakeTimers<T>(start: () => Promise<T>): Promise<T> {
  const time = install()
  try {
    const promise = start()
    // runAllAsync yields to real timers, where a rejection with no handler
    // yet is reported as unhandled; the await below still rethrows it.
    promise.catch(() => {})
    await time.runAllAsync()
    return await promise
  } finally {
    time.uninstall()
  }
}
