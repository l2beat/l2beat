export interface ICache {
  get: <T>(
    options: {
      key: (string | undefined)[]
      ttl: number
      staleWhileRevalidate?: number
    },
    fallback: () => Promise<T>,
  ) => Promise<T>
}
