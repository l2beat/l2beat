import { expect } from 'earl'
import { lastIndexAtOrBefore } from './ChartHoverOverlay'

describe(lastIndexAtOrBefore.name, () => {
  const rows = [10, 20, 20, 30]
  const getX = (row: number) => row

  it('takes the row the value is in, up to the next one', () => {
    expect(lastIndexAtOrBefore(rows, getX, 10)).toEqual(0)
    expect(lastIndexAtOrBefore(rows, getX, 19)).toEqual(0)
    expect(lastIndexAtOrBefore(rows, getX, 35)).toEqual(3)
  })

  it('takes the last of the rows at the same x', () => {
    expect(lastIndexAtOrBefore(rows, getX, 20)).toEqual(2)
  })

  it('has none before the first row', () => {
    expect(lastIndexAtOrBefore(rows, getX, 9)).toEqual(-1)
  })
})
