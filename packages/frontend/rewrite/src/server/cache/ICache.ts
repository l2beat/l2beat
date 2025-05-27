export interface ICache {
  get: <T>(
    options: {
      key: string[]
      ttl: number
      staleWhileRevalidate?: number
    },
    fallback: () => Promise<T>,
  ) => Promise<T>
}
