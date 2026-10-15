import { expect } from 'earl'
import { gestureCamera } from './relationsCamera'

describe(gestureCamera.name, () => {
  const camera = { x: 10, y: 20, k: 1 }

  it('pans by the distance a single pointer moved', () => {
    expect(gestureCamera(camera, [{ x: 0, y: 0 }], [{ x: 30, y: -5 }])).toEqual(
      { x: 40, y: 15, k: 1 },
    )
  })

  it('zooms around the pinch centre as the fingers spread', () => {
    const next = gestureCamera(
      camera,
      [
        { x: 90, y: 100 },
        { x: 110, y: 100 },
      ],
      [
        { x: 80, y: 100 },
        { x: 120, y: 100 },
      ],
    )

    expect(next).toEqual({ x: -80, y: -60, k: 2 })
    // The world point under the fingers' centre stays under it.
    expect((100 - next.x) / next.k).toEqual((100 - camera.x) / camera.k)
  })

  it('pans and zooms together when the fingers move while pinching', () => {
    const next = gestureCamera(
      camera,
      [
        { x: 90, y: 100 },
        { x: 110, y: 100 },
      ],
      [
        { x: 130, y: 150 },
        { x: 170, y: 150 },
      ],
    )

    expect(next).toEqual({ x: -30, y: -10, k: 2 })
  })

  it('stops zooming at the scale limits', () => {
    const next = gestureCamera(
      camera,
      [
        { x: 99, y: 100 },
        { x: 101, y: 100 },
      ],
      [
        { x: 0, y: 100 },
        { x: 200, y: 100 },
      ],
    )

    expect(next.k).toEqual(4)
  })
})
