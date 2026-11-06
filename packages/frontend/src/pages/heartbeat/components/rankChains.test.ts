import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { HeartbeatChain } from '~/server/features/heartbeat/buildHeartbeat'
import type { HeartbeatProject } from '~/server/features/heartbeat/getHeartbeatProjects'
import { rankChains, sumBeats } from './rankChains'

const READ_AT = UnixTime(1_800_000_000)

describe(rankChains.name, () => {
  it('ranks by the metric, with chains running behind last', () => {
    const projects = [project('a'), project('b'), project('c')]
    const chains = [
      chain('a', { uops: 5, tps: 50 }),
      chain('b', { uops: 50, tps: 5 }),
      chain('c', { uops: 500, tps: 500 }, READ_AT - 120),
    ]

    const byUops = rankChains(projects, { readAt: READ_AT, chains }, 'uops')
    const byTps = rankChains(projects, { readAt: READ_AT, chains }, 'tps')

    expect(byUops.map((r) => r.project.id)).toEqual(['b', 'a', 'c'])
    expect(byTps.map((r) => r.project.id)).toEqual(['a', 'b', 'c'])
    expect(byUops.map((r) => r.behindBy)).toEqual([undefined, undefined, 120])
  })

  it('leaves out chains with no project to show', () => {
    const result = rankChains(
      [project('a')],
      { readAt: READ_AT, chains: [chain('a', {}), chain('gone', {})] },
      'uops',
    )

    expect(result.map((r) => r.project.id)).toEqual(['a'])
  })
})

describe(sumBeats.name, () => {
  it("adds up the chains' transactions second by second", () => {
    const result = sumBeats([
      {
        ...chain('a', {}),
        beats: [
          [READ_AT - 1, 2],
          [READ_AT, 3],
        ],
      },
      {
        ...chain('b', {}),
        beats: [
          [READ_AT - 2, 1],
          [READ_AT, 4],
        ],
      },
    ])

    expect(result).toEqual([
      [READ_AT - 2, 1],
      [READ_AT - 1, 2],
      [READ_AT, 7],
    ])
  })
})

function project(id: string): HeartbeatProject {
  return { id, name: id, iconUrl: `/icons/${id}.png`, href: `/${id}` }
}

function chain(
  projectId: string,
  rates: Partial<Pick<HeartbeatChain, 'tps' | 'uops'>>,
  newest = READ_AT - 5,
): HeartbeatChain {
  return {
    projectId,
    newest,
    tps: rates.tps ?? 0,
    uops: rates.uops ?? 0,
    gasPerSecond: 0,
    blocks: 0,
    beats: [],
  }
}
