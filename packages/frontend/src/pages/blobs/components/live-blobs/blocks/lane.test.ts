import { expect } from 'earl'
import type { PendingBlobBatch } from './beaconChain'
import { layoutBelt } from './beltLayout'
import { type LaneSpot, pendingSpot, updateLane } from './lane'

// Methodology: a lane with one batch that has just left the pending ones, as
// when its block came, updated once with motion and once without.
describe(updateLane.name, () => {
  const layout = layoutBelt(800, 300, 21, 14)
  const batch: PendingBlobBatch = {
    key: 'base:1',
    posterIndex: 0,
    blobs: 2,
    to: '0x',
    firstSeenAt: 0,
  }
  const laneWith = (spot: LaneSpot) => new Map([[batch.key, spot]])

  it('lets a batch no longer pending fade out', () => {
    const lane = laneWith(pendingSpot(batch, 0))

    updateLane(lane, new Map(), layout, 10, 0.016, false)

    expect(lane.get(batch.key)?.goneAt).toEqual(10)
  })

  it('takes a batch no longer pending off at once when nothing moves', () => {
    const lane = laneWith(pendingSpot(batch, 0))

    updateLane(lane, new Map(), layout, 10, 0.016, true)

    expect(lane.size).toEqual(0)
  })
})
