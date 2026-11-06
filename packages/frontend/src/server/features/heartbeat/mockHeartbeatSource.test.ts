import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createMockHeartbeatSource } from './mockHeartbeatSource'

const NOW = UnixTime(1_800_000_000)

describe(createMockHeartbeatSource.name, () => {
  it('makes up the same seconds for the same clock', async () => {
    const source = () =>
      createMockHeartbeatSource(Promise.resolve(['a', 'b', 'c']), () => NOW)

    const first = await source().getSecondsSince(NOW - 60)
    const second = await source().getSecondsSince(NOW - 60)

    expect(first.length).toBeGreaterThan(0)
    expect(first).toEqual(second)
  })

  it('makes up seconds only after the given one, oldest first', async () => {
    const source = createMockHeartbeatSource(
      Promise.resolve(['a', 'b', 'c']),
      () => NOW,
    )

    const seconds = await source.getSecondsSince(NOW - 60)
    const timestamps = seconds.map((s) => s.timestamp)

    expect(timestamps.every((t) => t > NOW - 60 && t <= NOW)).toEqual(true)
    expect(timestamps).toEqual([...timestamps].sort((a, b) => a - b))
  })
})
