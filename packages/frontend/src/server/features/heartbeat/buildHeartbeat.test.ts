import type { LiveActivitySecondRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { buildHeartbeat } from './buildHeartbeat'

const READ_AT = UnixTime(1_800_000_000)

describe(buildHeartbeat.name, () => {
  it("averages each chain's last minute up to its newest block", () => {
    // Methodology: chain a's newest block is 10 s old, so its minute starts
    // 70 s back and leaves out the second 80 s back
    const newest = READ_AT - 10
    const result = buildHeartbeat(
      [
        second('a', newest - 70, { count: 600 }),
        second('a', newest - 59, { count: 60, uopsCount: 90, blocks: 2 }),
        second('a', newest, { count: 60, uopsCount: 90, gasUsed: 6_000 }),
      ],
      READ_AT,
    )

    expect(result).toEqual({
      readAt: READ_AT,
      chains: [
        {
          projectId: 'a',
          newest,
          tps: 2,
          uops: 3,
          gasPerSecond: 100,
          blocks: 3,
          beats: [
            [newest - 70, 600],
            [newest - 59, 60],
            [newest, 60],
          ],
        },
      ],
    })
  })

  it('keeps each chain apart', () => {
    const result = buildHeartbeat(
      [second('a', READ_AT - 1, {}), second('b', READ_AT, {})],
      READ_AT,
    )

    expect(result.chains.map((c) => [c.projectId, c.newest])).toEqual([
      ['a', READ_AT - 1],
      ['b', READ_AT],
    ])
  })
})

function second(
  projectId: string,
  timestamp: UnixTime,
  values: Partial<LiveActivitySecondRecord>,
): LiveActivitySecondRecord {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    blocks: 1,
    count: 0,
    uopsCount: 0,
    gasUsed: 0,
    ...values,
  }
}
