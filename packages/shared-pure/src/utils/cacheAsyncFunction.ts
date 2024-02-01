export function cacheAsyncFunction<T>(fn: () => Promise<T>): {
  call: () => Promise<T>
  refetch: () => Promise<void>
} {
  let cached: { value: T } | undefined = undefined
  let promise: Promise<void> | undefined = undefined

  const refetch = async () => {
    promise = fn().then((value) => {
      cached = { value }
      promise = undefined
    })
  }

  const call = async () => {
    if (promise) {
      await promise
    }
    if (cached) {
      return cached.value
    }
    await refetch()
    return cached!.value
  }

  return { call, refetch }
}
