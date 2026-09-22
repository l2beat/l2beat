import { expect } from 'earl'
import {
  describePrivacyRosetteSlice,
  getPrivacyRosetteArcs,
  getPrivacyRosetteRingArcs,
} from './privacyRosetteGeometry'

describe('getPrivacyRosetteArcs', () => {
  it('returns nothing for an empty half', () => {
    expect(getPrivacyRosetteArcs(0, 'right')).toEqual([])
  })

  it('fills the right half from the top clockwise', () => {
    const arcs = getPrivacyRosetteArcs(5, 'right')

    expect(arcs.length).toEqual(5)
    expect(arcs[0]?.start).toEqual(14)
    expect(arcs[4]?.end).toEqual(166)
    expect(arcs.map((arc) => arc.start)).toEqual(
      [...arcs.map((arc) => arc.start)].sort((a, b) => a - b),
    )
  })

  it('lists the left half top to bottom as well', () => {
    const arcs = getPrivacyRosetteArcs(3, 'left')

    expect(arcs[0]?.end).toEqual(346)
    expect(arcs[2]?.start).toEqual(194)
    // Read in order, the slices walk up the left side, i.e. anticlockwise.
    expect(arcs[0]!.start > arcs[1]!.start).toEqual(true)
    expect(arcs[1]!.start > arcs[2]!.start).toEqual(true)
  })

  it('leaves the same gap between every pair of neighbours', () => {
    const arcs = getPrivacyRosetteArcs(4, 'right')
    const gaps = arcs.slice(1).map((arc, index) => arc.start - arcs[index]!.end)

    expect(gaps).toEqual([3, 3, 3])
  })

  it('gives a lone slice the whole half', () => {
    expect(getPrivacyRosetteArcs(1, 'right')).toEqual([{ start: 14, end: 166 }])
  })
})

describe('getPrivacyRosetteRingArcs', () => {
  it('centres the first slice at the top and closes the ring', () => {
    const arcs = getPrivacyRosetteRingArcs(5)

    expect(arcs.length).toEqual(5)
    expect(arcs[0]!.start + arcs[0]!.end).toEqual(0)
    // The last slice ends one gap short of where the first one starts.
    expect(
      Math.round((arcs[4]!.end + 3 - (arcs[0]!.start + 360)) * 1e9),
    ).toEqual(0)
  })
})

describe('describePrivacyRosetteSlice', () => {
  it('draws an annular sector that closes back on itself', () => {
    const path = describePrivacyRosetteSlice({ start: 0, end: 90 }, 80, 40)

    expect(path).toEqual(
      'M90 10 A80 80 0 0 1 170 90 L130 90 A40 40 0 0 0 90 50 Z',
    )
  })

  it('sets the large arc flag once a slice passes a half turn', () => {
    const path = describePrivacyRosetteSlice({ start: 0, end: 200 }, 80, 40)

    expect(path.includes('A80 80 0 1 1')).toEqual(true)
  })
})
