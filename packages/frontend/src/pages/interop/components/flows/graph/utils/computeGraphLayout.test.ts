import { expect } from 'earl'
import { computeGraphLayout, type FlowsGraphLayout } from './computeGraphLayout'

describe(computeGraphLayout.name, () => {
  const volumes = [
    { chainId: 'a', totalVolume: 100 },
    { chainId: 'b', totalVolume: 25 },
    { chainId: 'c', totalVolume: 25 },
    { chainId: 'hub', totalVolume: 150 },
  ]

  it('places every chain on the ring by default', () => {
    const layout = computeGraphLayout(
      ['a', 'b', 'c', 'hub'],
      volumes,
      1000,
      false,
    )

    for (const id of ['a', 'b', 'c', 'hub']) {
      const node = layout.get(id)
      expect(node !== undefined).toEqual(true)
      const distance = Math.hypot((node?.x ?? 0) - 500, (node?.y ?? 0) - 500)
      expect(Math.round(distance)).toEqual(400)
    }
  })

  it('places the center chain in the middle and the rest around it', () => {
    const layout = computeGraphLayout(
      ['a', 'b', 'c', 'hub'],
      volumes,
      1000,
      false,
      undefined,
      'hub',
    )

    expect(layout.get('hub')).toEqual({ x: 500, y: 500, radius: 58 })
    for (const id of ['a', 'b', 'c']) {
      const node = layout.get(id)
      const distance = Math.hypot((node?.x ?? 0) - 500, (node?.y ?? 0) - 500)
      expect(Math.round(distance)).toEqual(330)
    }
  })

  it('leaves the center chain out of the bubble scale', () => {
    const layout = computeGraphLayout(
      ['a', 'b', 'c', 'hub'],
      volumes,
      1000,
      false,
      undefined,
      'hub',
    )

    // a is the largest on the ring, so it takes the full radius even though
    // the hub carries more volume than it does
    expect(layout.get('a')?.radius).toEqual(50)
    expect(layout.get('b')?.radius).toEqual(25)
  })

  it('keeps the given order around a hub, clockwise from the top', () => {
    const layout = computeGraphLayout(
      ['hub', 'b', 'a', 'c'],
      volumes,
      1000,
      false,
      undefined,
      'hub',
    )

    const angles = ['b', 'a', 'c'].map((id) => getAngle(layout, id))
    expect(angles[0]).toEqual(0)
    expect((angles[1] ?? 0) > 0).toEqual(true)
    expect((angles[2] ?? 0) > (angles[1] ?? 0)).toEqual(true)
  })

  it('leaves the same gap between every two neighbours around a hub', () => {
    const layout = computeGraphLayout(
      ['hub', 'a', 'b', 'c'],
      volumes,
      1000,
      false,
      undefined,
      'hub',
    )

    // radii 50, 25 and 25 on a ring of radius 330
    const gap = (2 * Math.PI * 330 - 200) / 3
    const arcs = ['a', 'b', 'c'].map((id) => getAngle(layout, id) * 330)
    expect(arcs.map(Math.round)).toEqual(
      [0, 50 + gap + 25, 50 + gap + 25 + 25 + gap + 25].map(Math.round),
    )
  })

  it('spreads the ring of a hub evenly when the bubbles do not fit', () => {
    // a ring this small cannot hold three bubbles of at least 8 px each
    const layout = computeGraphLayout(
      ['hub', 'a', 'b', 'c'],
      volumes,
      1,
      false,
      undefined,
      'hub',
    )

    const angles = ['a', 'b', 'c'].map((id) => getAngle(layout, id, 1))
    expect(angles.map((angle) => Math.round((angle * 180) / Math.PI))).toEqual([
      0, 120, 240,
    ])
  })

  it('still keeps large chains apart without a hub', () => {
    const layout = computeGraphLayout(
      ['a', 'b', 'c', 'hub'],
      volumes,
      1000,
      false,
    )

    // by volume: hub, a, then b and c. The two largest are not neighbours
    const angles = ['hub', 'b', 'a', 'c'].map((id) => getAngle(layout, id))
    expect(angles.map((angle) => Math.round((angle * 180) / Math.PI))).toEqual([
      0, 90, 180, 270,
    ])
  })

  it('ignores a center chain that is not among the chains', () => {
    const layout = computeGraphLayout(
      ['a', 'b', 'c'],
      volumes,
      1000,
      false,
      undefined,
      'hub',
    )

    expect(layout.get('hub')).toEqual(undefined)
    const node = layout.get('a')
    const distance = Math.hypot((node?.x ?? 0) - 500, (node?.y ?? 0) - 500)
    expect(Math.round(distance)).toEqual(400)
  })
})

/** Clockwise from the top, in radians */
function getAngle(layout: FlowsGraphLayout, id: string, size = 1000): number {
  const node = layout.get(id)
  const x = (node?.x ?? 0) - size / 2
  const y = (node?.y ?? 0) - size / 2
  const angle = Math.atan2(x, -y)
  // the first bubble sits at the very top, give or take a rounding error
  if (Math.abs(angle) < 1e-9) return 0
  return angle < 0 ? angle + 2 * Math.PI : angle
}
