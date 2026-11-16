import { expect } from 'earl'
import { type LaneSize, laneLayout } from './laneLayout'

// Hand-built lanes of items with different sizes; each test reads the
// boxes the locations give and checks one property of the arrangement.
describe(laneLayout.name, () => {
  const sizes = new Map<string, LaneSize>([
    ['bridge', { width: 200, height: 100 }],
    ['inbox', { width: 240, height: 60 }],
    ['outbox', { width: 200, height: 80 }],
    ['rollup', { width: 200, height: 300 }],
    ['admin', { width: 200, height: 50 }],
    ['safe', { width: 260, height: 70 }],
  ])
  const lanes = [
    [['bridge'], ['inbox', 'outbox'], ['rollup']],
    [['admin'], ['safe']],
  ]

  it('places every item, and no two overlap', () => {
    const boxes = toBoxes(laneLayout(lanes, sizes), sizes)

    expect(boxes.map((box) => box.id).sort()).toEqual([...sizes.keys()].sort())
    for (const [index, first] of boxes.entries()) {
      for (const second of boxes.slice(index + 1)) {
        expect(overlap(first, second)).toEqual(false)
      }
    }
  })

  it('puts columns left to right, each as wide as its widest item', () => {
    const locations = laneLayout(lanes, sizes)

    expect(locations.bridge?.x).toEqual(0)
    expect(locations.inbox?.x).toEqual(locations.outbox?.x)
    // bridge is 200 wide, and the inbox column is 240 wide.
    expect(locations.inbox?.x).toEqual(200 + 160)
    expect(locations.rollup?.x).toEqual(200 + 160 + 240 + 160)
  })

  it('stacks the items of a column top to bottom', () => {
    const locations = laneLayout(lanes, sizes)

    expect(locations.outbox?.y).toEqual((locations.inbox?.y ?? 0) + 60 + 20)
  })

  it('stacks lanes top to bottom, below the tallest column', () => {
    const locations = laneLayout(lanes, sizes)

    expect(locations.rollup?.y).toEqual(0)
    expect(locations.admin?.y).toEqual(300 + 200 + Math.floor((70 - 50) / 2))
    expect(locations.safe?.y).toEqual(300 + 200)
  })

  it('centers each column vertically in its lane', () => {
    const locations = laneLayout(lanes, sizes)

    expect(locations.bridge?.y).toEqual((300 - 100) / 2)
    // inbox and outbox are 60 + 20 + 80 tall together.
    expect(locations.inbox?.y).toEqual((300 - 160) / 2)
  })
})

interface PlacedBox {
  id: string
  x: number
  y: number
  width: number
  height: number
}

function toBoxes(
  locations: ReturnType<typeof laneLayout>,
  sizes: ReadonlyMap<string, LaneSize>,
): PlacedBox[] {
  return Object.entries(locations).map(([id, location]) => {
    const size = sizes.get(id)
    if (size === undefined) {
      throw new Error('Placed an item without a size')
    }
    return { id, x: location.x, y: location.y, ...size }
  })
}

function overlap(first: PlacedBox, second: PlacedBox): boolean {
  const apartX =
    first.x + first.width <= second.x || second.x + second.width <= first.x
  const apartY =
    first.y + first.height <= second.y || second.y + second.height <= first.y
  return !apartX && !apartY
}
