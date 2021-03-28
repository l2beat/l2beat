export interface Point {
  date: string
}

export function tvlSorter(a: Point, b: Point) {
  return new Date(a.date).getTime() - new Date(b.date).getTime()
}
