export interface ICache {
  get: <T>(
    options: { key: string; ttl: number },
    fallback: () => Promise<T>,
  ) => Promise<T>
}
