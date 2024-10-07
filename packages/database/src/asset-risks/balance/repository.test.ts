import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { UpsertableAssetRisksBalanceRecord } from './entity'
import { AssetRisksBalanceRepository } from './repository'

describeDatabase(AssetRisksBalanceRepository.name, (db) => {
  const repository = db.assetRisksBalance
  let users: [string, string]
  let networkId: string
  let tokens: [string, string, string, string]

  beforeEach(async function () {
    networkId = (await db.network.upsert({ name: 'Mainnet', chainId: 1 })).id
    users = [
      (await db.assetRisksUser.upsert({ address: 'a' })).id,
      (await db.assetRisksUser.upsert({ address: 'b' })).id,
    ]
    tokens = [
      (await db.token.upsert({ networkId, address: 'a' })).id,
      (await db.token.upsert({ networkId, address: 'b' })).id,
      (await db.token.upsert({ networkId, address: 'c' })).id,
      (await db.token.upsert({ networkId, address: 'd' })).id,
    ]
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
        record(users[0], tokens[0], 1),
        record(users[0], tokens[1], 2),
        record(users[0], tokens[2], 3),
        record(users[1], tokens[0], 4),
        record(users[1], tokens[1], 5),
        record(users[1], tokens[2], 6),
      ])

      expect(await repository.getAllForUser(users[0])).toEqualUnsorted([
        matchingRecord(users[0], tokens[0], 1),
        matchingRecord(users[0], tokens[1], 2),
        matchingRecord(users[0], tokens[2], 3),
      ])

      expect(await repository.getAllForUser(users[1])).toEqualUnsorted([
        matchingRecord(users[1], tokens[0], 4),
        matchingRecord(users[1], tokens[1], 5),
        matchingRecord(users[1], tokens[2], 6),
      ])
    })

    it('merges on conflict', async () => {
      await repository.upsertMany([
        record(users[0], tokens[0], 1),
        record(users[0], tokens[1], 2),
        record(users[0], tokens[2], 3),
      ])

      await repository.upsertMany([record(users[0], tokens[0], 4)])

      expect(await repository.getAllForUser(users[0])).toEqualUnsorted([
        matchingRecord(users[0], tokens[0], 4),
        matchingRecord(users[0], tokens[1], 2),
        matchingRecord(users[0], tokens[2], 3),
      ])
    })
  })
})

function record(
  userId: string,
  tokenId: string,
  balance: number,
): UpsertableAssetRisksBalanceRecord {
  return {
    userId,
    tokenId,
    balance,
  }
}

function matchingRecord(userId: string, tokenId: string, balance: number) {
  return {
    userId,
    tokenId,
    balance,
    id: expect.a(String),
    updatedAt: expect.a(Date),
    createdAt: expect.a(Date),
  }
}
