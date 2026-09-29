import { expect } from 'earl'
import { computeGraphLayout } from './computeGraphLayout'

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
