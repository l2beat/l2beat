import { expect } from 'earl'
import { getThroughputInForce } from './getThroughputInForce'

// Each case asks for the limits at a moment placed around the configured
// switch times, given out of order to show the order in config does not matter.
describe(getThroughputInForce.name, () => {
  const throughput = [
    { size: 2400, target: 1200, frequency: 12, sinceTimestamp: 500 },
    { size: 4800, target: 2400, frequency: 12, sinceTimestamp: 2000 },
    { size: 1200, target: 600, frequency: 12, sinceTimestamp: 0 },
  ]

  it('returns the newest limits that already started', () => {
    expect(getThroughputInForce(throughput, 1000)?.size).toEqual(2400)
  })

  it('ignores limits configured ahead of their start', () => {
    expect(getThroughputInForce(throughput, 1999)?.size).toEqual(2400)
  })

  it('switches at the moment the new limits start', () => {
    expect(getThroughputInForce(throughput, 2000)?.size).toEqual(4800)
  })

  it('returns nothing before any limits started', () => {
    expect(getThroughputInForce(throughput.slice(0, 2), 100)).toEqual(undefined)
    expect(getThroughputInForce([], 100)).toEqual(undefined)
  })
})
