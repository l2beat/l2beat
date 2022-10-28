import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { BlockTipRepository } from '../../../src/peripherals/database/BlockTipRepository'
import { setupDatabaseTestSuite } from './shared/setup'

const PROJECT_A = ProjectId('a')
const PROJECT_B = ProjectId('b')

describe(BlockTipRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new BlockTipRepository(database, Logger.SILENT)

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it('works with no data', async () => {
    expect(await repository.findByProject(PROJECT_A)).not.toBeDefined()
  })

  it('finds single project', async () => {
    const blockNumber = 1
    const timestamp = UnixTime.now()

    await repository.updateByProject(PROJECT_A, { blockNumber, timestamp })
    expect(await repository.findByProject(PROJECT_A)).toEqual({
      blockNumber,
      timestamp,
      projectId: PROJECT_A,
    })
  })

  it('finds within multiple project', async () => {
    const tipA = { blockNumber: 1, timestamp: UnixTime.now().add(1, 'days') }
    const tipB = { blockNumber: 2, timestamp: UnixTime.now().add(2, 'days') }

    await repository.updateByProject(PROJECT_A, tipA)
    await repository.updateByProject(PROJECT_B, tipB)

    expect(await repository.findByProject(PROJECT_A)).toEqual({
      ...tipA,
      projectId: PROJECT_A,
    })
    expect(await repository.findByProject(PROJECT_B)).toEqual({
      ...tipB,
      projectId: PROJECT_B,
    })
  })

  it('removes when updating to undefined', async () => {
    const tip = { blockNumber: 1, timestamp: UnixTime.now().add(1, 'days') }

    await repository.updateByProject(PROJECT_A, tip)

    expect(await repository.findByProject(PROJECT_A)).toEqual({
      ...tip,
      projectId: PROJECT_A,
    })

    await repository.updateByProject(PROJECT_A, undefined)

    expect(await repository.findByProject(PROJECT_A)).toEqual(undefined)
  })
})
