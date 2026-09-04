import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import type { DefiTvlRecord } from './DefiTvlRepository'
import { DefiTvlRepository } from './DefiTvlRepository'

describeDatabase(DefiTvlRepository.name, (db) => {
  const repository = db.defiTvl

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('upserts and sums the latest per-chain snapshot per project', async () => {
    await repository.upsertMany([
      record('project-a', 'config000001', 'ethereum', 100, 10),
      record('project-a', 'config000001', 'arbitrum', 100, 20),
      record('project-a', 'config000001', 'ethereum', 200, 11),
      record('project-a', 'config000001', 'arbitrum', 200, 22, 205),
      record('project-b', 'config000002', 'ethereum', 150, 40),
    ])

    const result = await repository.getLatestByProjects([
      'project-a',
      'project-b',
    ])

    expect(result).toEqualUnsorted([
      {
        projectId: 'project-a',
        timestamp: UnixTime(200),
        sourceTimestamp: UnixTime(200),
        valueUsd: 33,
        chainCount: 2,
      },
      {
        projectId: 'project-b',
        timestamp: UnixTime(150),
        sourceTimestamp: UnixTime(150),
        valueUsd: 40,
        chainCount: 1,
      },
    ])
  })

  it('returns summed snapshots in the requested range', async () => {
    await repository.upsertMany([
      record('project-a', 'config000001', 'ethereum', 100, 10),
      record('project-a', 'config000001', 'arbitrum', 100, 20),
      record('project-a', 'config000001', 'ethereum', 200, 11),
      record('project-a', 'config000001', 'arbitrum', 200, 22),
    ])

    const result = await repository.getByProjectInRange(
      'project-a',
      UnixTime(150),
      UnixTime(250),
    )

    expect(result).toEqual([
      {
        projectId: 'project-a',
        timestamp: UnixTime(200),
        sourceTimestamp: UnixTime(200),
        valueUsd: 33,
        chainCount: 2,
      },
    ])
  })

  it('updates a snapshot and deletes all data for a configuration', async () => {
    await repository.upsertMany([
      record('project-a', 'config000001', 'ethereum', 100, 10),
      record('project-b', 'config000002', 'ethereum', 100, 20),
    ])
    await repository.upsertMany([
      record('project-a', 'config000001', 'ethereum', 100, 15, 101),
    ])

    expect(await repository.deleteByConfigIds(['config000002'])).toEqual(1)
    expect(await repository.getAll()).toEqualUnsorted([
      record('project-a', 'config000001', 'ethereum', 100, 15, 101),
    ])
  })
})

function record(
  projectId: string,
  configurationId: string,
  chain: string,
  timestamp: number,
  valueUsd: number,
  sourceTimestamp = timestamp,
): DefiTvlRecord {
  return {
    projectId,
    configurationId,
    chain,
    timestamp: UnixTime(timestamp),
    sourceTimestamp: UnixTime(sourceTimestamp),
    valueUsd,
  }
}
