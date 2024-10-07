import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { UpsertableAssetRisksBalanceRecord } from './entity'
import { AssetRisksBalanceRepository } from './repository'
import { assert } from '@l2beat/shared-pure'

describeDatabase(AssetRisksBalanceRepository.name, (db) => {
  const repository = db.assetRisksBalance
  let networkId: string
  let users: [string, string]
  let tokens: [string, string, string, string]

  beforeEach(async function () {
    await db.assetRisksUser.upsert({ address: 'a' })
    await db.assetRisksUser.upsert({ address: 'b' })
    await db.network.upsert({ name: 'Mainnet', chainId: 1 })
    await db.token.upsertMany([
      { networkId, address: 'a' },
      { networkId, address: 'b' },
      { networkId, address: 'c' },
      { networkId, address: 'd' },
    ])

    const allNetworks = await db.network.getAll()
    assert(
      allNetworks.length === 1 && allNetworks[0],
      'Expected exactly one network',
    )
    networkId = allNetworks[0].id

    const allUsers = await db.assetRisksUser.getAll()
    assert(
      allUsers.length === 2 && allUsers[0] && allUsers[1],
      'Expected exactly two users',
    )
    users = [allUsers[0].id, allUsers[1].id] as [string, string]

    const allTokens = await db.token.getAll()
    assert(
      allTokens.length === 4 &&
        allTokens[0] &&
        allTokens[1] &&
        allTokens[2] &&
        allTokens[3],
      'Expected exactly four tokens',
    )
    tokens = [
      allTokens[0].id,
      allTokens[1].id,
      allTokens[2].id,
      allTokens[3].id,
    ] as [string, string, string, string]
  })

  afterEach(async function () {
    await repository.deleteAll()
    await db.assetRisksUser.deleteAll()
    await db.token.deleteAll()
    await db.network.deleteAll()
  })

  describe(AssetRisksBalanceRepository.prototype.upsertMany.name, () => {
    it('adds new rows', async () => {
      await repository.upsertMany([
        record(users[0], tokens[0], '1'),
        record(users[0], tokens[1], '2'),
        record(users[0], tokens[2], '3'),
        record(users[1], tokens[0], '4'),
        record(users[1], tokens[1], '5'),
        record(users[1], tokens[2], '6'),
      ])

      expect(await repository.getAllForUser(users[0])).toEqualUnsorted([
        matchingRecord(users[0], tokens[0], '1'),
        matchingRecord(users[0], tokens[1], '2'),
        matchingRecord(users[0], tokens[2], '3'),
      ])

      expect(await repository.getAllForUser(users[1])).toEqualUnsorted([
        matchingRecord(users[1], tokens[0], '4'),
        matchingRecord(users[1], tokens[1], '5'),
        matchingRecord(users[1], tokens[2], '6'),
      ])
    })

    it('merges on conflict', async () => {
      await repository.upsertMany([
        record(users[0], tokens[0], '1'),
        record(users[0], tokens[1], '2'),
        record(users[0], tokens[2], '3'),
      ])

      await repository.upsertMany([record(users[0], tokens[0], '4')])

      expect(await repository.getAllForUser(users[0])).toEqualUnsorted([
        matchingRecord(users[0], tokens[0], '4'),
        matchingRecord(users[0], tokens[1], '2'),
        matchingRecord(users[0], tokens[2], '3'),
      ])
    })
  })
})

function record(
  userId: string,
  tokenId: string,
  balance: string,
): UpsertableAssetRisksBalanceRecord {
  return {
    userId,
    tokenId,
    balance,
  }
}

function matchingRecord(userId: string, tokenId: string, balance: string) {
  return {
    userId,
    tokenId,
    balance,
    id: expect.a(String),
    updatedAt: expect.a(Date),
    createdAt: expect.a(Date),
  }
}
