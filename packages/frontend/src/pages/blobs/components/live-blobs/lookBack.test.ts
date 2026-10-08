import { expect } from 'earl'
import { clampView, pastPagesFor } from './lookBack'

describe(clampView.name, () => {
  const hour = { head: 1000, slots: 300 }

  it('is live past the head, whose slot the live bay holds', () => {
    expect(clampView(1001, hour, 20)).toEqual(undefined)
    expect(clampView(1000, hour, 20)).toEqual(1000)
  })

  it('goes back no further than fills the belt left of the bay', () => {
    // the hour starts at 701, and 20 racks are left of the bay
    expect(clampView(500, hour, 20)).toEqual(721)
    expect(clampView(850, hour, 20)).toEqual(850)
  })

  it('stays live while the hour is too short to look back through', () => {
    expect(clampView(990, { head: 1000, slots: 15 }, 20)).toEqual(undefined)
  })
})

describe(pastPagesFor.name, () => {
  it('fetches the pages from the belt up to what the live answers carry', () => {
    // 32 slots a page; the live answers carry 969-1000
    expect(pastPagesFor(900, 1000)).toEqual([28, 29, 30])
    expect(pastPagesFor(980, 1000)).toEqual([])
  })
})
