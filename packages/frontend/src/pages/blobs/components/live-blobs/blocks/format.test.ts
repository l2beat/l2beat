import { expect } from 'earl'
import { describeWindow, formatClock } from './format'

// Methodology: slot counts at and around the day and the hour, read as the
// label under the stats strip would show them
describe(describeWindow.name, () => {
  it('names the whole day, or how far back it reaches while the backend fills it', () => {
    expect(describeWindow(7200)).toEqual('Last 24h')
    expect(describeWindow(3100)).toEqual('Last 10h')
    expect(describeWindow(100)).toEqual('Last 20 min')
    expect(describeWindow(1)).toEqual('Last 1 min')
  })
})

// Methodology: an afternoon slot, so a 12-hour clock or a zone east of UTC
// would show; run under TZ=Europe/Warsaw LANG=en_US to see it
describe(formatClock.name, () => {
  it('shows the time of day in UTC on a 24-hour clock, labelled', () => {
    // 2026-10-27 13:05:07 UTC
    expect(formatClock(1793106307)).toEqual('13:05:07 UTC')
  })

  it('pads midnight to 00, not 24', () => {
    // 2026-10-28 00:00:00 UTC
    expect(formatClock(1793145600)).toEqual('00:00:00 UTC')
  })
})
