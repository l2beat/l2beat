export type TopItems<T> = {
  items: T[]
  remainingCount: number
}

export function getTopItems<T>(items: T[], limit: number): TopItems<T> {
  return {
    items: items.slice(0, limit),
    remainingCount: Math.max(items.length - limit, 0),
  }
}
