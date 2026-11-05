import { expect } from 'earl'
import { formatAge } from './formatAge'

describe(formatAge.name, () => {
  it('counts seconds, then minutes, then hours', () => {
    expect(formatAge(0)).toEqual('0 s ago')
    expect(formatAge(59.9)).toEqual('59 s ago')
    expect(formatAge(60)).toEqual('1 min ago')
    expect(formatAge(3599)).toEqual('59 min ago')
    expect(formatAge(7200)).toEqual('2 h ago')
  })

  it('reads a timestamp slightly ahead of the clock as now', () => {
    // A visitor's clock can run behind the chain's
    expect(formatAge(-5)).toEqual('0 s ago')
  })
})
