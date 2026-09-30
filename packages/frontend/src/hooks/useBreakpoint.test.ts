import { expect } from 'earl'
import { breakpointFromWidth } from './useBreakpoint'

describe(breakpointFromWidth.name, () => {
  // Probes one pixel either side of every threshold, so an off-by-one in a
  // boundary fails the test for that boundary alone.
  const cases = [
    [0, 'xs'],
    [549, 'xs'],
    [550, 'sm'],
    [767, 'sm'],
    [768, 'md'],
    [1199, 'md'],
    [1200, 'lg'],
    [1439, 'lg'],
    [1440, 'xl'],
    [1919, 'xl'],
    [1920, '2xl'],
    [4000, '2xl'],
  ] as const

  for (const [width, breakpoint] of cases) {
    it(`maps ${width}px to ${breakpoint}`, () => {
      expect(breakpointFromWidth(width)).toEqual(breakpoint)
    })
  }
})
