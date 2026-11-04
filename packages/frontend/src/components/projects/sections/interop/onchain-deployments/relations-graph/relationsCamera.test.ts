import { expect } from 'earl'
import {
  centerCamera,
  dotGridSpacing,
  gestureCamera,
  gridShift,
  revealCamera,
  wheelZoomFactor,
} from './relationsCamera'

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

describe(centerCamera.name, () => {
  it('moves a world point to the middle of the viewport at the same scale', () => {
    const next = centerCamera(
      { x: 10, y: 20, k: 0.5 },
      { x: 300, y: 400 },
      { width: 390, height: 300 },
    )

    expect(next).toEqual({ x: 45, y: -50, k: 0.5 })
  })
})

describe(revealCamera.name, () => {
  const camera = { x: 0, y: 0, k: 0.5 }
  const area = { x: 0, y: 0, width: 600, height: 400 }

  it('leaves the camera alone when the box is already inside the area', () => {
    const box = { x: 200, y: 200, width: 200, height: 100 }

    expect(revealCamera(camera, box, area, 16)).toEqual(camera)
  })

  it('pans the box just clear of the area edge it crosses', () => {
    // On screen the box spans x 550..650, past the area's right edge at 600.
    const box = { x: 1100, y: 200, width: 200, height: 100 }

    expect(revealCamera(camera, box, area, 16)).toEqual({
      x: -66,
      y: 0,
      k: 0.5,
    })
  })

  it('keeps the left edge in view when the box is wider than the area', () => {
    const box = { x: 1200, y: 100, width: 2000, height: 100 }

    expect(revealCamera(camera, box, area, 16)).toEqual({
      x: -584,
      y: 0,
      k: 0.5,
    })
  })
})

describe(dotGridSpacing.name, () => {
  it('scales the world grid step with the zoom', () => {
    expect(dotGridSpacing(24, 1)).toEqual(24)
    expect(dotGridSpacing(24, 2)).toEqual(48)
  })

  it('skips every other dot once zooming out packs them too tightly', () => {
    expect(dotGridSpacing(24, 0.375)).toEqual(18)
    expect(dotGridSpacing(24, 0.125)).toEqual(24)
  })
})

describe(gridShift.name, () => {
  const offsets = [0, 7, -7, 23.5, -23.5, 1000.5, -1000.5]

  it('moves the dots with the camera, by less than one spacing', () => {
    for (const spacing of [16, 24, 96]) {
      // Where the dots fall within a spacing, the same at every offset.
      const phases = offsets.map((offset) => {
        const shift = gridShift(offset, spacing)
        expect(shift).toBeLessThanOrEqual(0)
        expect(shift).toBeGreaterThan(-spacing)
        return (((offset - shift) % spacing) + spacing) % spacing
      })

      expect(new Set(phases).size).toEqual(1)
    }
  })
})

describe(wheelZoomFactor.name, () => {
  const inPixels = (deltaY: number) => wheelZoomFactor({ deltaY, deltaMode: 0 })

  it('zooms as far as a trackpad pinch scales, however its events merge', () => {
    expect(inPixels(-100 * Math.log(1.05))).toBeCloseTo(1.05, 10)
    expect(inPixels(-4) * inPixels(-6)).toBeCloseTo(inPixels(-10), 10)
    expect(inPixels(-10) * inPixels(10)).toBeCloseTo(1, 10)
  })

  it('zooms a mouse wheel notch by one step', () => {
    expect(inPixels(100)).toEqual(1 / 1.15)
    expect(wheelZoomFactor({ deltaY: -3, deltaMode: 1 })).toEqual(1.15)
  })
})
