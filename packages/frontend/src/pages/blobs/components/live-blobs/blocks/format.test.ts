import { expect } from 'earl'
import { describeWindow } from './format'

// Methodology: slot counts at and around the day and the hour, read as the
// label under the stats strip would show them
describe(describeWindow.name, () => {
  it('names the whole day, or how far back it reaches while the backend fills it', () => {
    expect(describeWindow(7200)).toEqual('Last 24 h')
    expect(describeWindow(3100)).toEqual('Last 10 h')
    expect(describeWindow(100)).toEqual('Last 20 min')
    expect(describeWindow(1)).toEqual('Last 1 min')
  })
})
