import { expect } from 'earl'
import { clampView, pastPagesFor } from './lookBack'

// Methodology: a day of 300 slots ending at head 1000, with a belt of 20
// racks left of the bay; a slot asked for is clamped and checked.
describe(clampView.name, () => {
  const day = { head: 1000, slots: 300 }

  it('is live from the head on, whose block the live bay holds', () => {
    expect(clampView(1001, day, 20)).toEqual(undefined)
    expect(clampView(1000, day, 20)).toEqual(undefined)
    expect(clampView(999, day, 20)).toEqual(999)
  })

  it('goes back no further than fills the belt left of the bay', () => {
    // the day starts at 701, and 20 racks are left of the bay
    expect(clampView(500, day, 20)).toEqual(721)
    expect(clampView(850, day, 20)).toEqual(850)
  })

  it('stays live while the day is too short to look back through', () => {
    expect(clampView(990, { head: 1000, slots: 15 }, 20)).toEqual(undefined)
  })
})

describe(pastPagesFor.name, () => {
  // 32 slots a page; the live answers carry 9969-10000, and the belt glides
  // through at most 32 slots
  const racks = { before: 20, after: 5 }

  it('fetches the racks around the view and the run-up to live, not the slots between', () => {
    // around the view: 4947-5037; the run-up: 9947-9968
    expect(pastPagesFor(5000, 10_000, racks)).toEqual([
      154, 155, 156, 157, 310, 311,
    ])
  })

  it('fetches nothing the live answers carry', () => {
    expect(pastPagesFor(9990, 10_000, racks)).toEqual([310, 311])
  })
})
