import { expect } from 'earl'
import { type Rectangle, squarify } from './squarify'

const BOUNDS: Rectangle = { x: 0, y: 0, width: 400, height: 300 }

// Methodology: the layout is checked through its invariants instead of exact
// coordinates, because the row breaks depend on the aspect ratio heuristic and
// would make coordinate assertions a copy of the implementation.
describe('squarify', () => {
  it('gives every item a tile with an area proportional to its value', () => {
    const values = [50, 25, 12, 8, 5]
    const tiles = squarify(values, (value) => value, BOUNDS)

    expect(tiles.length).toEqual(values.length)
    const total = values.reduce((sum, value) => sum + value, 0)
    const boundsArea = BOUNDS.width * BOUNDS.height
    for (const tile of tiles) {
      const expected = (tile.item / total) * boundsArea
      expect(tile.width * tile.height).toBeCloseTo(expected, 0.001)
    }
  })

  it('fills the bounds without overflowing them', () => {
    const tiles = squarify([9, 7, 6, 4, 3, 2, 1], (value) => value, BOUNDS)

    const covered = tiles.reduce(
      (sum, tile) => sum + tile.width * tile.height,
      0,
    )
    expect(covered).toBeCloseTo(BOUNDS.width * BOUNDS.height, 0.001)

    for (const tile of tiles) {
      expect(tile.x).toBeGreaterThanOrEqual(BOUNDS.x - 0.001)
      expect(tile.y).toBeGreaterThanOrEqual(BOUNDS.y - 0.001)
      expect(tile.x + tile.width).toBeLessThanOrEqual(
        BOUNDS.x + BOUNDS.width + 0.001,
      )
      expect(tile.y + tile.height).toBeLessThanOrEqual(
        BOUNDS.y + BOUNDS.height + 0.001,
      )
    }
  })

  it('lays out tiles that do not overlap', () => {
    const tiles = squarify([40, 30, 20, 6, 3, 1], (value) => value, BOUNDS)

    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        const a = tiles[i]
        const b = tiles[j]
        expect(a).not.toEqual(undefined)
        expect(b).not.toEqual(undefined)
        if (a === undefined || b === undefined) {
          continue
        }
        const overlapX =
          Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
        const overlapY =
          Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
        expect(Math.min(overlapX, overlapY)).toBeLessThanOrEqual(0.001)
      }
    }
  })

  it('drops items without a value', () => {
    const tiles = squarify([10, 0, 5, -1], (value) => value, BOUNDS)

    expect(tiles.map((tile) => tile.item)).toEqual([10, 5])
  })

  it('returns nothing for empty input or empty bounds', () => {
    expect(squarify([], (value: number) => value, BOUNDS)).toEqual([])
    expect(
      squarify([1, 2], (value) => value, { x: 0, y: 0, width: 0, height: 10 }),
    ).toEqual([])
  })
})
