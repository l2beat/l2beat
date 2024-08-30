import { ChainId, Hash256, } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { FlatSourcesRecord } from './entity'
import { FlatSourcesRepository } from './repository'

const CONFIG_HASH = Hash256.random()

describeDatabase(FlatSourcesRepository.name, (db) => {
  const repository = db.flatSources

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(FlatSourcesRepository.prototype.upsert.name, async () => {
    const projectName = 'project'

    const flatRecord: FlatSourcesRecord = {
      projectName,
      chainId: ChainId.ETHEREUM,
      blockNumber: -1,
      contentHash: CONFIG_HASH,
      flat: {}
    }
    await repository.upsert(flatRecord)

    const updated: FlatSourcesRecord = { ...flatRecord, blockNumber: 1 }
    await repository.upsert(updated)
    const latest = await repository.get(projectName, ChainId.ETHEREUM)

    expect(latest).toEqual(updated)
  })
})
