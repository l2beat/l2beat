import { assert } from '@l2beat/shared-pure'
import type { NodeLocations } from './storage'

// Like flowLayout's spacing between layers and between nodes of a layer,
// with lanes further apart than anything inside one.
const COLUMN_GAP_PX = 160
const ITEM_GAP_PX = 20
const LANE_GAP_PX = 200
// What is arranged under the lanes reads as one more lane.
export const BELOW_LANES_GAP_PX = LANE_GAP_PX

export interface LaneSize {
  readonly width: number
  readonly height: number
}

// Lanes stack top to bottom from (0, 0). In a lane, columns go left to right,
// each as wide as its widest item, and stand vertically centered in the
// lane; a column's items are left-aligned and stack top to bottom.
export function laneLayout(
  lanes: readonly (readonly (readonly string[])[])[],
  sizes: ReadonlyMap<string, LaneSize>,
): NodeLocations {
  const locations: NodeLocations = {}
  let laneTop = 0
  for (const lane of lanes) {
    const columnHeights = lane.map((column) => columnHeight(column, sizes))
    const laneHeight = Math.max(0, ...columnHeights)
    let columnLeft = 0
    for (const [index, column] of lane.entries()) {
      const height = columnHeights[index] as number
      let top = laneTop + Math.floor((laneHeight - height) / 2)
      let width = 0
      for (const id of column) {
        const size = sizeOf(sizes, id)
        assert(locations[id] === undefined, 'Item placed twice')
        locations[id] = { x: columnLeft, y: top }
        top += size.height + ITEM_GAP_PX
        width = Math.max(width, size.width)
      }
      columnLeft += width + COLUMN_GAP_PX
    }
    laneTop += laneHeight + LANE_GAP_PX
  }
  return locations
}

function columnHeight(
  column: readonly string[],
  sizes: ReadonlyMap<string, LaneSize>,
): number {
  let height = 0
  for (const id of column) {
    height += sizeOf(sizes, id).height
  }
  return height + Math.max(0, column.length - 1) * ITEM_GAP_PX
}

function sizeOf(sizes: ReadonlyMap<string, LaneSize>, id: string): LaneSize {
  const size = sizes.get(id)
  assert(size !== undefined, 'Item without a size')
  return size
}
