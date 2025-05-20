export interface ICache {
  get: <T>(options: { key: string; ttl: number },
    callback: () => Promise<T>,
  ) => Promise<T>
}

