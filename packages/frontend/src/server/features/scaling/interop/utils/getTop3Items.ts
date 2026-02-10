export type TopItems<T> = {
  items: T[]
  totalCount: number
}

export function getTopItems<T>(items: T[], limit: number): TopItems<T> {
  return {
    items: items.slice(0, limit),
    totalCount: items.length,
  }
}
