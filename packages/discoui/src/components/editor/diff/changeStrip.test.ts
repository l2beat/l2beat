import { expect } from 'earl'
import { contentYAt, scrollTopToCenter, toStripRange } from './changeStrip'

describe('toStripRange', () => {
  it('scales content pixels to strip pixels', () => {
    expect(toStripRange({ top: 2000, bottom: 3000 }, 10000, 500, 2)).toEqual({
      top: 100,
      height: 50,
    })
  })

  it('keeps a one line change visible', () => {
    expect(toStripRange({ top: 5000, bottom: 5010 }, 10000, 500, 2)).toEqual({
      top: 250,
      height: 2,
    })
  })

  it('keeps a mark at the very end inside the strip', () => {
    expect(toStripRange({ top: 9995, bottom: 10000 }, 10000, 500, 2)).toEqual({
      top: 498,
      height: 2,
    })
  })

  it('fills the strip when the content is shorter than the view', () => {
    expect(toStripRange({ top: 0, bottom: 800 }, 400, 500, 8)).toEqual({
      top: 0,
      height: 500,
    })
  })
})

describe('contentYAt', () => {
  // At 20 content pixels per strip pixel, the one line change at 1000-1020
  // has its mark at 50-52 and the long one at 2000-3000 at 100-150.
  const short = { top: 1000, bottom: 1020 }
  const long = { top: 2000, bottom: 3000 }
  const bands = [short, long]

  it('lands on a short change from anywhere on its mark', () => {
    expect(contentYAt(bands, 50, 10000, 500)).toEqual(1000)
    expect(contentYAt(bands, 52, 10000, 500)).toEqual(1020)
  })

  it('lands on a change from just beside its mark', () => {
    expect(contentYAt(bands, 54.5, 10000, 500)).toEqual(1020)
    expect(contentYAt(bands, 97, 10000, 500)).toEqual(2000)
  })

  it('keeps the pressed point inside a long change', () => {
    expect(contentYAt(bands, 125, 10000, 500)).toEqual(2500)
  })

  it('picks the nearer of two marks', () => {
    const next = { top: 1100, bottom: 1120 }
    expect(contentYAt([short, next], 53, 10000, 500)).toEqual(1020)
    expect(contentYAt([short, next], 54.5, 10000, 500)).toEqual(1100)
  })

  it('keeps the pressed point away from marks', () => {
    expect(contentYAt(bands, 75, 10000, 500)).toEqual(1500)
  })
})

describe('scrollTopToCenter', () => {
  it('puts the point in the middle of the view', () => {
    expect(scrollTopToCenter(5000, 10000, 1000)).toEqual(4500)
  })

  it('stops at the top', () => {
    expect(scrollTopToCenter(200, 10000, 1000)).toEqual(0)
  })

  it('stops at the bottom', () => {
    expect(scrollTopToCenter(9980, 10000, 1000)).toEqual(9000)
  })

  it('stays at the top when everything fits', () => {
    expect(scrollTopToCenter(300, 400, 500)).toEqual(0)
  })
})
