// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => Promise<any>

const cache = new Map<string, unknown>()

export function unstable_cache<T extends Callback>(
  cb: T,
  keyParts?: string[],
  __?: unknown,
): T {
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(`${keyParts?.join(':')}:${JSON.stringify(args)}`)

    const cached = cache.get(key)
    if (cached) {
      return Promise.resolve(cached) as ReturnType<T>
    }

    return cb(...args).then((result) => {
      cache.set(key, result)
      return result as ReturnType<T>
    })
  }) as T
}
