import { assert } from '@l2beat/shared-pure'

export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export interface Tile<T> extends Rectangle {
  item: T
}

interface Entry<T> {
  item: T
  area: number
}

// Squarified treemap of Bruls, Huizing and van Wijk: fill the space row by row
// along its shorter side, keeping every row for as long as adding one more item
// improves the worst aspect ratio in it. Rows laid this way stay close to
// square, which is what makes the areas comparable by eye.
export function squarify<T>(
  items: T[],
  toValue: (item: T) => number,
  bounds: Rectangle,
): Tile<T>[] {
  if (bounds.width <= 0 || bounds.height <= 0) {
    return []
  }
  const entries = toEntries(items, toValue, bounds)

  const tiles: Tile<T>[] = []
  let free = bounds
  let rowStart = 0
  while (rowStart < entries.length) {
    const shorterSide = Math.min(free.width, free.height)
    const rowEnd = findRowEnd(entries, rowStart, shorterSide)
    assert(rowEnd > rowStart, 'A row must consume at least one item')

    const row = layoutRow(entries.slice(rowStart, rowEnd), free)
    tiles.push(...row.tiles)
    free = row.free
    rowStart = rowEnd
  }

  return tiles
}

function toEntries<T>(
  items: T[],
  toValue: (item: T) => number,
  bounds: Rectangle,
): Entry<T>[] {
  const sorted = items
    .map((item) => ({ item, value: toValue(item) }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value)

  const total = sorted.reduce((sum, entry) => sum + entry.value, 0)
  if (total <= 0) {
    return []
  }

  const scale = (bounds.width * bounds.height) / total
  return sorted.map((entry) => ({
    item: entry.item,
    area: entry.value * scale,
  }))
}

function findRowEnd(
  entries: readonly { area: number }[],
  rowStart: number,
  shorterSide: number,
): number {
  const head = entries[rowStart]
  assert(head !== undefined, 'Row starts outside of the item list')

  let sum = head.area
  let worst = worstRatio(shorterSide, sum, head.area, head.area)
  let rowEnd = rowStart + 1
  while (rowEnd < entries.length) {
    const next = entries[rowEnd]
    assert(next !== undefined, 'Row runs past the end of the item list')

    const ratio = worstRatio(shorterSide, sum + next.area, head.area, next.area)
    if (ratio > worst) {
      break
    }
    sum += next.area
    worst = ratio
    rowEnd++
  }
  return rowEnd
}

// Aspect ratio of the least square tile a row would get. Items arrive largest
// first, so the biggest and smallest area in the row are its head and its tail.
function worstRatio(
  shorterSide: number,
  sum: number,
  areaMax: number,
  areaMin: number,
): number {
  const side2 = shorterSide * shorterSide
  const sum2 = sum * sum
  return Math.max((side2 * areaMax) / sum2, sum2 / (side2 * areaMin))
}

function layoutRow<T>(
  row: Entry<T>[],
  free: Rectangle,
): { tiles: Tile<T>[]; free: Rectangle } {
  const sum = row.reduce((total, entry) => total + entry.area, 0)
  const isColumn = free.width >= free.height
  const shorterSide = isColumn ? free.height : free.width
  const thickness = shorterSide > 0 ? sum / shorterSide : 0

  const tiles: Tile<T>[] = []
  let offset = 0
  for (const entry of row) {
    const length = thickness > 0 ? entry.area / thickness : 0
    tiles.push({
      item: entry.item,
      x: isColumn ? free.x : free.x + offset,
      y: isColumn ? free.y + offset : free.y,
      width: isColumn ? thickness : length,
      height: isColumn ? length : thickness,
    })
    offset += length
  }

  return {
    tiles,
    free: isColumn
      ? {
          x: free.x + thickness,
          y: free.y,
          width: Math.max(0, free.width - thickness),
          height: free.height,
        }
      : {
          x: free.x,
          y: free.y + thickness,
          width: free.width,
          height: Math.max(0, free.height - thickness),
        },
  }
}
