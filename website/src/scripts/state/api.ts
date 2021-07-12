// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, Promise<any>>()

export function apiGet<T>(url: string): Promise<T> {
  const cached = cache.get(url)
  if (cached) {
    return cached
  }
  const result = fetch(url).then((res) => res.json())
  cache.set(url, result)
  return result
}
