import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { generateTimestamps } from './generateTimestamps'

describe('generateTimestamps', () => {
  const from = 0 // Jan 1, 1970
  const to = UnixTime(86400 * 3) // Jan 4, 1970

  it('generates hourly timestamps', () => {
    const timestamps = generateTimestamps([from, to], 'hourly')
    expect(timestamps.length).toEqual(73) // 72 hours + 1 for the start
  })

  it('generates six-hourly timestamps', () => {
    const timestamps = generateTimestamps([from, to], 'sixHourly')
    expect(timestamps.length).toEqual(13) // 12 six-hour periods + 1 for the start
  })

  it('generates daily timestamps', () => {
    const timestamps = generateTimestamps([from, to], 'daily')
    expect(timestamps.length).toEqual(4) // 3 days + 1 for the start
  })

  it('adds target timestamp if addTarget is true and last generated is not target', () => {
    const to = UnixTime(86400 * 3 + 3600) // Jan 4, 1970, 01:00
    const timestamps = generateTimestamps([from, to], 'daily', {
      addTarget: true,
    })
    expect(timestamps.length).toEqual(5) // 3 days + 1 for the start + 1 for the target
    expect(timestamps.at(-1) === to).toEqual(true)
  })

  it('does not add target timestamp if addTarget is false', () => {
    const to = UnixTime(86400 * 3 + 3600) // Jan 4, 1970, 01:00
    const timestamps = generateTimestamps([from, to], 'daily', {
      addTarget: false,
    })
    expect(timestamps.length).toEqual(4) // 3 days + 1 for the start
  })
})
